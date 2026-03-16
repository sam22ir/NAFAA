"use client";

import Link from "next/link";
import Image from "next/image";
import { ShoppingCart, Eye } from "lucide-react";
import { useState } from "react";
import QuickViewModal from "./QuickViewModal";

interface ProductCardProps {
  id: string;
  name_ar: string;
  name_en: string;
  price_dzd: number;
  discount_price_dzd?: number;
  image_urls: string[];
  is_new_arrival?: boolean;
  is_featured?: boolean;
  categories?: {
    name_ar: string;
    name_en: string;
  };
}

export default function ProductCard({
  id,
  name_ar,
  name_en,
  price_dzd,
  discount_price_dzd,
  image_urls,
  is_new_arrival,
  is_featured,
  categories,
}: ProductCardProps) {
  const mainImage = image_urls?.[0] || "/placeholder-product.jpg";
  const hoverImage = image_urls?.[1] || mainImage;
  const categoryName = categories?.name_ar || "منتج";
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);

  return (
    <div className="group relative flex flex-col bg-brand-white transition-all duration-300">
      <Link href={`/product/${id}`} className="absolute inset-0 z-0" aria-label={`View ${name_ar}`} />
      
      {/* Image Container */}
      <div className="relative aspect-[3/4] overflow-hidden bg-light-grey pointer-events-none">
        {/* Main Image */}
        <div className="relative w-full h-full block">
          <Image
            src={mainImage}
            alt={name_ar}
            fill
            className="object-cover transition-opacity duration-700 group-hover:opacity-0"
          />
          {/* Hover Image */}
          <Image
            src={hoverImage}
            alt={`${name_ar} - Alternate View`}
            fill
            className="object-cover absolute inset-0 opacity-0 transition-opacity duration-700 group-hover:opacity-100"
          />
        </div>

        {/* Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
          {is_new_arrival && (
            <span className="bg-primary-dark text-brand-white text-[10px] font-black uppercase tracking-widest px-3 py-1 font-montserrat">
              New
            </span>
          )}
          {discount_price_dzd && (
            <span className="bg-alert text-brand-white text-[10px] font-black uppercase tracking-widest px-3 py-1 font-montserrat">
              Sale
            </span>
          )}
        </div>

        {/* Quick Add / Actions Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-gradient-to-t from-primary-dark/60 to-transparent z-20 flex gap-2 pointer-events-auto">
          <Link 
            href={`/product/${id}`}
            className="flex-grow bg-brand-white text-primary-dark font-black text-[10px] uppercase tracking-widest py-3 flex items-center justify-center gap-2 hover:bg-accent-blue hover:text-brand-white transition-colors duration-200"
          >
            <ShoppingCart size={14} />
            إضافة للسلة
          </Link>
          <button
            onClick={(e) => {
              e.preventDefault();
              setIsQuickViewOpen(true);
            }}
            className="p-3 bg-brand-white/20 backdrop-blur-md text-brand-white hover:bg-brand-white hover:text-primary-dark transition-colors duration-200"
            title="مشاهدة التفاصيل"
          >
            <Eye size={16} />
          </button>
        </div>
      </div>

      {/* Product Details */}
      <div className="py-4 flex flex-col items-center text-center pointer-events-none">
        <span className="text-[10px] uppercase tracking-[0.2em] text-dark-grey font-bold mb-1 font-montserrat z-10 relative">
          {categoryName}
        </span>
        <h3 className="text-sm font-bold text-brand-black mb-2 group-hover:text-accent-blue transition-colors font-tajawal z-10 relative">
          {name_ar}
        </h3>
        
        <div className="flex items-center gap-3 z-10 relative">
          <span className="text-base font-black text-primary-dark font-numbers">
            {price_dzd.toLocaleString()} دج
          </span>
          {discount_price_dzd && (
            <span className="text-xs text-dark-grey line-through font-numbers">
              {discount_price_dzd.toLocaleString()} دج
            </span>
          )}
        </div>
      </div>

      <QuickViewModal
        isOpen={isQuickViewOpen}
        onClose={() => setIsQuickViewOpen(false)}
        product={{ id, name_ar, name_en, price_dzd, original_price: discount_price_dzd, image_urls, is_new: is_new_arrival, categories }}
      />
    </div>
  );
}
