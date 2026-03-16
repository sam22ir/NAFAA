"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  ArrowRight, 
  Save, 
  X, 
  Upload, 
  Image as ImageIcon,
  Check,
  Loader2,
  Trash2
} from "lucide-react";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";

interface Category {
  id: string;
  name: string;
  name_ar: string;
}

export default function NewProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  
  const [formData, setFormData] = useState({
    name_en: "",
    name_ar: "",
    description_en: "",
    description_ar: "",
    price_dzd: "",
    discount_price_dzd: "",
    stock_quantity: "0",
    category_id: "",
    image_url: "", // Temporary single field for UI
    is_featured: false,
    is_new_arrival: true
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    const { data, error } = await supabase.from("categories").select("*");
    if (!error) setCategories(data || []);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    setFormData(prev => ({ ...prev, [name]: val }));
  };

  const handleToggle = (name: string) => {
    setFormData(prev => ({ ...prev, [name as keyof typeof prev]: !prev[name as keyof typeof prev] }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { data, error } = await supabase
      .from("products")
      .insert([
        {
          name_en: formData.name_en,
          name_ar: formData.name_ar,
          description_en: formData.description_en,
          description_ar: formData.description_ar,
          price_dzd: parseFloat(formData.price_dzd),
          discount_price_dzd: formData.discount_price_dzd ? parseFloat(formData.discount_price_dzd) : null,
          stock_quantity: parseInt(formData.stock_quantity) || 0,
          category_id: parseInt(formData.category_id),
          image_urls: formData.image_url ? [formData.image_url] : [],
          is_featured: formData.is_featured,
          is_new_arrival: formData.is_new_arrival
        }
      ])
      .select();

    if (error) {
      console.error("Error creating product:", error);
      alert("Error creating product: " + error.message);
    } else {
      router.push("/admin/products");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#F8F9FB] pt-24 pb-12 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-10">
          <button 
            onClick={() => router.back()}
            className="flex items-center gap-2 text-primary-dark font-black uppercase tracking-widest text-xs hover:text-accent-blue transition-colors"
          >
            <ArrowRight size={18} className="rotate-180" />
            Back
          </button>
          
          <div className="text-right">
            <h1 className="text-3xl font-black uppercase tracking-tighter mb-2 font-montserrat">
              NEW <span className="text-accent-blue">PRODUCT</span>
            </h1>
            <p className="text-dark-grey font-tajawal text-sm uppercase tracking-widest font-bold">
              إضافة منتج جديد
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* General Information Card */}
          <div className="bg-brand-white p-8 shadow-2xl border border-light-grey rounded-sm">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-accent-blue mb-8 font-montserrat flex items-center gap-3">
              <span className="w-8 h-[1px] bg-accent-blue"></span>
              General Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-primary-dark block font-montserrat">Product Name (EN)</label>
                <input 
                  type="text" 
                  name="name_en"
                  value={formData.name_en}
                  onChange={handleChange}
                  required
                  placeholder="e.g. Classic Oversized T-Shirt"
                  className="w-full bg-light-grey border-none p-4 text-sm font-bold font-montserrat focus:ring-2 focus:ring-accent-blue outline-none transition-all"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-primary-dark block font-montserrat text-right">(AR)اسم المنتج</label>
                <input 
                  type="text" 
                  name="name_ar"
                  value={formData.name_ar}
                  onChange={handleChange}
                  required
                  placeholder="مثال: تيشرت كلاسيكي واسع"
                  className="w-full bg-light-grey border-none p-4 text-sm font-bold font-tajawal text-right focus:ring-2 focus:ring-accent-blue outline-none transition-all"
                />
              </div>

              <div className="md:col-span-2 space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-primary-dark block font-montserrat">Description (EN)</label>
                <textarea 
                  name="description_en"
                  value={formData.description_en}
                  onChange={handleChange}
                  rows={4}
                  className="w-full bg-light-grey border-none p-4 text-sm font-medium font-montserrat focus:ring-2 focus:ring-accent-blue outline-none transition-all resize-none"
                />
              </div>

              <div className="md:col-span-2 space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-primary-dark block font-montserrat text-right">(AR)وصف المنتج</label>
                <textarea 
                  name="description_ar"
                  value={formData.description_ar}
                  onChange={handleChange}
                  rows={4}
                  className="w-full bg-light-grey border-none p-4 text-sm font-bold font-tajawal text-right focus:ring-2 focus:ring-accent-blue outline-none transition-all resize-none"
                />
              </div>
            </div>
          </div>

          {/* Inventory & Pricing Card */}
          <div className="bg-brand-white p-8 shadow-2xl border border-light-grey rounded-sm">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-accent-blue mb-8 font-montserrat flex items-center gap-3">
              <span className="w-8 h-[1px] bg-accent-blue"></span>
              Inventory & Pricing
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-primary-dark block font-montserrat">Price (DA)</label>
                <input 
                  type="number" 
                  name="price_dzd"
                  value={formData.price_dzd}
                  onChange={handleChange}
                  required
                  className="w-full bg-light-grey border-none p-4 text-sm font-black font-numbers focus:ring-2 focus:ring-accent-blue outline-none transition-all"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-primary-dark block font-montserrat">Discount Price (DA)</label>
                <input 
                  type="number" 
                  name="discount_price_dzd"
                  value={formData.discount_price_dzd}
                  onChange={handleChange}
                  className="w-full bg-light-grey border-none p-4 text-sm font-black font-numbers focus:ring-2 focus:ring-accent-blue outline-none transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-primary-dark block font-montserrat">Stock Quantity</label>
                <input 
                  type="number" 
                  name="stock_quantity"
                  value={formData.stock_quantity}
                  onChange={handleChange}
                  required
                  className="w-full bg-light-grey border-none p-4 text-sm font-black font-numbers focus:ring-2 focus:ring-accent-blue outline-none transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-primary-dark block font-montserrat">Category</label>
                <select 
                  name="category_id"
                  value={formData.category_id}
                  onChange={handleChange}
                  required
                  className="w-full bg-light-grey border-none p-4 text-sm font-bold font-tajawal focus:ring-2 focus:ring-accent-blue outline-none transition-all cursor-pointer appearance-none"
                >
                  <option value="">اختر الفئة</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name_ar} ({cat.name})</option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-2 flex items-center gap-8 pt-6 px-4">
                <label className="flex items-center gap-4 cursor-pointer group">
                  <div 
                    onClick={() => handleToggle("is_featured")}
                    className={`w-6 h-6 border-2 flex items-center justify-center transition-all ${formData.is_featured ? 'bg-primary-dark border-primary-dark' : 'border-light-blue/40 group-hover:border-accent-blue'}`}
                  >
                    {formData.is_featured && <Check size={14} className="text-brand-white" />}
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-primary-dark font-montserrat">Featured Item</span>
                </label>

                <label className="flex items-center gap-4 cursor-pointer group">
                  <div 
                    onClick={() => handleToggle("is_new_arrival")}
                    className={`w-6 h-6 border-2 flex items-center justify-center transition-all ${formData.is_new_arrival ? 'bg-primary-dark border-primary-dark' : 'border-light-blue/40 group-hover:border-accent-blue'}`}
                  >
                    {formData.is_new_arrival && <Check size={14} className="text-brand-white" />}
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-primary-dark font-montserrat">New Arrival</span>
                </label>
              </div>
            </div>
          </div>

          {/* Media Card */}
          <div className="bg-brand-white p-8 shadow-2xl border border-light-grey rounded-sm">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-accent-blue mb-8 font-montserrat flex items-center gap-3">
              <span className="w-8 h-[1px] bg-accent-blue"></span>
              Product Media
            </h3>
            
            <div className="space-y-4">
              <label className="text-[10px] font-black uppercase tracking-widest text-primary-dark block font-montserrat">Image URL</label>
              <div className="flex gap-4">
                <div className="relative flex-grow">
                  <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-grey" size={18} />
                  <input 
                    type="text" 
                    name="image_url"
                    value={formData.image_url}
                    onChange={handleChange}
                    placeholder="https://example.com/image.jpg"
                    className="w-full bg-light-grey border-none p-4 pl-12 text-sm font-medium font-montserrat focus:ring-2 focus:ring-accent-blue outline-none transition-all"
                  />
                </div>
              </div>
              
              {formData.image_url && (
                <div className="mt-4 w-40 h-40 bg-light-grey border border-light-blue/20 p-2 group relative">
                  <img src={formData.image_url} alt="Preview" className="w-full h-full object-cover" />
                  <button 
                    onClick={() => setFormData(prev => ({ ...prev, image_url: "" }))}
                    className="absolute -top-2 -right-2 bg-alert text-brand-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X size={14} />
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-6 pt-4">
            <button 
              type="button"
              onClick={() => router.back()}
              className="px-10 py-4 font-black uppercase tracking-widest text-sm text-primary-dark hover:text-alert transition-colors font-montserrat"
            >
              Cancel
            </button>
            <button 
              type="submit"
              disabled={loading}
              className="bg-primary-dark text-brand-white px-12 py-4 font-black uppercase tracking-widest text-sm flex items-center justify-center gap-3 hover:bg-accent-blue transition-all duration-300 shadow-lg shadow-primary-dark/20 disabled:opacity-50"
            >
              {loading ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
              Save Product
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
