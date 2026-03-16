export default function Hero() {
  return (
    <section className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-primary-dark">
      {/* Background Overlay or Placeholder Image */}
      <div className="absolute inset-0 bg-gradient-to-t from-primary-dark/80 to-transparent z-10" />
      <div className="absolute inset-0 grayscale opacity-40 hover:opacity-50 transition-opacity duration-700 bg-[url('https://images.unsplash.com/photo-1552346154-21d32810aba3?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center" />

      <div className="relative z-20 text-center px-6 max-w-4xl">
        <h2 className="text-light-blue text-sm md:text-base font-bold uppercase tracking-[0.3em] mb-4 drop-shadow-sm font-montserrat">
          The New Streetwear Era
        </h2>
        
        <h1 className="text-brand-white text-5xl md:text-8xl font-black uppercase tracking-tighter mb-8 leading-tight font-montserrat">
          NAFAA <span className="text-accent-blue">BRAND</span>
        </h1>

        <p className="text-light-grey text-lg md:text-xl font-tajawal mb-12 max-w-2xl mx-auto leading-relaxed">
          تصاميم عصرية تجمع بين الراحة والأناقة. اكتشف تشكيلة "نافع" الجديدة للموسم الحالي.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
          <a
            href="/shop"
            className="w-full sm:w-auto px-12 py-4 bg-brand-white text-primary-dark font-black uppercase tracking-widest text-sm hover:bg-accent-blue hover:text-brand-white transition-all duration-300"
          >
            تسوق الآن
          </a>
          <a
            href="/new-arrivals"
            className="w-full sm:w-auto px-12 py-4 border-2 border-brand-white text-brand-white font-black uppercase tracking-widest text-sm hover:bg-brand-white hover:text-primary-dark transition-all duration-300"
          >
            وصلنا حديثاً
          </a>
        </div>
      </div>

      {/* Decorative vertical line (RTL left/end) */}
      <div className="absolute bottom-10 left-10 hidden lg:flex flex-col items-center gap-4 z-20">
        <span className="text-brand-white/40 text-[10px] uppercase tracking-[0.5em] rotate-180 [writing-mode:vertical-lr]">
          Est. 2026
        </span>
        <div className="w-px h-20 bg-brand-white/20" />
      </div>
    </section>
  );
}
