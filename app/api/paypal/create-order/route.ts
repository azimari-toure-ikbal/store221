import { db } from "@/lib/db";
import { rates } from "@/lib/db/schema";
import { baseUrl, getAccessToken } from "@/lib/server-exports";
import { PayPalBody } from "@/types";
import { eq } from "drizzle-orm";
import got from "got";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { amount, items } = (await req.json()) as PayPalBody;

  try {
    const accessToken = await getAccessToken();

    let rate = 0;

    if (amount.currency_code === "XOF") {
      const usd = await db.query.rates.findFirst({
        where: eq(rates.currency, "USD"),
      });

      if (!usd) return NextResponse.json({ error: "Pas de rate pour le USD" });

      rate = Number(usd.rate);
    } else {
      const foundRate = await db.query.rates.findFirst({
        where: eq(rates.currency, amount.currency_code as "USD" | "EUR"),
      });

      if (!foundRate) return NextResponse.json({ error: "Pas de rate" });

      rate = Number(foundRate.rate);
    }

    const currencyCode =
      amount.currency_code === "XOF" ? "USD" : amount.currency_code;

    const totalPrice = Number(amount.value) * rate;

    const totalValue = Number(amount.breakdown.item_total.value) * rate;

    const deliveryPrice = Number(amount.breakdown.shipping.value) * rate;

    // console.log("items", items);
    // console.log("amount", amount);

    // console.log("currencyCode", currencyCode);

    const res = await got.post(`${baseUrl}/v2/checkout/orders`, {
      headers: {
        "Content-Type": "application/json",
        "PayPal-Request-Id": crypto.randomUUID(),
        Authorization: `Bearer ${accessToken}`,
      },
      json: {
        intent: "CAPTURE",
        purchase_units: [
          {
            // invoice_id: "90210",
            amount: {
              currency_code: currencyCode,
              value: Math.round(totalPrice),
              breakdown: {
                item_total: {
                  currency_code: currencyCode,
                  value: Math.round(totalValue),
                },
                shipping: {
                  currency_code: currencyCode,
                  value: Math.round(deliveryPrice),
                },
              },
            },
            items: items.map((item) => {
              const itemPrice = Number(item.unit_amount.value) * rate;

              return {
                name: item.name,
                quantity: item.quantity,
                unit_amount: {
                  currency_code: currencyCode,
                  value: Math.round(itemPrice),
                },
              };
            }),
          },
        ],
        payment_source: {
          paypal: {
            experience_context: {
              payment_method_preference: "IMMEDIATE_PAYMENT_REQUIRED",
              payment_method_selected: "PAYPAL",
              brand_name: "Store221",
              // shipping_preference: "NO_SHIPPING",
              // locale: "fr_FR",
              user_action: "PAY_NOW",
              return_url: `${process.env.PAYPAL_REDIRECT_URL}/sale-success`,
              cancel_url: `${process.env.PAYPAL_REDIRECT_URL}/sale-canceled`,
            },
          },
        },
      },
      responseType: "json",
    });

    // console.log("res", res.statusCode);

    return NextResponse.json({ orderId: res.body });
  } catch (e) {
    console.error("Error in /api/paypal/create-order", e);

    return NextResponse.json({
      error: "Internal Server Error in /api/paypal/create-order",
    });
  }
}
