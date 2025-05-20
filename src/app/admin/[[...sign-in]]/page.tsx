import Image from "next/image";
import { SignIn } from "@clerk/nextjs";
import Link from "next/link";

export default function AdminPage() {
  return (
    <div className="relative min-h-screen w-full">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
    
        <Image
          src="/bglandingpage.jpg"
          alt="Background"
          fill
          className="object-cover brightness-50"
          priority
        />
      
      </div>

      {/* Content */}
      <div className="relative flex min-h-screen flex-col items-center justify-center px-4">
        {/* Logo */}
        <div className="mb-8 transform transition-transform hover:scale-105">
          <Link href="/">
          <Image
            src="/SAN-AGUSTIN-removebg-preview.png"
            alt="Barangay Logo"
            width={150}
            height={150}
            className="rounded-full bg-white/90 p-2 shadow-lg"
          />
          </Link>
        </div>

        {/* Welcome Text */}
        <Link href="/">
        <h1 className="mb-2 text-center text-4xl font-bold text-white drop-shadow-lg">
          Welcome to Barangay San Agustin
        </h1>
        <p className="mb-12 text-center text-2xl text-white/90 drop-shadow">
          Betis, Guagua, Pampanga, 2003
        </p>
        </Link>

        {/* Clerk Sign In Component */}
        <div className="flex w-full max-w-[400px] flex-col items-center overflow-hidden rounded-xl bg-yellow-400/95 shadow-2xl backdrop-blur-sm transition-all">
          <div className="w-full p-8">
            <h2 className="mb-6 text-center text-2xl font-bold text-black/90">
              Log In as Admin
            </h2>
            <div className="flex w-full justify-center">
              <SignIn afterSignInUrl="/dashboard" appearance={{
                elements: {
                  formButtonPrimary: 
                    "bg-yellow-400 hover:bg-yellow-500 text-black border border-black w-full mt-4 rounded-lg py-3 font-semibold transition-colors duration-200 shadow-md hover:shadow-lg",
                  card: "bg-transparent shadow-none w-full",
                  headerTitle: "hidden",
                  headerSubtitle: "hidden",
                  socialButtonsBlockButton: "hidden",
                  dividerLine: "hidden",
                  dividerText: "hidden",
                  formFieldInput: 
                    "bg-white text-black border-gray-300 w-full p-3 rounded-lg shadow-inner transition-all duration-200 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-400/50",
                  formFieldLabel: 
                    "text-black/80 mb-2 font-medium",
                  footerActionLink: 
                    "text-black/70 hover:text-yellow-700 transition-colors duration-200",
                  rootBox: "w-full",
                  formFieldInputShowPasswordButton: "text-black/70 hover:text-black transition-colors duration-200",
                  footer: "w-full text-center mt-6",
                  formField: "mb-4",
                  form: "p-6 bg-white/95 rounded-xl shadow-inner"
                },
                layout: {
                  showOptionalFields: false,
                  socialButtonsPlacement: "bottom"
                }
              }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 