"use client";

import { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import { supabase } from "@/lib/supabase";
import { Loader2, PackageOpen } from "lucide-react";

interface ProductGridProps {
  categoryId?: string | number;
  sortOption?: string;
}

export default function ProductGrid({ categoryId, sortOption = "newest" }: ProductGridProps) {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, [categoryId, sortOption]);

  const fetchProducts = async () => {
    setLoading(true);
    let query = supabase
      .from("products")
      .select(`
        *,
        categories (
          name_ar,
          name_en
        )
      `)
      .eq("is_active", true);

    if (categoryId && categoryId !== "all") {
      query = query.eq("category_id", categoryId);
    }

    if (sortOption === "price_asc") {
      query = query.order("price_dzd", { ascending: true });
    } else if (sortOption === "price_desc") {
      query = query.order("price_dzd", { ascending: false });
    } else {
      query = query.order("created_at", { ascending: false });
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching products:", error);
    } else {
      setProducts(data || []);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-12 md:gap-x-8">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="animate-pulse flex flex-col gap-4">
            <div className="aspect-[3/4] bg-light-grey rounded"></div>
            <div className="h-4 bg-light-grey w-3/4 mx-auto"></div>
            <div className="h-4 bg-light-grey w-1/2 mx-auto"></div>
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <PackageOpen size={64} className="text-light-blue mb-6" />
        <h3 className="text-xl font-bold text-primary-dark font-tajawal mb-2">لا يوجد منتجات حالياً</h3>
        <p className="text-dark-grey font-tajawal">يرجى المحاولة مرة أخرى لاحقاً أو تغيير الفلتر.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-12 md:gap-x-8">
      {products.map((product) => (
        <ProductCard key={product.id} {...product} />
      ))}
    </div>
  );
}
