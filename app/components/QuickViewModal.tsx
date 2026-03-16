"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingBag, Heart, ShieldCheck, Truck } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { useCart } from "@/context/CartContext";

interface QuickViewModalProps {
  product: any;
  isOpen: boolean;
  onClose: () => void;
}

export default function QuickViewModal({ product, isOpen, onClose }: QuickViewModalProps) {
  const [selectedSize, setSelectedSize] = useState("");
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  if (!product) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-brand-black/60 backdrop-blur-sm z-[100]"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl bg-brand-white z-[110] shadow-2xl overflow-hidden flex flex-col md:flex-row"
          >
            <button onClick={onClose} className="absolute top-4 right-4 z-10 p-2 bg-brand-white/80 hover:bg-brand-white transition-colors rounded-full shadow-sm">
              <X size={20} />
            </button>

            {/* Image Section */}
            <div className="w-full md:w-1/2 aspect-[3/4] bg-light-grey relative">
              <Image src={product.image_urls?.[0] || "/placeholder-product.jpg"} alt={product.name_ar} fill className="object-cover" />
            </div>

            {/* Content Section */}
            <div className="w-full md:w-1/2 p-8 flex flex-col">
              <div className="mb-6">
                <span className="text-[10px] font-black uppercase tracking-widest text-accent-blue font-montserrat mb-2 block">Quick View</span>
                <h2 className="text-2xl font-black text-primary-dark mb-2 font-tajawal">{product.name_ar}</h2>
                <div className="flex items-center gap-3">
                  <span className="text-xl font-black text-primary-dark font-numbers">{product.price_dzd?.toLocaleString()} دج</span>
                  {product.original_price && (
                    <span className="text-sm text-dark-grey line-through font-numbers">{product.original_price.toLocaleString()} دج</span>
                  )}
                </div>
              </div>

              <div className="mb-8">
                <h3 className="text-xs font-black uppercase tracking-widest text-primary-dark mb-4 font-montserrat">المقاس</h3>
                <div className="flex flex-wrap gap-2">
                  {(product.sizes || ["S", "M", "L", "XL"]).map((size: string) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`w-12 h-12 flex items-center justify-center font-black transition-all border ${
                        selectedSize === size ? "bg-primary-dark text-brand-white border-primary-dark" : "border-light-grey hover:border-primary-dark"
                      } font-montserrat`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              <button 
                onClick={() => {
                  if (product.sizes?.length > 0 && !selectedSize) {
                    alert("الرجاء تحديد المقاس");
                    return;
                  }
                  addItem({ ...product, selectedSize, quantity: 1 });
                  setAdded(true);
                  setTimeout(() => { setAdded(false); onClose(); }, 1500);
                }}
                className={`w-full py-4 font-black uppercase tracking-widest text-sm flex items-center justify-center gap-3 transition-all duration-300 mb-6 ${
                  added ? "bg-success text-brand-white" : "bg-primary-dark text-brand-white hover:bg-accent-blue"
                }`}
              >
                <ShoppingBag size={20} />
                {added ? "تمت الإضافة" : "إضافة للسلة"}
              </button>

              <div className="mt-auto space-y-4 pt-6 border-t border-light-grey">
                <div className="flex items-center gap-3 text-dark-grey">
                  <Truck size={18} className="text-accent-blue" />
                  <span className="text-[10px] font-bold uppercase tracking-widest font-montserrat">Shipping to 58 Wilayas</span>
                </div>
                <div className="flex items-center gap-3 text-dark-grey">
                  <ShieldCheck size={18} className="text-accent-blue" />
                  <span className="text-[10px] font-bold uppercase tracking-widest font-montserrat">Premium Quality Guarantee</span>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
