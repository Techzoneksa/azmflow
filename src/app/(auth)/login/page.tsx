"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff, Lock, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { login } from "@/app/actions/authActions";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("[LOGIN] form submitted");
    setError("");
    if (!username.trim()) {
      console.log("[LOGIN] username empty");
      setError("يرجى إدخال اسم المستخدم");
      return;
    }
    setLoading(true);
    const formData = new FormData();
    formData.set("username", username);
    formData.set("password", password);
    console.log("[LOGIN] calling server action...");
    try {
      const result = await login(formData);
      console.log("[LOGIN] server action returned:", result);
      setLoading(false);
      if (result?.error) {
        setError(result.error);
      }
    } catch (err) {
      console.error("[LOGIN] unexpected client error:", err);
      setLoading(false);
      setError("حدث خطأ غير متوقع في المتصفح.");
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-background overflow-hidden"
      onClick={() => console.log("[LOGIN] page clicked")}
    >
      <div
        className="absolute inset-0"
        style={{
          background: "radial-gradient(ellipse at center, rgba(108,142,245,0.06) 0%, transparent 70%)",
        }}
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative z-10 w-full max-w-[400px]"
      >
        <div className="rounded-2xl border border-border bg-surface p-8 shadow-2xl">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-gradient shadow-lg shadow-primary/30">
              <span className="text-2xl font-bold text-white">ع</span>
            </div>
            <h1 className="font-cairo text-2xl font-bold text-text-primary">
              AZM Flow
            </h1>
            <p className="mt-1 text-sm text-text-secondary">عزم فلو — نظام إدارة التوصيل</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="username">اسم المستخدم</Label>
              <div className="relative">
                <User className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
                <Input
                  id="username"
                  name="username"
                  placeholder="أدخل اسم المستخدم"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="pr-9"
                  dir="rtl"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">كلمة المرور</Label>
              <div className="relative">
                <Lock className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="أدخل كلمة المرور"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pr-9"
                  dir="rtl"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-secondary transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <Checkbox id="remember" label="تذكرني" />
            </div>

            {error && (
              <motion.p
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm text-error"
              >
                {error}
              </motion.p>
            )}

            <motion.div
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <Button
                type="submit"
                className="w-full h-11 text-base font-semibold"
                disabled={loading}
                onClick={() => console.log("[LOGIN] submit button clicked")}
              >
                {loading ? "جاري تسجيل الدخول..." : "تسجيل الدخول"}
              </Button>
            </motion.div>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
