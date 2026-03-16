import Link from "next/link";
import { Instagram, Award, Truck, Shield } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-brand-white pt-16">
      {/* Hero */}
      <div className="bg-primary-dark text-brand-white py-32 px-6 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-accent-blue/5" />
        <div className="relative z-10">
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-accent-blue font-montserrat mb-4">OUR STORY</p>
          <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter font-montserrat mb-6">
            WHO IS<br /><span className="text-accent-blue">NAFAA</span>
          </h1>
          <p className="max-w-xl mx-auto font-tajawal text-lg leading-relaxed text-brand-white/80">
            علامة جزائرية أصيلة تجمع بين الأناقة العصرية وروح الشارع، صنعت في الجزائر للجزائريين.
          </p>
        </div>
      </div>

      {/* Mission */}
      <div className="max-w-5xl mx-auto px-6 py-24">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div className="text-right" dir="rtl">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-accent-blue font-montserrat mb-4">OUR MISSION</p>
            <h2 className="text-4xl font-black uppercase tracking-tighter font-montserrat text-primary-dark mb-6">
              رسالتنا
            </h2>
            <p className="font-tajawal text-dark-grey leading-relaxed text-lg mb-4">
              نهدف إلى تقديم ملابس عصرية بجودة عالمية وأسعار مناسبة للشباب الجزائري. كل قطعة مصممة بعناية لتعكس هويتك وتمنحك الثقة.
            </p>
            <p className="font-tajawal text-dark-grey leading-relaxed">
              من العاصمة إلى أدرار، نوصل إلى 69 ولاية لأن كل جزائري يستحق الأفضل.
            </p>
          </div>
          <div className="bg-primary-dark aspect-square flex items-center justify-center">
            <span className="text-8xl font-black text-brand-white font-montserrat opacity-20">N</span>
          </div>
        </div>
      </div>

      {/* Values */}
      <div className="bg-light-grey py-20 px-6">
        <div className="max-w-5xl mx-auto text-center mb-12">
          <h2 className="text-3xl font-black uppercase tracking-tighter font-montserrat text-primary-dark">
            Our <span className="text-accent-blue">Values</span>
          </h2>
        </div>
        <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-8">
          {[
            { icon: Award, title: "الجودة أولاً", desc: "كل تصميم يمر بمراقبة صارمة قبل وصوله إليك", en: "QUALITY FIRST" },
            { icon: Shield, title: "الأصالة", desc: "علامة جزائرية 100% تفخر بجذورها وتطمح للعالمية", en: "AUTHENTICITY" },
            { icon: Truck, title: "التوصيل السريع", desc: "توصيل موثوق لجميع الولايات الـ 69عبر ياليدين", en: "FAST DELIVERY" },
          ].map((val) => {
            const Icon = val.icon;
            return (
              <div key={val.en} className="bg-brand-white p-8 text-center border border-light-grey hover:border-accent-blue transition-colors">
                <div className="w-14 h-14 bg-primary-dark/5 flex items-center justify-center mx-auto mb-4">
                  <Icon size={24} className="text-accent-blue" />
                </div>
                <p className="text-[9px] font-black uppercase tracking-widest text-accent-blue font-montserrat mb-2">{val.en}</p>
                <h3 className="font-tajawal font-black text-primary-dark text-lg mb-3">{val.title}</h3>
                <p className="font-tajawal text-dark-grey text-sm leading-relaxed">{val.desc}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* CTA */}
      <div className="py-20 px-6 text-center">
        <h2 className="text-4xl font-black uppercase tracking-tighter font-montserrat text-primary-dark mb-4">
          Join the <span className="text-accent-blue">NAFAA</span> Family
        </h2>
        <p className="font-tajawal text-dark-grey mb-8 text-lg">تابعنا على إنستغرام واكتشف آخر التشكيلات</p>
        <div className="flex justify-center gap-4 flex-wrap">
          <Link href="/shop" className="bg-primary-dark text-brand-white px-10 py-4 font-black uppercase tracking-widest text-xs hover:bg-accent-blue transition-all">
            تسوق الآن
          </Link>
          <a
            href="https://instagram.com/nafaa_brand"
            target="_blank"
            rel="noopener noreferrer"
            className="border-2 border-primary-dark text-primary-dark px-10 py-4 font-black uppercase tracking-widest text-xs hover:bg-primary-dark hover:text-brand-white transition-all flex items-center gap-2"
          >
            <Instagram size={14} /> Instagram
          </a>
        </div>
      </div>
    </div>
  );
}
