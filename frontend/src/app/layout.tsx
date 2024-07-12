import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.scss";
import { NextUIProvider } from "@nextui-org/react";
import ConfigureAmplifyClientSide from "../config/amplifyCognitoConfig";
import * as React from "react";
import { UserProfileProvider } from "@/context/UserProfileContext";
import { MapboxProvider } from "@/context/MapboxContext";


const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MyCity",
  description: "MyCity",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#000000" />
        <link rel="apple-touch-icon" href="/icon-192x192.png" />
      </head>
      <body className={inter.className}>
        <NextUIProvider>
          <ConfigureAmplifyClientSide />
          <UserProfileProvider>
            <MapboxProvider>
              {children}
            </MapboxProvider>
          </UserProfileProvider>
        </NextUIProvider>
      </body>
    </html >
  );
}

