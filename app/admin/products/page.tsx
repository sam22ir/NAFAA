"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Plus, 
  Search, 
  Filter, 
  Edit2, 
  Trash2, 
  ChevronRight, 
  Package,
  AlertCircle,
  CheckCircle2,
  MoreVertical,
  ArrowUpDown
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

interface Product {
  id: string;
  name_en: string;
  name_ar: string;
  price_dzd: number;
  stock_quantity: number;
  category_id: number;
  image_urls: string[];
  categories?: {
    name_ar: string;
  };
}

export default function AdminProductsPage() {
  const { user, profile, loading: authLoading } = useAuth();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  useEffect(() => {
    if (!authLoading && (!user || (!profile?.is_admin && profile?.role !== 'admin'))) {
      router.push("/");
    }
    fetchProducts();
  }, [authLoading, user, profile, router]);

  const fetchProducts = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("products")
      .select(`
        *,
        categories (
          name_ar
        )
      `)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching products:", error);
    } else {
      setProducts(data || []);
    }
    setLoading(false);
  };

  const filteredProducts = products.filter(p => 
    (p.name_en.toLowerCase().includes(searchTerm.toLowerCase()) || 
     p.name_ar.includes(searchTerm)) &&
    (selectedCategory === "all" || p.category_id.toString() === selectedCategory)
  );

  return (
    <div className="min-h-screen bg-light-grey pt-24 pb-12 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <h1 className="text-3xl font-black uppercase tracking-tighter mb-2 font-montserrat">
              PRODUCT <span className="text-accent-blue">MANAGEMENT</span>
            </h1>
            <p className="text-dark-grey font-tajawal text-sm uppercase tracking-widest font-bold">
              إدارة المخزون والمنتجات
            </p>
          </div>
          
          <Link href="/admin/products/new" className="bg-primary-dark text-brand-white px-8 py-4 font-black uppercase tracking-widest text-sm flex items-center justify-center gap-3 hover:bg-accent-blue transition-all duration-300 shadow-lg shadow-primary-dark/20">
            <Plus size={18} />
            Add New Product
          </Link>
        </div>

        {/* Filters/Actions Bar */}
        <div className="bg-brand-white p-6 shadow-sm border border-light-grey mb-8 flex flex-col lg:flex-row lg:items-center gap-4">
          <div className="relative flex-grow">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-grey" size={18} />
            <input 
              type="text" 
              placeholder="Search by name... (ابحث بالاسم)"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-light-grey border-none py-3 pl-12 pr-4 text-sm font-bold font-tajawal focus:ring-2 focus:ring-accent-blue outline-none transition-all"
            />
          </div>
          
          <div className="flex gap-4">
            <div className="relative min-w-[200px]">
              <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-grey" size={18} />
              <select 
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full bg-light-grey border-none py-3 pl-12 pr-10 text-sm font-bold font-tajawal focus:ring-2 focus:ring-accent-blue outline-none transition-all appearance-none cursor-pointer"
              >
                <option value="all">All Categories</option>
                <option value="clothing">T-Shirts</option>
                <option value="accessories">Accessories</option>
              </select>
            </div>
            
            <button className="bg-light-grey p-3 hover:bg-light-blue/10 transition-colors text-primary-dark">
              <ArrowUpDown size={20} />
            </button>
          </div>
        </div>

        {/* Table Content */}
        <div className="bg-brand-white shadow-xl overflow-hidden border border-light-grey">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-light-grey border-b border-light-blue/20">
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-primary-dark font-montserrat">Image</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-primary-dark font-montserrat text-right">Product Name / الاسم</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-primary-dark font-montserrat text-right">Category / الفئة</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-primary-dark font-montserrat">Price</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-primary-dark font-montserrat">Stock</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-primary-dark font-montserrat text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-light-grey">
                <AnimatePresence>
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td className="px-6 py-4"><div className="w-12 h-12 bg-light-grey rounded"></div></td>
                      <td className="px-6 py-4"><div className="h-4 bg-light-grey w-3/4 ml-auto"></div></td>
                      <td className="px-6 py-4"><div className="h-4 bg-light-grey w-1/2 ml-auto"></div></td>
                      <td className="px-6 py-4"><div className="h-4 bg-light-grey w-1/4"></div></td>
                      <td className="px-6 py-4"><div className="h-4 bg-light-grey w-1/4"></div></td>
                      <td className="px-6 py-4"><div className="h-4 bg-light-grey w-1/2 mx-auto"></div></td>
                    </tr>
                  ))
                ) : filteredProducts.length > 0 ? (
                  filteredProducts.map((product) => (
                    <motion.tr 
                      key={product.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="hover:bg-light-grey/50 transition-colors group"
                    >
                      <td className="px-6 py-4">
                        <div className="w-12 h-12 bg-light-grey rounded overflow-hidden shadow-inner flex items-center justify-center">
                          {product.image_urls && product.image_urls.length > 0 ? (
                            <img src={product.image_urls[0]} alt={product.name_en} className="w-full h-full object-cover" />
                          ) : (
                            <Package size={20} className="text-dark-grey" />
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="font-bold text-primary-dark font-montserrat text-sm">{product.name_en}</div>
                        <div className="text-xs text-dark-grey font-tajawal font-bold mt-0.5">{product.name_ar}</div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="text-xs font-bold uppercase tracking-widest text-accent-blue font-montserrat bg-accent-blue/10 px-2 py-1">
                          {product.categories?.name_ar || "غير مصنف"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-numbers font-black text-sm text-primary-dark">{product.price_dzd.toLocaleString()} DA</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${product.stock_quantity > 10 ? 'bg-green-500' : product.stock_quantity > 0 ? 'bg-orange-500' : 'bg-alert'}`}></div>
                          <span className="font-numbers font-bold text-xs">
                            {product.stock_quantity}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Link href={`/admin/products/edit/${product.id}`} className="p-2 text-primary-dark hover:text-accent-blue transition-colors">
                            <Edit2 size={18} />
                          </Link>
                          <button className="p-2 text-primary-dark hover:text-alert transition-colors">
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-20 text-center">
                      <div className="flex flex-col items-center gap-4">
                        <Package size={48} className="text-light-blue" />
                        <div className="font-tajawal font-bold text-dark-grey">لم يتم العثور على أي منتجات</div>
                        <button 
                          onClick={() => { setSearchTerm(""); setSelectedCategory("all"); }}
                          className="text-accent-blue text-xs font-black uppercase tracking-widest underline decoration-2 underline-offset-4"
                        >
                          Clear Filters
                        </button>
                      </div>
                    </td>
                  </tr>
                )}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
