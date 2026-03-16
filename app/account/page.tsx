"use client";

import { useState, useEffect } from "react";
import { User, Package, Heart, Star, LogOut, ChevronRight, Award } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { useRouter } from "next/navigation";

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-700",
  confirmed: "bg-blue-100 text-blue-700",
  processing: "bg-purple-100 text-purple-700",
  shipped: "bg-orange-100 text-orange-700",
  delivered: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
};

const STATUS_AR: Record<string, string> = {
  pending: "قيد الانتظار",
  confirmed: "تم التأكيد",
  processing: "قيد التجهيز",
  shipped: "تم الشحن",
  delivered: "تم التوصيل",
  cancelled: "ملغى",
};

export default function AccountPage() {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"profile" | "orders" | "wishlist" | "loyalty">("profile");
  const [orders, setOrders] = useState<any[]>([]);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }
    fetchData();
  }, [user]);

  async function fetchData() {
    const [{ data: profileData }, { data: ordersData }] = await Promise.all([
      supabase.from("profiles").select("*").eq("id", user?.uid).single(),
      supabase.from("orders").select("*").eq("user_id", user?.uid).order("created_at", { ascending: false }),
    ]);
    setProfile(profileData);
    setOrders(ordersData || []);
    setLoading(false);
  }

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  const tabs = [
    { id: "profile", label: "الملف الشخصي", icon: User },
    { id: "orders", label: "طلباتي", icon: Package },
    { id: "wishlist", label: "المفضلة", icon: Heart },
    { id: "loyalty", label: "نقاط الولاء", icon: Award },
  ];

  return (
    <div className="min-h-screen bg-[#F8F9FB] pt-24 pb-20 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-accent-blue font-montserrat mb-3">MY ACCOUNT</p>
          <h1 className="text-3xl font-black uppercase tracking-tighter font-montserrat text-primary-dark">
            حسابي <span className="text-accent-blue">الشخصي</span>
          </h1>
        </div>

        {/* Tabs */}
        <div className="flex overflow-x-auto gap-1 mb-8 bg-brand-white border border-light-grey p-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-3 text-[10px] font-black uppercase tracking-widest whitespace-nowrap flex-1 justify-center transition-all ${
                  activeTab === tab.id ? "bg-primary-dark text-brand-white" : "text-dark-grey hover:bg-light-grey"
                }`}
              >
                <Icon size={14} />
                <span className="font-tajawal text-xs font-bold">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Profile Tab */}
        {activeTab === "profile" && (
          <div className="bg-brand-white border border-light-grey shadow-lg p-8">
            <div className="flex items-center gap-6 mb-8 flex-row-reverse">
              <div className="w-20 h-20 bg-primary-dark rounded-full flex items-center justify-center text-brand-white font-black text-2xl font-montserrat">
                {profile?.full_name?.[0] || user?.email?.[0]?.toUpperCase() || "N"}
              </div>
              <div className="text-right">
                <h2 className="text-xl font-black font-tajawal text-primary-dark">{profile?.full_name || "المستخدم"}</h2>
                <p className="text-dark-grey text-sm font-tajawal">{user?.email}</p>
                {profile?.loyalty_points > 0 && (
                  <p className="text-accent-blue text-xs font-black uppercase tracking-widest font-montserrat mt-1">
                    {profile.loyalty_points} POINTS
                  </p>
                )}
              </div>
            </div>
            <div className="space-y-4 text-right" dir="rtl">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[9px] font-black uppercase tracking-widest text-dark-grey">الاسم الكامل</label>
                  <p className="mt-1 font-tajawal font-bold text-primary-dark">{profile?.full_name || "—"}</p>
                </div>
                <div>
                  <label className="text-[9px] font-black uppercase tracking-widest text-dark-grey">رقم الهاتف</label>
                  <p className="mt-1 font-numbers font-bold text-primary-dark">{profile?.phone || "—"}</p>
                </div>
                <div>
                  <label className="text-[9px] font-black uppercase tracking-widest text-dark-grey">الولاية الافتراضية</label>
                  <p className="mt-1 font-tajawal font-bold text-primary-dark">{profile?.default_wilaya || "—"}</p>
                </div>
              </div>
            </div>
            <button
              onClick={handleSignOut}
              className="mt-8 flex items-center gap-2 text-alert text-[10px] font-black uppercase tracking-widest hover:opacity-70 transition-opacity"
            >
              <LogOut size={14} /> تسجيل الخروج
            </button>
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === "orders" && (
          <div className="space-y-4">
            {orders.length === 0 ? (
              <div className="bg-brand-white border border-light-grey p-12 text-center">
                <Package size={48} className="mx-auto mb-4 text-light-grey" />
                <p className="font-tajawal text-dark-grey">لم تقم بأي طلبات بعد</p>
                <Link href="/shop" className="mt-4 inline-block bg-primary-dark text-brand-white px-8 py-3 text-[10px] font-black uppercase tracking-widest hover:bg-accent-blue transition-all">
                  تسوق الآن
                </Link>
              </div>
            ) : orders.map((order) => (
              <div key={order.id} className="bg-brand-white border border-light-grey shadow-sm p-5 flex items-center justify-between">
                <ChevronRight size={16} className="text-dark-grey" />
                <div className="text-right flex-1">
                  <div className="flex items-center justify-end gap-3 mb-1">
                    <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-0.5 ${STATUS_COLORS[order.status] || "bg-gray-100 text-gray-700"}`}>
                      {STATUS_AR[order.status] || order.status}
                    </span>
                    <span className="font-black font-montserrat text-xs text-primary-dark">{order.order_number}</span>
                  </div>
                  <p className="text-xs text-dark-grey font-tajawal">{new Date(order.created_at).toLocaleDateString("ar-DZ")} — {order.total?.toLocaleString()} DA</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Wishlist Tab */}
        {activeTab === "wishlist" && (
          <div className="bg-brand-white border border-light-grey p-12 text-center">
            <Heart size={48} className="mx-auto mb-4 text-light-grey" />
            <p className="font-tajawal text-dark-grey mb-4">لا توجد منتجات في قائمة المفضلة</p>
            <Link href="/shop" className="inline-block bg-primary-dark text-brand-white px-8 py-3 text-[10px] font-black uppercase tracking-widest hover:bg-accent-blue transition-all">
              اكتشف المنتجات
            </Link>
          </div>
        )}

        {/* Loyalty Tab */}
        {activeTab === "loyalty" && (
          <div className="bg-brand-white border border-light-grey shadow-lg p-8 text-right" dir="rtl">
            <div className="flex items-center gap-4 mb-6 flex-row-reverse">
              <div className="w-16 h-16 bg-accent-blue/10 rounded-full flex items-center justify-center">
                <Award size={28} className="text-accent-blue" />
              </div>
              <div>
                <h2 className="text-3xl font-black font-numbers text-primary-dark">{profile?.loyalty_points || 0}</h2>
                <p className="text-[10px] font-black uppercase tracking-widest text-accent-blue font-montserrat">LOYALTY POINTS</p>
              </div>
            </div>
            <div className="h-3 bg-light-grey rounded-full mb-2">
              <div
                className="h-full bg-accent-blue rounded-full transition-all"
                style={{ width: `${Math.min((profile?.loyalty_points || 0) / 500 * 100, 100)}%` }}
              />
            </div>
            <p className="text-xs text-dark-grey font-tajawal">{500 - (profile?.loyalty_points || 0)} نقطة متبقية للوصول إلى Miss NAFAA 🌟</p>
            <div className="mt-6 p-4 bg-light-grey/50 border border-light-grey">
              <p className="text-xs font-tajawal text-dark-grey">تكسب <strong className="text-primary-dark">10 نقاط</strong> لكل 1000 دج تنفقها. 100 نقطة = خصم 1000 دج.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
