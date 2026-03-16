"use client";

import { useState } from "react";
import { Search, Package, Truck, CheckCircle2, Clock, XCircle, MessageCircle, MapPin } from "lucide-react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

const STEPS = [
  { key: "pending", label_ar: "تم استلام الطلب", label_en: "Order Received", icon: Package },
  { key: "confirmed", label_ar: "تم التأكيد", label_en: "Confirmed", icon: CheckCircle2 },
  { key: "processing", label_ar: "قيد التجهيز", label_en: "Processing", icon: Clock },
  { key: "shipped", label_ar: "تم الشحن — ياليدين", label_en: "Shipped", icon: Truck },
  { key: "delivered", label_ar: "تم التوصيل", label_en: "Delivered", icon: CheckCircle2 },
];

export default function OrderTrackingPage() {
  const [orderNumber, setOrderNumber] = useState("");
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    if (!orderNumber.trim()) return;
    setLoading(true);
    setError("");
    setOrder(null);

    const { data, error: fetchErr } = await supabase
      .from("orders")
      .select("*")
      .ilike("order_number", orderNumber.trim())
      .maybeSingle();

    setLoading(false);
    if (fetchErr || !data) {
      setError("لم يتم العثور على الطلب. تحقق من رقم الطلب وحاول مرة أخرى.");
    } else {
      setOrder(data);
    }
  };

  const currentStepIndex = order ? STEPS.findIndex(s => s.key === order.status) : -1;

  return (
    <div className="min-h-screen bg-[#F8F9FB] pt-24 pb-20 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-accent-blue font-montserrat mb-3">NAFAA — TRACK YOUR ORDER</p>
          <h1 className="text-4xl font-black uppercase tracking-tighter font-montserrat text-primary-dark">
            تتبع <span className="text-accent-blue">طلبك</span>
          </h1>
          <p className="text-dark-grey font-tajawal mt-3 text-sm">أدخل رقم طلبك للاطلاع على حالته الآنية</p>
        </div>

        {/* Search Box */}
        <div className="bg-brand-white shadow-lg border border-light-grey p-6 mb-8">
          <div className="flex gap-3">
            <input
              type="text"
              value={orderNumber}
              onChange={(e) => setOrderNumber(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder="مثال: NAFAA-2026-0001"
              className="flex-1 border border-light-grey px-4 py-3 text-sm font-tajawal text-primary-dark focus:outline-none focus:border-accent-blue transition-colors text-right"
              dir="rtl"
            />
            <button
              onClick={handleSearch}
              disabled={loading}
              className="bg-primary-dark text-brand-white px-6 py-3 font-black uppercase tracking-widest text-[10px] hover:bg-accent-blue transition-all flex items-center gap-2 disabled:opacity-50"
            >
              {loading ? <Clock size={14} className="animate-spin" /> : <Search size={14} />}
              بحث
            </button>
          </div>
          {error && (
            <p className="mt-3 text-alert text-xs font-tajawal font-bold flex items-center gap-2 justify-end">
              <XCircle size={14} /> {error}
            </p>
          )}
        </div>

        {/* Order Details */}
        {order && (
          <div className="space-y-6">
            {/* Order Info */}
            <div className="bg-brand-white shadow-lg border border-light-grey p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-accent-blue font-montserrat">{order.order_number}</p>
                  <p className="text-xs text-dark-grey font-tajawal mt-1">{new Date(order.created_at).toLocaleDateString("ar-DZ")}</p>
                </div>
                <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1 ${
                  order.status === "delivered" ? "bg-green-100 text-green-700" :
                  order.status === "cancelled" ? "bg-red-100 text-red-700" :
                  "bg-accent-blue/10 text-accent-blue"
                }`}>
                  {STEPS.find(s => s.key === order.status)?.label_ar || order.status}
                </span>
              </div>

              {/* Progress Steps */}
              <div className="mt-6" dir="rtl">
                <div className="flex items-center justify-between relative">
                  <div className="absolute top-5 right-5 left-5 h-0.5 bg-light-grey z-0" />
                  <div
                    className="absolute top-5 right-5 h-0.5 bg-accent-blue z-0 transition-all duration-700"
                    style={{ width: `${(currentStepIndex / (STEPS.length - 1)) * 90}%` }}
                  />
                  {STEPS.map((step, i) => {
                    const Icon = step.icon;
                    const done = i <= currentStepIndex;
                    return (
                      <div key={step.key} className="flex flex-col items-center gap-2 z-10">
                        <div className={`w-10 h-10 flex items-center justify-center rounded-full border-2 transition-all ${done ? "bg-accent-blue border-accent-blue text-white" : "bg-white border-light-grey text-light-grey"}`}>
                          <Icon size={16} />
                        </div>
                        <span className="text-[8px] font-black font-tajawal text-center max-w-[60px] leading-tight text-dark-grey">{step.label_ar}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Tracking & Delivery */}
            <div className="bg-brand-white shadow-lg border border-light-grey p-6">
              <h3 className="font-black uppercase tracking-widest text-[10px] text-accent-blue font-montserrat mb-4">DELIVERY INFO</h3>
              <div className="space-y-3 text-right" dir="rtl">
                {order.customer_name && (
                  <div className="flex justify-between text-sm">
                    <span className="font-tajawal text-dark-grey">الاسم</span>
                    <span className="font-bold font-tajawal text-primary-dark">{order.customer_name}</span>
                  </div>
                )}
                {order.wilaya && (
                  <div className="flex justify-between text-sm items-center">
                    <span className="font-tajawal text-dark-grey">الولاية</span>
                    <span className="font-bold font-tajawal text-primary-dark flex items-center gap-1"><MapPin size={12} /> {order.wilaya}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="font-tajawal text-dark-grey">المجموع</span>
                  <span className="font-black font-numbers text-primary-dark">{order.total?.toLocaleString()} DA</span>
                </div>
                {order.tracking_code && (
                  <div className="mt-4 p-3 bg-accent-blue/5 border border-accent-blue/20">
                    <p className="text-[9px] font-black uppercase tracking-widest text-accent-blue font-montserrat mb-1">YALIDINE TRACKING</p>
                    <p className="font-numbers font-bold text-primary-dark">{order.tracking_code}</p>
                  </div>
                )}
              </div>
            </div>

            {/* WhatsApp Support */}
            <a
              href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}?text=مرحباً، أريد الاستفسار عن طلب رقم: ${order.order_number}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 w-full bg-[#25D366] text-white py-4 font-black uppercase tracking-widest text-xs hover:bg-[#128C7E] transition-all"
            >
              <MessageCircle size={18} /> تواصل عبر واتساب
            </a>
          </div>
        )}

        {!order && !loading && !error && (
          <div className="text-center text-dark-grey">
            <Package size={48} className="mx-auto mb-4 opacity-20" />
            <p className="font-tajawal text-sm">أدخل رقم طلبك للتتبع</p>
          </div>
        )}
      </div>
    </div>
  );
}
