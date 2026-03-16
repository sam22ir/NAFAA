"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Search, ShoppingCart, User, Menu, X } from "lucide-react";
import CartSidebar from "./CartSidebar";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { AuthService } from "@/lib/services/auth-service";

export default function Navbar() {
  const { user, loading } = useAuth();
  const { totalItems } = useCart();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? "bg-brand-white shadow-md py-2 text-primary-dark" : "bg-transparent py-4 text-brand-white"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          {/* Mobile Menu Toggle */}
          <button
            className="lg:hidden p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <span className={`text-2xl font-black tracking-tighter uppercase font-montserrat ${isScrolled ? "text-primary-dark" : "text-brand-white"}`}>
              NAFAA
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <ul className="hidden lg:flex items-center gap-8 list-none m-0 p-0 text-sm font-bold uppercase tracking-widest">
            <li><Link href="/" className="hover:text-accent-blue transition-colors">الرئيسية</Link></li>
            <li><Link href="/shop" className="hover:text-accent-blue transition-colors">المتجر</Link></li>
            <li><Link href="/new-arrivals" className="hover:text-accent-blue transition-colors">وصلنا حديثاً</Link></li>
            <li><Link href="/about" className="hover:text-accent-blue transition-colors">عن نافع</Link></li>
          </ul>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <Link href="/shop" className={`p-2 hover:text-accent-blue transition-colors ${isScrolled ? "text-primary-dark" : "text-brand-white"}`}>
              <Search size={22} />
            </Link>
            
            {!loading && (
              user ? (
                <div className="flex gap-4 items-center">
                  <div className="group relative">
                    <button className={`p-2 hover:text-accent-blue transition-colors ${isScrolled ? "text-primary-dark" : "text-brand-white"}`}>
                      <User size={22} />
                    </button>
                    <div className="absolute top-full left-0 mt-2 w-48 bg-brand-white shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all border border-light-grey py-2">
                      <Link href="/account" className="block px-6 py-3 text-xs font-bold uppercase tracking-widest text-primary-dark hover:bg-light-grey font-montserrat">My Account</Link>
                      <button 
                        onClick={() => AuthService.logout()}
                        className="w-full text-left px-6 py-3 text-xs font-bold uppercase tracking-widest text-alert hover:bg-light-grey font-montserrat"
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => setIsCartOpen(true)}
                    className={`relative p-2 hover:text-accent-blue transition-colors ${isScrolled ? "text-primary-dark" : "text-brand-white"}`}
                  >
                    <ShoppingCart size={22} />
                    {totalItems > 0 && (
                      <span className="absolute top-0 right-0 bg-alert text-brand-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full font-numbers">
                        {totalItems}
                      </span>
                    )}
                  </button>
                </div>
              ) : (
                <Link href="/login" className={`p-2 hover:text-accent-blue transition-colors ${isScrolled ? "text-primary-dark" : "text-brand-white"}`}>
                  <User size={22} />
                </Link>
              )
            )}
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 right-0 bg-brand-white border-t border-light-grey shadow-xl p-6 flex flex-col gap-6 text-brand-black">
            <ul className="flex flex-col gap-4 list-none m-0 p-0 font-bold uppercase tracking-widest">
              <li><Link href="/" onClick={() => setIsMobileMenuOpen(false)}>الرئيسية</Link></li>
              <li><Link href="/shop" onClick={() => setIsMobileMenuOpen(false)}>المتجر</Link></li>
              <li><Link href="/new-arrivals" onClick={() => setIsMobileMenuOpen(false)}>وصلنا حديثاً</Link></li>
              <li><Link href="/about" onClick={() => setIsMobileMenuOpen(false)}>عن نافع</Link></li>
            </ul>
            <div className="pt-4 border-t border-light-grey">
              {user ? (
                <div className="flex flex-col gap-4">
                  <button 
                    onClick={() => { setIsCartOpen(true); setIsMobileMenuOpen(false); }}
                    className="flex items-center gap-2 font-bold"
                  >
                    <ShoppingCart size={20} />
                    <span>سلة المشتريات ({totalItems})</span>
                  </button>
                  <button 
                    onClick={() => { AuthService.logout(); setIsMobileMenuOpen(false); }}
                    className="flex items-center gap-2 font-bold text-alert"
                  >
                    <X size={20} />
                    <span>تسجيل الخروج</span>
                  </button>
                </div>
              ) : (
                <Link href="/login" className="flex items-center gap-2 font-bold" onClick={() => setIsMobileMenuOpen(false)}>
                  <User size={20} />
                  <span>تسجيل الدخول</span>
                </Link>
              )}
            </div>
          </div>
        )}
      </nav>

      <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
}
