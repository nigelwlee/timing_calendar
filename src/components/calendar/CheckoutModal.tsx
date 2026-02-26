"use client";

import { useState } from "react";
import { cn } from "@/lib/utils/cn";

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function CheckoutModal({ isOpen, onClose, onSuccess }: CheckoutModalProps) {
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");
  const [name, setName] = useState("");
  const [processing, setProcessing] = useState(false);

  function formatCardNumber(value: string) {
    const digits = value.replace(/\D/g, "").slice(0, 16);
    return digits.replace(/(.{4})/g, "$1 ").trim();
  }

  function formatExpiry(value: string) {
    const digits = value.replace(/\D/g, "").slice(0, 4);
    if (digits.length >= 3) {
      return digits.slice(0, 2) + " / " + digits.slice(2);
    }
    return digits;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setProcessing(true);
    // Simulate payment processing
    setTimeout(() => {
      setProcessing(false);
      onSuccess();
    }, 1500);
  }

  const isFormValid =
    cardNumber.replace(/\s/g, "").length === 16 &&
    expiry.replace(/\D/g, "").length === 4 &&
    cvc.length >= 3 &&
    name.trim().length > 0;

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          "fixed inset-0 bg-black/60 z-40 transition-opacity duration-200",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className={cn(
          "fixed z-50 transition-all duration-300 ease-out",
          // Center on screen
          "top-1/2 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-md",
          isOpen
            ? "-translate-y-1/2 opacity-100"
            : "-translate-y-[45%] opacity-0 pointer-events-none"
        )}
      >
        <div className="bg-navy-900 border border-navy-700 rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-6 pt-6 pb-4">
            <div>
              <h3 className="font-[family-name:var(--font-heading)] text-xl text-slate-100">
                Complete Purchase
              </h3>
              <p className="text-sm text-slate-400 mt-1">7-Day Forecast Access</p>
            </div>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-200 transition-colors p-1"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M5 5l10 10M15 5 5 15" />
              </svg>
            </button>
          </div>

          {/* Price summary */}
          <div className="mx-6 mb-5 flex items-center justify-between rounded-lg bg-navy-800/60 px-4 py-3 border border-navy-700/50">
            <span className="text-sm text-slate-300">One-time purchase</span>
            <span className="text-lg font-semibold text-gold-400">$2.99</span>
          </div>

          {/* Card form */}
          <form onSubmit={handleSubmit} className="px-6 pb-6 space-y-4">
            {/* Card number */}
            <div>
              <label className="block text-sm text-slate-400 mb-1.5">Card number</label>
              <input
                type="text"
                placeholder="1234 5678 9012 3456"
                value={cardNumber}
                onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                className="w-full rounded-lg bg-navy-800 border border-navy-600 px-4 py-3 text-base text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-gold-400/60 focus:ring-1 focus:ring-gold-400/30 transition-colors"
              />
            </div>

            {/* Expiry + CVC row */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm text-slate-400 mb-1.5">Expiry</label>
                <input
                  type="text"
                  placeholder="MM / YY"
                  value={expiry}
                  onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                  className="w-full rounded-lg bg-navy-800 border border-navy-600 px-4 py-3 text-base text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-gold-400/60 focus:ring-1 focus:ring-gold-400/30 transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1.5">CVC</label>
                <input
                  type="text"
                  placeholder="123"
                  value={cvc}
                  onChange={(e) => setCvc(e.target.value.replace(/\D/g, "").slice(0, 4))}
                  className="w-full rounded-lg bg-navy-800 border border-navy-600 px-4 py-3 text-base text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-gold-400/60 focus:ring-1 focus:ring-gold-400/30 transition-colors"
                />
              </div>
            </div>

            {/* Cardholder name */}
            <div>
              <label className="block text-sm text-slate-400 mb-1.5">Cardholder name</label>
              <input
                type="text"
                placeholder="Jane Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-lg bg-navy-800 border border-navy-600 px-4 py-3 text-base text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-gold-400/60 focus:ring-1 focus:ring-gold-400/30 transition-colors"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={!isFormValid || processing}
              className={cn(
                "w-full mt-2 py-3 rounded-xl text-base font-semibold transition-colors shadow-lg shadow-gold-400/20",
                isFormValid && !processing
                  ? "bg-gold-400 text-navy-950 hover:bg-gold-300 cursor-pointer"
                  : "bg-navy-700 text-slate-500 cursor-not-allowed"
              )}
            >
              {processing ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Processing…
                </span>
              ) : (
                "Pay $2.99"
              )}
            </button>

            <p className="text-xs text-slate-500 text-center pt-1">
              This is a demo — no real charge will be made.
            </p>
          </form>
        </div>
      </div>
    </>
  );
}
