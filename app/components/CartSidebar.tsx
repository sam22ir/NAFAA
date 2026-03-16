"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingBag, Plus, Minus, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartSidebar({ isOpen, onClose }: CartSidebarProps) {
  const { items, subtotal, removeItem, updateQuantity } = useCart();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-brand-black/40 backdrop-blur-sm z-[60]"
          />

          {/* Sidebar (RTL Slide from right/end) */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-brand-white z-[70] shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="p-6 border-b border-light-grey flex items-center justify-between">
              <div className="flex items-center gap-3">
                <ShoppingBag size={24} className="text-primary-dark" />
                <h2 className="text-lg font-black uppercase tracking-tight font-montserrat">
                  سلة التسوق <span className="text-accent-blue font-numbers">({items.length})</span>
                </h2>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-light-grey transition-colors rounded-full">
                <X size={24} />
              </button>
            </div>

            {/* Items List */}
            <div className="flex-grow overflow-y-auto p-6 flex flex-col gap-8">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center">
                  <ShoppingBag size={48} className="text-light-grey mb-4" />
                  <p className="text-dark-grey font-bold font-tajawal">سلة التسوق فارغة</p>
                </div>
              ) : (
                items.map((item) => (
                  <div key={`${item.id}-${item.size}`} className="flex gap-4 group">
                    <div className="relative w-24 aspect-[3/4] bg-light-grey shrink-0 overflow-hidden">
                      <img src={item.image_url} alt={item.name_en} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-grow flex flex-col justify-between py-1">
                      <div>
                        <h3 className="text-sm font-bold text-brand-black mb-1 font-tajawal">{item.name_ar}</h3>
                        <div className="flex gap-4 text-[10px] text-dark-grey font-bold uppercase tracking-widest font-montserrat">
                          {item.size && <span>Size: {item.size}</span>}
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        {/* Quantity Controls */}
                        <div className="flex items-center border border-light-grey">
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity - 1, item.size)}
                            className="p-1.5 hover:bg-light-grey transition-colors"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="px-3 text-xs font-bold font-numbers">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity + 1, item.size)}
                            className="p-1.5 hover:bg-light-grey transition-colors"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                        
                        <div className="flex items-center gap-4">
                          <span className="text-sm font-black text-primary-dark font-numbers">{(item.price_dzd * item.quantity).toLocaleString()} دج</span>
                          <button 
                            onClick={() => removeItem(item.id, item.size)}
                            className="text-alert/40 hover:text-alert transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer / Summary */}
            <div className="p-6 border-t border-light-grey bg-light-grey/30">
              <div className="flex items-center justify-between mb-6">
                <span className="text-sm font-bold text-dark-grey uppercase tracking-widest font-montserrat">المجموع الفرعي</span>
                <span className="text-xl font-black text-primary-dark font-numbers">{subtotal.toLocaleString()} دج</span>
              </div>
              <p className="text-[10px] text-dark-grey mb-6 font-tajawal">
                تتم معالجة كل الطلبيات بالدينار الجزائري. يتم حساب تكلفة الشحن عند الدفع.
              </p>
              <Link 
                href="/checkout"
                onClick={onClose}
                className="block w-full text-center bg-primary-dark text-brand-white py-4 font-black uppercase tracking-widest text-sm hover:bg-accent-blue transition-colors duration-300"
              >
                إتمام الطلب
              </Link>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
