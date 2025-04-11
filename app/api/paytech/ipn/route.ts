import { IpnBody } from "@/config";
import { db } from "@/lib/db";
import { carts, orders, products } from "@/lib/db/schema";
import { Delivery } from "@/lib/validators";
import crypto from "crypto";
import { eq, sql } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = (await req.json()) as IpnBody;

  const cartId = body.custom_field.cartId as string;
  // const promoCode = body.custom_field.promoCode as string | undefined;
  const delivery = body.custom_field.delivery as Delivery;
  const deliveryPrice = body.custom_field.deliveryPrice as number;

  if (body.type_event === "sale_canceled") {
    // Send email to inform that the sale was canceled
    return NextResponse.redirect(`https://store221.com/sale-canceled`);
  }

  const cart = await db.query.carts.findFirst({
    where: eq(carts.id, cartId),
    with: {
      items: true,
    },
  });

  if (!cart) {
    return NextResponse.redirect(`https://store221.com/sale-error`);
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
    cartId: cartId,
    userId: cart.userId,
    delivery: delivery,
    totalPaid: body.item_price,
  });

  return NextResponse.json({ success: true });
}

const shaEncrypt = (data: string) => {
  const hash = crypto.createHash("sha256");
  hash.update(data);
  return hash.digest("hex");
};
