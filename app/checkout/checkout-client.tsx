"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ShieldCheck, Truck, CreditCard, Banknote, ChevronRight, CheckCircle, MapPin } from "lucide-react";
import { useCartStore } from "@/store/cart.store";
import { useAuthStore } from "@/store/auth.store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { formatPrice } from "@/lib/utils";
import toast from "react-hot-toast";

const addressSchema = z.object({
  fullName: z.string().min(2, "Full name required"),
  phone: z.string().min(10, "Valid phone number required"),
  addressLine1: z.string().min(5, "Address required"),
  addressLine2: z.string().optional(),
  city: z.string().min(2, "City required"),
  state: z.string().min(2, "Province required"),
  postalCode: z.string().min(4, "Postal code required"),
});

type AddressForm = z.infer<typeof addressSchema>;

type Step = "address" | "payment" | "confirm";

export function CheckoutClient() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [step, setStep] = useState<Step>("address");
  const [paymentMethod, setPaymentMethod] = useState<"STRIPE" | "COD">("COD");
  const [isPlacing, setIsPlacing] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState<string | null>(null);
  const [couponInput, setCouponInput] = useState("");
  const [couponLoading, setCouponLoading] = useState(false);
  const [savedAddresses, setSavedAddresses] = useState<Array<{
    id: string; fullName: string; phone: string; addressLine1: string;
    addressLine2?: string | null; city: string; state: string; postalCode: string; isDefault: boolean;
  }>>([]);

  const { items, subtotal, shipping, tax, total, discount, couponCode, clearCart, applyCoupon, removeCoupon } = useCartStore();
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);

  useEffect(() => setMounted(true), []);

  // Fetch saved addresses to auto-fill
  useEffect(() => {
    if (!mounted) return;
    fetch("/api/user/addresses", { credentials: "include" })
      .then((r) => r.json())
      .then((data) => {
        if (data.success && data.data?.length > 0) {
          setSavedAddresses(data.data);
          // Auto-fill default address
          const def = data.data.find((a: { isDefault: boolean }) => a.isDefault) ?? data.data[0];
          if (def) {
            setValue("fullName", def.fullName);
            setValue("phone", def.phone);
            setValue("addressLine1", def.addressLine1);
            setValue("addressLine2", def.addressLine2 ?? "");
            setValue("city", def.city);
            setValue("state", def.state);
            setValue("postalCode", def.postalCode);
          }
        }
      })
      .catch(() => { /* silent */ });
  }, [mounted]);  // eslint-disable-line react-hooks/exhaustive-deps

  const safeItems = mounted ? items : [];
  const sub = mounted ? subtotal() : 0;
  const shippingCost = mounted ? shipping() : 0;
  const taxAmount = mounted ? tax() : 0;
  const discountAmount = mounted ? discount : 0;
  const creditsDiscount = 0; // Credits system available after account setup
  const finalTotal = mounted ? Math.max(0, total() - creditsDiscount) : 0;

  const { register, handleSubmit, formState: { errors }, getValues, setValue } = useForm<AddressForm>({
    resolver: zodResolver(addressSchema),
  });

  const onAddressSubmit = () => setStep("payment");

  const handleApplyCoupon = async () => {
    if (!couponInput.trim()) return;
    setCouponLoading(true);
    try {
      const res = await fetch("/api/coupons/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: couponInput.trim(), cartTotal: sub }),
      });
      const data = await res.json();
      if (data.success) {
        applyCoupon(data.data.code, data.data.discountAmount);
        toast.success(data.message ?? "Coupon applied!");
        setCouponInput("");
      } else {
        toast.error(data.error ?? "Invalid coupon");
      }
    } catch {
      toast.error("Failed to apply coupon");
    } finally {
      setCouponLoading(false);
    }
  };

  const handlePlaceOrder = async () => {
    setIsPlacing(true);
    try {
      const address = getValues();
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          items: safeItems.map((i) => ({
            productId: i.product.id,
            quantity: i.quantity,
            price: i.price,
            size: i.size,
            color: i.color,
          })),
          shippingAddress: address,
          billingAddress: address,
          paymentMethod,
          couponCode,
          creditsUsed: creditsDiscount,
          subtotal: sub,
          discount: discountAmount + creditsDiscount,
          shipping: shippingCost,
          tax: taxAmount,
          total: finalTotal,
        }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error);
      clearCart();
      setOrderPlaced(data.data.orderNumber);
      setStep("confirm");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to place order");
    } finally {
      setIsPlacing(false);
    }
  };

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-neutral-900 border-t-transparent" />
      </div>
    );
  }

  // Order confirmed screen
  if (step === "confirm" && orderPlaced) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center space-y-6">
          <div className="flex justify-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-neutral-900">Order Placed!</h1>
            <p className="mt-2 text-neutral-500">
              Your order <span className="font-semibold text-neutral-900">{orderPlaced}</span> has been confirmed.
            </p>
          </div>
          <div className="rounded-xl bg-white border border-neutral-100 p-5 text-left space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-neutral-500">Payment</span>
              <span className="font-medium">{paymentMethod === "COD" ? "Cash on Delivery" : "Card"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-500">Total Paid</span>
              <span className="font-bold text-neutral-900">{formatPrice(finalTotal)}</span>
            </div>
          </div>
          <div className="flex gap-3">
            <Link href="/dashboard" className="flex-1">
              <Button variant="outline" className="w-full">Track Order</Button>
            </Link>
            <Link href="/products" className="flex-1">
              <Button className="w-full">Continue Shopping</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (safeItems.length === 0 && step !== "confirm") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-lg font-medium text-neutral-900">Your cart is empty</p>
        <Link href="/products"><Button>Shop Now</Button></Link>
      </div>
    );
  }

  const steps: { id: Step; label: string }[] = [
    { id: "address", label: "Address" },
    { id: "payment", label: "Payment" },
    { id: "confirm", label: "Confirm" },
  ];
  const stepIndex = steps.findIndex((s) => s.id === step);

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <div className="bg-white border-b border-neutral-100 py-5">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-xl font-black tracking-widest text-neutral-900">
              MARQET
            </Link>
            {/* Step indicator */}
            <div className="flex items-center gap-2">
              {steps.map((s, i) => (
                <div key={s.id} className="flex items-center gap-2">
                  <div className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold transition-colors ${
                    i < stepIndex ? "bg-green-500 text-white"
                    : i === stepIndex ? "bg-neutral-900 text-white"
                    : "bg-neutral-200 text-neutral-500"
                  }`}>
                    {i < stepIndex ? "✓" : i + 1}
                  </div>
                  <span className={`text-xs font-medium hidden sm:block ${i === stepIndex ? "text-neutral-900" : "text-neutral-400"}`}>
                    {s.label}
                  </span>
                  {i < steps.length - 1 && <ChevronRight className="h-3.5 w-3.5 text-neutral-300" />}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
          {/* Left — form */}
          <div className="lg:col-span-3 space-y-6">
            {/* Address step */}
            {step === "address" && (
              <form onSubmit={handleSubmit(onAddressSubmit)} className="space-y-5">
                <div className="rounded-2xl bg-white border border-neutral-100 p-6">
                  <h2 className="text-lg font-semibold text-neutral-900 mb-5 flex items-center gap-2">
                    <Truck className="h-5 w-5 text-amber-500" />
                    Shipping Address
                  </h2>

                  {/* Saved addresses quick-select */}
                  {savedAddresses.length > 0 && (
                    <div className="mb-5">
                      <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wide mb-2">
                        <MapPin className="inline h-3.5 w-3.5 mr-1" />
                        Saved Addresses
                      </p>
                      <div className="flex flex-col gap-2">
                        {savedAddresses.map((addr) => (
                          <button
                            key={addr.id}
                            type="button"
                            onClick={() => {
                              setValue("fullName", addr.fullName);
                              setValue("phone", addr.phone);
                              setValue("addressLine1", addr.addressLine1);
                              setValue("addressLine2", addr.addressLine2 ?? "");
                              setValue("city", addr.city);
                              setValue("state", addr.state);
                              setValue("postalCode", addr.postalCode);
                              toast.success("Address filled in");
                            }}
                            className="flex items-start gap-3 rounded-xl border border-neutral-200 p-3 text-left hover:border-amber-400 hover:bg-amber-50 transition-all"
                          >
                            <MapPin className="h-4 w-4 text-amber-500 flex-shrink-0 mt-0.5" />
                            <div className="min-w-0">
                              <p className="text-sm font-medium text-neutral-900">
                                {addr.fullName}
                                {addr.isDefault && <span className="ml-2 text-xs text-green-600 font-normal">Default</span>}
                              </p>
                              <p className="text-xs text-neutral-500 truncate">
                                {addr.addressLine1}, {addr.city}, {addr.state}
                              </p>
                            </div>
                          </button>
                        ))}
                      </div>
                      <p className="text-xs text-neutral-400 mt-2">Or fill manually below:</p>
                      <Separator className="mt-3 mb-4" />
                    </div>
                  )}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input label="Full Name" error={errors.fullName?.message} {...register("fullName")} placeholder="Muhammad Ali" />
                    <Input label="Phone" error={errors.phone?.message} {...register("phone")} placeholder="+92 300 1234567" />
                    <div className="sm:col-span-2">
                      <Input label="Address Line 1" error={errors.addressLine1?.message} {...register("addressLine1")} placeholder="House #, Street, Area" />
                    </div>
                    <div className="sm:col-span-2">
                      <Input label="Address Line 2 (optional)" {...register("addressLine2")} placeholder="Apartment, floor, etc." />
                    </div>
                    <Input label="City" error={errors.city?.message} {...register("city")} placeholder="Lahore" />
                    <Input label="Province" error={errors.state?.message} {...register("state")} placeholder="Punjab" />
                    <Input label="Postal Code" error={errors.postalCode?.message} {...register("postalCode")} placeholder="54000" />
                  </div>
                </div>
                <Button type="submit" size="lg" className="w-full">
                  Continue to Payment
                </Button>
              </form>
            )}

            {/* Payment step */}
            {step === "payment" && (
              <div className="space-y-5">
                <div className="rounded-2xl bg-white border border-neutral-100 p-6">
                  <h2 className="text-lg font-semibold text-neutral-900 mb-5 flex items-center gap-2">
                    <CreditCard className="h-5 w-5 text-amber-500" />
                    Payment Method
                  </h2>
                  <div className="space-y-3">
                    {[
                      { id: "COD", label: "Cash on Delivery", sub: "Pay when your order arrives", icon: Banknote },
                      { id: "STRIPE", label: "Credit / Debit Card", sub: "Visa, Mastercard, JazzCash", icon: CreditCard },
                    ].map((method) => (
                      <label
                        key={method.id}
                        className={`flex items-center gap-4 rounded-xl border-2 p-4 cursor-pointer transition-all ${
                          paymentMethod === method.id
                            ? "border-neutral-900 bg-neutral-50"
                            : "border-neutral-200 hover:border-neutral-300"
                        }`}
                      >
                        <input
                          type="radio"
                          name="payment"
                          value={method.id}
                          checked={paymentMethod === method.id}
                          onChange={() => setPaymentMethod(method.id as "STRIPE" | "COD")}
                          className="accent-neutral-900"
                        />
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-neutral-100">
                          <method.icon className="h-5 w-5 text-neutral-700" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-neutral-900">{method.label}</p>
                          <p className="text-xs text-neutral-500">{method.sub}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Credits */}
                {/* Credits redemption available in future update */}

                <div className="flex gap-3">
                  <Button variant="outline" onClick={() => setStep("address")} className="flex-1">
                    Back
                  </Button>
                  <Button onClick={handlePlaceOrder} isLoading={isPlacing} className="flex-1" size="lg">
                    {paymentMethod === "COD" ? "Place Order" : "Pay Now"}
                  </Button>
                </div>

                <div className="flex items-center justify-center gap-2 text-xs text-neutral-400">
                  <ShieldCheck className="h-4 w-4 text-green-500" />
                  Secured by 256-bit SSL encryption
                </div>
              </div>
            )}
          </div>

          {/* Right — order summary */}
          <div className="lg:col-span-2">
            <div className="sticky top-24 rounded-2xl bg-white border border-neutral-100 overflow-hidden">
              <div className="px-5 py-4 border-b border-neutral-50">
                <h3 className="font-semibold text-neutral-900">
                  Order Summary ({safeItems.length} items)
                </h3>
              </div>

              {/* Items */}
              <div className="max-h-60 overflow-y-auto divide-y divide-neutral-50">
                {safeItems.map((item) => (
                  <div key={item.id} className="flex items-center gap-3 px-5 py-3">
                    <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-lg bg-neutral-100">
                      {item.product.images[0] && (
                        <Image src={item.product.images[0].url} alt={item.product.name} fill className="object-cover" sizes="48px" />
                      )}
                      <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-neutral-900 text-[9px] font-bold text-white">
                        {item.quantity}
                      </span>
                    </div>
                    <p className="flex-1 text-xs text-neutral-700 line-clamp-2">{item.product.name}</p>
                    <p className="text-xs font-semibold text-neutral-900 flex-shrink-0">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                  </div>
                ))}
              </div>

              {/* Coupon input */}
              <div className="px-5 pb-4 border-t border-neutral-50">
                <p className="text-xs font-semibold text-neutral-600 mb-2 mt-3">Have a coupon?</p>
                {couponCode ? (
                  <div className="flex items-center justify-between rounded-lg bg-green-50 border border-green-200 px-3 py-2">
                    <span className="text-sm font-semibold text-green-700 font-mono">{couponCode}</span>
                    <button onClick={removeCoupon} className="text-xs text-red-500 hover:text-red-700">Remove</button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                      onKeyDown={(e) => e.key === "Enter" && handleApplyCoupon()}
                      placeholder="Enter code"
                      className="flex-1 rounded-lg border border-neutral-200 px-3 py-2 text-sm font-mono uppercase outline-none focus:border-neutral-400"
                    />
                    <Button size="sm" variant="outline" onClick={handleApplyCoupon} isLoading={couponLoading} className="flex-shrink-0">
                      Apply
                    </Button>
                  </div>
                )}
              </div>

              {/* Totals */}
              <div className="px-5 py-4 space-y-2 border-t border-neutral-50 text-sm">
                <div className="flex justify-between text-neutral-600">
                  <span>Subtotal</span><span>{formatPrice(sub)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Coupon ({couponCode})</span><span>-{formatPrice(discountAmount)}</span>
                  </div>
                )}
                {creditsDiscount > 0 && (
                  <div className="flex justify-between text-amber-600">
                    <span>Credits</span><span>-{formatPrice(creditsDiscount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-neutral-600">
                  <span>Shipping</span>
                  <span>{shippingCost === 0 ? <span className="text-green-600">Free</span> : formatPrice(shippingCost)}</span>
                </div>
                <div className="flex justify-between text-neutral-600">
                  <span>Tax (17%)</span><span>{formatPrice(taxAmount)}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-bold text-base text-neutral-900">
                  <span>Total</span><span>{formatPrice(finalTotal)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
