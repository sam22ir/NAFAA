"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Instagram, ShoppingBag, ExternalLink, Heart, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function InstagramFeed() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPosts() {
      try {
        const { data, error } = await supabase
          .from("instagram_posts")
          .select("*")
          .order("posted_at", { ascending: false })
          .limit(8);

        if (error) throw error;
        
        if (!data || data.length === 0) {
          // Fallback mock data for visual demonstration
          setPosts([
            {
              id: "1",
              media_url: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1020&auto=format&fit=crop",
              caption: "Summer Collection 2024 / تشكيلة صيف 2024",
              is_shop_look: true
            },
            {
              id: "2",
              media_url: "https://images.unsplash.com/photo-1539109132314-347f85417bd0?q=80&w=987&auto=format&fit=crop",
              caption: "Minimalist Style / البساطة في الأناقة",
              is_shop_look: false
            },
            {
              id: "3",
              media_url: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?q=80&w=2073&auto=format&fit=crop",
              caption: "Casual Friday / الأناقة اليومية",
              is_shop_look: true
            },
            {
              id: "4",
              media_url: "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2070&auto=format&fit=crop",
              caption: "New Arrivals / وصول جديد",
              is_shop_look: false
            }
          ]);
        } else {
          setPosts(data);
        }
      } catch (error) {
        console.error("Error fetching Instagram posts:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchPosts();
  }, []);

  if (loading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center">
        <Loader2 className="animate-spin text-accent-blue mb-4" />
        <span className="text-[10px] font-black uppercase tracking-widest text-dark-grey font-montserrat tracking-[0.3em]">Connecting to Instagram</span>
      </div>
    );
  }

  return (
    <section className="py-32 bg-brand-white border-t border-light-grey overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <header className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="max-w-2xl">
            <div className="flex items-center gap-3 text-accent-blue mb-4">
              <Instagram size={20} />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] font-montserrat">Follow @NAFAA_Brand</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-none font-montserrat">
              SHOP THE <span className="text-accent-blue">LOOK</span>
            </h2>
            <p className="mt-6 text-dark-grey font-tajawal text-sm font-bold uppercase tracking-widest leading-relaxed">
              استكشف مجموعتنا من خلال عيون عملائنا على إنستغرام. تسوق القطع مباشرة من المنشورات.
            </p>
          </div>
          <a 
            href="https://instagram.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="group flex items-center gap-4 text-xs font-black uppercase tracking-widest border-b-2 border-primary-dark pb-2 hover:text-accent-blue hover:border-accent-blue transition-all"
          >
            Visit Profile <ExternalLink size={14} className="group-hover:translate-x-1 transition-transform" />
          </a>
        </header>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
          {posts.map((post, i) => (
            <div 
              key={post.id} 
              className={`group relative overflow-hidden bg-light-grey aspect-square ${i === 1 || i === 3 ? 'md:translate-y-12' : ''}`}
            >
              <Image 
                src={post.media_url} 
                alt={post.caption || "Instagram Post"} 
                fill 
                className="object-cover group-hover:scale-110 transition-transform duration-1000"
              />
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-primary-dark/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 backdrop-blur-[2px] flex flex-col justify-between p-6">
                <div className="flex justify-end">
                  {post.is_shop_look && (
                    <span className="bg-brand-white text-primary-dark text-[10px] font-black px-3 py-1.5 flex items-center gap-2 uppercase font-montserrat">
                      <ShoppingBag size={12} /> Shop This
                    </span>
                  )}
                </div>
                
                <div className="space-y-4">
                  <p className="text-brand-white text-xs font-tajawal line-clamp-2 leading-relaxed">
                    {post.caption}
                  </p>
                  <div className="flex items-center gap-4 text-brand-white">
                    <Heart size={16} fill="white" />
                    <span className="text-[10px] font-black font-montserrat">{post.likes_count || '258'}</span>
                  </div>
                </div>
              </div>

              {/* Tag marker */}
              {post.is_shop_look && (
                <div className="absolute bottom-4 right-4 w-4 h-4 bg-brand-white/80 rounded-full animate-pulse flex items-center justify-center">
                  <div className="w-1.5 h-1.5 bg-accent-blue rounded-full" />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Brand Hashtag Banner */}
        <div className="mt-40 border-y border-light-grey py-16">
          <div className="flex overflow-hidden group">
            <div className="flex animate-marquee whitespace-nowrap gap-12 text-6xl md:text-8xl font-black text-light-grey font-montserrat tracking-tighter group-hover:pause">
              <span>#NAFAA_STYLE</span>
              <span className="text-accent-blue/10">#BE_NAFAA</span>
              <span>#ALGERIA_FASHION</span>
              <span className="text-accent-blue/10">#NAFAA_STYLE</span>
            </div>
            <div className="flex animate-marquee whitespace-nowrap gap-12 text-6xl md:text-8xl font-black text-light-grey font-montserrat tracking-tighter group-hover:pause" aria-hidden="true">
              <span>#NAFAA_STYLE</span>
              <span className="text-accent-blue/10">#BE_NAFAA</span>
              <span>#ALGERIA_FASHION</span>
              <span className="text-accent-blue/10">#NAFAA_STYLE</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
