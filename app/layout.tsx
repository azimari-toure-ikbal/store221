export const dynamic = "force-dynamic";

import FloatingWhatsapp from "@/components/floating-whatsapp";
import Footer from "@/components/footer";
import GlobalProvider from "@/components/global-provider";
import Navbar from "@/components/navbar";
import PaypalProvider from "@/components/paypal-provider";
import { TRPCProvider } from "@/server/trpc/client";
import { HydrateClient, trpc } from "@/server/trpc/server";
import { Provider as JotaiProvider } from "jotai";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { NuqsAdapter } from "nuqs/adapters/next";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { Toaster } from "sonner";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Store221",
  description: "Boutique de vêtements africains et contemporains",
  category: "Ecommerce",
  classification: "Store",
  keywords: [
    "africa",
    "african",
    "style",
    "fashion",
    "shop",
    "boutique",
    "ecommerce",
    "store",
    "221",
    "store221",
    "kayshopping",
    "kay shopping",
    "kay shopping store",
    "kay shopping boutique",
  ],
  publisher: "Store221",
  openGraph: {
    type: "website",
    url: "https://store221.com",
    title: "Store221",
    description: "Boutique de vêtements africains et contemporains",
    siteName: "Store221",

    // images: [
    //   {
    //     url: "https://store221.com/og.png",
    //     width: 1200,
    //     height: 630,
    //     alt: "Store221",
    //   },
    // ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  void trpc.rates.getRates.prefetch();

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <JotaiProvider>
          <TRPCProvider>
            <NuqsAdapter>
              <div className="relative min-h-full w-full bg-white">
                <main className="relative flex min-h-screen flex-col">
                  <FloatingWhatsapp />

                  <HydrateClient>
                    <Suspense
                      fallback={
                        <header className="sticky top-0 z-40 border-b bg-zinc-50">
                          <div className="container mx-auto flex h-16 items-center justify-between py-4">
                            <div className="h-8 w-20 animate-pulse rounded-xl bg-zinc-200"></div>
                            <div className="hidden items-center gap-6 md:flex">
                              {[...Array(6)].map((_, index) => (
                                <div
                                  key={index}
                                  className="h-8 w-20 animate-pulse rounded-xl bg-zinc-200"
                                ></div>
                              ))}
                            </div>
                            <div className="flex items-center gap-4">
                              <div className="size-8 animate-pulse rounded-full bg-zinc-200"></div>
                              <div className="h-8 w-20 animate-pulse rounded-xl bg-zinc-200"></div>
                              <div className="h-8 w-20 animate-pulse rounded-xl bg-zinc-200"></div>
                            </div>
                          </div>
                        </header>
                      }
                    >
                      <ErrorBoundary fallback={<p>Error</p>}>
                        <Navbar />
                      </ErrorBoundary>
                    </Suspense>
                  </HydrateClient>
                  <div className="h-full w-full flex-1 flex-grow overflow-x-hidden pb-6 sm:overflow-x-scroll">
                    <GlobalProvider />
                    <PaypalProvider>{children}</PaypalProvider>
                  </div>
                  <Footer />
                </main>
              </div>
              <Toaster />
            </NuqsAdapter>
          </TRPCProvider>
        </JotaiProvider>
      </body>
    </html>
  );
}
