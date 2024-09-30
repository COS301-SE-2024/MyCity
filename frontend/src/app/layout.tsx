import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.scss";
import { NextUIProvider } from "@nextui-org/react";
import ConfigureAmplifyClientSide from "../config/amplify-cognito.config";
import * as React from "react";
import { UserProfileProvider } from "@/context/UserProfileContext";
import { MapboxProvider } from "@/context/MapboxContext";

const inter = Inter({ subsets: ["latin"] });

const APP_NAME = "MyCity";
const APP_DEFAULT_TITLE = "MyCity";
const APP_TITLE_TEMPLATE = "%s - PWA App";
const APP_DESCRIPTION = "Be the change with MyCity!";

export const metadata: Metadata = {
  applicationName: APP_NAME,
  title: {
    default: APP_DEFAULT_TITLE,
    template: APP_TITLE_TEMPLATE,
  },
  description: APP_DESCRIPTION,
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: APP_DEFAULT_TITLE,
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    siteName: APP_NAME,
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
  },
  twitter: {
    card: "summary",
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
  },
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
        <meta name="mobile-web-app-capable" content="yes" />
        <link rel="apple-touch-icon" href="/icon-192x192.png" />
      </head>
      <body className={inter.className}>
        <NextUIProvider>
          <ConfigureAmplifyClientSide />
          <UserProfileProvider>
            <MapboxProvider>
              <div className="relative z-10">
                {children}
              </div>
            </MapboxProvider>
          </UserProfileProvider>
        </NextUIProvider>
      </body>
    </html>
  );
}
