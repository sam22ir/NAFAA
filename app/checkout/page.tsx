"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  ChevronRight, 
  MapPin, 
  Phone, 
  Truck, 
  CheckCircle2, 
  AlertCircle,
  Loader2,
  ArrowRight,
  Home
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, clearCart, totalItems } = useCart();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [placedOrderNumber, setPlacedOrderNumber] = useState("");
  const [couponCode, setCouponCode] = useState("");
  const [activeCoupon, setActiveCoupon] = useState<any>(null);
  const [couponError, setCouponError] = useState("");
  const [couponLoading, setCouponLoading] = useState(false);
  const [wilayas, setWilayas] = useState<any[]>([]);
  const [deliveryType, setDeliveryType] = useState<"home" | "desk">("home");

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    wilayaId: "",
    commune: "",
    address: "",
    notes: "",
  });

  useEffect(() => {
    supabase.from("wilayas").select("*").eq("is_available", true).order("id")
      .then(({ data }) => setWilayas(data || []));
  }, []);

  const selectedWilaya = useMemo(() => {
    return wilayas.find(w => w.id === parseInt(formData.wilayaId));
  }, [formData.wilayaId, wilayas]);

  const shippingCost = useMemo(() => {
    if (!selectedWilaya) return 0;
    return deliveryType === "home"
      ? selectedWilaya.home_delivery_cost
      : selectedWilaya.desk_delivery_cost;
  }, [selectedWilaya, deliveryType]);

  const discountAmount = useMemo(() => {
    if (!activeCoupon) return 0;
    if (activeCoupon.discount_type === 'percent') {
      return (subtotal * activeCoupon.value) / 100;
    }
    return activeCoupon.value;
  }, [activeCoupon, subtotal]);

  const total = subtotal + shippingCost - discountAmount;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleApplyCoupon = async () => {
    if (!couponCode) return;
    setCouponLoading(true);
    setCouponError("");
    
    try {
      const { data, error } = await supabase
        .from("coupons")
        .select("*")
        .eq("code", couponCode.toUpperCase())
        .eq("is_active", true)
        .single();

      if (error || !data) throw new Error("كود غير صالح");

      if (data.expiry_date && new Date(data.expiry_date) < new Date()) {
        throw new Error("كود منتهي الصلاحية");
      }

      if (subtotal < (data.min_order || 0)) {
        throw new Error(`الحد الأدنى للطلب هو ${data.min_order} DA`);
      }

      setActiveCoupon(data);
    } catch (err: any) {
      setCouponError(err.message);
      setActiveCoupon(null);
    } finally {
      setCouponLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;
    
    setLoading(true);
    
    try {
      // Generate order number: NAFAA-YYYY-XXXX
      const year = new Date().getFullYear();
      const rand = Math.floor(Math.random() * 9000) + 1000;
      const orderNumber = `NAFAA-${year}-${rand}`;

      // 1. Create Order with all required fields
      const { data: orderData, error: orderError } = await supabase
        .from("orders")
        .insert({
          user_id: user?.uid || null,
          order_number: orderNumber,
          customer_name: formData.fullName,
          phone: formData.phone,
          wilaya: selectedWilaya?.name_ar || "",
          wilaya_id: parseInt(formData.wilayaId) || null,
          commune: formData.commune,
          address: formData.address,
          delivery_type: deliveryType,
          items: items.map(i => ({ id: i.id, name: i.name_ar, qty: i.quantity, price: i.price_dzd })),
          subtotal: subtotal,
          shipping_cost: shippingCost,
          discount: discountAmount,
          total: total,
          coupon_code: activeCoupon?.code || null,
          notes: formData.notes || null,
          status: 'pending',
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // 2. Create Order Items
      const orderItems = items.map(item => ({
        order_id: orderData.id,
        product_id: item.id,
        quantity: item.quantity,
        price_at_purchase: item.price_dzd
      }));

      const { error: itemsError } = await supabase
        .from("order_items")
        .insert(orderItems);

      if (itemsError) console.warn("Items error:", itemsError);

      // 3. Update coupon usage count
      if (activeCoupon?.id) {
        await supabase
          .from("coupons")
          .update({ uses_count: (activeCoupon.uses_count || 0) + 1 })
          .eq("id", activeCoupon.id);
      }

      // 4. Success
      setPlacedOrderNumber(orderNumber);
      setOrderPlaced(true);
      clearCart();
      
    } catch (error: any) {
      console.error("Order error:", error);
      alert("حدث خطأ أثناء تسجيل الطلب: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-brand-white pt-32 pb-20 px-6 flex flex-col items-center justify-center text-center">
        <div className="w-24 h-24 bg-accent-blue/10 flex items-center justify-center mb-8">
          <CheckCircle2 size={48} className="text-accent-blue" />
        </div>
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-accent-blue font-montserrat mb-3">ORDER CONFIRMED</p>
        <h1 className="text-4xl font-black uppercase tracking-tighter mb-4 font-montserrat">تم تسجيل <span className="text-accent-blue">طلبك</span></h1>
        <p className="text-xl font-tajawal font-bold text-dark-grey mb-4">سيتم التواصل معك قريباً لتأكيد الطلب عبر واتساب.</p>
        {placedOrderNumber && (
          <div className="bg-light-grey px-6 py-3 mb-6">
            <p className="text-[10px] font-black uppercase tracking-widest text-dark-grey font-montserrat">ORDER NUMBER</p>
            <p className="font-numbers font-black text-2xl text-primary-dark">{placedOrderNumber}</p>
          </div>
        )}
        <div className="flex gap-4">
          <button onClick={() => router.push(`/order-tracking`)} className="bg-primary-dark text-brand-white px-8 py-3 font-black uppercase tracking-widest text-xs hover:bg-accent-blue transition-all">
            تتبع طلبك
          </button>
          <button onClick={() => router.push("/")} className="border border-primary-dark text-primary-dark px-8 py-3 font-black uppercase tracking-widest text-xs hover:bg-light-grey transition-all">
            الصفحة الرئيسية
          </button>
        </div>
      </div>
    );
  }

  if (items.length === 0 && !orderPlaced) {
    return (
      <div className="min-h-screen bg-brand-white pt-32 pb-20 px-6 flex flex-col items-center justify-center text-center">
        <h1 className="text-4xl font-black uppercase tracking-tighter mb-4 font-montserrat">CART <span className="text-accent-blue">EMPTY</span></h1>
        <p className="text-xl font-tajawal font-bold text-dark-grey mb-8">سلة التسوق فارغة حالياً.</p>
        <button 
          onClick={() => router.push("/shop")}
          className="bg-primary-dark text-brand-white px-12 py-4 font-black uppercase tracking-widest text-sm hover:bg-accent-blue transition-all"
        >
          اذهب للمتجر
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FB] pt-24 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12">
          <h1 className="text-4xl font-black uppercase tracking-tighter mb-2 font-montserrat">CHECK<span className="text-accent-blue">OUT</span></h1>
          <p className="text-dark-grey font-tajawal text-sm uppercase tracking-widest font-bold">إتمام عملية الشراء والتوصيل</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Shipping Form */}
          <div className="space-y-10">
            <div className="bg-brand-white p-8 shadow-2xl border border-light-grey rounded-sm">
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-accent-blue mb-10 font-montserrat flex items-center gap-3">
                <span className="w-8 h-[1px] bg-accent-blue"></span>
                Shipping Details / تفاصيل الشحن
              </h3>
              
              <form id="checkout-form" onSubmit={handleSubmit} className="space-y-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-primary-dark block font-montserrat">Full Name / الاسم الكامل</label>
                  <input 
                    type="text" 
                    name="fullName"
                    required
                    value={formData.fullName}
                    onChange={handleChange}
                    className="w-full bg-light-grey border-none p-4 text-sm font-bold font-tajawal focus:ring-2 focus:ring-accent-blue outline-none transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-primary-dark block font-montserrat">Phone Number / رقم الهاتف</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-grey" size={18} />
                    <input 
                      type="tel" 
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="0XXXXXXXXX"
                      className="w-full bg-light-grey border-none p-4 pl-12 text-sm font-black font-numbers focus:ring-2 focus:ring-accent-blue outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-primary-dark block font-montserrat">Wilaya / الولاية</label>
                    <div className="relative">
                      <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-grey" size={18} />
                      <select 
                        name="wilayaId"
                        required
                        value={formData.wilayaId}
                        onChange={handleChange}
                        className="w-full bg-light-grey border-none p-4 pl-12 pr-10 text-sm font-bold font-tajawal focus:ring-2 focus:ring-accent-blue outline-none transition-all appearance-none cursor-pointer"
                      >
                        <option value="">اختر ولايتك</option>
                        {wilayas.map((w: any) => (
                          <option key={w.id} value={w.id}>{w.id} - {w.name_ar} ({w.name_fr})</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-primary-dark block font-montserrat">Shipping Method</label>
                    <div className="flex items-center gap-3 bg-light-blue/5 p-4 border border-accent-blue/20 rounded-sm">
                      <Truck className="text-accent-blue" size={20} />
                      <div className="text-[10px] font-black uppercase tracking-widest text-primary-dark font-montserrat">Home Delivery</div>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-primary-dark block font-montserrat">Full Address / العنوان الكامل</label>
                  <textarea 
                    name="address"
                    required
                    value={formData.address}
                    onChange={handleChange}
                    rows={3}
                    className="w-full bg-light-grey border-none p-4 text-sm font-bold font-tajawal focus:ring-2 focus:ring-accent-blue outline-none transition-all resize-none"
                  />
                </div>
              </form>
            </div>
          </div>

          {/* Order Summary */}
          <div className="space-y-10">
            <div className="bg-brand-white p-8 shadow-2xl border border-light-grey rounded-sm sticky top-24">
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-accent-blue mb-10 font-montserrat flex items-center gap-3">
                <span className="w-8 h-[1px] bg-accent-blue"></span>
                Order Summary / مخلص الطلب
              </h3>

              <div className="space-y-6 mb-10">
                {items.map(item => (
                  <div key={`${item.id}-${item.size}`} className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-light-grey border border-light-blue/20 p-1 flex-shrink-0">
                      <img src={item.image_url} alt={item.name_en} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-grow">
                      <div className="text-xs font-bold font-montserrat text-primary-dark uppercase">{item.name_en}</div>
                      <div className="text-[10px] font-bold font-tajawal text-dark-grey mt-1">{item.name_ar}</div>
                      <div className="text-[10px] font-black text-accent-blue font-montserrat mt-1 uppercase">QTY: {item.quantity} {item.size && `| SIZE: ${item.size}`}</div>
                    </div>
                    <div className="text-sm font-black font-numbers text-primary-dark">{(item.price_dzd * item.quantity).toLocaleString()} DA</div>
                  </div>
                ))}
              </div>

              <div className="space-y-4 border-t border-light-grey pt-6">
                <div className="flex items-center justify-between text-sm font-bold">
                  <span className="font-montserrat uppercase text-dark-grey tracking-widest">Subtotal</span>
                  <span className="font-numbers text-primary-dark">{subtotal.toLocaleString()} DA</span>
                </div>
                <div className="flex items-center justify-between text-sm font-bold">
                  <span className="font-montserrat uppercase text-dark-grey tracking-widest">Shipping</span>
                  <span className="font-numbers text-primary-dark">{shippingCost.toLocaleString()} DA</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex items-center justify-between text-sm font-bold text-accent-blue">
                    <span className="font-montserrat uppercase tracking-widest">Discount ({activeCoupon?.code})</span>
                    <span className="font-numbers">-{discountAmount.toLocaleString()} DA</span>
                  </div>
                )}
                <div className="flex items-center justify-between text-xl font-black pt-4 border-t border-primary-dark/10">
                  <span className="font-montserrat uppercase text-primary-dark">Total</span>
                  <span className="font-numbers text-accent-blue">{total.toLocaleString()} DA</span>
                </div>
              </div>

              {/* Coupon Input */}
              <div className="mb-10 pb-10 border-b border-light-grey">
                <label className="text-[10px] font-black uppercase tracking-widest text-primary-dark mb-4 block font-montserrat tracking-[0.2em]">Have a Promo Code? / هل لديك كود خصم؟</label>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    placeholder="Enter Code"
                    className="flex-grow bg-light-grey border-none p-4 text-xs font-black font-montserrat uppercase focus:ring-1 focus:ring-accent-blue outline-none transition-all"
                  />
                  <button 
                    onClick={handleApplyCoupon}
                    disabled={couponLoading || !couponCode}
                    className="bg-primary-dark text-brand-white px-6 py-4 text-[10px] font-black uppercase tracking-widest hover:bg-accent-blue transition-all disabled:opacity-50"
                  >
                    {couponLoading ? "..." : "Apply"}
                  </button>
                </div>
                {couponError && <p className="text-[10px] font-bold text-alert mt-2 font-tajawal">{couponError}</p>}
                {activeCoupon && <p className="text-[10px] font-bold text-green-600 mt-2 font-tajawal">تم تطبيق الخصم بنجاح!</p>}
              </div>

              <button 
                type="submit"
                form="checkout-form"
                disabled={loading}
                className="w-full mt-10 bg-primary-dark text-brand-white px-12 py-5 font-black uppercase tracking-widest text-sm flex items-center justify-center gap-3 hover:bg-accent-blue transition-all duration-300 shadow-xl shadow-primary-dark/20 disabled:opacity-50"
              >
                {loading ? <Loader2 className="animate-spin" size={18} /> : (
                  <>
                    Confirm Order
                    <ArrowRight size={18} />
                  </>
                )}
              </button>

              <div className="mt-6 flex items-center gap-3 p-4 bg-light-grey border border-light-blue/10 rounded-sm">
                <AlertCircle className="text-accent-blue flex-shrink-0" size={18} />
                <p className="text-[10px] font-bold font-tajawal text-dark-grey leading-relaxed">
                  الدفع عند الاستلام (Cash on Delivery). سيتم الاتصال بك لتأكيد الطلب قبل الشحن.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
