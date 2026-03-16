import type { Metadata } from "next";
import { Cairo, Tajawal, Montserrat, Inter, Roboto_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import WhatsAppButton from "./components/WhatsAppButton";

const cairo = Cairo({
  variable: "--font-cairo",
  subsets: ["arabic", "latin"],
  weight: ["400", "700"],
});

const tajawal = Tajawal({
  variable: "--font-tajawal",
  subsets: ["arabic"],
  weight: ["400", "500", "700"],
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["700", "900"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const robotoMono = Roboto_Mono({
  variable: "--font-roboto-mono",
  subsets: ["latin"],
});

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
      <body
        className={`${cairo.variable} ${tajawal.variable} ${montserrat.variable} ${inter.variable} ${robotoMono.variable} antialiased min-h-screen flex flex-col`}
      >
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

