import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.scss";
import { NextUIProvider } from "@nextui-org/react";
import ConfigureAmplifyClientSide from "../config/amplify-cognito-config";
import * as React from "react";

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
      <body className={inter.className}>
        <NextUIProvider>
          <ConfigureAmplifyClientSide/>
          {children}
        </NextUIProvider>
      </body>
    </html>
  );
}
