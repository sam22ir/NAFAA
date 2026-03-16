"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Search, ShoppingCart, User } from "lucide-react";
import CartSidebar from "./CartSidebar";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { AuthService } from "@/lib/services/auth-service";
import ThemeToggle from "./ThemeToggle";

export default function Navbar() {
  const { user, profile, loading } = useAuth();
  const { totalItems } = useCart();
  const pathname = usePathname();
  const isHome = pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Determine navbar colors based on page and scroll
  const isTransparent = isHome && !isScrolled;
  const navBgClass = isTransparent 
    ? "bg-transparent border-transparent py-6"
    : isScrolled 
      ? "bg-brand-white/95 backdrop-blur-md border-light-grey shadow-sm py-4"
      : "bg-brand-white border-transparent py-6";
  
  const textColorClass = isTransparent ? "text-brand-white" : "text-primary-dark";

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b ${navBgClass}`}
        dir="ltr"
      >
        <div className="max-w-7xl mx-auto px-4 md:px-6 flex items-center justify-between">
          
          {/* Left: Navigation Links */}
          <div className="flex-1 flex justify-start overflow-x-auto no-scrollbar">
            <ul className={`flex items-center gap-4 md:gap-8 list-none m-0 p-0 text-[10px] md:text-sm font-black uppercase tracking-widest font-montserrat whitespace-nowrap ${textColorClass}`}>
              <li><Link href="/" className="hover:text-accent-blue transition-colors">Home</Link></li>
              <li><Link href="/shop" className="hover:text-accent-blue transition-colors">Shop</Link></li>
              <li><Link href="/new-arrivals" className="hover:text-accent-blue transition-colors">New</Link></li>
              <li><Link href="/about" className="hover:text-accent-blue transition-colors">About</Link></li>
            </ul>
          </div>

          {/* Center: Logo */}
          <div className="flex-1 flex justify-center flex-shrink-0 px-2 md:px-0">
            <Link href="/">
              <span className={`text-xl md:text-3xl font-black tracking-tighter uppercase font-montserrat ${textColorClass}`}>
                NAFAA
              </span>
            </Link>
          </div>

          {/* Right: Icons */}
          <div className={`flex-1 flex justify-end items-center gap-3 md:gap-6 ${textColorClass}`}>
            <ThemeToggle />
            
            <Link href="/shop" className="hover:text-accent-blue transition-colors p-1">
              <Search size={18} className="md:w-6 md:h-6" />
            </Link>
            
            {!loading && (
              user ? (
                <div className="flex gap-3 md:gap-6 items-center">
                  <div className="group relative">
                    <button className="hover:text-accent-blue transition-colors p-1">
                      <User size={18} className="md:w-6 md:h-6" />
                    </button>
                    <div className="absolute top-full right-0 mt-4 w-48 bg-brand-white shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all border border-light-grey py-2 z-50">
                      <Link href="/account" className="block px-6 py-3 text-xs font-bold uppercase tracking-widest text-primary-dark hover:bg-light-grey font-montserrat text-left">My Account</Link>
                      {(profile?.is_admin || profile?.role === 'admin') && (
                        <Link href="/admin" className="block px-6 py-3 text-xs font-bold uppercase tracking-widest text-accent-blue hover:bg-light-grey font-montserrat text-left">Admin Panel</Link>
                      )}
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
                    className="relative hover:text-accent-blue transition-colors p-1"
                  >
                    <ShoppingCart size={18} className="md:w-6 md:h-6" />
                    {totalItems > 0 && (
                      <span className="absolute -top-1 -right-2 bg-accent-blue text-brand-white text-[9px] md:text-[10px] font-black w-4 h-4 md:w-5 md:h-5 flex items-center justify-center rounded-full font-numbers border-2 border-brand-white">
                        {totalItems}
                      </span>
                    )}
                  </button>
                </div>
              ) : (
                <Link href="/login" className="hover:text-accent-blue transition-colors p-1 flex items-center">
                  <User size={18} className="md:w-6 md:h-6" />
                </Link>
              )
            )}
          </div>

        </div>
      </nav>

      <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
}
