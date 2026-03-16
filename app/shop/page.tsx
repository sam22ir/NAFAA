"use client";

import { useState, useEffect } from "react";
import ProductGrid from "../components/ProductGrid";
import { Filter, ChevronDown, X } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function ShopPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | number>("all");

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    const { data, error } = await supabase.from("categories").select("*");
    if (!error) setCategories(data || []);
  };

  const getCategoryName = () => {
    if (selectedCategory === "all") return "الكل";
    const cat = categories.find(c => c.id === selectedCategory);
    return cat ? cat.name_ar : "";
  };

  return (
    <div className="bg-brand-white min-h-screen pb-24">
      {/* Page Header */}
      <div className="bg-light-grey py-16 border-b border-light-blue/20">
        <div className="max-w-7xl mx-auto px-6">
          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-4 font-montserrat">
            المتجر <span className="text-accent-blue">الكامل</span>
          </h1>
          <p className="text-dark-grey text-lg font-tajawal max-w-2xl">
            استكشف تشكيلتنا الواسعة من الملابس العصرية المصممة خصيصاً لتناسب نمط حياتك. الجودة الجزائرية تلتقي مع التصميم العالمي.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 mt-12 flex flex-col lg:flex-row gap-12">
        {/* Sidebar Filters */}
        <aside className="w-full lg:w-64 shrink-0">
          <div className="sticky top-24 space-y-10">
            <div>
              <h3 className="text-xs font-black uppercase tracking-widest text-primary-dark mb-6 font-montserrat flex items-center justify-between">
                الفئات
                <ChevronDown size={14} />
              </h3>
              <ul className="space-y-3 font-tajawal text-sm font-bold text-dark-grey">
                <li 
                  onClick={() => setSelectedCategory("all")}
                  className={`cursor-pointer transition-colors ${selectedCategory === "all" ? "text-accent-blue" : "hover:text-primary-dark"}`}
                >
                  الكل
                </li>
                {categories.map((category) => (
                  <li 
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`cursor-pointer transition-colors ${selectedCategory === category.id ? "text-accent-blue" : "hover:text-primary-dark"}`}
                  >
                    {category.name_ar}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-xs font-black uppercase tracking-widest text-primary-dark mb-6 font-montserrat flex items-center justify-between">
                ترتيب حسب
                <Filter size={14} />
              </h3>
              <select className="w-full bg-light-grey border-none text-sm font-bold font-tajawal p-3 focus:ring-1 focus:ring-accent-blue outline-none cursor-pointer">
                <option>الأحدث أولاً</option>
                <option>السعر: من الأقل للأعلى</option>
                <option>السعر: من الأعلى للأقل</option>
                <option>الأكثر مبيعاً</option>
              </select>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-grow">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 pb-4 border-b border-light-grey gap-4">
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-[10px] font-black uppercase tracking-widest text-primary-dark font-montserrat">الفلاتر النشطة:</span>
              <div className="flex flex-wrap gap-2">
                {selectedCategory !== "all" && (
                  <span 
                    onClick={() => setSelectedCategory("all")}
                    className="bg-light-grey px-3 py-1 text-[10px] font-bold border border-light-blue/20 flex items-center gap-2 group cursor-pointer hover:bg-brand-white transition-colors uppercase font-montserrat"
                  >
                    {getCategoryName()} <X size={10} className="text-dark-grey group-hover:text-alert" />
                  </span>
                )}
                {selectedCategory !== "all" && (
                  <button 
                    onClick={() => setSelectedCategory("all")}
                    className="text-[10px] font-black underline text-dark-grey hover:text-alert transition-colors font-tajawal"
                  >
                    مسح الكل
                  </button>
                )}
              </div>
            </div>
            
            <span className="text-xs font-bold text-dark-grey font-numbers uppercase tracking-widest font-montserrat">
              NAFAA EXCLUSIVE
            </span>
          </div>
          
          <ProductGrid categoryId={selectedCategory} />
          
          {/* Pagination Placeholder */}
          <div className="mt-16 flex justify-center gap-2">
            {[1].map((n) => (
              <button key={n} className={`w-10 h-10 flex items-center justify-center font-bold font-numbers border transition-colors ${n === 1 ? "bg-primary-dark text-brand-white border-primary-dark" : "hover:border-primary-dark"}`}>
                {n}
              </button>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
