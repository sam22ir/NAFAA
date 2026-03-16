import type { Metadata } from "next";
import "./globals.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import WhatsAppButton from "./components/WhatsAppButton";

export const metadata: Metadata = {
  title: "NAFAA | Men's Streetwear & Sportswear",
  description: "NAFAA - Premium Men's Streetwear and Sportswear brand in Algeria.",
};



import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";

import { ThemeProvider } from "./components/ThemeProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" suppressHydrationWarning dir="rtl">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;700&family=Inter:wght@400;500;600;700&family=Montserrat:wght@700;900&family=Roboto+Mono&family=Tajawal:wght@400;500;700&display=swap" rel="stylesheet" />
        <style dangerouslySetInnerHTML={{__html: `
          :root {
            --font-cairo: 'Cairo', sans-serif;
            --font-tajawal: 'Tajawal', sans-serif;
            --font-montserrat: 'Montserrat', sans-serif;
            --font-inter: 'Inter', sans-serif;
            --font-roboto-mono: 'Roboto Mono', monospace;
          }
        `}} />
      </head>
      <body className="antialiased min-h-screen flex flex-col font-cairo bg-brand-white text-brand-black transition-colors duration-300">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <AuthProvider>
            <CartProvider>
              <Navbar />
              <main className="flex-grow pt-16 md:pt-20">{children}</main>
              <Footer />
              <WhatsAppButton />
            </CartProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
