"use client";

import { useState, useEffect } from "react";
import { 
  BarChart3, 
  Map as MapIcon, 
  TrendingUp, 
  Users, 
  ArrowUpRight, 
  ChevronRight,
  Globe,
  Loader2,
  PieChart
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function AdminReportsPage() {
  const { profile, loading: authLoading } = useAuth();
  const router = useRouter();
  const [reportData, setReportData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && profile?.role !== 'admin') {
      router.push("/");
    }
  }, [profile, authLoading, router]);

  useEffect(() => {
    async function fetchReport() {
      try {
        // Query to get order counts grouped by wilaya
        const { data, error } = await supabase
          .from("orders")
          .select("wilaya");

        if (error) throw error;

        // Count occurrences
        const counts: Record<string, number> = {};
        data.forEach(order => {
          counts[order.wilaya] = (counts[order.wilaya] || 0) + 1;
        });

        // Convert to array and sort
        const sorted = Object.entries(counts)
          .map(([name, count]) => ({ name, count }))
          .sort((a, b) => b.count - a.count);

        setReportData(sorted);
      } catch (error) {
        console.error("Error fetching report:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchReport();
  }, []);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-white">
        <Loader2 className="animate-spin text-accent-blue" size={48} />
      </div>
    );
  }

  const maxCount = reportData.length > 0 ? reportData[0].count : 1;

  return (
    <div className="min-h-screen bg-[#F8F9FB] pt-24 pb-20 px-6">
      <div className="max-w-6xl mx-auto">
        <header className="mb-16">
          <div className="flex items-center gap-3 text-accent-blue mb-4">
            <Globe size={20} />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] font-montserrat">Market Insights</span>
          </div>
          <h1 className="text-4xl font-black uppercase tracking-tighter mb-4 font-montserrat">
            WILAYA <span className="text-accent-blue">DEMAND</span> REPORT
          </h1>
          <p className="text-dark-grey font-tajawal text-sm font-bold uppercase tracking-widest">تحليل الطلب في الـ 58 ولاية جزائرية</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main List */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-brand-white p-8 shadow-xl border border-light-grey">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-sm font-black uppercase tracking-widest text-primary-dark font-montserrat">Top Performing Regions / المناطق الأكثر طلباً</h3>
                <div className="text-[10px] font-black text-green-600 font-montserrat flex items-center gap-1">
                  <TrendingUp size={12} /> Live Updates
                </div>
              </div>

              <div className="space-y-8">
                {reportData.length === 0 ? (
                  <div className="py-20 text-center text-light-grey font-black uppercase tracking-widest text-xs">No data available yet</div>
                ) : (
                  reportData.map((wilaya, i) => (
                    <div key={i} className="group">
                      <div className="flex justify-between items-end mb-3">
                        <div>
                          <span className="text-[10px] font-black text-accent-blue mb-1 block font-numbers">#{i + 1}</span>
                          <h4 className="text-lg font-black text-primary-dark font-tajawal">{wilaya.name}</h4>
                        </div>
                        <div className="text-right">
                          <span className="text-2xl font-black text-primary-dark font-numbers">{wilaya.count}</span>
                          <span className="text-[10px] font-black text-dark-grey ml-2 font-montserrat uppercase">Orders</span>
                        </div>
                      </div>
                      <div className="h-2 bg-light-grey overflow-hidden group-hover:h-3 transition-all duration-300">
                        <div 
                          className="h-full bg-accent-blue group-hover:bg-primary-dark transition-all duration-1000 ease-out"
                          style={{ width: `${(wilaya.count / maxCount) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Sidebar Stats */}
          <div className="space-y-6">
            <div className="bg-primary-dark text-brand-white p-8 shadow-2xl relative overflow-hidden">
              <div className="relative z-10">
                <PieChart size={32} className="text-accent-blue mb-6" />
                <h3 className="text-[10px] font-black uppercase tracking-widest text-brand-white/60 mb-2 font-montserrat">Primary Cluster</h3>
                <div className="text-3xl font-black font-tajawal mb-4">{reportData[0]?.name || "-"}</div>
                <p className="text-xs text-brand-white/40 leading-relaxed font-tajawal">
                  تمثل ولاية {reportData[0]?.name || "..."} المركز الأول من حيث حجم الطلبيات حالياً.
                </p>
              </div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-accent-blue/10 rounded-full -translate-y-1/2 translate-x-1/2" />
            </div>

            <div className="bg-brand-white p-8 shadow-xl border border-light-grey">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-accent-blue mb-6 font-montserrat flex items-center gap-3">
                <span className="w-8 h-[1px] bg-accent-blue"></span>
                Regional Breakdown
              </h3>
              <div className="space-y-4">
                {[
                  { label: "North / شمال", count: "65%", color: "bg-accent-blue" },
                  { label: "Highlands / الهضاب", count: "25%", color: "bg-primary-dark" },
                  { label: "South / جنوب", count: "10%", color: "bg-dark-grey" },
                ].map((reg, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 ${reg.color}`} />
                      <span className="text-[10px] font-black uppercase tracking-widest text-dark-grey font-montserrat">{reg.label}</span>
                    </div>
                    <span className="text-xs font-black text-primary-dark font-numbers">{reg.count}</span>
                  </div>
                ))}
              </div>
            </div>

            <button 
              onClick={() => router.push("/admin/orders")}
              className="w-full bg-accent-blue text-brand-white py-4 font-black uppercase tracking-widest text-[10px] hover:bg-primary-dark transition-all flex items-center justify-center gap-3 shadow-lg shadow-accent-blue/20"
            >
              Export Report / تحميل البيانات <ArrowUpRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
