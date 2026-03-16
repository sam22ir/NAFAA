"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Mail, Lock, Chrome, ArrowRight, UserPlus } from "lucide-react";
import { AuthService } from "@/lib/services/auth-service";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    setLoading(true);
    try {
      await AuthService.signInWithEmail(email, password);
      router.push("/");
    } catch (error: any) {
      console.error("Login error:", error);
      alert(error.message || "Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      await AuthService.signInWithGoogle();
      router.push("/");
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-light-grey px-6 py-12">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-brand-white p-10 shadow-2xl border border-light-blue/20"
      >
        <div className="text-center mb-10">
          <h1 className="text-3xl font-black uppercase tracking-tighter mb-2 font-montserrat">
            NAFAA <span className="text-accent-blue">LOGIN</span>
          </h1>
          <p className="text-dark-grey font-tajawal text-sm uppercase tracking-widest font-bold">
            تسجيل الدخول إلى حسابك
          </p>
        </div>

        <form className="space-y-6" onSubmit={handleSignIn}>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-primary-dark font-montserrat block">
              Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full bg-light-grey border-none p-4 pl-12 text-sm font-bold font-tajawal focus:ring-2 focus:ring-accent-blue outline-none transition-all"
              />
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-grey" size={18} />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-[10px] font-black uppercase tracking-widest text-primary-dark font-montserrat">
                Password
              </label>
              <Link href="/forgot-password" className="text-[10px] font-black uppercase tracking-widest text-accent-blue hover:underline font-montserrat">
                Forgot?
              </Link>
            </div>
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-light-grey border-none p-4 pl-12 text-sm font-bold font-tajawal focus:ring-2 focus:ring-accent-blue outline-none transition-all"
              />
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-grey" size={18} />
            </div>
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-primary-dark text-brand-white py-4 font-black uppercase tracking-widest text-sm flex items-center justify-center gap-3 hover:bg-accent-blue transition-all duration-300 shadow-lg shadow-primary-dark/20 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Signing In..." : "Sign In"}
            {!loading && <ArrowRight size={18} />}
          </button>
        </form>

        <div className="my-8 flex items-center gap-4">
          <div className="flex-grow h-[1px] bg-light-blue/20"></div>
          <span className="text-[10px] font-black uppercase tracking-widest text-dark-grey font-montserrat">OR</span>
          <div className="flex-grow h-[1px] bg-light-blue/20"></div>
        </div>

        <button 
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="w-full bg-brand-white border border-light-blue/40 text-primary-dark py-4 font-black uppercase tracking-widest text-sm flex items-center justify-center gap-3 hover:bg-light-grey transition-all duration-300"
        >
          <Chrome size={18} />
          Sign In with Google
        </button>

        <div className="mt-10 text-center">
          <p className="text-xs text-dark-grey font-tajawal font-bold uppercase tracking-widest">
            Don't have an account?{" "}
            <Link href="/register" className="text-accent-blue hover:underline">
              Sign Up
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
