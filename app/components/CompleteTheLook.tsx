"use client";

import { useState, useEffect } from "react";
import { ShoppingCart, ArrowLeft } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useCart } from "@/context/CartContext";
import Link from "next/link";

interface CompleteTheLookProps {
  productId: string;
  category?: string;
}

export default function CompleteTheLook({ productId, category }: CompleteTheLookProps) {
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const { addItem } = useCart();

  useEffect(() => {
    // Fetch complementary products from different category
    const excludeCategory = category || "";
    supabase
      .from("products")
      .select("id, name_ar, price_dzd, images, category, is_new")
      .neq("id", productId)
      .neq("category", excludeCategory)
      .eq("is_active", true)
      .eq("is_archived", false)
      .limit(4)
      .then(({ data }) => setSuggestions(data || []));
  }, [productId, category]);

  if (suggestions.length === 0) return null;

  return (
    <section className="py-12 border-t border-light-grey" dir="rtl">
      <div className="mb-6">
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-accent-blue font-montserrat mb-2">COMPLETE THE LOOK</p>
        <h2 className="text-2xl font-black uppercase tracking-tighter font-montserrat text-primary-dark">
          أكمل <span className="text-accent-blue">إطلالتك</span>
        </h2>
        <p className="font-tajawal text-dark-grey text-sm mt-1">منتجات تتناسب مع هذه القطعة</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {suggestions.map((product) => (
          <div key={product.id} className="group relative">
            {/* Image */}
            <Link href={`/product/${product.id}`}>
              <div className="aspect-[3/4] bg-light-grey overflow-hidden relative mb-3">
                {product.images?.[0] ? (
                  <img
                    src={product.images[0]}
                    alt={product.name_ar}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-4xl font-black text-dark-grey/20 font-montserrat">N</span>
                  </div>
                )}
                {product.is_new && (
                  <span className="absolute top-2 right-2 bg-accent-blue text-brand-white text-[9px] font-black px-2 py-0.5 font-montserrat">NEW</span>
                )}
              </div>
            </Link>

            {/* Info */}
            <p className="font-tajawal font-bold text-primary-dark text-sm truncate">{product.name_ar}</p>
            <div className="flex items-center justify-between mt-1">
              <span className="font-numbers font-black text-accent-blue">{product.price_dzd?.toLocaleString()} DA</span>
              <button
                onClick={() => addItem({ ...product, quantity: 1, price_dzd: product.price_dzd })}
                className="bg-primary-dark text-brand-white p-1.5 hover:bg-accent-blue transition-all"
                title="أضف للسلة"
              >
                <ShoppingCart size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
