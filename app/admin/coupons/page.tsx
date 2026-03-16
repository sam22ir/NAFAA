"use client";

import { useState, useEffect } from "react";
import { 
  Plus, 
  Trash2, 
  Ticket, 
  Search, 
  Calendar, 
  Percent, 
  DollarSign, 
  Loader2,
  AlertCircle,
  Tag
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function AdminCouponsPage() {
  const { profile, loading: authLoading } = useAuth();
  const router = useRouter();
  const [coupons, setCoupons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newCoupon, setNewCoupon] = useState({
    code: "",
    discount_type: "percent",
    value: 10,
    min_order: 0,
    expiry_date: ""
  });

  useEffect(() => {
    if (!authLoading && !profile?.is_admin && profile?.role !== 'admin') {
      router.push("/");
    }
  }, [profile, authLoading, router]);

  useEffect(() => {
    fetchCoupons();
  }, []);

  async function fetchCoupons() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("coupons")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setCoupons(data || []);
    } catch (error) {
      console.error("Error fetching coupons:", error);
    } finally {
      setLoading(false);
    }
  }

  const handleAddCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await supabase
        .from("coupons")
        .insert({
          ...newCoupon,
          code: newCoupon.code.toUpperCase()
        });

      if (error) throw error;
      
      setShowAddForm(false);
      fetchCoupons();
      setNewCoupon({ code: "", discount_type: "percent", value: 10, min_order: 0, expiry_date: "" });
    } catch (error: any) {
      alert("Error adding coupon: " + error.message);
    }
  };

  const handleDeleteCoupon = async (id: string) => {
    if (!confirm("Are you sure?")) return;
    try {
      const { error } = await supabase.from("coupons").delete().eq("id", id);
      if (error) throw error;
      setCoupons(prev => prev.filter(c => c.id !== id));
    } catch (error) {
      alert("Error deleting coupon");
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-white">
        <Loader2 className="animate-spin text-accent-blue" size={48} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-light-grey pt-24 pb-20 px-6">
      <div className="max-w-6xl mx-auto">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div>
            <div className="flex items-center gap-3 text-accent-blue mb-4">
              <Ticket size={20} />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] font-montserrat">Marketing Tools</span>
            </div>
            <h1 className="text-4xl font-black uppercase tracking-tighter mb-4 font-montserrat">
              COUPON <span className="text-accent-blue">MANAGEMENT</span>
            </h1>
            <p className="text-dark-grey font-tajawal text-sm font-bold uppercase tracking-widest leading-relaxed">بناء وإدارة أكواد الخصم والحملات الترويجية</p>
          </div>
          
          <button 
            onClick={() => setShowAddForm(!showAddForm)}
            className="bg-primary-dark text-brand-white px-8 py-4 text-[10px] font-black uppercase tracking-widest flex items-center gap-3 hover:bg-accent-blue transition-all shadow-xl shadow-primary-dark/10"
          >
            {showAddForm ? "Cancel / إلغاء" : "Create Coupon / كود جديد"} <Plus size={16} />
          </button>
        </header>

        {showAddForm && (
          <div className="mb-16 bg-brand-white p-10 shadow-2xl border border-light-grey animate-fade-in">
            <h3 className="text-xl font-black uppercase tracking-tighter mb-8 font-montserrat">New Promotional Code</h3>
            <form onSubmit={handleAddCoupon} className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-dark-grey font-montserrat">Coupon Code (e.g. NAFAA20)</label>
                <input 
                  type="text" 
                  required
                  value={newCoupon.code}
                  onChange={(e) => setNewCoupon({...newCoupon, code: e.target.value.toUpperCase()})}
                  className="w-full bg-light-grey p-4 text-xs font-black font-montserrat focus:ring-1 focus:ring-accent-blue outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-dark-grey font-montserrat">Discount Type</label>
                <select 
                  value={newCoupon.discount_type}
                  onChange={(e) => setNewCoupon({...newCoupon, discount_type: e.target.value})}
                  className="w-full bg-light-grey p-4 text-xs font-black font-montserrat focus:ring-1 focus:ring-accent-blue outline-none"
                >
                  <option value="percent">Percentage (%)</option>
                  <option value="fixed">Fixed Amount (DA)</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-dark-grey font-montserrat">Value</label>
                <input 
                  type="number" 
                  required
                  value={newCoupon.value}
                  onChange={(e) => setNewCoupon({...newCoupon, value: parseFloat(e.target.value)})}
                  className="w-full bg-light-grey p-4 text-xs font-black font-montserrat focus:ring-1 focus:ring-accent-blue outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-dark-grey font-montserrat">Min Order Amount</label>
                <input 
                  type="number" 
                  value={newCoupon.min_order}
                  onChange={(e) => setNewCoupon({...newCoupon, min_order: parseFloat(e.target.value)})}
                  className="w-full bg-light-grey p-4 text-xs font-black font-montserrat focus:ring-1 focus:ring-accent-blue outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-dark-grey font-montserrat">Expiry Date</label>
                <input 
                  type="date" 
                  value={newCoupon.expiry_date}
                  onChange={(e) => setNewCoupon({...newCoupon, expiry_date: e.target.value})}
                  className="w-full bg-light-grey p-4 text-xs font-black font-montserrat focus:ring-1 focus:ring-accent-blue outline-none"
                />
              </div>
              <div className="flex items-end">
                <button 
                  type="submit"
                  className="w-full bg-accent-blue text-brand-white py-4 text-[10px] font-black uppercase tracking-widest hover:bg-primary-dark transition-all"
                >
                  Save Coupon
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {coupons.length === 0 ? (
            <div className="col-span-3 py-20 text-center text-light-grey font-black uppercase tracking-widest text-xs">No active coupons found</div>
          ) : (
            coupons.map((coupon) => (
              <div key={coupon.id} className="bg-brand-white p-8 border border-light-grey shadow-lg relative group overflow-hidden">
                <div className="flex justify-between items-start mb-8">
                  <div className="bg-accent-blue/10 p-3 rounded-full text-accent-blue">
                    <Tag size={20} />
                  </div>
                  <button 
                    onClick={() => handleDeleteCoupon(coupon.id)}
                    className="p-2 text-dark-grey hover:text-alert transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
                
                <h4 className="text-2xl font-black text-primary-dark mb-4 font-montserrat">{coupon.code}</h4>
                
                <div className="space-y-4">
                  <div className="flex justify-between text-[10px] font-black font-montserrat">
                    <span className="text-dark-grey uppercase tracking-widest">Discount</span>
                    <span className="text-accent-blue">
                      {coupon.discount_type === 'percent' ? `${coupon.value}%` : `${coupon.value} DA`}
                    </span>
                  </div>
                  <div className="flex justify-between text-[10px] font-black font-montserrat">
                    <span className="text-dark-grey uppercase tracking-widest">Usage</span>
                    <span className="text-primary-dark font-numbers">{coupon.uses_count || 0} Uses</span>
                  </div>
                  <div className="flex justify-between text-[10px] font-black font-montserrat">
                    <span className="text-dark-grey uppercase tracking-widest">Expires</span>
                    <span className="text-primary-dark font-numbers">
                      {coupon.expiry_date ? new Date(coupon.expiry_date).toLocaleDateString() : 'Never'}
                    </span>
                  </div>
                </div>

                {!coupon.is_active && (
                  <div className="absolute inset-0 bg-brand-white/80 backdrop-blur-[1px] flex items-center justify-center">
                    <span className="bg-alert text-brand-white px-4 py-2 text-[10px] font-black uppercase tracking-widest">Disabled</span>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
