import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import Image from "next/image";

export default function AdminNav() {
  return (
    <nav className="fixed top-0 right-0 left-0 z-50 mb-15 flex items-center justify-between bg-gray-900 p-4 text-white">
      <div className="flex items-center gap-6">
        <img
          src="/SAN-AGUSTIN-removebg-preview.png"
          alt="Logo"
          className="h-12 w-12 rounded-full bg-white p-1"
        />
        <h1 className="text-xl font-bold">Barangay San Agustin - Admin</h1>
      </div>
      <div className="flex items-center gap-6">
        <Link 
          href="/dashboard" 
          className="hover:text-yellow-400 transition-colors"
        >
          Dashboard
        </Link>
        <Link 
          href="/admin/requests" 
          className="hover:text-yellow-400 transition-colors"
        >
          Requests
        </Link>
        <Link 
          href="/admin/announcements" 
          className="hover:text-yellow-400 transition-colors"
        >
          Announcements
        </Link>
        <Link 
          href="/documents" 
          className="hover:text-yellow-400 transition-colors"
        >
          Documents
        </Link>
        <UserButton afterSignOutUrl="/admin" />
      </div>
    </nav>
  );
} 