'use client';

import { useState } from "react";
import Image from "next/image";
import Footer from "../_components/footer";

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setIsSubmitting(true);

    try {
      const form = e.currentTarget;
      const formData = {
        fullName: (form.elements.namedItem('name') as HTMLInputElement).value,
        email: (form.elements.namedItem('email') as HTMLInputElement).value,
        phone: (form.elements.namedItem('phone') as HTMLInputElement)?.value || null,
        message: (form.elements.namedItem('message') as HTMLTextAreaElement).value,
        address: 'Contact Form Submission', // Required field for the database
        requestType: 'contact', // Ensure contact requests are labeled correctly
      };

      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit contact form');
      }

      setSuccess(true);
      form.reset();
    } catch (error) {
      console.error('Error submitting contact form:', error);
      setError(error instanceof Error ? error.message : 'Failed to submit contact form. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-gray-100 pt-32">
      {/* Header Banner */}
      <div className="relative h-[300px] w-full">
        <div className="absolute inset-0 bg-gradient-to-r from-amber-600 to-amber-800"></div>
        <div className="relative z-10 flex h-full flex-col items-center justify-center text-white">
          <h1 className="text-5xl font-bold">Contact Us</h1>
          <p className="mt-4 text-xl">
            We're here to help and answer any questions you might have
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 px-4 py-12">
        <div className="mx-auto grid max-w-7xl gap-12 md:grid-cols-2">
          {/* Contact Form */}
          <div>
            <h2 className="mb-6 text-2xl font-bold text-gray-800">
              Send us a Message
            </h2>

            {/* Error Message */}
            {error && (
              <div className="mb-4 rounded-lg bg-red-100 p-4 text-red-700">
                <p className="flex items-center gap-2">
                  <span>⚠️</span>
                  {error}
                </p>
              </div>
            )}

            {/* Success Message */}
            {success && (
              <div className="mb-4 rounded-lg bg-green-100 p-4 text-green-700">
                <p className="flex items-center gap-2">
                  <span>✅</span>
                  Message sent successfully! We'll get back to you soon.
                </p>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label
                  htmlFor="name"
                  className="mb-2 block text-sm font-medium text-gray-600"
                >
                  Full Name<span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  className="w-full rounded-md border border-gray-300 p-3"
                  placeholder="Juan Dela Cruz"
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium text-gray-600"
                >
                  Email Address<span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  className="w-full rounded-md border border-gray-300 p-3"
                  placeholder="juan@example.com"
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="phone"
                  className="mb-2 block text-sm font-medium text-gray-600"
                >
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  className="w-full rounded-md border border-gray-300 p-3"
                  placeholder="(123) 456-7890"
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="message"
                  className="mb-2 block text-sm font-medium text-gray-600"
                >
                  Message<span className="text-red-500">*</span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={6}
                  required
                  className="w-full rounded-md border border-gray-300 p-3"
                  placeholder="Your message here..."
                ></textarea>
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full rounded-md px-6 py-3 text-white transition
                  ${isSubmitting 
                    ? 'bg-amber-400 cursor-not-allowed' 
                    : 'bg-amber-600 hover:bg-amber-700'
                  }`}
              >
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>

          {/* Contact Information */}
          <div>
            <div className="rounded-lg bg-white p-8 shadow-md">
              <h3 className="mb-4 text-xl font-bold text-gray-800">
                Office Information
              </h3>
              <div className="space-y-4 text-gray-600">
                <p className="flex items-center gap-3">
                  <span className="text-xl">📍</span>
                  Barangay Hall, San Agustin, City of San Fernando, Pampanga
                </p>
                <p className="flex items-center gap-3">
                  <span className="text-xl">📞</span>
                  (045) 123-4567
                </p>
                <p className="flex items-center gap-3">
                  <span className="text-xl">✉️</span>
                  brgysanagustin@gmail.com
                </p>
                <p className="flex items-center gap-3">
                  <span className="text-xl">⏰</span>
                  Monday to Friday, 8:00 AM - 5:00 PM
                </p>
              </div>
            </div>

            {/* Map */}
            <div className="mt-8 rounded-lg bg-white p-8 shadow-md">
              <h3 className="mb-4 text-xl font-bold text-gray-800">
                Location Map
              </h3>
              <div className="relative h-[300px] w-full overflow-hidden rounded-lg">
                <Image
                  src="/MAP.png"
                  alt="Barangay Location Map"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
