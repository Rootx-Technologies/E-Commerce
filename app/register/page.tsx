import type { Metadata } from "next";
import { Suspense } from "react";
import { RegisterForm } from "./register-form";

export const metadata: Metadata = {
  title: "Create Account",
  description: "Create your account to start shopping",
};

export default function RegisterPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 bg-neutral-50">
      <Suspense fallback={
        <div className="w-full max-w-md animate-pulse">
          <div className="h-8 w-32 bg-neutral-200 rounded mx-auto mb-8" />
          <div className="rounded-2xl border border-neutral-100 bg-white p-8 space-y-4">
            <div className="h-10 bg-neutral-100 rounded-xl" />
            <div className="h-10 bg-neutral-100 rounded-xl" />
            <div className="h-10 bg-neutral-100 rounded-xl" />
            <div className="h-10 bg-neutral-100 rounded-xl" />
            <div className="h-12 bg-neutral-200 rounded-xl" />
          </div>
        </div>
      }>
        <RegisterForm />
      </Suspense>
    </div>
  );
}
