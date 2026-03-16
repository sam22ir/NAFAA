"use client";

import { useState, useEffect } from "react";
import { Archive, RotateCcw, Eye, TrendingDown } from "lucide-react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

export default function AdminArchivePage() {
  const [archived, setArchived] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [restoring, setRestoring] = useState<string | null>(null);

  useEffect(() => {
    supabase
      .from("products")
      .select("*")
      .eq("is_archived", true)
      .order("updated_at", { ascending: false })
      .then(({ data }) => {
        setArchived(data || []);
        setLoading(false);
      });
  }, []);

  const restoreProduct = async (id: string) => {
    setRestoring(id);
    const { error } = await supabase
      .from("products")
      .update({ is_archived: false, is_active: true })
      .eq("id", id);

    if (!error) {
      setArchived(prev => prev.filter(p => p.id !== id));
    }
    setRestoring(null);
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
              <Archive size={28} className="text-accent-blue" />
              أرشيف المنتجات
            </h1>
            <p className="font-tajawal text-dark-grey mt-1">{archived.length} منتج مؤرشف</p>
          </div>
          <Link href="/admin/products" className="text-xs font-black uppercase tracking-widest text-dark-grey hover:text-primary-dark font-montserrat">
            ← المنتجات
          </Link>
        </div>

        {/* Info */}
        <div className="bg-primary-dark/5 border border-primary-dark/10 p-4 mb-6" dir="rtl">
          <p className="font-tajawal text-dark-grey text-sm">
            المنتجات المؤرشفة غير مرئية للعملاء لكن تحافظ على بيانات المبيعات والتقييمات التاريخية. يمكنك إعادة تفعيلها في أي وقت.
          </p>
        </div>

        {archived.length === 0 ? (
          <div className="bg-brand-white border border-light-grey p-16 text-center">
            <Archive size={56} className="text-dark-grey/20 mx-auto mb-4" />
            <p className="font-black uppercase tracking-widest text-dark-grey font-montserrat text-sm">الأرشيف فارغ</p>
            <p className="font-tajawal text-dark-grey/60 mt-2 text-sm">لا توجد منتجات مؤرشفة حالياً.</p>
          </div>
        ) : (
          <div className="bg-brand-white border border-light-grey overflow-hidden">
            <div className="bg-primary-dark text-brand-white px-6 py-3">
              <div className="grid grid-cols-12 gap-4 text-[10px] font-black uppercase tracking-widest font-montserrat">
                <div className="col-span-4">المنتج</div>
                <div className="col-span-2 text-center">السعر</div>
                <div className="col-span-2 text-center">المخزون</div>
                <div className="col-span-2 text-center">المبيعات</div>
                <div className="col-span-2 text-center">الإجراء</div>
              </div>
            </div>
            <div className="divide-y divide-light-grey">
              {archived.map((product) => (
                <div key={product.id} className="px-6 py-4 grid grid-cols-12 gap-4 items-center hover:bg-light-grey/30 transition-colors">
                  <div className="col-span-4">
                    <div className="flex items-center gap-3">
                      {product.images?.[0] ? (
                        <img src={product.images[0]} alt="" className="w-12 h-12 object-cover border border-light-grey opacity-60" />
                      ) : (
                        <div className="w-12 h-12 bg-light-grey flex items-center justify-center">
                          <Archive size={16} className="text-dark-grey" />
                        </div>
                      )}
                      <div>
                        <p className="font-tajawal font-bold text-primary-dark text-sm">{product.name_ar}</p>
                        <p className="text-[10px] font-montserrat text-dark-grey uppercase">{product.category}</p>
                      </div>
                    </div>
                  </div>
                  <div className="col-span-2 text-center">
                    <span className="font-numbers font-bold text-primary-dark text-sm">{product.price_dzd?.toLocaleString()}</span>
                    <span className="text-[10px] text-dark-grey font-tajawal block">DA</span>
                  </div>
                  <div className="col-span-2 text-center">
                    <span className="font-numbers font-bold text-dark-grey text-sm">{product.stock_count ?? 0}</span>
                    <span className="text-[10px] text-dark-grey font-tajawal block">وحدة</span>
                  </div>
                  <div className="col-span-2 text-center">
                    <span className="font-numbers font-bold text-accent-blue text-sm">{product.sales_count ?? 0}</span>
                    <span className="text-[10px] text-dark-grey font-tajawal block">مبيع</span>
                  </div>
                  <div className="col-span-2 flex gap-2 justify-center">
                    <button
                      onClick={() => restoreProduct(product.id)}
                      disabled={restoring === product.id}
                      className="flex items-center gap-1 bg-success/10 text-success border border-success/30 px-3 py-2 text-[10px] font-black uppercase tracking-wider font-montserrat hover:bg-success hover:text-brand-white transition-all"
                    >
                      <RotateCcw size={12} className={restoring === product.id ? "animate-spin" : ""} />
                      تفعيل
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
