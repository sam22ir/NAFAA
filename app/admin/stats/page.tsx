"use client";

import { useState, useEffect } from "react";
import { 
  TrendingUp, 
  ShoppingBag, 
  Users, 
  DollarSign, 
  ArrowUpRight, 
  ArrowDownRight,
  BarChart3,
  Calendar,
  Loader2
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function AdminStatsPage() {
  const { profile, loading: authLoading } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    avgOrderValue: 0,
    totalItems: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !profile?.is_admin && profile?.role !== 'admin') {
      router.push("/");
    }
  }, [profile, authLoading, router]);

  useEffect(() => {
    async function fetchStats() {
      try {
        const { data: orders, error } = await supabase
          .from("orders")
          .select("total_amount, order_items(quantity)");

        if (error) throw error;

        const totalRevenue = orders.reduce((acc, order) => acc + order.total_amount, 0);
        const totalOrders = orders.length;
        const totalItems = orders.reduce((acc, order) => 
          acc + order.order_items.reduce((sum, item) => sum + item.quantity, 0), 0
        );
        const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

        setStats({
          totalRevenue,
          totalOrders,
          avgOrderValue,
          totalItems,
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-white">
        <Loader2 className="animate-spin text-accent-blue" size={48} />
      </div>
    );
  }

  const statCards = [
    { title: "Total Revenue", value: `${stats.totalRevenue.toLocaleString()} DA`, icon: DollarSign, color: "text-green-600", bg: "bg-green-500/10" },
    { title: "Total Orders", value: stats.totalOrders.toString(), icon: ShoppingBag, color: "text-accent-blue", bg: "bg-accent-blue/10" },
    { title: "Avg Order Value", value: `${Math.round(stats.avgOrderValue).toLocaleString()} DA`, icon: TrendingUp, color: "text-primary-dark", bg: "bg-primary-dark/10" },
    { title: "Items Sold", value: stats.totalItems.toString(), icon: BarChart3, color: "text-purple-600", bg: "bg-purple-500/10" },
  ];

  return (
    <div className="min-h-screen bg-light-grey pt-24 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-black uppercase tracking-tighter mb-2 font-montserrat">BUSINESS <span className="text-accent-blue">INSIGHTS</span></h1>
            <p className="text-dark-grey font-tajawal text-sm uppercase tracking-widest font-bold">نظرة عامة على أداء المتجر</p>
          </div>
          
          <div className="bg-brand-white border border-light-grey px-6 py-3 flex items-center gap-4">
            <Calendar size={18} className="text-accent-blue" />
            <span className="text-[10px] font-black uppercase tracking-widest font-montserrat">Lifetime Performance</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {statCards.map((card, i) => (
            <div key={i} className="bg-brand-white p-8 shadow-xl border border-light-grey group hover:border-accent-blue/50 transition-all">
              <div className="flex items-center justify-between mb-6">
                <div className={`p-4 ${card.bg} ${card.color}`}>
                  <card.icon size={24} />
                </div>
                <div className="text-[10px] font-black text-green-600 flex items-center gap-1 font-montserrat">
                  <ArrowUpRight size={12} />
                  +12%
                </div>
              </div>
              <h3 className="text-[10px] font-black uppercase tracking-widest text-dark-grey mb-2 font-montserrat">{card.title}</h3>
              <div className="text-3xl font-black text-primary-dark font-numbers">{card.value}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Performance Placeholder */}
          <div className="lg:col-span-2 bg-brand-white p-8 shadow-xl border border-light-grey">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-accent-blue mb-8 font-montserrat flex items-center gap-3">
              <span className="w-8 h-[1px] bg-accent-blue"></span>
              Sales Overview / نظرة عامة
            </h3>
            <div className="h-[300px] flex items-center justify-center border-2 border-dashed border-light-grey text-light-grey font-black uppercase tracking-widest text-[10px]">
              Chart Visualization Placeholder
            </div>
          </div>

          <div className="bg-brand-white p-8 shadow-xl border border-light-grey">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-accent-blue mb-8 font-montserrat flex items-center gap-3">
              <span className="w-8 h-[1px] bg-accent-blue"></span>
              Top Zones / المناطق الأكثر طلباً
            </h3>
            <div className="space-y-6">
              {[
                { label: "Center / الجزائر الوسطى", value: "45%", progress: 45 },
                { label: "North / الشمال", value: "30%", progress: 30 },
                { label: "South / الجنوب", value: "25%", progress: 25 },
              ].map((zone, i) => (
                <div key={i}>
                  <div className="flex justify-between text-[10px] font-black uppercase tracking-widest mb-2 font-montserrat">
                    <span>{zone.label}</span>
                    <span>{zone.value}</span>
                  </div>
                  <div className="h-2 bg-light-grey overflow-hidden">
                    <div 
                      className="h-full bg-accent-blue transition-all duration-1000" 
                      style={{ width: `${zone.progress}%` }} 
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
