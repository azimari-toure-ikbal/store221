"use client";

import { currencyAtom } from "@/lib/atoms";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import { useAtomValue } from "jotai";
import React from "react";

type PaypalProviderProps = {
  children: React.ReactNode;
};

const PaypalProvider: React.FC<PaypalProviderProps> = ({ children }) => {
  const currency = useAtomValue(currencyAtom);

  const currencyCode = currency.code === "XOF" ? "USD" : currency.code;

  return (
    <PayPalScriptProvider
      options={{
        clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID ?? "",
        currency: currencyCode,
        // intent: "capture",
        // buyerCountry: currency.code,
      }}
    >
      {children}
    </PayPalScriptProvider>
  );
};

export default PaypalProvider;
