'use client';

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Footer from "../_components/footer";

export default function InquiryPage() {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (!selectedFile) {
      setError('Please select a file to upload');
      return;
    }

    setIsSubmitting(true);
    try {
      const form = e.currentTarget;
      const formData = new FormData();
      
      // Add all form fields to FormData
      formData.append('file', selectedFile);
      formData.append('fullName', (form.elements.namedItem('fullName') as HTMLInputElement).value);
      formData.append('address', (form.elements.namedItem('address') as HTMLInputElement).value);
      formData.append('documentType', (form.elements.namedItem('documentType') as HTMLSelectElement).value);
      formData.append('phone', (form.elements.namedItem('phone') as HTMLInputElement).value);
      formData.append('email', (form.elements.namedItem('email') as HTMLInputElement).value);
      formData.append('purpose', (form.elements.namedItem('purpose') as HTMLTextAreaElement).value);

      console.log('Submitting form data:', {
        file: selectedFile.name,
        fullName: formData.get('fullName'),
        documentType: formData.get('documentType'),
        purpose: formData.get('purpose')
      });

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      console.log('Server response:', {
        status: response.status,
        ok: response.ok,
        data
      });

      if (!response.ok) {
        throw new Error(data.error || 'Upload failed: ' + response.status);
      }

      console.log('Upload successful:', data);
      setSuccess(true);
      setSelectedFile(null);
      formRef.current?.reset();
      router.refresh();
      
    } catch (error) {
      console.error('Error submitting request:', {
        error,
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      });
      setError(error instanceof Error ? error.message : 'Upload failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
      if (!allowedTypes.includes(file.type)) {
        setError('Please upload a valid file type (JPEG, PNG, or PDF)');
        e.target.value = '';
        return;
      }

      // Validate file size (e.g., max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('File size must be less than 5MB');
        e.target.value = '';
        return;
      }
      setSelectedFile(file);
    }
  };

  return (
    <div className="mt-20 flex-1 pt-32">
      <div className="mx-auto max-w-4xl px-4">
        {/* Title */}
        <h1 className="mb-8 flex items-center justify-center gap-2 text-3xl font-bold text-yellow-400">
          <span>📄</span> Request for Barangay Document
        </h1>

        {/* Instructions Box */}
        <div className="mb-8 rounded-lg bg-gray-700 p-4 text-white">
          <div className="flex items-center gap-2">
            <span>📢</span>
            <h2 className="font-bold">Instructions</h2>
          </div>
          <p className="mt-2">
            Please fill out this form to request official barangay documents.
            Ensure all required fields are filled correctly.
          </p>
        </div>

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
              Request submitted successfully! <br />
              Your request is pending admin verification and will be processed within 1–2 business days.
            </p>
            </div>
        )}

        {/* Form Container */}
        <div className="mb-20 rounded-lg bg-gray-200 p-8">
          <form ref={formRef} className="space-y-6" onSubmit={handleSubmit}>
            <div className="grid gap-6 md:grid-cols-2">
              {/* Full Name */}
              <div>
                <label className="block font-semibold">
                  Full Name<span className="text-red-500">*</span>
                </label>
                <input
                  name="fullName"
                  type="text"
                  required
                  className="mt-1 w-full rounded-md border bg-gray-100 p-2"
                />
              </div>

              {/* Address */}
              <div>
                <label className="block font-semibold">
                  Address<span className="text-red-500">*</span>
                </label>
                <input
                  name="address"
                  type="text"
                  required
                  className="mt-1 w-full rounded-md border bg-gray-100 p-2"
                />
              </div>

              {/* Document Type */}
              <div>
                <label className="block font-semibold">
                  Document Type<span className="text-red-500">*</span>
                </label>
                <select 
                  name="documentType"
                  required
                  className="mt-1 w-full rounded-md border bg-gray-100 p-2"
                >
                  <option value="">Select document type</option>
                  <option value="barangay_clearance">Barangay Clearance</option>
                  <option value="certificate_residency">
                    Certificate of Residency
                  </option>
                  <option value="business_permit">Business Permit</option>
                  <option value="indigency">Certificate of Indigency</option>
                </select>
              </div>

              {/* Phone */}
              <div>
                <label className="block font-semibold">
                  Phone<span className="text-red-500">*</span>
                </label>
                <input
                  name="phone"
                  type="tel"
                  required
                  className="mt-1 w-full rounded-md border bg-gray-100 p-2"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block font-semibold">Email (Optional)</label>
                <input
                  name="email"
                  type="email"
                  className="mt-1 w-full rounded-md border bg-gray-100 p-2"
                />
              </div>

              {/* Upload ID */}
              <div>
                <label className="block font-semibold">
                  Upload Valid ID<span className="text-red-500">*</span>
                </label>
                <div className="mt-1 cursor-pointer rounded-md border-2 border-dashed border-gray-400 p-4 text-center">
                  <label htmlFor="id-upload" className="cursor-pointer">
                    <p>{selectedFile ? selectedFile.name : 'Upload Here'}</p>
                    <input
                      id="id-upload"
                      type="file"
                      required
                      className="hidden"
                      accept="image/*,.pdf"
                      onChange={handleFileChange}
                    />
                  </label>
                </div>
                <p className="mt-1 text-sm text-gray-500">
                  Maximum file size: 5MB. Accepted formats: Images, PDF
                </p>
              </div>
            </div>

            {/* Purpose */}
            <div>
              <label className="block font-semibold">
                Purpose of request<span className="text-red-500">*</span>
              </label>
              <textarea
                name="purpose"
                required
                rows={3}
                className="mt-1 w-full rounded-md border bg-gray-100 p-2"
              ></textarea>
            </div>

            <div className="mt-6 flex justify-center">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`rounded-md px-8 py-3 font-semibold text-black transition
                  ${isSubmitting 
                    ? 'bg-yellow-300 cursor-not-allowed' 
                    : 'bg-yellow-400 hover:bg-yellow-500'
                  }`}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Request'}
              </button>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
}
