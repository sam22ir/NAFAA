"use client";

import { useState, useEffect } from "react";
import { Bell, ShoppingCart, MessageCircle, AlertCircle, Clock, CheckCircle2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function SmartCartAlertsPage() {
  const { profile, loading: authLoading } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [alerts, setAlerts] = useState<any[]>([]);

  useEffect(() => {
    if (!authLoading && !profile?.is_admin && profile?.role !== 'admin') {
      router.push("/");
    }
  }, [profile, authLoading, router]);

  useEffect(() => {
    // In a real app, this would fetch from an 'abandoned_carts' table or similar.
    // For this implementation, we will mock the smart cart alerts to demonstrate the UI.
    const mockAlerts = [
      { id: 1, phone: "0555123456", name: "أحمد مسعود", items: 2, total: 12500, timeAgo: "ساعتين", status: "pending" },
      { id: 2, phone: "0666987654", name: "سارة بن علي", items: 1, total: 6000, timeAgo: "5 ساعات", status: "recovered" },
      { id: 3, phone: "0777456789", name: "كريم محمد", items: 3, total: 18000, timeAgo: "يوم واحد", status: "pending" },
    ];
    setAlerts(mockAlerts);
    setLoading(false);
  }, []);

  if (authLoading || loading) return null;

  return (
    <div className="min-h-screen bg-light-grey pt-24 pb-20 px-6">
      <div className="max-w-6xl mx-auto">
        <header className="mb-12">
          <div className="flex items-center gap-3 text-alert mb-4">
            <Bell size={20} />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] font-montserrat">Abandoned Carts</span>
          </div>
          <h1 className="text-4xl font-black uppercase tracking-tighter mb-4 font-montserrat">
            SMART <span className="text-alert">CART</span> ALERTS
          </h1>
          <p className="text-dark-grey font-tajawal text-sm font-bold uppercase tracking-widest">مراقبة السلات المتروكة واسترجاعها</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-brand-white p-6 border border-light-grey shadow-sm">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-dark-grey mb-2 font-montserrat">Total Abandoned Value</h3>
            <p className="text-3xl font-black font-numbers text-alert">36,500 DA</p>
          </div>
          <div className="bg-brand-white p-6 border border-light-grey shadow-sm">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-dark-grey mb-2 font-montserrat">Recovery Rate</h3>
            <p className="text-3xl font-black font-numbers text-success">33.3%</p>
          </div>
          <div className="bg-brand-white p-6 border border-light-grey shadow-sm">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-dark-grey mb-2 font-montserrat">Active Alerts</h3>
            <p className="text-3xl font-black font-numbers text-primary-dark">2</p>
          </div>
        </div>

        <div className="bg-brand-white border border-light-grey shadow-xl p-8">
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-light-grey">
            <h2 className="text-lg font-black uppercase tracking-widest font-montserrat text-primary-dark flex items-center gap-2">
              <ShoppingCart size={18} /> Recent Alerts
            </h2>
          </div>

          <div className="space-y-4">
            {alerts.map((alert) => (
              <div key={alert.id} className="border border-light-grey p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:shadow-md transition-shadow">
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-full ${alert.status === 'recovered' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                    {alert.status === 'recovered' ? <CheckCircle2 size={24} /> : <AlertCircle size={24} />}
                  </div>
                  <div>
                    <h3 className="font-black font-tajawal text-primary-dark text-lg mb-1">{alert.name}</h3>
                    <div className="flex items-center gap-4 text-sm font-tajawal text-dark-grey">
                      <span className="flex items-center gap-1 font-numbers"><ShoppingCart size={14} /> {alert.items} عناصر</span>
                      <span className="flex items-center gap-1 font-numbers text-primary-dark font-bold">{alert.total.toLocaleString()} DA</span>
                      <span className="flex items-center gap-1 text-alert"><Clock size={14} /> منذ {alert.timeAgo}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <a
                    href={`https://wa.me/213${alert.phone.substring(1)}?text=مرحباً ${alert.name}، لاحظنا تركك لبعض العناصر المميزة في سلة التسوق الخاصة بك في NAFAA. هل تحتاج إلى مساعدة في إتمام الطلب؟`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`px-6 py-3 font-black uppercase tracking-widest text-[10px] flex items-center gap-2 transition-all ${
                      alert.status === 'recovered' 
                        ? 'bg-light-grey text-dark-grey cursor-not-allowed' 
                        : 'bg-[#25D366] text-white hover:bg-[#128C7E]'
                    }`}
                  >
                    <MessageCircle size={14} /> 
                    {alert.status === 'recovered' ? 'تم الاسترجاع' : 'إرسال تذكير واتساب'}
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
