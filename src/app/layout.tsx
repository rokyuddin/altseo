import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google"; // Editorial combination
import "@/styles/globals.css";
import { AuthProvider } from "@/components/providers/auth-provider";

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
  title: "AltSEO | Automated ALT Text & Image SEO for Next.js",
  description:
    "Boost your search rankings and web accessibility with AltSEO. Automate ALT text generation for your images using enterprise-grade AI. Built for developers and SEO teams.",
  openGraph: {
    title: "AltSEO: The Future of Image SEO & Web Accessibility",
    description: "Automate your image accessibility and SEO with AI. Generate keyword-rich ALT text that drives organic traffic and ensures WCAG compliance.",
    type: "website",
    url: "https://altseo.vercel.app", // Assuming the domain
  },
  twitter: {
    card: "summary_large_image",
    title: "AltSEO | Automated ALT Text & Image SEO",
    description: "Automate your image accessibility and SEO with AI vision.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={`${inter.variable} ${playfair.variable} font-sans antialiased`}
      >
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
