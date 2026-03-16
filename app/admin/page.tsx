"use client";

import { 
  Package, 
  ShoppingBag, 
  BarChart3, 
  Plus, 
  ArrowRight,
  LayoutDashboard,
  ExternalLink,
  Ticket
} from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AdminDashboard() {
  const { profile, loading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && profile?.role !== 'admin') {
      router.push("/");
    }
  }, [profile, authLoading, router]);

  if (authLoading) return null;

  const adminModules = [
    {
      title: "Marketing Tools",
      arTitle: "الأدوات التسويقية",
      desc: "Create and manage coupon codes and promotions.",
      icon: Ticket,
      href: "/admin/coupons",
      color: "bg-accent-blue",
      action: "Manage Coupons"
    },
    {
      title: "Advanced Reports",
      arTitle: "التقارير المتقدمة",
      desc: "In-depth analysis of sales and wilaya demand.",
      icon: BarChart3,
      href: "/admin/reports",
      color: "bg-primary-dark",
      action: "View Reports"
    },
    {
      title: "Product Inventory",
      arTitle: "مخزون المنتجات",
      desc: "Manage products, stock levels, and pricing.",
      icon: Package,
      href: "/admin/products",
      color: "bg-green-600",
      action: "Manage Products"
    },
    {
      title: "Order Management",
      arTitle: "إدارة الطلبيات",
      desc: "Track customer orders, updates status, and Yalidine shipping.",
      icon: ShoppingBag,
      href: "/admin/orders",
      color: "bg-dark-grey",
      action: "Manage Orders"
    }
  ];

  return (
    <div className="min-h-screen bg-[#F8F9FB] pt-24 pb-20 px-6">
      <div className="max-w-6xl mx-auto">
        <header className="mb-16">
          <div className="flex items-center gap-3 text-accent-blue mb-4">
            <LayoutDashboard size={20} />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] font-montserrat">Admin Panel</span>
          </div>
          <h1 className="text-5xl font-black uppercase tracking-tighter mb-4 font-montserrat">
            NAFAA <span className="text-accent-blue">HUB</span>
          </h1>
          <p className="text-dark-grey font-tajawal text-lg font-bold">مرحباً بك في لوحة تحكم علامة نافع. قم بإدارة متجرك بسهولة.</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {adminModules.map((module, i) => (
            <Link 
              key={i} 
              href={module.href}
              className="group bg-brand-white p-10 shadow-xl border border-light-grey hover:border-accent-blue transition-all relative overflow-hidden"
            >
              <div className={`absolute top-0 right-0 w-32 h-32 ${module.color} opacity-[0.03] -translate-y-1/2 translate-x-1/2 rounded-full group-hover:scale-150 transition-transform duration-700`} />
              
              <div className="relative z-10">
                <div className={`w-16 h-16 ${module.color} text-brand-white flex items-center justify-center mb-8 shadow-lg group-hover:scale-110 transition-transform`}>
                  <module.icon size={32} />
                </div>
                
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-2xl font-black uppercase tracking-tight mb-1 font-montserrat">{module.title}</h2>
                    <h3 className="text-sm font-bold text-accent-blue font-tajawal">{module.arTitle}</h3>
                  </div>
                  <ArrowRight className="text-light-grey group-hover:text-accent-blue group-hover:translate-x-2 transition-all" />
                </div>
                
                <p className="text-dark-grey text-sm mb-8 leading-relaxed font-bold">{module.desc}</p>
                
                <div className="text-[10px] font-black uppercase tracking-widest text-primary-dark group-hover:text-accent-blue flex items-center gap-2 font-montserrat">
                  {module.action} <ExternalLink size={12} />
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Quick Help / Support */}
        <div className="mt-16 bg-primary-dark text-brand-white p-12 shadow-2xl relative overflow-hidden">
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
            <div>
              <h2 className="text-3xl font-black uppercase tracking-tighter mb-2 font-montserrat">Need Help?</h2>
              <p className="text-brand-white/60 font-tajawal">إذا كنت تواجه أي مشكلة تقنية في لوحة التحكم، يرجى التواصل مع فريق التطوير.</p>
            </div>
            <Link 
              href="/"
              className="px-8 py-4 bg-brand-white text-primary-dark font-black uppercase tracking-widest text-xs hover:bg-accent-blue hover:text-brand-white transition-all whitespace-nowrap"
            >
              Back to Store / العودة للمتجر
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
