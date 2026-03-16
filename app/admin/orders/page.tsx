"use client";

import { useState, useEffect } from "react";
import { 
  Package, 
  Search, 
  Filter, 
  Clock, 
  Truck, 
  CheckCircle2, 
  XCircle, 
  ChevronRight, 
  MoreVertical,
  Calendar,
  User,
  Phone,
  MapPin,
  Loader2,
  ExternalLink,
  ArrowUpRight
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function AdminOrdersPage() {
  const { profile, loading: authLoading } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !profile?.is_admin && profile?.role !== 'admin') {
      router.push("/");
    }
  }, [profile, authLoading, router]);

  useEffect(() => {
    fetchOrders();
  }, []);

  async function fetchOrders() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("orders")
        .select(`
          *,
          order_items (
            *,
            products (name_ar, name_en, image_urls)
          )
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  }

  const updateOrderStatus = async (id: string, newStatus: string) => {
    try {
      setUpdatingId(id);
      const { error } = await supabase
        .from("orders")
        .update({ status: newStatus })
        .eq("id", id);

      if (error) throw error;
      
      setOrders(prev => prev.map(order => 
        order.id === id ? { ...order, status: newStatus } : order
      ));
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Failed to update status");
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.phone_number?.includes(searchQuery) ||
      order.shipping_address?.fullName?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-white">
        <Loader2 className="animate-spin text-accent-blue" size={48} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-light-grey pt-24 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-black uppercase tracking-tighter mb-2 font-montserrat">ORDER <span className="text-accent-blue">MANAGEMENT</span></h1>
            <p className="text-dark-grey font-tajawal text-sm uppercase tracking-widest font-bold">إدارة طلبيات الزبائن وتتبع الحالة</p>
          </div>
          
          <div className="flex flex-wrap gap-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-grey" size={18} />
              <input 
                type="text" 
                placeholder="Search orders..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-brand-white border border-light-grey pl-12 pr-6 py-3 text-xs font-bold font-montserrat uppercase tracking-widest focus:ring-2 focus:ring-accent-blue outline-none transition-all w-full md:w-64"
              />
            </div>
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-brand-white border border-light-grey px-6 py-3 text-xs font-bold font-montserrat uppercase tracking-widest focus:ring-2 focus:ring-accent-blue outline-none transition-all cursor-pointer"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-brand-white shadow-2xl border border-light-grey overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-right md:text-left">
              <thead>
                <tr className="bg-primary-dark text-brand-white">
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] font-montserrat">Order / Date</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] font-montserrat">Customer</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] font-montserrat">Amount</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] font-montserrat">Status</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] font-montserrat">Logistics</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] font-montserrat text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-light-grey">
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-20 text-center text-dark-grey font-bold font-tajawal">
                      No orders found matching your criteria.
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-light-grey/30 transition-colors group">
                      <td className="px-6 py-6">
                        <div className="text-xs font-black font-numbers text-primary-dark mb-1">#{order.id.slice(0, 8).toUpperCase()}</div>
                        <div className="text-[10px] font-bold text-dark-grey font-montserrat flex items-center gap-2">
                          <Calendar size={12} />
                          {new Date(order.created_at).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-6">
                        <div className="text-xs font-black font-tajawal text-primary-dark mb-1">{order.shipping_address?.fullName}</div>
                        <div className="text-[10px] font-bold text-dark-grey font-numbers flex items-center gap-2">
                          <Phone size={12} />
                          {order.phone_number}
                        </div>
                      </td>
                      <td className="px-6 py-6">
                        <div className="text-sm font-black text-accent-blue font-numbers">{order.total_amount.toLocaleString()} DA</div>
                        <div className="text-[10px] font-bold text-dark-grey font-montserrat uppercase">{order.order_items?.length} Items</div>
                      </td>
                      <td className="px-6 py-6">
                        <div className={`inline-flex items-center gap-2 px-3 py-1 text-[9px] font-black uppercase tracking-widest ${
                          order.status === 'delivered' ? 'bg-green-500/10 text-green-600' :
                          order.status === 'shipped' ? 'bg-accent-blue/10 text-accent-blue' :
                          order.status === 'cancelled' ? 'bg-alert/10 text-alert' :
                          'bg-primary-dark/10 text-primary-dark'
                        }`}>
                          {order.status === 'delivered' ? <CheckCircle2 size={12} /> :
                           order.status === 'shipped' ? <Truck size={12} /> :
                           order.status === 'cancelled' ? <XCircle size={12} /> :
                           <Clock size={12} />}
                          {order.status}
                        </div>
                      </td>
                      <td className="px-6 py-6">
                        {order.yalidine_track_id ? (
                          <div className="flex flex-col gap-1">
                            <span className="text-[10px] font-black text-accent-blue font-numbers">{order.yalidine_track_id}</span>
                            <span className="text-[8px] font-bold text-dark-grey uppercase tracking-widest">Yalidine Tracking</span>
                          </div>
                        ) : (
                          <button 
                            onClick={async () => {
                              try {
                                setUpdatingId(order.id);
                                const mockTrackId = `YAL-${Math.random().toString(36).substring(7).toUpperCase()}`;
                                const { error } = await supabase
                                  .from("orders")
                                  .update({ yalidine_track_id: mockTrackId, status: 'processing' })
                                  .eq("id", order.id);
                                if (error) throw error;
                                fetchOrders();
                              } catch (e) {
                                alert("Yalidine API Error");
                              } finally {
                                setUpdatingId(null);
                              }
                            }}
                            className="text-[9px] font-black uppercase tracking-widest text-dark-grey border border-light-grey px-2 py-1 hover:bg-primary-dark hover:text-brand-white transition-all flex items-center gap-2"
                          >
                            <ArrowUpRight size={10} /> Push to Yalidine
                          </button>
                        )}
                      </td>
                      <td className="px-6 py-6">
                        <div className="flex items-center justify-center gap-2">
                          {updatingId === order.id ? (
                            <Loader2 className="animate-spin text-accent-blue" size={18} />
                          ) : (
                            <>
                              <button 
                                onClick={() => updateOrderStatus(order.id, 'shipped')}
                                disabled={order.status === 'shipped' || order.status === 'delivered'}
                                className="p-2 text-dark-grey hover:text-accent-blue transition-colors disabled:opacity-20"
                                title="Mark as Shipped"
                              >
                                <Truck size={18} />
                              </button>
                              <button 
                                onClick={() => updateOrderStatus(order.id, 'delivered')}
                                disabled={order.status === 'delivered'}
                                className="p-2 text-dark-grey hover:text-green-600 transition-colors disabled:opacity-20"
                                title="Mark as Delivered"
                              >
                                <CheckCircle2 size={18} />
                              </button>
                              <button 
                                onClick={() => updateOrderStatus(order.id, 'cancelled')}
                                disabled={order.status === 'cancelled' || order.status === 'delivered'}
                                className="p-2 text-dark-grey hover:text-alert transition-colors disabled:opacity-20"
                                title="Cancel Order"
                              >
                                <XCircle size={18} />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
