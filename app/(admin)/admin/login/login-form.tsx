"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Lock, Mail, Store } from "lucide-react";
import toast from "react-hot-toast";
import { adminLogin } from "@/lib/admin-api";
import { SITE_NAME } from "@/lib/constants";

export function AdminLoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Email and password are required");
      return;
    }
    setLoading(true);
    try {
      const res = await adminLogin(email, password);
      if (res.success) {
        toast.success("Welcome back!");
        router.push("/admin");
        router.refresh();
      } else {
        toast.error(res.error ?? "Login failed");
      }
    } catch {
      toast.error("Network error — please try again");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-sm">
      {/* Logo */}
      <div className="mb-8 flex flex-col items-center gap-3">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-neutral-900 text-white shadow-lg">
          <Store size={26} />
        </div>
        <div className="text-center">
          <h1 className="text-2xl font-bold text-neutral-900">{SITE_NAME}</h1>
          <p className="mt-1 text-sm text-neutral-500">Sign in to the Admin Panel</p>
        </div>
      </div>

      {/* Card */}
      <form
        onSubmit={handleSubmit}
        className="rounded-2xl border border-neutral-100 bg-white p-8 shadow-sm"
      >
        <div className="flex flex-col gap-5">
          {/* Email */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-neutral-700">Email Address</label>
            <div className="relative">
              <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                autoComplete="email"
                required
                className="w-full rounded-lg border border-neutral-200 py-2.5 pl-9 pr-3 text-sm outline-none transition-colors focus:border-neutral-400 focus:ring-2 focus:ring-neutral-100"
              />
            </div>
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-neutral-700">Password</label>
            <div className="relative">
              <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
                required
                className="w-full rounded-lg border border-neutral-200 py-2.5 pl-9 pr-3 text-sm outline-none transition-colors focus:border-neutral-400 focus:ring-2 focus:ring-neutral-100"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex items-center justify-center gap-2 rounded-xl bg-neutral-900 py-3 text-sm font-semibold text-white transition-colors hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading && <Loader2 size={15} className="animate-spin" />}
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </div>
      </form>

      <p className="mt-4 text-center text-xs text-neutral-400">
        Restricted to admin users only
      </p>
    </div>
  );
}
