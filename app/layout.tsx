import type { Metadata } from "next";
import "./globals.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import WhatsAppButton from "./components/WhatsAppButton";

export const metadata: Metadata = {
  title: "NAFAA | Men's Streetwear & Sportswear",
  description: "NAFAA - Premium Men's Streetwear and Sportswear brand in Algeria.",
};

function PromoBanner() {
  return (
    <div className="bg-primary-dark text-brand-white py-2 overflow-hidden border-b border-white/5">
      <div className="flex whitespace-nowrap animate-float-text">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex items-center gap-8 px-4">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] font-montserrat">Free Shipping on orders over 15,000 DZD</span>
            <span className="w-1 h-1 bg-accent-blue rounded-full" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] font-montserrat">توصيل سريع لـ 69 ولاية</span>
            <span className="w-1 h-1 bg-accent-blue rounded-full" />
          </div>
        ))}
      </div>
    </div>
  );
}

import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
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
      <body className="antialiased min-h-screen flex flex-col font-cairo">
        <AuthProvider>
          <CartProvider>
            <PromoBanner />
            <Navbar />
            <main className="flex-grow pt-16 md:pt-20">{children}</main>
            <Footer />
            <WhatsAppButton />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
