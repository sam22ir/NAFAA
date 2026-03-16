"use client";

import { useState } from "react";
import { MessageCircle, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface BackInStockFormProps {
  productId: string;
  selectedSize?: string;
}

export default function BackInStockForm({ productId, selectedSize }: BackInStockFormProps) {
  const [phone, setPhone] = useState("+213");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || phone.length < 10) {
      setError("أدخل رقم هاتف صحيح");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const { error: insertError } = await supabase
        .from("back_in_stock_requests")
        .insert({
          product_id: productId,
          size: selectedSize || null,
          phone: phone,
        });

      if (insertError) throw insertError;
      setDone(true);
    } catch (err: any) {
      setError("حدث خطأ. حاول مرة أخرى.");
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    return (
      <div className="border border-success bg-success/5 p-4 flex items-center gap-3" dir="rtl">
        <CheckCircle2 size={18} className="text-success flex-shrink-0" />
        <div>
          <p className="font-tajawal font-bold text-primary-dark text-sm">تم تسجيل طلبك!</p>
          <p className="font-tajawal text-dark-grey text-xs">سنراسلك عبر واتساب فور توفر المنتج.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="border border-light-grey bg-light-grey/40 p-4" dir="rtl">
      <div className="flex items-center gap-2 mb-3">
        <MessageCircle size={16} className="text-accent-blue" />
        <p className="text-[10px] font-black uppercase tracking-widest text-accent-blue font-montserrat">
          أعلمني عند التوفر
        </p>
      </div>
      <p className="font-tajawal text-dark-grey text-xs mb-4">
        أدخل رقمك وسنرسل لك رسالة واتساب فور توفر هذا المنتج
        {selectedSize && <span className="font-bold"> (مقاس {selectedSize})</span>}.
      </p>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="+213 6XX XXX XXX"
          className="flex-1 bg-brand-white border border-light-grey px-3 py-2.5 text-sm font-tajawal focus:ring-2 focus:ring-accent-blue outline-none"
          dir="ltr"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-primary-dark text-brand-white px-4 py-2.5 font-black uppercase tracking-widest text-[10px] hover:bg-accent-blue transition-all disabled:opacity-50 font-montserrat flex items-center gap-2"
        >
          {loading ? <Loader2 size={14} className="animate-spin" /> : <MessageCircle size={14} />}
          أعلمني
        </button>
      </form>
      {error && (
        <div className="flex items-center gap-2 mt-2 text-alert">
          <AlertCircle size={12} />
          <p className="text-xs font-tajawal">{error}</p>
        </div>
      )}
    </div>
  );
}
