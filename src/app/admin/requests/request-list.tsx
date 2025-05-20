'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface FileUpload {
  id: number;
  fileName: string;
  fileSize: number;
  mimeType: string;
  uploadedBy: string;
  status: string;
  createdAt: string;
  fileData: string;
  fullName: string;
  address: string;
  documentType: string;
  purpose: string;
  requestType: string;
  email?: string | null;
  phone?: string | null;
  message?: string | null;
}

interface RequestListProps {
  initialRequests: FileUpload[];
}

export default function RequestList({ initialRequests }: RequestListProps) {
  const [requests, setRequests] = useState<FileUpload[]>(initialRequests);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [selectedFile, setSelectedFile] = useState<FileUpload | null>(null);
  const router = useRouter();

  // Poll for updates every 5 seconds
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await fetch('/api/requests');
        if (response.ok) {
          const data = await response.json();
          setRequests(data.requests);
        }
      } catch (error) {
        console.error('Error fetching updates:', error);
      }
    };
    fetchRequests(); // Initial fetch
    const interval = setInterval(fetchRequests, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleAction = async (id: number, action: 'approved' | 'rejected') => {
    try {
      const response = await fetch('/api/requests', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, status: action }),
      });

      if (!response.ok) {
        throw new Error('Failed to update request');
      }

      // Instantly refetch requests after action
      const fetchRequests = async () => {
        const response = await fetch('/api/requests');
        if (response.ok) {
          const data = await response.json();
          setRequests(data.requests);
        }
      };
      await fetchRequests();
      router.refresh();
    } catch (error) {
      console.error('Error updating request:', error);
      alert('Failed to update request. Please try again.');
    }
  };

  const handleViewFile = (request: FileUpload) => {
    setSelectedFile(request);
  };

  const closeFileViewer = () => {
    setSelectedFile(null);
  };

  // Filter requests to only show those with requestType === 'request' or 'contact'
  const filteredRequests = requests
    .filter(request => request.requestType === 'request' || request.requestType === 'contact')
    .filter(request => {
      const matchesSearch = 
        request.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.documentType?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.message?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = !statusFilter || request.status === statusFilter;
      return matchesSearch && matchesStatus;
    });

  // Sort requests by date, most recent first
  const sortedRequests = [...filteredRequests].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <div>
      {/* Search and Filter Section */}
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:justify-between">
        <input
          type="text"
          placeholder="🔍 Search by name/email/type/message"
          className="w-full flex-grow rounded border p-3 md:w-auto"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select 
          className="w-full rounded border p-3 md:w-auto"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {/* Requests List */}
      {sortedRequests.length === 0 ? (
        <div className="mx-auto h-80 w-full max-w-5xl rounded-lg bg-gray-100 p-8 shadow-md">
          <p className="text-gray-600">📭 No requests found.</p>
          <p className="text-gray-600">
            {requests.length === 0 
              ? "Once a resident submits a request, it will appear here."
              : "Try adjusting your search or filter settings."}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {sortedRequests.map((request) => (
            <div
              key={request.id}
              className="border rounded-lg p-6 bg-white shadow-sm hover:shadow-md transition-shadow duration-200"
            >
              <div className="flex flex-col space-y-4">
                {/* Header with Name, Type, and Status */}
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-medium text-gray-900 text-lg">
                        {request.fullName || 'Anonymous'}
                      </h3>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium
                        ${request.requestType === 'request' ? 'bg-blue-100 text-blue-800' : request.requestType === 'contact' ? 'bg-pink-100 text-pink-800' : 'bg-purple-100 text-purple-800'}`
                      }>
                        {request.requestType === 'request'
                          ? 'Document Request'
                          : request.requestType === 'contact'
                          ? 'Contact Request'
                          : 'Other'}
                      </span>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium
                        ${request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                          request.status === 'approved' ? 'bg-green-100 text-green-800' :
                          'bg-red-100 text-red-800'}`
                      }>
                        {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                      </span>
                    </div>
                    {/* Contact Information */}
                    <div className="text-sm space-y-1">
                      <p className="text-blue-600 font-medium">
                        {request.email || 'No email provided'}
                      </p>
                      {request.phone && (
                        <p className="text-gray-600">
                          📱 {request.phone}
                        </p>
                      )}
                    </div>
                  </div>
                  {/* Action Buttons */}
                  <div className="flex items-center gap-2">
                    {(request.requestType === 'request' || (request.requestType === 'contact' && request.fileName && request.fileData)) && (
                      <button
                        onClick={() => handleViewFile(request)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                      >
                        View File
                      </button>
                    )}
                  </div>
                </div>

                {/* Request Details */}
                <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-600 space-y-2">
                  {request.requestType === 'request' ? (
                    <>
                      <p><strong>Document Type:</strong> {request.documentType}</p>
                      <p><strong>Purpose:</strong> {request.purpose}</p>
                      <p><strong>File Details:</strong> {request.fileName} ({(request.fileSize / 1024 / 1024).toFixed(2)} MB)</p>
                    </>
                  ) : request.requestType === 'contact' ? (
                    <>
                      <p><strong>Message:</strong> {request.message}</p>
                    </>
                  ) : null}
                  <p><strong>Submitted:</strong> {new Date(request.createdAt).toLocaleString()}</p>
                </div>

                {/* Action Buttons for Pending Requests */}
                {request.status === 'pending' && (
                  <div className="flex justify-end space-x-2 pt-4 border-t">
                    <button
                      onClick={() => handleAction(request.id, 'approved')}
                      className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleAction(request.id, 'rejected')}
                      className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                    >
                      Reject
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* File Viewer Modal */}
      {selectedFile && (selectedFile.requestType === 'request' || selectedFile.requestType === 'contact') && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-auto p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Viewing File: {selectedFile.fileName}</h3>
              <button
                onClick={closeFileViewer}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <div className="border rounded p-4">
              {selectedFile.mimeType.startsWith('image/') ? (
                <img
                  src={`data:${selectedFile.mimeType};base64,${selectedFile.fileData}`}
                  alt={selectedFile.fileName}
                  className="max-w-full h-auto"
                />
              ) : (
                <iframe
                  src={`data:${selectedFile.mimeType};base64,${selectedFile.fileData}`}
                  className="w-full h-[70vh]"
                  title={selectedFile.fileName}
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 