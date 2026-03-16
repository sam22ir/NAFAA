import Link from "next/link";
import { Instagram, Facebook, Twitter, Mail, MapPin, Phone } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-primary-dark text-brand-white py-20 border-t border-brand-white/10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          
          {/* Brand Info */}
          <div className="flex flex-col gap-6">
            <h3 className="text-2xl font-black font-montserrat tracking-tighter uppercase">NAFAA</h3>
            <p className="text-light-blue/70 text-sm leading-relaxed font-tajawal">
              علامة تجارية حزائرية متخصصة في ألبسة الشارع والرياضة، نسعى لتقديم الجودة والأناقة لجيل اليوم.
            </p>
            <div className="flex items-center gap-4">
              <Link href="https://www.instagram.com/nafaabrand?igsh=MW55MTRrN2hyMjRndA==" target="_blank" className="hover:text-accent-blue transition-colors outline-none"><Instagram size={20} /></Link>
              <Link href="#" className="hover:text-accent-blue transition-colors outline-none"><Facebook size={20} /></Link>
              <Link href="#" className="hover:text-accent-blue transition-colors outline-none"><Twitter size={20} /></Link>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-widest mb-6 font-montserrat">روابط سريعة</h4>
            <ul className="flex flex-col gap-3 font-tajawal text-sm text-light-blue/70 list-none m-0 p-0">
              <li><Link href="/" className="hover:text-brand-white transition-colors">الرئيسية</Link></li>
              <li><Link href="/shop" className="hover:text-brand-white transition-colors">المتجر</Link></li>
              <li><Link href="/new-arrivals" className="hover:text-brand-white transition-colors">وصلنا حديثاً</Link></li>
              <li><Link href="/about" className="hover:text-brand-white transition-colors">عن نافع</Link></li>
            </ul>
          </div>

          {/* Help & Support */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-widest mb-6 font-montserrat">المساعدة والدعم</h4>
            <ul className="flex flex-col gap-3 font-tajawal text-sm text-light-blue/70 list-none m-0 p-0">
              <li><Link href="/shipping" className="hover:text-brand-white transition-colors">سياسة الشحن (58 ولاية)</Link></li>
              <li><Link href="/returns" className="hover:text-brand-white transition-colors">سياسة الاسترجاع</Link></li>
              <li><Link href="/faq" className="hover:text-brand-white transition-colors">الأسئلة الشائعة</Link></li>
              <li><Link href="/track" className="hover:text-brand-white transition-colors">تتبع طلبك عبر Yalidine</Link></li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-widest mb-6 font-montserrat">تواصل معنا</h4>
            <ul className="flex flex-col gap-4 font-tajawal text-sm text-light-blue/70 list-none m-0 p-0">
              <li className="flex items-start gap-3">
                <MapPin size={18} className="text-accent-blue mt-0.5 shrink-0" />
                <span>تبسة، الجزائر</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} className="text-accent-blue shrink-0" />
                <span className="font-numbers tracking-wide" dir="ltr">+213 540 87 33 74</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={18} className="text-accent-blue shrink-0" />
                <span>contact@nafaabrand.com</span>
              </li>
            </ul>
          </div>

        </div>

        <div className="mt-20 pt-8 border-t border-brand-white/5 flex flex-col md:flex-row items-center justify-between gap-6 opacity-60 text-[10px] sm:text-xs">
          <p>© {currentYear} NAFAA BRAND. جميع الحقوق محفوظة.</p>
          <div className="flex gap-6 uppercase tracking-widest font-bold">
            <Link href="/privacy" className="hover:text-brand-white transition-colors">سياسة الخصوصية</Link>
            <Link href="/terms" className="hover:text-brand-white transition-colors">الشروط والأحكام</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
