import { Truck, Package, Clock, MapPin, MessageCircle, CheckCircle2 } from "lucide-react";
import Link from "next/link";

const DELIVERY_INFO = [
  { region: "الجزائر العاصمة + الجزائر الكبرى", home: "350 DA", desk: "250 DA", days: "24-48 ساعة" },
  { region: "الشمال (ولايات قريبة)", home: "400-450 DA", desk: "300 DA", days: "2-3 أيام" },
  { region: "الوسط والشرق والغرب", home: "500-600 DA", desk: "350-400 DA", days: "3-4 أيام" },
  { region: "الجنوب الكبير", home: "700-800 DA", desk: "500-600 DA", days: "4-5 أيام" },
  { region: "أقصى الجنوب (تمنراست، إليزي، تندوف…)", home: "1000-1200 DA", desk: "800-1000 DA", days: "5-7 أيام" },
];

export default function ShippingPage() {
  return (
    <div className="min-h-screen bg-[#F8F9FB] pt-24 pb-20 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-accent-blue font-montserrat mb-3">NAFAA — FAST DELIVERY</p>
          <h1 className="text-5xl font-black uppercase tracking-tighter font-montserrat text-primary-dark">
            الشحن & <span className="text-accent-blue">التوصيل</span>
          </h1>
          <p className="font-tajawal text-dark-grey mt-4 text-lg">نوصل إلى جميع الـ 69 ولاية عبر شريكنا ياليدين</p>
        </div>

        {/* Partner Banner */}
        <div className="bg-primary-dark text-brand-white p-8 mb-8 flex items-center justify-between gap-4 flex-wrap">
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-accent-blue font-montserrat mb-1">SHIPPING PARTNER</p>
            <h2 className="text-2xl font-black font-montserrat">YALIDINE EXPRESS</h2>
            <p className="font-tajawal text-brand-white/70 text-sm mt-1">شريكنا الموثوق في التوصيل عبر الجزائر</p>
          </div>
          <Truck size={48} className="text-accent-blue" />
        </div>

        {/* Types */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <div className="bg-brand-white border border-light-grey p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-accent-blue/10 flex items-center justify-center">
                <MapPin size={20} className="text-accent-blue" />
              </div>
              <div>
                <p className="text-[9px] font-black uppercase tracking-widest text-accent-blue font-montserrat">HOME DELIVERY</p>
                <h3 className="font-tajawal font-black text-primary-dark text-lg">توصيل للمنزل</h3>
              </div>
            </div>
            <p className="font-tajawal text-dark-grey text-sm leading-relaxed">يصلك طلبك مباشرة إلى عنوانك. مثالي للراحة وتجنب التنقل.</p>
          </div>
          <div className="bg-brand-white border border-light-grey p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-accent-blue/10 flex items-center justify-center">
                <Package size={20} className="text-accent-blue" />
              </div>
              <div>
                <p className="text-[9px] font-black uppercase tracking-widest text-accent-blue font-montserrat">STOP DESK</p>
                <h3 className="font-tajawal font-black text-primary-dark text-lg">توصيل للمكتب</h3>
              </div>
            </div>
            <p className="font-tajawal text-dark-grey text-sm leading-relaxed">استلم طلبك من أقرب مكتب ياليدين بسعر أقل وبنفس السرعة.</p>
          </div>
        </div>

        {/* Pricing Table */}
        <div className="bg-brand-white border border-light-grey shadow-lg overflow-hidden mb-8">
          <div className="bg-primary-dark text-brand-white p-4">
            <h3 className="font-black uppercase tracking-widest text-[10px] font-montserrat">DELIVERY PRICING BY REGION</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-light-grey">
                <tr>
                  <th className="p-4 text-right font-black text-[9px] uppercase tracking-widest text-dark-grey font-montserrat">المنطقة</th>
                  <th className="p-4 text-center font-black text-[9px] uppercase tracking-widest text-dark-grey font-montserrat">للمنزل</th>
                  <th className="p-4 text-center font-black text-[9px] uppercase tracking-widest text-dark-grey font-montserrat">للمكتب</th>
                  <th className="p-4 text-center font-black text-[9px] uppercase tracking-widest text-dark-grey font-montserrat">المدة</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-light-grey">
                {DELIVERY_INFO.map((row, i) => (
                  <tr key={i} className="hover:bg-light-grey/30 transition-colors">
                    <td className="p-4 text-right font-tajawal font-bold text-primary-dark text-sm">{row.region}</td>
                    <td className="p-4 text-center font-numbers font-bold text-primary-dark text-sm">{row.home}</td>
                    <td className="p-4 text-center font-numbers font-bold text-accent-blue text-sm">{row.desk}</td>
                    <td className="p-4 text-center">
                      <span className="flex items-center justify-center gap-1 text-xs font-tajawal text-dark-grey">
                        <Clock size={12} /> {row.days}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Policy */}
        <div className="bg-brand-white border border-light-grey p-6 mb-6">
          <h3 className="font-black uppercase tracking-widest text-[10px] text-accent-blue font-montserrat mb-4">ORDER POLICY</h3>
          <div className="space-y-3" dir="rtl">
            {[
              "الدفع عند الاستلام فقط — لا حاجة لدفع مسبق",
              "التأكيد يتم في غضون 24 ساعة عبر واتساب",
              "يمكنك تتبع طلبك عبر كود ياليدين",
              "في حال الرفض: يُحسب سعر الوجهتين (ذهاباً وإياباً)",
              "لمزيد من المساعدة تواصل معنا عبر واتساب",
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3">
                <CheckCircle2 size={14} className="text-accent-blue mt-0.5 flex-shrink-0" />
                <p className="font-tajawal text-dark-grey text-sm">{item}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Support CTA */}
        <a
          href="https://wa.me/213XXXXXXXXX"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-3 w-full bg-[#25D366] text-white py-4 font-black uppercase tracking-widest text-xs hover:bg-[#128C7E] transition-all"
        >
          <MessageCircle size={18} /> تواصل مع الدعم عبر واتساب
        </a>
      </div>
    </div>
  );
}
