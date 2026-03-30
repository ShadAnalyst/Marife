import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center text-center px-4">
      <p className="text-7xl font-black text-[#E01F54]">404</p>
      <h1 className="mt-4 text-2xl font-bold text-[#1A1A1A]">Page Not Found</h1>
      <p className="mt-2 text-gray-500 max-w-sm">
        Looks like this page disappeared into another dimension. Let's get you back on track.
      </p>
      <Link
        href="/"
        className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#E01F54] px-7 py-3 text-sm font-bold text-white hover:bg-[#c01a48] transition-colors"
      >
        Back to Home
      </Link>
    </div>
  );
}
