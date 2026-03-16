"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { 
  X, 
  ShoppingBag, 
  ArrowLeft, 
  Check, 
  Minus,
  AlertCircle
} from "lucide-react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";

export default function ComparePage() {
  const [items, setItems] = useState<any[]>([]);
  const { addItem } = useCart();

  useEffect(() => {
    const saved = localStorage.getItem("nafaa_comparison");
    if (saved) {
      setItems(JSON.parse(saved));
    }
  }, []);

  const removeFromComparison = (id: string) => {
    const updated = items.filter(item => item.id !== id);
    setItems(updated);
    localStorage.setItem("nafaa_comparison", JSON.stringify(updated));
  };

  const clearComparison = () => {
    setItems([]);
    localStorage.removeItem("nafaa_comparison");
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-brand-white pt-32 pb-20 px-6 flex flex-col items-center justify-center text-center">
        <AlertCircle size={64} className="text-light-grey mb-6" />
        <h1 className="text-4xl font-black uppercase tracking-tighter mb-4 font-montserrat">COMPARISON <span className="text-accent-blue">EMPTY</span></h1>
        <p className="text-xl font-tajawal font-bold text-dark-grey mb-8">لم تقم بإضافة أي منتجات للمقارنة بعد.</p>
        <Link 
          href="/shop"
          className="bg-primary-dark text-brand-white px-12 py-4 font-black uppercase tracking-widest text-sm hover:bg-accent-blue transition-all"
        >
          اذهب للمتجر
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-light-grey pt-24 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div>
            <h1 className="text-4xl font-black uppercase tracking-tighter mb-2 font-montserrat">PRODUCT <span className="text-accent-blue">COMPARISON</span></h1>
            <p className="text-dark-grey font-tajawal text-sm uppercase tracking-widest font-bold">مقارنة تفصيلية بين المنتجات المختارة</p>
          </div>
          
          <button 
            onClick={clearComparison}
            className="text-[10px] font-black uppercase tracking-widest text-alert border-b-2 border-alert pb-1 hover:text-primary-dark hover:border-primary-dark transition-all"
          >
            Clear All / مسح الكل
          </button>
        </div>

        <div className="bg-brand-white shadow-2xl border border-light-grey overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-light-grey">
                <th className="p-8 text-left bg-light-grey/30 w-64 min-w-[200px]">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-accent-blue font-montserrat">Specifications</span>
                </th>
                {items.map((item) => (
                  <th key={item.id} className="p-8 min-w-[300px] relative group border-l border-light-grey">
                    <button 
                      onClick={() => removeFromComparison(item.id)}
                      className="absolute top-4 right-4 text-light-grey hover:text-alert transition-colors"
                    >
                      <X size={20} />
                    </button>
                    <div className="aspect-[3/4] relative bg-light-grey mb-6 w-48 mx-auto">
                      <Image src={item.image_urls?.[0] || item.image_url} alt={item.name_en} fill className="object-cover" />
                    </div>
                    <div className="text-center">
                      <h3 className="text-sm font-black text-primary-dark font-montserrat uppercase mb-2 leading-tight">{item.name_en}</h3>
                      <p className="text-[10px] font-bold text-accent-blue font-tajawal mb-4">{item.name_ar}</p>
                      <button 
                        onClick={() => addItem({
                          id: item.id,
                          name_ar: item.name_ar,
                          name_en: item.name_en,
                          price_dzd: item.price_dzd,
                          image_url: item.image_urls?.[0] || item.image_url,
                        })}
                        className="bg-primary-dark text-brand-white px-6 py-3 text-[9px] font-black uppercase tracking-widest hover:bg-accent-blue transition-all flex items-center justify-center gap-2 mx-auto"
                      >
                        <ShoppingBag size={12} /> Add to Cart
                      </button>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-light-grey">
              <tr>
                <td className="p-8 font-black uppercase tracking-widest text-[10px] text-dark-grey bg-light-grey/30">Price / السعر</td>
                {items.map(item => (
                  <td key={item.id} className="p-8 text-center text-lg font-black font-numbers text-primary-dark border-l border-light-grey">
                    {item.price_dzd.toLocaleString()} DA
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-8 font-black uppercase tracking-widest text-[10px] text-dark-grey bg-light-grey/30">Category / الفئة</td>
                {items.map(item => (
                  <td key={item.id} className="p-8 text-center text-xs font-bold text-dark-grey font-tajawal border-l border-light-grey">
                    {item.categories?.name_ar || 'تصنيف عام'}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-8 font-black uppercase tracking-widest text-[10px] text-dark-grey bg-light-grey/30">Stock Status</td>
                {items.map(item => (
                  <td key={item.id} className="p-8 text-center border-l border-light-grey">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-100 text-green-700 text-[9px] font-black uppercase tracking-widest">
                      <Check size={12} /> In Stock
                    </div>
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-8 font-black uppercase tracking-widest text-[10px] text-dark-grey bg-light-grey/30">Description / الوصف</td>
                {items.map(item => (
                  <td key={item.id} className="p-8 text-center border-l border-light-grey">
                    <p className="text-[10px] font-tajawal text-dark-grey leading-relaxed line-clamp-4">
                      {item.description_ar}
                    </p>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>

        <div className="mt-16 flex justify-center">
          <Link 
            href="/shop"
            className="flex items-center gap-3 text-sm font-black uppercase tracking-widest text-primary-dark hover:text-accent-blue transition-all"
          >
            <ArrowLeft size={18} /> Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
