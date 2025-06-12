import { IpnBody, logVerbose } from "@/config";
import { db } from "@/lib/db";
import { carts, orders, products } from "@/lib/db/schema";
import { Delivery } from "@/lib/validators";
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
    cartId: cartId,
    userId: cart.userId,
    delivery: delivery,
    deliveryPrice: String(deliveryPrice),
    totalPaid: body.item_price,
  });

  // Send notification to the NTFY server
  fetch(`${process.env.NTFY_BASE_URL}/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
    },
    body: "Bonjour, vous avez une nouvelle commande sur Store221. Cliquez sur le lien suivant https://store221.com/dashboard/orders",
  })
    .then((response) => {
      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);
      return response.text();
    })
    .then(async (text) => {
      if (logVerbose) console.info("NTFY notification sent:", text);
    })
    .catch((err) => {
      if (logVerbose) console.error("NTFY notification error:", err);
    });

  return NextResponse.json({ success: true });
}
