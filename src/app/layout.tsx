import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google"; // Editorial combination
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "AltSEO - AI Powered Accessibility",
  description: "Automate your image accessibility with enterprise-grade AI vision.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${playfair.variable} font-sans antialiased bg-[#fcfbf9] text-zinc-900`}
      >
        {children}
      </body>
    </html>
  );
}
