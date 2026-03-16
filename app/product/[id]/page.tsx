"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { ShoppingBag, Heart, Share2, ShieldCheck, Truck, RefreshCw, Loader2, Ruler } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { useCart } from "@/context/CartContext";
import SizeGuideModal from "@/app/components/SizeGuideModal";
import BackInStockForm from "@/app/components/BackInStockForm";
import CompleteTheLook from "@/app/components/CompleteTheLook";

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState("");
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
  const [isBackInStockOpen, setIsBackInStockOpen] = useState(false);
  const [isComparing, setIsComparing] = useState(false);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [reviews, setReviews] = useState<any[]>([]);
  const [newReview, setNewReview] = useState({ rating: 5, comment: "" });
  const { addItem } = useCart();

  useEffect(() => {
    async function fetchProduct() {
      try {
        const { data, error } = await supabase
          .from("products")
          .select("*, categories(name_ar, name_en)")
          .eq("id", params.id)
          .single();

        if (error) throw error;
        setProduct(data);
        if (data.sizes && data.sizes.length > 0) {
          setSelectedSize(data.sizes[0]);
        }

        // Fetch Related Products (same category)
        const { data: related } = await supabase
          .from("products")
          .select("*")
          .eq("category_id", data.category_id)
          .neq("id", data.id)
          .limit(4);
        
        setRelatedProducts(related || []);

        // Fetch Reviews
        const { data: revData } = await supabase
          .from("reviews")
          .select("*, profiles(full_name)")
          .eq("product_id", params.id)
          .order("created_at", { ascending: false });
        
        setReviews(revData || []);
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchProduct();
  }, [params.id]);

  const handleAddToCart = () => {
    if (!product) return;
    if (product.sizes && product.sizes.length > 0 && !selectedSize) {
      alert("Please select a size");
      return;
    }

    addItem({
      id: product.id,
      name_ar: product.name_ar,
      name_en: product.name_en,
      price_dzd: product.discount_price_dzd || product.price_dzd,
      image_url: product.image_urls?.[0] || "",
      size: selectedSize
    });
    
    // Optional: show a small toast or open cart sidebar
  };

  const handleAddToCompare = () => {
    if (!product) return;
    const saved = localStorage.getItem("nafaa_comparison");
    let comparisonList = saved ? JSON.parse(saved) : [];
    
    // Avoid duplicates
    if (!comparisonList.find((item: any) => item.id === product.id)) {
      if (comparisonList.length >= 4) {
        alert("تستطيع مقارنة 4 منتجات كحد أقصى");
        return;
      }
      comparisonList.push(product);
      localStorage.setItem("nafaa_comparison", JSON.stringify(comparisonList));
    }
    
    setIsComparing(true);
    setTimeout(() => setIsComparing(false), 3000);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-accent-blue" size={48} />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-6">
        <h1 className="text-4xl font-black mb-4">PRODUCT NOT FOUND</h1>
        <p className="text-dark-grey font-tajawal mb-8">المنتج الذي تبحث عنه غير موجود أو تم حذفه.</p>
      </div>
    );
  }

  const sizes = product.sizes || ["S", "M", "L", "XL", "XXL"]; // Fallback if meta is empty
  const images = product.image_urls?.length > 0 ? product.image_urls : ["https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=687&auto=format&fit=crop"];

  return (
    <div className="bg-brand-white min-h-screen pb-24">
      <div className="max-w-7xl mx-auto px-6 pt-12 md:pt-20">
        <div className="flex flex-col lg:flex-row gap-12 md:gap-20">
          {/* Product Gallery */}
          <div className="w-full lg:w-1/2 space-y-4">
            <div className="relative aspect-[3/4] bg-light-grey overflow-hidden group">
              <Image src={images[0]} alt={product.name_en} fill className="object-cover" priority />
            </div>
            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {images.map((img: string, i: number) => (
                  <div key={i} className="relative aspect-square bg-light-grey cursor-pointer hover:ring-2 hover:ring-accent-blue transition-all">
                    <Image src={img} alt={`${product.name_en} ${i}`} fill className="object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="w-full lg:w-1/2 flex flex-col">
            <div className="mb-8">
              {product.is_new_arrival && (
                <span className="text-xs font-black uppercase tracking-[0.2em] text-accent-blue font-montserrat mb-2 block">New Arrival</span>
              )}
              <h1 className="text-3xl md:text-5xl font-black text-primary-dark mb-4 font-tajawal leading-tight">{product.name_ar}</h1>
              <div className="flex items-center gap-4">
                <span className="text-2xl font-black text-primary-dark font-numbers">{(product.discount_price_dzd || product.price_dzd).toLocaleString()} دج</span>
                {product.discount_price_dzd && (
                  <span className="text-lg text-dark-grey line-through font-numbers">{product.price_dzd.toLocaleString()} دج</span>
                )}
                {product.discount_price_dzd && (
                  <span className="bg-alert text-brand-white text-[10px] font-black px-2 py-1 uppercase font-montserrat">SALE</span>
                )}
              </div>
            </div>

            <p className="text-dark-grey text-lg leading-relaxed font-tajawal mb-8 border-b border-light-grey pb-8">
              {product.description_ar}
            </p>

            {/* Size Selector */}
            <div className="mb-10">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-black uppercase tracking-widest text-primary-dark font-montserrat">Select Size / اختر المقاس</h3>
                <div className="flex gap-4">
                  <button 
                    onClick={() => setIsBackInStockOpen(true)}
                    className="text-xs font-bold text-dark-grey underline font-tajawal hover:text-accent-blue transition-colors"
                  >
                    مقاس غير متوفر؟
                  </button>
                  <button className="text-xs font-bold text-accent-blue underline font-tajawal">دليل المقاسات</button>
                </div>
              </div>
              <div className="flex flex-wrap gap-3">
                {sizes.map((size: string) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`min-w-[50px] h-12 flex items-center justify-center font-black transition-all border ${
                      selectedSize === size ? "bg-primary-dark text-brand-white border-primary-dark" : "border-light-grey hover:border-primary-dark"
                    } font-montserrat`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 mb-10">
              <button 
                onClick={handleAddToCart}
                className="flex-grow bg-primary-dark text-brand-white h-16 font-black uppercase tracking-widest text-sm flex items-center justify-center gap-3 hover:bg-accent-blue transition-all duration-300"
              >
                <ShoppingBag size={20} />
                إضافة للسلة
              </button>
              <button 
                onClick={handleAddToCompare}
                className={`w-16 h-16 border border-light-grey flex items-center justify-center transition-all ${isComparing ? 'bg-accent-blue text-brand-white' : 'hover:bg-light-grey'}`}
                title="Compare Product"
              >
                <RefreshCw size={20} className={isComparing ? 'animate-spin' : ''} />
              </button>
              <button className="w-16 h-16 border border-light-grey flex items-center justify-center hover:bg-light-grey transition-all">
                <Heart size={20} />
              </button>
            </div>

            {isComparing && (
              <div className="mb-6 p-4 bg-accent-blue/10 border border-accent-blue text-accent-blue text-[10px] font-black uppercase tracking-widest flex items-center justify-between animate-fade-in">
                <span>Added to comparison list</span>
                <Link href="/compare" className="underline">View Comparison</Link>
              </div>
            )}

            {/* Trust Badges */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-10 border-t border-light-grey">
              <div className="flex items-center gap-3">
                <Truck className="text-accent-blue" size={24} />
                <span className="text-[10px] font-bold uppercase tracking-widest text-dark-grey font-montserrat">Fast 58 Wilaya Shipping</span>
              </div>
              <div className="flex items-center gap-3">
                <ShieldCheck className="text-accent-blue" size={24} />
                <span className="text-[10px] font-bold uppercase tracking-widest text-dark-grey font-montserrat">Guaranteed Quality</span>
              </div>
              <div className="flex items-center gap-3">
                <RefreshCw className="text-accent-blue" size={24} />
                <span className="text-[10px] font-bold uppercase tracking-widest text-dark-grey font-montserrat">Easy Returns Algiers</span>
              </div>
            </div>
          </div>
        </div>

        {/* Complete the Look / Recommended */}
        {relatedProducts.length > 0 && (
          <div className="mt-32 pt-20 border-t border-light-grey">
            <h2 className="text-3xl font-black uppercase tracking-tighter mb-12 text-center font-montserrat">
              Complete <span className="text-accent-blue">The Look</span>
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {relatedProducts.map((item) => (
                <a key={item.id} href={`/product/${item.id}`} className="group">
                  <div className="relative aspect-[3/4] bg-light-grey mb-4 overflow-hidden">
                    <Image 
                      src={item.image_urls?.[0] || images[0]} 
                      alt={item.name_en} 
                      fill 
                      className="object-cover group-hover:scale-110 transition-transform duration-700" 
                    />
                  </div>
                  <h3 className="text-sm font-black text-primary-dark font-tajawal mb-2">{item.name_ar}</h3>
                  <p className="text-xs font-black text-accent-blue font-numbers">{item.price_dzd.toLocaleString()} DA</p>
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Back in Stock Modal/Section */}
        {isBackInStockOpen && (
          <div className="fixed inset-0 bg-primary-dark/80 backdrop-blur-md z-50 flex items-center justify-center p-6">
            <div className="bg-brand-white p-10 max-w-md w-full shadow-2xl border border-light-grey relative">
              <button 
                onClick={() => setIsBackInStockOpen(false)}
                className="absolute top-4 right-4 text-dark-grey hover:text-primary-dark"
              >
                <RefreshCw size={24} className="rotate-45" />
              </button>
              <h3 className="text-2xl font-black uppercase tracking-tighter mb-4 font-montserrat">Back In <span className="text-accent-blue">Stock Alert</span></h3>
              <p className="text-dark-grey font-tajawal mb-8 text-sm">أدخل رقم هاتفك وسنقوم بإشعارك عبر الواتساب فور توفر هذا المقاس مجدداً.</p>
              
              <div className="space-y-6">
                <div>
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-dark-grey mb-2 block">Phone Number / رقم الهاتف</label>
                  <input 
                    type="text" 
                    placeholder="05XXXXXXXX"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="w-full bg-light-grey border border-transparent p-4 outline-none focus:ring-2 focus:ring-accent-blue transition-all font-numbers text-lg"
                  />
                </div>
                <button 
                  onClick={() => {
                    alert("تم حفظ طلبك! سنقوم بإخطارك قريباً.");
                    setIsBackInStockOpen(false);
                  }}
                  className="w-full bg-accent-blue text-brand-white py-4 font-black uppercase tracking-widest text-xs hover:bg-primary-dark transition-all"
                >
                  Notify Me / أعلمني عند التوفر
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Reviews Section */}
        <div className="mt-32 pt-20 border-t border-light-grey">
          <div className="flex flex-col md:flex-row justify-between items-start mb-16 gap-12">
            <div>
              <h2 className="text-3xl font-black uppercase tracking-tighter mb-4 font-montserrat">
                Customer <span className="text-accent-blue">Reviews</span>
              </h2>
              <div className="flex items-center gap-4">
                <div className="flex text-accent-blue space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-xl">★</span>
                  ))}
                </div>
                <span className="text-sm font-black text-primary-dark font-montserrat">
                  {reviews.length} REVIEWS
                </span>
              </div>
            </div>
            
            <button className="bg-primary-dark text-brand-white px-8 py-4 text-[10px] font-black uppercase tracking-widest hover:bg-accent-blue transition-all">
              Write A Review / أضف تقييمك
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {reviews.length === 0 ? (
              <div className="col-span-2 py-20 text-center bg-light-grey/30 border-2 border-dashed border-light-grey">
                <p className="text-dark-grey font-tajawal font-bold uppercase tracking-widest text-xs">لا يوجد تقييمات لهذا المنتج بعد. كن أول من يقيمه!</p>
              </div>
            ) : (
              reviews.map((rev) => (
                <div key={rev.id} className="p-8 border border-light-grey bg-brand-white shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h4 className="font-black text-primary-dark mb-1 font-tajawal">{rev.profiles?.full_name || "M***"}</h4>
                      <div className="flex text-accent-blue text-xs">
                        {[...Array(5)].map((_, i) => (
                          <span key={i}>{i < rev.rating ? "★" : "☆"}</span>
                        ))}
                      </div>
                    </div>
                    {rev.is_verified_purchase && (
                      <span className="text-[8px] font-black uppercase tracking-widest bg-green-100 text-green-700 px-2 py-1 flex items-center gap-1 font-montserrat">
                        <ShieldCheck size={10} /> Verified Purchase
                      </span>
                    )}
                  </div>
                <p className="text-dark-grey font-tajawal text-sm leading-relaxed">
                    {rev.comment}
                  </p>
                  <span className="text-[10px] text-light-grey font-numbers mt-6 block">
                    {new Date(rev.created_at).toLocaleDateString()}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* ── Complete the Look ──────────────────────── */}
        <CompleteTheLook productId={product.id} category={product.category} />
      </div>

      {/* Size Guide Modal */}
      <SizeGuideModal
        isOpen={isSizeGuideOpen}
        onClose={() => setIsSizeGuideOpen(false)}
        category={product.category}
      />
    </div>
  );
}
