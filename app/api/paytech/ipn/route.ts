import { PayTechIPN } from "@/config";
import { db } from "@/lib/db";
import { carts, orders } from "@/lib/db/schema";
import { Delivery } from "@/lib/validators";
import crypto from "crypto";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  return NextResponse.json({ success: true });
}

export async function POST(req: NextRequest) {
  console.log("IPN request received");

  const body = await req.text();

  console.log("body", body);

  const bodyArray = body.split("&");
  let response: PayTechIPN = {
    currency: "",
    api_key_sha256: "",
    api_secret_sha256: "",
    type_event: "",
    custom_field: "",
    ref_command: "",
    item_name: "",
    item_price: "",
    command_name: "",
    token: "",
    env: "",
    payment_method: "",
    client_phone: "",
  };

  bodyArray.forEach((item) => {
    const key = item.split("=")[0];
    const value = item.split("=")[1];
    response = { ...response, [key]: value };
  });

  // if (shouldLog) {
  //   console.log("IPN bodyObject: ", response);
  // }

  const api_key_sha256 = shaEncrypt(process.env.PAYTECH_API!);
  const api_secret_sha256 = shaEncrypt(process.env.PAYTECH_SECRET!);

  const customField = decodeURIComponent(response.custom_field);
  const cartId = JSON.parse(customField).cartId as string;
  // const promoCode = JSON.parse(customField).promoCode as string | undefined;
  const delivery = JSON.parse(customField).delivery as Delivery;
  const deliveryPrice = JSON.parse(customField).deliveryPrice as number;

  if (
    response.api_key_sha256 !== api_key_sha256 ||
    response.api_secret_sha256 !== api_secret_sha256
  ) {
    // return NextResponse.json({ success: false });
    // console.error("API key or secret do not match");
    return NextResponse.redirect(`https://store221.com/sale-error`);
  }

  if (response.type_event === "sale_canceled") {
    // Send email to inform that the sale was canceled
    return NextResponse.redirect(`https://store221.com/sale-canceled`);
  }

  const cart = await db.query.carts.findFirst({
    where: eq(carts.id, cartId),
  });

  if (!cart) {
    return NextResponse.redirect(`https://store221.com/sale-error`);
  }

  await db.update(carts).set({ status: "PAYED" }).where(eq(carts.id, cartId));

  await db.insert(orders).values({
    cartId: cartId,
    userId: cart.userId,
    delivery: delivery,
    totalPaid: response.item_price,
  });

  return NextResponse.json({ success: true });
}

const shaEncrypt = (data: string) => {
  const hash = crypto.createHash("sha256");
  hash.update(data);
  return hash.digest("hex");
};
