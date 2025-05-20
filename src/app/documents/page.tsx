'use client';

import { useAuth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import AdminNav from "~/app/_components/AdminNav";
import { QuickUploadForm } from "~/app/_components/QuickUploadForm";
import { useEffect, useState } from "react";
import { toast } from "sonner";

// Types
type Document = {
  id: string;
  documentType: string;
  purpose: string | null;
  fileData: string;
  createdAt: Date;
};

export default function DocumentsPage() {
  const { userId, isLoaded } = useAuth();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  
  const fetchDocuments = async () => {
    try {
      const response = await fetch('/api/documents', {
        headers: {
          'Cache-Control': 'no-cache'
        }
      });
      if (!response.ok) {
        throw new Error('Failed to fetch documents');
      }
      const data = await response.json();
      setDocuments(data);
    } catch (error) {
      console.error('Failed to fetch documents:', error);
      toast.error('Failed to fetch documents');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isLoaded) return;
    
    if (!userId) {
      redirect("/sign-in");
    }

    fetchDocuments();
  }, [userId, isLoaded]);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this document?')) {
      return;
    }

    try {
      const response = await fetch(`/api/documents/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete document');
      }

      toast.success('Document deleted successfully');
      fetchDocuments(); // Refresh the list
    } catch (error) {
      console.error('Error deleting document:', error);
      toast.error('Failed to delete document');
    }
  };

  const handleUploadSuccess = () => {
    toast.success('Document uploaded successfully');
    fetchDocuments(); // Refresh the document list
  };

  if (!isLoaded || loading) {
    return <div>Loading...</div>;
  }

  return (
    <main className="mx-6 mt-30 md:mx-20 lg:mx-40">
      <AdminNav />

      {/* Document List Section */}
      <section className="mt-20 mb-10">
        <h2 className="mb-6 text-center text-3xl font-bold text-amber-600">
          📂 Document List
        </h2>
        <div className="mx-auto w-full max-w-5xl rounded-lg bg-gray-100 p-8 shadow-md">
          {documents.length === 0 ? (
            <>
              <p className="text-gray-600">📄 No documents uploaded yet.</p>
              <p className="text-gray-600">
                Upload new files to make them available for residents.
              </p>
            </>
          ) : (
            <div className="divide-y divide-gray-200">
              {documents.map((doc) => (
                <div 
                  key={doc.id} 
                  className="flex items-center justify-between py-4 hover:bg-gray-50"
                >
                  <div>
                    <h3 className="font-medium text-gray-900">
                      {doc.documentType}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {doc.purpose ? doc.purpose : <span className="italic text-gray-400">No description</span>}
                    </p>
                    <p className="text-xs text-gray-500">
                      Uploaded on {new Date(doc.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <a
                      href={doc.fileData}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-md bg-amber-100 px-4 py-2 text-sm font-medium text-amber-700 hover:bg-amber-200"
                    >
                      View Document
                    </a>
                    <button
                      onClick={() => handleDelete(doc.id)}
                      className="rounded-md bg-red-100 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-200"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Quick Upload Section */}
      <section className="mt-16">
        <h2 className="mb-6 text-center text-2xl font-bold text-amber-600">
          Quick Upload
        </h2>
        <div className="mx-auto w-full max-w-xl rounded-lg bg-gray-100 p-6 shadow-md">
          <QuickUploadForm onUploadSuccess={handleUploadSuccess} />
        </div>
      </section>
    </main>
  );
}
