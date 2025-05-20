import Image from "next/image";
import { Home, Users, Shield, HelpCircle, MapPin } from "lucide-react";

export function SideBar() {
  // Adjust top-32 and h-[calc(100vh-8rem)] to match the combined height of your header and nav bars
  return (
    <aside className="fixed top-41 left-0 z-50 h-[calc(100vh-8rem)] w-64 bg-gradient-to-b from-amber-600 via-yellow-400 to-amber-200 shadow-xl flex flex-col items-center py-8 px-4 border-t-4 border-amber-700">
      {/* Logo */}
      <div className="mb-6 flex flex-col items-center">
        <Image
          src="/SAN-AGUSTIN-removebg-preview.png"
          alt="Barangay Logo"
          width={64}
          height={64}
          className="rounded-full bg-white p-1 shadow-md"
        />
        <h2 className="mt-3 text-xl font-extrabold text-gray-900 tracking-wide drop-shadow">San Agustin</h2>
      </div>
      <nav className="flex flex-col gap-2 w-full">
        <a href="#" className="flex items-center gap-3 rounded-lg px-4 py-3 font-medium text-gray-900 bg-white/80 hover:bg-amber-100 transition shadow">
          <Home className="w-5 h-5 text-amber-600" />
          About Us
        </a>
        <a href="#Barangay-Officials" className="flex items-center gap-3 rounded-lg px-4 py-3 font-medium text-gray-900 bg-white/80 hover:bg-amber-100 transition shadow">
          <Users className="w-5 h-5 text-amber-600" />
          Barangay Officials
        </a>
        <a href="#Privacy-Policy" className="flex items-center gap-3 rounded-lg px-4 py-3 font-medium text-gray-900 bg-white/80 hover:bg-amber-100 transition shadow">
          <Shield className="w-5 h-5 text-amber-600" />
          Privacy Policy
        </a>
        <a href="#FAQs" className="flex items-center gap-3 rounded-lg px-4 py-3 font-medium text-gray-900 bg-white/80 hover:bg-amber-100 transition shadow">
          <HelpCircle className="w-5 h-5 text-amber-600" />
          FAQs
        </a>
        <a href="#Our-Location" className="flex items-center gap-3 rounded-lg px-4 py-3 font-medium text-gray-900 bg-white/80 hover:bg-amber-100 transition shadow">
          <MapPin className="w-5 h-5 text-amber-600" />
          Our Location
        </a>
      </nav>
    </aside>
  );
}
