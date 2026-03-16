import Hero from "./components/Hero";
import ProductGrid from "./components/ProductGrid";
import InstagramFeed from "./components/InstagramFeed";

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <Hero />

      {/* New Drops Headline - RTL Arabic */}
      <section className="py-24 bg-brand-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter mb-4 font-montserrat text-primary-dark">
              وصلنا <span className="text-accent-blue">حديثاً</span>
            </h2>
            <p className="text-dark-grey text-lg font-tajawal max-w-xl mx-auto">
              انطلاق التشكيلة الجديدة لموسم 2026. الأناقة التي طالما كنت تنتظرها متوفرة الآن في جميع أنحاء الوطن.
            </p>
          </div>
          
          {/* Real Product Grid */}
          <ProductGrid />
        </div>
      </section>

      {/* Brands / Values Strip */}
      <section className="py-16 bg-light-grey border-y border-light-blue/20">
        <div className="max-w-7xl mx-auto px-6 flex flex-wrap items-center justify-center gap-12 md:gap-24 opacity-60 grayscale">
          <div className="text-xl font-black tracking-widest font-montserrat uppercase">Quality First</div>
          <div className="text-xl font-black tracking-widest font-montserrat uppercase">Made in Algeria</div>
          <div className="text-xl font-black tracking-widest font-montserrat uppercase">Fast Shipping</div>
          <div className="text-xl font-black tracking-widest font-montserrat uppercase">Modern Fit</div>
        </div>
      </section>

      {/* Instagram Integration */}
      <InstagramFeed />
    </div>
  );
}
