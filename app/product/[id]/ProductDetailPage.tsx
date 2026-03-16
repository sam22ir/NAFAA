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
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedImage, setSelectedImage] = useState(0);
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
  const [isComparing, setIsComparing] = useState(false);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [reviews, setReviews] = useState<any[]>([]);
  const [newReview, setNewReview] = useState({ rating: 5, comment: "" });
  const [addedToCart, setAddedToCart] = useState(false);
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
        if (data.colors && data.colors.length > 0) {
          setSelectedColor(data.colors[0]);
        }

        // Related Products
        const { data: related } = await supabase
          .from("products")
          .select("*")
          .eq("category_id", data.category_id)
          .neq("id", data.id)
          .limit(4);
        setRelatedProducts(related || []);

        // Reviews
        const { data: revData } = await supabase
          .from("reviews")
          .select("*, profiles(full_name)")
          .eq("product_id", params.id)
          .order("created_at", { ascending: false });
        setReviews(revData || []);
      } catch (err) {
        console.error("Product fetch error:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, [params.id]);

  const handleAddToCart = () => {
    if (!selectedSize && product?.sizes?.length > 0) {
      alert("الرجاء اختيار المقاس");
      return;
    }
    if (!selectedColor && product?.colors?.length > 0) {
      alert("الرجاء اختيار اللون");
      return;
    }
    addItem({ ...product, selectedSize, selectedColor, quantity: 1 });
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const avgRating = reviews.length > 0
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-white flex items-center justify-center pt-20">
        <Loader2 size={32} className="animate-spin text-accent-blue" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-brand-white flex items-center justify-center pt-20" dir="rtl">
        <div className="text-center">
          <p className="font-montserrat font-black text-2xl uppercase text-primary-dark mb-4">المنتج غير موجود</p>
          <Link href="/shop" className="bg-accent-blue text-brand-white px-6 py-3 font-montserrat font-black uppercase tracking-widest text-xs hover:bg-primary-dark transition-all">
            العودة للمتجر
          </Link>
        </div>
      </div>
    );
  }

  const images = product.images || [];
  const isOutOfStock = (product.stock_count ?? 0) === 0;

  return (
    <div className="min-h-screen bg-brand-white pt-20" dir="rtl">
      <div className="max-w-7xl mx-auto px-6 py-12">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs font-tajawal text-dark-grey mb-8">
          <Link href="/" className="hover:text-accent-blue transition-colors">الرئيسية</Link>
          <span>/</span>
          <Link href="/shop" className="hover:text-accent-blue transition-colors">المتجر</Link>
          <span>/</span>
          <span className="text-primary-dark font-bold">{product.name_ar}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* ── Image Gallery ── */}
          <div>
            <div className="aspect-[3/4] bg-light-grey overflow-hidden relative mb-4">
              {images[selectedImage] ? (
                <Image
                  src={images[selectedImage]}
                  alt={product.name_ar}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-8xl font-black text-dark-grey/10 font-montserrat">N</span>
                </div>
              )}
              {product.discount_percent > 0 && (
                <span className="absolute top-4 left-4 bg-alert text-brand-white text-[10px] font-black px-3 py-1 font-montserrat uppercase">
                  -{product.discount_percent}%
                </span>
              )}
              {product.is_new && (
                <span className="absolute top-4 right-4 bg-accent-blue text-brand-white text-[10px] font-black px-3 py-1 font-montserrat uppercase">
                  NEW
                </span>
              )}
            </div>
            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto">
                {images.map((img: string, i: number) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`w-20 h-24 bg-light-grey overflow-hidden flex-shrink-0 border-2 transition-all ${
                      selectedImage === i ? "border-primary-dark" : "border-transparent"
                    }`}
                  >
                    <Image src={img} alt="" width={80} height={96} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ── Product Info ── */}
          <div className="flex flex-col">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-accent-blue font-montserrat mb-2">
              {product.categories?.name_ar || product.category || "NAFAA"}
            </p>
            <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tighter font-montserrat text-primary-dark mb-2">
              {product.name_ar}
            </h1>
            {product.name_fr && (
              <p className="text-sm font-montserrat text-dark-grey uppercase tracking-widest mb-4">{product.name_fr}</p>
            )}

            {/* Rating */}
            {reviews.length > 0 && (
              <div className="flex items-center gap-2 mb-4">
                <div className="flex text-yellow-400">
                  {[1,2,3,4,5].map(i => (
                    <span key={i}>{i <= Math.round(avgRating) ? "★" : "☆"}</span>
                  ))}
                </div>
                <span className="text-xs font-tajawal text-dark-grey">({reviews.length} تقييم)</span>
              </div>
            )}

            {/* Price */}
            <div className="flex items-baseline gap-4 mb-6">
              <span className="text-3xl font-black font-numbers text-primary-dark">
                {product.price_dzd?.toLocaleString()} DA
              </span>
              {product.original_price && product.original_price > product.price_dzd && (
                <span className="text-lg font-numbers text-dark-grey/50 line-through">
                  {product.original_price?.toLocaleString()} DA
                </span>
              )}
            </div>

            {/* Description */}
            {product.description && (
              <p className="font-tajawal text-dark-grey text-sm leading-relaxed mb-6">
                {product.description}
              </p>
            )}

            {/* Color selector */}
            {product.colors && product.colors.length > 0 && (
              <div className="mb-6">
                <span className="text-[10px] font-black uppercase tracking-widest text-primary-dark font-montserrat mb-3 block">اللون</span>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map((color: string) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`h-10 px-4 border-2 font-bold font-tajawal text-xs transition-all ${
                        selectedColor === color
                          ? "border-primary-dark bg-primary-dark text-brand-white"
                          : "border-light-grey hover:border-primary-dark text-primary-dark bg-light-grey"
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Size selector */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-black uppercase tracking-widest text-primary-dark font-montserrat">المقاس</span>
                  <button
                    onClick={() => setIsSizeGuideOpen(true)}
                    className="flex items-center gap-1 text-[10px] font-bold text-accent-blue hover:underline font-montserrat uppercase tracking-widest"
                  >
                    <Ruler size={12} />
                    دليل المقاسات
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size: string) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`w-12 h-12 border-2 font-black font-montserrat text-sm transition-all ${
                        selectedSize === size
                          ? "border-primary-dark bg-primary-dark text-brand-white"
                          : "border-light-grey hover:border-primary-dark text-primary-dark"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Add to Cart / Back in Stock */}
            {isOutOfStock ? (
              <div className="mb-6">
                <div className="bg-light-grey text-dark-grey py-4 text-center font-black uppercase tracking-widest text-xs font-montserrat mb-4">
                  نفذ المخزون
                </div>
                <BackInStockForm productId={product.id} selectedSize={selectedSize} />
              </div>
            ) : (
              <button
                onClick={handleAddToCart}
                className={`w-full py-4 font-black uppercase tracking-widest text-sm font-montserrat flex items-center justify-center gap-3 transition-all mb-4 ${
                  addedToCart
                    ? "bg-success text-brand-white"
                    : "bg-primary-dark text-brand-white hover:bg-accent-blue"
                }`}
              >
                <ShoppingBag size={18} />
                {addedToCart ? "✓ تمت الإضافة!" : "أضف إلى السلة"}
              </button>
            )}

            {/* Guarantees */}
            <div className="grid grid-cols-3 gap-3 border-t border-light-grey pt-6 mb-6">
              {[
                { Icon: Truck, label: "توصيل لـ 69 ولاية" },
                { Icon: ShieldCheck, label: "جودة مضمونة" },
                { Icon: RefreshCw, label: "14 يوم استرجاع" },
              ].map(({ Icon, label }) => (
                <div key={label} className="flex flex-col items-center gap-2 text-center">
                  <Icon size={20} className="text-accent-blue" />
                  <span className="text-[10px] font-tajawal text-dark-grey font-bold">{label}</span>
                </div>
              ))}
            </div>

            {/* Share */}
            <button className="flex items-center gap-2 text-dark-grey hover:text-primary-dark transition-colors text-xs font-tajawal font-bold">
              <Share2 size={14} />
              مشاركة المنتج
            </button>
          </div>
        </div>

        {/* ── Reviews ── */}
        <div className="mt-20 border-t border-light-grey pt-12">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-accent-blue font-montserrat mb-2">REVIEWS</p>
          <h2 className="text-2xl font-black uppercase tracking-tighter font-montserrat text-primary-dark mb-8">
            آراء العملاء
          </h2>
          <div className="space-y-6">
            {reviews.length === 0 ? (
              <p className="font-tajawal text-dark-grey">لا توجد تقييمات بعد. كن أول من يقيّم!</p>
            ) : (
              reviews.map((rev) => (
                <div key={rev.id} className="border border-light-grey p-6">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="font-tajawal font-bold text-primary-dark">
                        {rev.profiles?.full_name || "عميل NAFAA"}
                      </p>
                      <div className="flex text-yellow-400 text-sm mt-1">
                        {[1,2,3,4,5].map(i => (
                          <span key={i}>{i <= rev.rating ? "★" : "☆"}</span>
                        ))}
                      </div>
                    </div>
                    {rev.is_verified_purchase && (
                      <span className="text-[8px] font-black uppercase tracking-widest bg-green-100 text-green-700 px-2 py-1 flex items-center gap-1 font-montserrat">
                        <ShieldCheck size={10} /> Verified
                      </span>
                    )}
                  </div>
                  <p className="text-dark-grey font-tajawal text-sm leading-relaxed">
                    {rev.comment}
                  </p>
                  <span className="text-[10px] text-light-grey font-numbers mt-4 block">
                    {new Date(rev.created_at).toLocaleDateString("ar-DZ")}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* ── Complete the Look ── */}
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
