"use client";

import { MessageCircle } from "lucide-react";

export default function WhatsAppButton() {
  const WHATSAPP_NUMBER = "+213540873374";
  const MESSAGE = encodeURIComponent("مرحباً فريق نافع، أرغب في الاستفسار عن ...");

  return (
    <a
      href={`https://wa.me/${WHATSAPP_NUMBER}?text=${MESSAGE}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 bg-[#25D366] text-white p-4 rounded-full shadow-2xl hover:scale-110 active:scale-95 transition-all duration-300 group"
      aria-label="Contact on WhatsApp"
    >
      <MessageCircle size={28} />
      <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 px-4 py-2 bg-brand-black text-brand-white text-xs font-bold rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap pointer-events-none font-tajawal">
        تحدث معنا الآن
      </span>
    </a>
  );
}
