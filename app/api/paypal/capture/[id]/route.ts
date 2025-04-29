import { db } from "@/lib/db";
import { carts, orders, products } from "@/lib/db/schema";
import { baseUrl, getAccessToken } from "@/lib/server-exports";
import { eq, sql } from "drizzle-orm";
import got from "got";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, context: any) {
  const { params } = context;
  const { id } = await params;

  const { cartId, deliveryZone, deliveryPrice, totalPaid } = await req.json();

  try {
    const accessToken = await getAccessToken();

    await got.post(`${baseUrl}/v2/checkout/orders/${id}/capture`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      responseType: "json",
    });

    const cart = await db.query.carts.findFirst({
      where: eq(carts.id, cartId),
      with: {
        items: true,
      },
    });

    if (!cart) {
      return NextResponse.redirect(`https://store221.com/sale-canceled`);
    }

    await db.update(carts).set({ status: "PAYED" }).where(eq(carts.id, cartId));

    // Decrement the quantity of the items in the cart
    for (const item of cart.items) {
      await db
        .update(products)
        .set({ stock: sql`${products.stock} - ${item.quantity}` })
        .where(eq(products.id, item.productId));
    }

    await db.insert(orders).values({
      cartId,
      userId: cart.userId,
      delivery: deliveryZone,
      deliveryPrice,
      totalPaid,
    });

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("Error in /api/paypal/capture/[id]/route", e);
    return NextResponse.json({
      error: "Internal Server Error in /api/paypal/capture/[id]/route",
    });
  }
}
