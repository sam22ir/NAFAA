"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { User, Mail, Phone, MapPin, Lock, UserPlus, ArrowRight, Loader2, Chrome } from "lucide-react";
import { AuthService } from "@/lib/services/auth-service";
import { useRouter } from "next/navigation";

const WILAYAS = [
  "01 - Adrar", "02 - Chlef", "03 - Laghouat", "04 - Oum El Bouaghi", "05 - Batna", 
  "06 - Béjaïa", "07 - Biskra", "08 - Béchar", "09 - Blida", "10 - Bouira",
  "11 - Tamanrasset", "12 - Tébessa", "13 - Tlemcen", "14 - Tiaret", "15 - Tizi Ouzou",
  "16 - Alger", "17 - Djelfa", "18 - Jijel", "19 - Sétif", "20 - Saïda",
  "21 - Skikda", "22 - Sidi Bel Abbès", "23 - Annaba", "24 - Guelma", "25 - Constantine",
  "26 - Médéa", "27 - Mostaganem", "28 - M'Sila", "29 - Mascara", "30 - Ouargla",
  "31 - Oran", "32 - El Bayadh", "33 - Illizi", "34 - Bordj Bou Arréridj", "35 - Boumerdès",
  "36 - El Tarf", "37 - Tindouf", "38 - Tissemsilt", "39 - El Oued", "40 - Khenchela",
  "41 - Souk Ahras", "42 - Tipaza", "43 - Mila", "44 - Aïn Defla", "45 - Naâma",
  "46 - Aïn Témouchent", "47 - Ghardaïa", "48 - Relizane", "49 - El M'Ghair", "50 - El Meniaa",
  "51 - Ouled Djellal", "52 - Bordj Baji Mokhtar", "53 - Béni Abbès", "54 - Timimoun", "55 - Touggourt",
  "56 - Djanet", "57 - In Salah", "58 - In Guezzam"
];

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    wilaya: "",
    password: "",
    confirmPassword: ""
  });

  const [error, setError] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("الكلمات المرورية غير متطابقة");
      return;
    }

    setLoading(true);
    try {
      await AuthService.signUpWithEmail(
        formData.email,
        formData.password,
        formData.fullName,
        formData.phone,
        formData.wilaya
      );
      
      // On success, redirect to login
      setTimeout(() => {
        router.push("/login");
      }, 1500);
      
    } catch (err: any) {
      setError(err.message || "حدث خطأ أثناء التسجيل");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center bg-light-grey px-6 py-12">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl bg-brand-white p-10 shadow-2xl border border-light-blue/20"
      >
        <div className="text-center mb-10">
          <h1 className="text-3xl font-black uppercase tracking-tighter mb-2 font-montserrat">
            BECOME <span className="text-accent-blue">A MEMBER</span>
          </h1>
          <p className="text-dark-grey font-tajawal text-sm uppercase tracking-widest font-bold">
            انضم إلى عائلة NAFAA الآن
          </p>
        </div>

        <form className="grid grid-cols-1 md:grid-cols-2 gap-6" onSubmit={handleRegister}>
          {/* Full Name */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-primary-dark font-montserrat block">
              Full Name
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="الاسم الكامل"
                value={formData.fullName}
                onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                required
                className="w-full bg-light-grey border-none p-4 pl-12 text-sm font-bold font-tajawal focus:ring-2 focus:ring-accent-blue outline-none transition-all"
              />
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-grey" size={18} />
            </div>
          </div>

          {/* Email */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-primary-dark font-montserrat block">
              Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                placeholder="name@example.com"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                required
                className="w-full bg-light-grey border-none p-4 pl-12 text-sm font-bold font-tajawal focus:ring-2 focus:ring-accent-blue outline-none transition-all"
              />
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-grey" size={18} />
            </div>
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-primary-dark font-montserrat block">
              Phone Number
            </label>
            <div className="relative">
              <input
                type="tel"
                placeholder="0XXXXXXXXX"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                required
                className="w-full bg-light-grey border-none p-4 pl-12 text-sm font-bold font-tajawal focus:ring-2 focus:ring-accent-blue outline-none transition-all"
              />
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-grey" size={18} />
            </div>
          </div>

          {/* Wilaya Dropdown */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-primary-dark font-montserrat block">
              Wilaya (الولاية)
            </label>
            <div className="relative">
              <select 
                value={formData.wilaya}
                onChange={(e) => setFormData({...formData, wilaya: e.target.value})}
                required
                className="w-full bg-light-grey border-none p-4 pl-12 text-sm font-bold font-tajawal focus:ring-2 focus:ring-accent-blue outline-none transition-all appearance-none cursor-pointer"
              >
                <option value="">اختر الولاية</option>
                {WILAYAS.map(w => <option key={w} value={w}>{w}</option>)}
              </select>
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-grey" size={18} />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-primary-dark font-montserrat block">
              Password
            </label>
            <div className="relative">
              <input
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                required
                className="w-full bg-light-grey border-none p-4 pl-12 text-sm font-bold font-tajawal focus:ring-2 focus:ring-accent-blue outline-none transition-all"
              />
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-grey" size={18} />
            </div>
          </div>

          {/* Confirm Password */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-primary-dark font-montserrat block">
              Confirm Password
            </label>
            <div className="relative">
              <input
                type="password"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                required
                className="w-full bg-light-grey border-none p-4 pl-12 text-sm font-bold font-tajawal focus:ring-2 focus:ring-accent-blue outline-none transition-all"
              />
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-grey" size={18} />
            </div>
          </div>

          <div className="md:col-span-2 mt-4">
            {error && (
              <div className="md:col-span-2 text-center text-red-500 font-bold font-tajawal text-sm mt-2 mb-2">
                {error}
              </div>
            )}
            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-primary-dark text-brand-white py-4 font-black uppercase tracking-widest text-sm flex items-center justify-center gap-3 hover:bg-accent-blue transition-all duration-300 shadow-lg shadow-primary-dark/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Creating Account..." : "Create Account"}
              {!loading && <UserPlus size={18} />}
            </button>
          </div>
        </form>

        <div className="my-8 flex items-center gap-4">
          <div className="flex-grow h-[1px] bg-light-blue/20"></div>
          <span className="text-[10px] font-black uppercase tracking-widest text-dark-grey font-montserrat">OR</span>
          <div className="flex-grow h-[1px] bg-light-blue/20"></div>
        </div>

        <button 
          onClick={async () => {
            setLoading(true);
            try {
              await AuthService.signInWithGoogle();
              router.push("/");
            } catch (error: any) {
              console.error(error);
              alert(error.message || "فشل التسجيل عبر جوجل. ربما لم تفعل هذا الخيار في إعدادات Firebase.");
            } finally {
              setLoading(false);
            }
          }}
          disabled={loading}
          className="w-full bg-brand-white border border-light-blue/40 text-primary-dark py-4 font-black uppercase tracking-widest text-sm flex items-center justify-center gap-3 hover:bg-light-grey transition-all duration-300"
        >
          <Chrome size={18} />
          Sign Up with Google
        </button>

        <div className="mt-10 text-center border-t border-light-blue/20 pt-8">
          <p className="text-xs text-dark-grey font-tajawal font-bold uppercase tracking-widest">
            Already have an account?{" "}
            <Link href="/login" className="text-accent-blue hover:underline">
              Log In
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
