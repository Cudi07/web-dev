import React from "react";
import Link from "next/link";
import Image from "next/image";

export default function BarangayLandingPage() {
  return (
    <div className="relative h-screen w-full">
      {/* Background Image */}
      <Image
        src="/bglandingpage.jpg"
        alt="Background"
        fill
        priority
        className="object-cover"
        quality={100}
      />

      {/* Content */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center px-4 text-center text-white">
        {/* Logo */}
        <Image
          src="/SAN-AGUSTIN-removebg-preview.png"
          alt="Barangay Logo"
          width={200}
          height={200}
          className="mb-4 rounded-full bg-white p-1 transform transition-transform hover:scale-105"
        />

        {/* Heading */}
        <h1 className="mb-2 text-3xl font-bold [text-shadow:_2px_2px_4px_#000000] md:text-5xl">
          Welcome to Barangay San Agustin
        </h1>
        <p className="mb-6 text-lg [text-shadow:_1px_1px_2px_#000000] md:text-2xl">
          Betis, Guagua, Pampanga, 2003
        </p>

        {/* Buttons */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row">
          <Link href="/admin">
            <button className="rounded-md bg-yellow-400 px-6 py-3 font-semibold text-black shadow-lg transition hover:bg-yellow-500">
              Enter as Admin
            </button>
          </Link>
          <Link href="/homepage">
            <button className="rounded-md bg-yellow-400 px-6 py-3 font-semibold text-black shadow-lg transition hover:bg-yellow-500">
              Enter as Resident
            </button>
          </Link>
        </div>

        {/* Footer Info */}
        <div className="flex items-center gap-6 text-sm text-yellow-300 [text-shadow:_1px_1px_2px_#000000]">
          <span>
            <a href="https://www.google.com/maps/@14.9736618,120.6428594,3a,75y,133.49h,94.68t/data=!3m7!1e1!3m5!1sCXn8PQBl8k5FSdTgc9gRzA!2e0!6shttps:%2F%2Fstreetviewpixels-pa.googleapis.com%2Fv1%2Fthumbnail%3Fcb_client%3Dmaps_sv.tactile%26w%3D900%26h%3D600%26pitch%3D-4.6791617354588055%26panoid%3DCXn8PQBl8k5FSdTgc9gRzA%26yaw%3D133.49189721815077!7i16384!8i8192?entry=ttu&g_ep=EgoyMDI1MDUwNy4wIKXMDSoASAFQAw%3D%3D">
              🏢 Office
            </a>
          </span>
          <span>
            <a href="https://www.google.com/maps/place/San+Agustin,+Guagua,+Pampanga/@14.9679178,120.6409546,1203m/data=!3m1!1e3!4m6!3m5!1s0x339658bfc458adbb:0x3644544b14537b4f!8m2!3d14.9686799!4d120.6357534!16s%2Fg%2F11h1pxzgy!5m1!1e4?entry=ttu&g_ep=EgoyMDI1MDUwNy4wIKXMDSoASAFQAw%3D%3D ">
              📍 Location
            </a>
          </span>
          <span>
            <a href="https://www.facebook.com/profile.php?id=61552794008313">
              📞 Contact
            </a>
          </span>
        </div>
      </div>
    </div>
  );
}
