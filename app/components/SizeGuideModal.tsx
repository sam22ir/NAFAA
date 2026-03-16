"use client";

import { X } from "lucide-react";

interface SizeGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  category?: string;
}

const TSHIRT_SIZES = [
  { size: "XS", chest: "86-90", shoulder: "42", sleeve: "20", length: "66" },
  { size: "S",  chest: "90-94", shoulder: "44", sleeve: "21", length: "68" },
  { size: "M",  chest: "94-100", shoulder: "46", sleeve: "22", length: "70" },
  { size: "L",  chest: "100-106", shoulder: "48", sleeve: "23", length: "72" },
  { size: "XL", chest: "106-112", shoulder: "50", sleeve: "24", length: "74" },
  { size: "XXL", chest: "112-120", shoulder: "52", sleeve: "25", length: "76" },
];

const HOODIE_SIZES = [
  { size: "S",  chest: "96-100", shoulder: "46", sleeve: "60", length: "68" },
  { size: "M",  chest: "100-106", shoulder: "48", sleeve: "62", length: "70" },
  { size: "L",  chest: "106-112", shoulder: "50", sleeve: "64", length: "72" },
  { size: "XL", chest: "112-118", shoulder: "52", sleeve: "66", length: "74" },
  { size: "XXL", chest: "118-126", shoulder: "54", sleeve: "68", length: "76" },
];

const PANTS_SIZES = [
  { size: "S",  waist: "76-80", hips: "90-94", inseam: "76", outseam: "98" },
  { size: "M",  waist: "80-84", hips: "94-98", inseam: "78", outseam: "100" },
  { size: "L",  waist: "84-88", hips: "98-102", inseam: "80", outseam: "102" },
  { size: "XL", waist: "88-94", hips: "102-108", inseam: "82", outseam: "104" },
  { size: "XXL", waist: "94-100", hips: "108-114", inseam: "82", outseam: "104" },
];

export default function SizeGuideModal({ isOpen, onClose, category = "tshirt" }: SizeGuideModalProps) {
  if (!isOpen) return null;

  const isTshirt = category === "tshirt";
  const isHoodie = category === "hoodie";
  const isPants  = category === "pants";
  const sizes = isPants ? PANTS_SIZES : isHoodie ? HOODIE_SIZES : TSHIRT_SIZES;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-primary-dark/60 backdrop-blur-sm" />
      <div
        className="relative bg-brand-white w-full max-w-2xl max-h-[85vh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-primary-dark text-brand-white px-6 py-4 flex items-center justify-between sticky top-0">
          <div>
            <p className="text-[9px] font-black uppercase tracking-[0.3em] text-accent-blue font-montserrat">SIZE GUIDE</p>
            <h2 className="text-lg font-black uppercase tracking-tighter font-montserrat">دليل المقاسات</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 transition-colors rounded-sm">
            <X size={20} />
          </button>
        </div>

        {/* Tip */}
        <div className="bg-light-blue/30 border-r-4 border-accent-blue px-6 py-3" dir="rtl">
          <p className="text-xs font-tajawal text-primary-dark">
            <strong>نصيحة:</strong> لضمان المقاس المناسب، قِس محيط صدرك وخصرك بشريط قياس مرن. جميع القياسات بالسنتيمتر (cm).
          </p>
        </div>

        {/* Table */}
        <div className="overflow-x-auto p-6">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-primary-dark text-brand-white">
                <th className="py-3 px-4 text-right font-montserrat font-black text-[10px] uppercase tracking-widest">المقاس</th>
                {isPants ? (
                  <>
                    <th className="py-3 px-4 text-center font-montserrat font-black text-[10px] uppercase tracking-widest">الخصر</th>
                    <th className="py-3 px-4 text-center font-montserrat font-black text-[10px] uppercase tracking-widest">الأرداف</th>
                    <th className="py-3 px-4 text-center font-montserrat font-black text-[10px] uppercase tracking-widest">داخل الساق</th>
                    <th className="py-3 px-4 text-center font-montserrat font-black text-[10px] uppercase tracking-widest">الطول</th>
                  </>
                ) : (
                  <>
                    <th className="py-3 px-4 text-center font-montserrat font-black text-[10px] uppercase tracking-widest">الصدر</th>
                    <th className="py-3 px-4 text-center font-montserrat font-black text-[10px] uppercase tracking-widest">الكتف</th>
                    <th className="py-3 px-4 text-center font-montserrat font-black text-[10px] uppercase tracking-widest">الكم</th>
                    <th className="py-3 px-4 text-center font-montserrat font-black text-[10px] uppercase tracking-widest">الطول</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-light-grey">
              {sizes.map((row: any, i) => (
                <tr key={i} className={i % 2 === 0 ? "bg-brand-white" : "bg-light-grey/40"}>
                  <td className="py-3 px-4 text-right font-black font-montserrat text-primary-dark">{row.size}</td>
                  {isPants ? (
                    <>
                      <td className="py-3 px-4 text-center font-numbers text-dark-grey">{row.waist}</td>
                      <td className="py-3 px-4 text-center font-numbers text-dark-grey">{row.hips}</td>
                      <td className="py-3 px-4 text-center font-numbers text-dark-grey">{row.inseam}</td>
                      <td className="py-3 px-4 text-center font-numbers text-dark-grey">{row.outseam}</td>
                    </>
                  ) : (
                    <>
                      <td className="py-3 px-4 text-center font-numbers text-dark-grey">{row.chest}</td>
                      <td className="py-3 px-4 text-center font-numbers text-dark-grey">{row.shoulder}</td>
                      <td className="py-3 px-4 text-center font-numbers text-dark-grey">{row.sleeve}</td>
                      <td className="py-3 px-4 text-center font-numbers text-dark-grey">{row.length}</td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Measure guide */}
        <div className="px-6 pb-6 grid grid-cols-2 gap-4" dir="rtl">
          <div className="bg-light-grey p-4">
            <p className="text-[9px] font-black uppercase tracking-widest text-accent-blue font-montserrat mb-2">محيط الصدر</p>
            <p className="text-xs font-tajawal text-dark-grey">مرر الشريط تحت الإبطين وفوق الجزء الأكثر امتلاءً من الصدر.</p>
          </div>
          <div className="bg-light-grey p-4">
            <p className="text-[9px] font-black uppercase tracking-widest text-accent-blue font-montserrat mb-2">محيط الخصر</p>
            <p className="text-xs font-tajawal text-dark-grey">مرر الشريط حول الجزء الأضيق من الخصر فوق السرة.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
