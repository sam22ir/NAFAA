"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { useCart } from "@/context/CartContext";
import { SlidersHorizontal, X, ChevronDown } from "lucide-react";

export default function NewArrivalsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const { addItem } = useCart();

  useEffect(() => {
    async function fetchNewArrivals() {
      const { data } = await supabase
        .from("products")
        .select("*, categories(name_ar)")
        .eq("is_active", true)
        .eq("is_new", true)
        .order("created_at", { ascending: false })
        .limit(24);
      setProducts(data || []);
      setLoading(false);
    }
    fetchNewArrivals();
  }, []);

  return (
    <div className="min-h-screen bg-[#F8F9FB] pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-accent-blue font-montserrat mb-3">NEW SEASON</p>
          <h1 className="text-5xl font-black uppercase tracking-tighter font-montserrat text-primary-dark">
            وصل <span className="text-accent-blue">حديثاً</span>
          </h1>
          <p className="text-dark-grey font-tajawal mt-3 font-bold">أحدث تشكيلات الموسم الجديد</p>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-light-grey animate-pulse aspect-[3/4]" />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20">
            <p className="font-tajawal text-xl text-dark-grey mb-6">لا توجد منتجات جديدة حالياً</p>
            <Link href="/shop" className="bg-primary-dark text-brand-white px-10 py-4 font-black uppercase tracking-widest text-xs hover:bg-accent-blue transition-all">
              تصفح المتجر
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map((product) => (
              <div
                key={product.id}
                className="group bg-brand-white border border-light-grey overflow-hidden"
                onMouseEnter={() => setHoveredId(product.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                <Link href={`/product/${product.id}`} className="block relative aspect-[3/4] overflow-hidden bg-light-grey">
                  {product.image_urls?.[0] || product.image_url ? (
                    <Image
                      src={hoveredId === product.id && product.image_urls?.[1]
                        ? product.image_urls[1]
                        : product.image_urls?.[0] || product.image_url}
                      alt={product.name_ar}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-primary-dark/5 flex items-center justify-center">
                      <span className="text-[10px] font-black uppercase tracking-widest text-dark-grey font-montserrat">NAFAA</span>
                    </div>
                  )}
                  <div className="absolute top-3 right-3">
                    <span className="bg-accent-blue text-brand-white text-[8px] font-black uppercase tracking-widest px-2 py-1">NEW</span>
                  </div>
                  {product.original_price && (
                    <div className="absolute top-3 left-3">
                      <span className="bg-alert text-brand-white text-[8px] font-black uppercase tracking-widest px-2 py-1">
                        -{Math.round((1 - product.price_dzd / product.original_price) * 100)}%
                      </span>
                    </div>
                  )}
                </Link>

                <div className="p-4">
                  <Link href={`/product/${product.id}`}>
                    <p className="text-[9px] font-black uppercase tracking-widest text-accent-blue font-montserrat mb-1">
                      {product.categories?.name_ar || "NAFAA"}
                    </p>
                    <h3 className="font-tajawal font-bold text-primary-dark text-sm leading-tight mb-2 line-clamp-2 text-right">
                      {product.name_ar}
                    </h3>
                  </Link>
                  <div className="flex items-center justify-between mt-3">
                    <button
                      onClick={() => addItem({
                        id: product.id,
                        name_ar: product.name_ar,
                        name_en: product.name_en,
                        price_dzd: product.price_dzd,
                        image_url: product.image_urls?.[0] || product.image_url,
                      })}
                      className="bg-primary-dark text-brand-white text-[8px] font-black uppercase tracking-widest px-3 py-2 hover:bg-accent-blue transition-all"
                    >
                      + سلة
                    </button>
                    <div className="text-right">
                      <p className="font-numbers font-black text-primary-dark text-sm">{product.price_dzd?.toLocaleString()} <span className="text-[10px]">DA</span></p>
                      {product.original_price && (
                        <p className="font-numbers text-dark-grey text-[10px] line-through">{product.original_price?.toLocaleString()} DA</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
