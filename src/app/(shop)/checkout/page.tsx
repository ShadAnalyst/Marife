"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { isDataImageUrl } from "@/lib/imageUpload";
import { useCartStore } from "@/store/useCartStore";
import { formatCHF } from "@/lib/utils";
import { CheckCircleIcon } from "@heroicons/react/24/solid";
import { LockClosedIcon } from "@heroicons/react/24/outline";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";

type Step = 1 | 2 | 3;

const PAYMENT_METHODS = [
  { id: "twint", label: "TWINT", emoji: "🇨🇭", desc: "Swiss mobile payment" },
  { id: "paypal", label: "PayPal", emoji: "💙", desc: "Pay with your PayPal account" },
  { id: "card", label: "Credit / Debit Card", emoji: "💳", desc: "Visa, Mastercard, Amex" },
];

function StepIndicator({ currentStep }: { currentStep: Step }) {
  const steps = ["Shipping", "Payment", "Confirmation"];
  return (
    <div className="flex items-center justify-center gap-0 mb-8">
      {steps.map((label, i) => {
        const step = (i + 1) as Step;
        const isDone = currentStep > step;
        const isCurrent = currentStep === step;
        return (
          <div key={label} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  "h-8 w-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors",
                  isDone
                    ? "bg-[#28A745] text-white"
                    : isCurrent
                    ? "bg-[#E01F54] text-white"
                    : "bg-gray-100 text-gray-400"
                )}
              >
                {isDone ? <CheckCircleIcon className="h-5 w-5" /> : step}
              </div>
              <span
                className={cn(
                  "mt-1 text-xs font-medium",
                  isCurrent ? "text-[#E01F54]" : "text-gray-400"
                )}
              >
                {label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div
                className={cn(
                  "h-px w-16 sm:w-24 mx-1 mb-5 transition-colors",
                  currentStep > step ? "bg-[#28A745]" : "bg-gray-200"
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

export default function CheckoutPage() {
  const { items, totals, clearCart } = useCartStore();
  const router = useRouter();
  const t = totals();
  const [step, setStep] = useState<Step>(1);
  const [orderId] = useState(`MRF-${Date.now().toString(36).toUpperCase()}`);
  const [paymentMethod, setPaymentMethod] = useState("twint");
  const [isProcessing, setIsProcessing] = useState(false);
  const [form, setForm] = useState({
    email: "",
    firstName: "",
    lastName: "",
    street: "",
    zip: "",
    city: "",
    country: "CH",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.email || !form.firstName || !form.street || !form.zip || !form.city) {
      toast.error("Please fill in all required fields");
      return;
    }
    setStep(2);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    // Simulate payment processing
    await new Promise((r) => setTimeout(r, 2000));
    setIsProcessing(false);
    clearCart();
    setStep(3);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-[#F7F7F7]">
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-black tracking-[0.1em] text-[#1A1A1A]">
            MARI<span className="text-[#E01F54]">FE</span>
          </h1>
          <div className="mt-2 flex items-center justify-center gap-1 text-xs text-gray-400">
            <LockClosedIcon className="h-3.5 w-3.5" />
            Secure Checkout
          </div>
        </div>

        <StepIndicator currentStep={step} />

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Main form area */}
          <div className="lg:col-span-3">
            {/* STEP 1: Shipping */}
            {step === 1 && (
              <div className="rounded-xl bg-white p-6 shadow-sm">
                <h2 className="text-lg font-bold text-[#1A1A1A] mb-5">Shipping Information</h2>
                <form onSubmit={handleShippingSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      required
                      placeholder="your@email.ch"
                      className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm focus:border-[#007791] focus:outline-none focus:ring-1 focus:ring-[#007791]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                        First Name *
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        value={form.firstName}
                        onChange={handleChange}
                        required
                        placeholder="Anna"
                        className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm focus:border-[#007791] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                        Last Name *
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        value={form.lastName}
                        onChange={handleChange}
                        required
                        placeholder="Müller"
                        className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm focus:border-[#007791] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                      Street Address *
                    </label>
                    <input
                      type="text"
                      name="street"
                      value={form.street}
                      onChange={handleChange}
                      required
                      placeholder="Bahnhofstrasse 1"
                      className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm focus:border-[#007791] focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                        ZIP Code *
                      </label>
                      <input
                        type="text"
                        name="zip"
                        value={form.zip}
                        onChange={handleChange}
                        required
                        placeholder="8001"
                        className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm focus:border-[#007791] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                        City *
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={form.city}
                        onChange={handleChange}
                        required
                        placeholder="Zürich"
                        className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm focus:border-[#007791] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                      Country
                    </label>
                    <select
                      name="country"
                      value={form.country}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm focus:border-[#007791] focus:outline-none bg-white"
                    >
                      <option value="CH">🇨🇭 Switzerland</option>
                      <option value="DE">🇩🇪 Germany</option>
                      <option value="AT">🇦🇹 Austria</option>
                      <option value="FR">🇫🇷 France</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    className="w-full rounded-full bg-[#E01F54] py-4 text-sm font-bold text-white hover:bg-[#c01a48] transition-colors mt-2"
                  >
                    Continue to Payment →
                  </button>
                </form>
              </div>
            )}

            {/* STEP 2: Payment */}
            {step === 2 && (
              <div className="rounded-xl bg-white p-6 shadow-sm">
                <h2 className="text-lg font-bold text-[#1A1A1A] mb-5">Payment Method</h2>
                <form onSubmit={handlePaymentSubmit} className="space-y-4">
                  <div className="space-y-3">
                    {PAYMENT_METHODS.map((pm) => (
                      <label
                        key={pm.id}
                        className={cn(
                          "flex items-center gap-4 rounded-xl border-2 p-4 cursor-pointer transition-all",
                          paymentMethod === pm.id
                            ? "border-[#E01F54] bg-[#E01F54]/5"
                            : "border-gray-200 hover:border-gray-300"
                        )}
                      >
                        <input
                          type="radio"
                          name="paymentMethod"
                          value={pm.id}
                          checked={paymentMethod === pm.id}
                          onChange={(e) => setPaymentMethod(e.target.value)}
                          className="sr-only"
                        />
                        <span className="text-2xl">{pm.emoji}</span>
                        <div>
                          <p className="font-semibold text-[#1A1A1A] text-sm">{pm.label}</p>
                          <p className="text-xs text-gray-400">{pm.desc}</p>
                        </div>
                        {paymentMethod === pm.id && (
                          <CheckCircleIcon className="ml-auto h-5 w-5 text-[#E01F54]" />
                        )}
                      </label>
                    ))}
                  </div>

                  {paymentMethod === "card" && (
                    <div className="space-y-3 pt-2">
                      <input
                        type="text"
                        placeholder="Card number"
                        className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm focus:border-[#007791] focus:outline-none"
                      />
                      <div className="grid grid-cols-2 gap-3">
                        <input
                          type="text"
                          placeholder="MM / YY"
                          className="rounded-lg border border-gray-200 px-4 py-2.5 text-sm focus:border-[#007791] focus:outline-none"
                        />
                        <input
                          type="text"
                          placeholder="CVC"
                          className="rounded-lg border border-gray-200 px-4 py-2.5 text-sm focus:border-[#007791] focus:outline-none"
                        />
                      </div>
                    </div>
                  )}

                  <div className="flex gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="flex-1 rounded-full border-2 border-gray-200 py-3.5 text-sm font-bold text-[#1A1A1A] hover:border-[#1A1A1A] transition-colors"
                    >
                      ← Back
                    </button>
                    <button
                      type="submit"
                      disabled={isProcessing}
                      className="flex-2 flex-[2] rounded-full bg-[#E01F54] py-3.5 text-sm font-bold text-white hover:bg-[#c01a48] transition-colors disabled:opacity-70"
                    >
                      {isProcessing ? "Processing…" : `Pay ${formatCHF(t.total)}`}
                    </button>
                  </div>

                  <p className="text-center text-xs text-gray-400 flex items-center justify-center gap-1">
                    <LockClosedIcon className="h-3 w-3" />
                    Your payment is secured with 256-bit SSL encryption
                  </p>
                </form>
              </div>
            )}

            {/* STEP 3: Confirmation */}
            {step === 3 && (
              <div className="rounded-xl bg-white p-8 shadow-sm text-center">
                <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-green-100 mb-4">
                  <CheckCircleIcon className="h-10 w-10 text-green-500" />
                </div>
                <h2 className="text-2xl font-black text-[#1A1A1A]">Order Confirmed!</h2>
                <p className="text-gray-500 mt-2 text-sm">
                  Thank you for your order. A confirmation has been sent to{" "}
                  <span className="font-medium">{form.email}</span>.
                </p>
                <div className="mt-5 rounded-xl bg-[#F7F7F7] p-4 text-sm">
                  <p className="text-gray-500">Order ID</p>
                  <p className="text-xl font-bold text-[#1A1A1A] mt-0.5">{orderId}</p>
                </div>
                <div className="mt-4 text-sm text-gray-500 space-y-1">
                  <p>📦 Estimated delivery: 2–4 business days</p>
                  <p>📬 Delivered in discreet packaging</p>
                </div>
                <a
                  href="/"
                  className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#E01F54] px-8 py-3 text-sm font-bold text-white hover:bg-[#c01a48] transition-colors"
                >
                  Continue Shopping
                </a>
              </div>
            )}
          </div>

          {/* Order Summary sidebar */}
          {step < 3 && (
            <div className="lg:col-span-2">
              <div className="rounded-xl bg-white p-5 shadow-sm">
                <h3 className="text-sm font-bold text-[#1A1A1A] mb-4">
                  Your Order ({items.length} {items.length === 1 ? "item" : "items"})
                </h3>
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {items.map((item) => (
                    <div key={item.variantId} className="flex gap-3">
                      <div className="relative h-14 w-12 flex-shrink-0 overflow-hidden rounded-md bg-[#F7F7F7]">
                        <Image
                          src={item.image || "/placeholder-product.jpg"}
                          alt={item.productName}
                          fill
                          className="object-cover"
                          sizes="48px"
                          unoptimized={isDataImageUrl(item.image)}
                        />
                        <span className="absolute -right-1 -top-1 h-4 w-4 rounded-full bg-gray-500 text-[10px] font-bold text-white flex items-center justify-center">
                          {item.quantity}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-[#1A1A1A] line-clamp-1">{item.productName}</p>
                        <p className="text-xs text-gray-400">{item.variantName}</p>
                      </div>
                      <span className="text-xs font-bold text-[#1A1A1A] flex-shrink-0">
                        {formatCHF(item.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 border-t pt-3 space-y-1.5 text-xs text-gray-500">
                  <div className="flex justify-between">
                    <span>Subtotal</span><span>{formatCHF(t.subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>{t.shipping === 0 ? <span className="text-green-600">FREE</span> : formatCHF(t.shipping)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>VAT (8.1%)</span><span>{formatCHF(t.tax)}</span>
                  </div>
                  <div className="flex justify-between border-t pt-2 font-bold text-sm text-[#1A1A1A]">
                    <span>Total</span><span>{formatCHF(t.total)}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
