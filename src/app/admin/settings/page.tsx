export default function SettingsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-[#1A1A1A]">Settings</h2>
        <p className="text-sm text-gray-500 mt-1">Manage store configuration, payments, shipping and notifications.</p>
      </div>

      {/* Store Info */}
      <div className="rounded-xl bg-white shadow-sm border border-gray-100">
        <div className="p-5 border-b">
          <h3 className="font-bold text-[#1A1A1A]">Store Information</h3>
        </div>
        <div className="p-5 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Store Name</label>
              <input
                type="text"
                defaultValue="Marife"
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-[#1A1A1A] focus:border-[#007791] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Contact Email</label>
              <input
                type="email"
                defaultValue="info@marife.ch"
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-[#1A1A1A] focus:border-[#007791] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Currency</label>
              <input
                type="text"
                defaultValue="CHF"
                disabled
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-400 bg-[#F7F7F7] cursor-not-allowed"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Country</label>
              <input
                type="text"
                defaultValue="Switzerland"
                disabled
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-400 bg-[#F7F7F7] cursor-not-allowed"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Shipping */}
      <div className="rounded-xl bg-white shadow-sm border border-gray-100">
        <div className="p-5 border-b">
          <h3 className="font-bold text-[#1A1A1A]">Shipping</h3>
        </div>
        <div className="p-5 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Flat Rate Shipping (CHF)</label>
              <input
                type="number"
                defaultValue="5.00"
                step="0.50"
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-[#1A1A1A] focus:border-[#007791] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Free Shipping Threshold (CHF)</label>
              <input
                type="number"
                defaultValue="75.00"
                step="5"
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-[#1A1A1A] focus:border-[#007791] focus:outline-none"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Tax */}
      <div className="rounded-xl bg-white shadow-sm border border-gray-100">
        <div className="p-5 border-b">
          <h3 className="font-bold text-[#1A1A1A]">Tax</h3>
        </div>
        <div className="p-5">
          <div className="max-w-xs">
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">VAT Rate (%)</label>
            <input
              type="number"
              defaultValue="8.1"
              step="0.1"
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-[#1A1A1A] focus:border-[#007791] focus:outline-none"
            />
            <p className="text-xs text-gray-400 mt-1">Swiss standard VAT rate</p>
          </div>
        </div>
      </div>

      {/* Payments */}
      <div className="rounded-xl bg-white shadow-sm border border-gray-100">
        <div className="p-5 border-b">
          <h3 className="font-bold text-[#1A1A1A]">Payment Methods</h3>
        </div>
        <div className="p-5 space-y-3">
          {["TWINT", "PayPal", "Credit / Debit Card (Stripe)"].map((method) => (
            <div key={method} className="flex items-center justify-between rounded-lg border border-gray-100 px-4 py-3">
              <span className="font-medium text-sm text-[#1A1A1A]">{method}</span>
              <span className="rounded-full bg-green-100 px-2.5 py-0.5 text-[11px] font-semibold text-green-700">Active</span>
            </div>
          ))}
        </div>
      </div>

      {/* Save */}
      <div className="flex justify-end">
        <button className="rounded-full bg-[#E01F54] px-8 py-2.5 text-sm font-semibold text-white hover:bg-[#c01843] transition-colors">
          Save Settings
        </button>
      </div>
    </div>
  );
}
