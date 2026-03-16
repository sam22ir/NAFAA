"use client";

import { useState, useEffect } from "react";
import { Instagram, Link2, Check, Plus, Trash2, Eye } from "lucide-react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

export default function AdminInstagramPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState<any>(null);
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    Promise.all([
      supabase.from("instagram_posts").select("*").order("posted_at", { ascending: false }),
      supabase.from("products").select("id, name_ar, price_dzd, images").eq("is_active", true),
    ]).then(([{ data: postsData }, { data: productsData }]) => {
      setPosts(postsData || []);
      setProducts(productsData || []);
      setLoading(false);
    });
  }, []);

  const openLinkModal = (post: any) => {
    setSelectedPost(post);
    setSelectedProductIds(post.linked_products || []);
  };

  const toggleProduct = (id: string) => {
    setSelectedProductIds(prev =>
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
  };

  const saveLinks = async () => {
    if (!selectedPost) return;
    setSaving(true);
    await supabase
      .from("instagram_posts")
      .update({
        linked_products: selectedProductIds,
        is_shop_look: selectedProductIds.length > 0,
      })
      .eq("id", selectedPost.id);

    if (selectedProductIds.length > 0) {
      await supabase.from("shop_the_looks").upsert({
        post_id: selectedPost.id,
        product_ids: selectedProductIds,
        is_active: true,
      }, { onConflict: "post_id" });
    }

    setPosts(prev => prev.map(p =>
      p.id === selectedPost.id
        ? { ...p, linked_products: selectedProductIds, is_shop_look: selectedProductIds.length > 0 }
        : p
    ));
    setSaving(false);
    setSelectedPost(null);
  };

  if (loading) {
    return <div className="min-h-screen bg-light-grey pt-20 flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-accent-blue border-t-transparent rounded-full animate-spin" />
    </div>;
  }

  return (
    <div className="min-h-screen bg-light-grey pt-20" dir="rtl">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-accent-blue font-montserrat">ADMIN PANEL</p>
            <h1 className="text-3xl font-black uppercase tracking-tighter font-montserrat text-primary-dark flex items-center gap-3">
              <Instagram size={28} className="text-pink-500" />
              Instagram
            </h1>
          </div>
          <Link href="/admin" className="text-xs font-black uppercase tracking-widest text-dark-grey hover:text-primary-dark font-montserrat">
            ← لوحة الإدارة
          </Link>
        </div>

        {/* Info Banner */}
        <div className="bg-primary-dark text-brand-white p-4 mb-6 flex items-center gap-4">
          <Instagram size={20} className="text-pink-400 flex-shrink-0" />
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest font-montserrat text-accent-blue mb-1">SHOP THE LOOK</p>
            <p className="font-tajawal text-sm text-brand-white/80">
              اربط منشورات Instagram بمنتجات NAFAA لتفعيل خاصية "Shop the Look"
            </p>
          </div>
        </div>

        {posts.length === 0 ? (
          <div className="bg-brand-white border border-light-grey p-12 text-center">
            <Instagram size={48} className="text-dark-grey/30 mx-auto mb-4" />
            <p className="font-tajawal text-dark-grey">لا توجد منشورات Instagram بعد.</p>
            <p className="font-tajawal text-xs text-dark-grey/70 mt-2">ستظهر المنشورات هنا بعد مزامنة الحساب.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {posts.map((post) => (
              <div key={post.id} className="bg-brand-white border border-light-grey overflow-hidden group">
                {/* Image */}
                <div className="aspect-square bg-light-grey relative overflow-hidden">
                  {post.media_url ? (
                    <img src={post.media_url} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Instagram size={32} className="text-dark-grey/30" />
                    </div>
                  )}
                  {post.is_shop_look && (
                    <div className="absolute top-2 right-2 bg-accent-blue text-brand-white text-[9px] font-black px-2 py-1 font-montserrat uppercase tracking-wider">
                      SHOP THE LOOK
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="p-3">
                  <p className="text-xs font-tajawal text-dark-grey line-clamp-2 mb-3">
                    {post.caption || "بدون تعليق"}
                  </p>
                  <div className="flex items-center gap-1 mb-3">
                    <span className="text-[10px] font-montserrat font-black text-dark-grey">
                      {(post.linked_products || []).length} منتج مرتبط
                    </span>
                  </div>
                  <button
                    onClick={() => openLinkModal(post)}
                    className="w-full bg-primary-dark text-brand-white py-2 text-[10px] font-black uppercase tracking-widest font-montserrat hover:bg-accent-blue transition-all flex items-center justify-center gap-2"
                  >
                    <Link2 size={12} />
                    ربط منتجات
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Link Products Modal */}
      {selectedPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-primary-dark/60" onClick={() => setSelectedPost(null)}>
          <div className="bg-brand-white w-full max-w-2xl max-h-[80vh] overflow-y-auto shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="bg-primary-dark text-brand-white px-6 py-4 flex items-center justify-between sticky top-0">
              <h3 className="font-black uppercase tracking-tight font-montserrat">ربط منتجات بالمنشور</h3>
              <span className="text-xs font-tajawal text-brand-white/60">{selectedProductIds.length} محدد</span>
            </div>
            <div className="p-4 grid grid-cols-2 gap-3">
              {products.map((product) => {
                const isSelected = selectedProductIds.includes(product.id);
                return (
                  <button
                    key={product.id}
                    onClick={() => toggleProduct(product.id)}
                    className={`flex items-center gap-3 p-3 border-2 text-right transition-all ${
                      isSelected ? "border-accent-blue bg-light-blue/20" : "border-light-grey hover:border-accent-blue/50"
                    }`}
                  >
                    <div className={`w-6 h-6 flex-shrink-0 flex items-center justify-center rounded-sm ${
                      isSelected ? "bg-accent-blue" : "bg-light-grey"
                    }`}>
                      {isSelected && <Check size={14} className="text-brand-white" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-tajawal font-bold text-primary-dark text-sm truncate">{product.name_ar}</p>
                      <p className="font-numbers text-accent-blue text-xs">{product.price_dzd?.toLocaleString()} DA</p>
                    </div>
                  </button>
                );
              })}
            </div>
            <div className="px-6 py-4 border-t border-light-grey flex gap-3 sticky bottom-0 bg-brand-white">
              <button
                onClick={saveLinks}
                disabled={saving}
                className="flex-1 bg-primary-dark text-brand-white py-3 font-black uppercase tracking-widest text-xs hover:bg-accent-blue transition-all font-montserrat"
              >
                {saving ? "جارٍ الحفظ..." : "حفظ الروابط"}
              </button>
              <button
                onClick={() => setSelectedPost(null)}
                className="px-6 border border-light-grey text-dark-grey font-black uppercase tracking-widest text-xs hover:bg-light-grey font-montserrat"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
