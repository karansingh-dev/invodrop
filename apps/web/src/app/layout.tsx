import type { Metadata } from "next";
import { Geist, Geist_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import QueryProvider from "@/components/providers/tanstack-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-space-grotesk",
});

export const metadata: Metadata = {
  title: "InvoDrop",
  description: "Seamless Invoicing in Every Drop",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" >
      <body
        className={`${spaceGrotesk.variable} ${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <QueryProvider>
          <Toaster position="bottom-right" reverseOrder={false} />
          {children}
        </QueryProvider>
      </body>
    </html>
  );
}
