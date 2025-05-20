"use client";

import { useEffect, useState } from "react";
import AdminNav from "~/app/_components/AdminNav";

interface Announcement {
  id: number;
  title: string;
  description: string;
  date: string;
  link?: string | null;
}

function Alert({ message, type, onClose }: { message: string; type: "success" | "error"; onClose: () => void }) {
  if (!message) return null;
  return (
    <div
      className={`mb-4 rounded px-4 py-3 text-sm font-medium ${
        type === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
      }`} role="alert" aria-live="polite"
    >
      <div className="flex items-center justify-between">
        <span>{message}</span>
        <button onClick={onClose} aria-label="Close alert" className="ml-4 text-lg font-bold">×</button>
      </div>
    </div>
  );
}

function AnnouncementItem({ a, onDelete, deleting }: { a: Announcement; onDelete: (id: number) => void; deleting: boolean }) {
  return (
    <li
      className="rounded bg-white p-4 shadow flex flex-col md:flex-row md:items-center md:justify-between"
      aria-label={`Announcement: ${a.title}`}
    >
      <div>
        <div className="font-bold text-lg">{a.title}</div>
        <div className="text-sm text-gray-600">{a.description}</div>
        <div className="text-xs text-gray-500">{new Date(a.date).toLocaleDateString()}</div>
        {a.link && (
          <a
            href={a.link}
            className="text-blue-600 text-xs break-all"
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`External link for ${a.title}`}
          >
            {a.link}
          </a>
        )}
      </div>
      <button
        onClick={() => onDelete(a.id)}
        className="mt-2 md:mt-0 rounded bg-red-100 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-200 flex items-center justify-center min-w-[80px]"
        aria-label={`Delete announcement: ${a.title}`}
        disabled={deleting}
      >
        {deleting ? (
          <span className="animate-spin mr-2 h-4 w-4 border-2 border-red-700 border-t-transparent rounded-full inline-block"></span>
        ) : null}
        Delete
      </button>
    </li>
  );
}

export default function AdminAnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    date: "",
    link: "",
  });
  const [fetching, setFetching] = useState(false);
  const [adding, setAdding] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Auto-dismiss alerts
  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        setError(null);
        setSuccess(null);
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [error, success]);

  const fetchAnnouncements = async () => {
    setFetching(true);
    try {
      const res = await fetch("/api/announcements");
      if (!res.ok) {
        throw new Error("Failed to fetch announcements");
      }
      const data = await res.json();
      // Ensure data is an array
      setAnnouncements(Array.isArray(data) ? data : []);
    } catch (e) {
      setError("Failed to fetch announcements");
      setAnnouncements([]); // Reset to empty array on error
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setAdding(true);
    try {
      const res = await fetch("/api/announcements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Failed to create announcement");
      const data = await res.json();
      setForm({ title: "", description: "", date: "", link: "" });
      setSuccess("Announcement created!");
      fetchAnnouncements();
    } catch (e) {
      setError("Failed to create announcement");
    } finally {
      setAdding(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Delete this announcement?")) return;
    setDeletingId(id);
    setError(null);
    setSuccess(null);
    try {
      const res = await fetch("/api/announcements", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) throw new Error("Failed to delete announcement");
      setSuccess("Announcement deleted!");
      fetchAnnouncements();
    } catch (e) {
      setError("Failed to delete announcement");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <AdminNav />
      
      <main className="flex-grow mx-6 md:mx-20 lg:mx-40">
        <h1 className="mt-20 mb-8 text-center text-3xl font-bold text-amber-600">Admin Announcements</h1>
        
        <section className="mb-12 rounded-lg bg-gray-100 p-6 shadow-md">
          <h2 className="mb-4 text-xl font-semibold text-gray-800">Add New Announcement</h2>
          <Alert message={error || ""} type="error" onClose={() => setError(null)} />
          <Alert message={success || ""} type="success" onClose={() => setSuccess(null)} />
          <form onSubmit={handleSubmit} className="space-y-4" aria-label="Add announcement form">
            <input
              type="text"
              name="title"
              placeholder="Title"
              value={form.title}
              onChange={handleChange}
              required
              className="w-full rounded border p-3"
              aria-label="Announcement title"
            />
            <textarea
              name="description"
              placeholder="Description"
              value={form.description}
              onChange={handleChange}
              required
              className="w-full rounded border p-3"
              rows={3}
              aria-label="Announcement description"
            />
            <input
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
              required
              className="w-full rounded border p-3"
              aria-label="Announcement date"
            />
            <input
              type="text"
              name="link"
              placeholder="Optional Link (e.g. https://...)"
              value={form.link}
              onChange={handleChange}
              className="w-full rounded border p-3"
              aria-label="Announcement link"
            />
            <button
              type="submit"
              disabled={adding}
              className="rounded bg-amber-600 px-6 py-2 font-bold text-white hover:bg-amber-700 disabled:opacity-50 flex items-center justify-center"
              aria-busy={adding}
            >
              {adding ? (
                <span className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full inline-block"></span>
              ) : null}
              {adding ? "Saving..." : "Add Announcement"}
            </button>
          </form>
        </section>

        <section className="rounded-lg bg-gray-100 p-6 shadow-md">
          <h2 className="mb-4 text-xl font-semibold text-gray-800">Existing Announcements</h2>
          {fetching ? (
            <div className="text-center py-4">Loading announcements...</div>
          ) : announcements.length === 0 ? (
            <div className="text-center py-4 text-gray-500">No announcements yet. Add your first announcement above!</div>
          ) : (
            <ul className="space-y-4">
              {announcements.map((a) => (
                <AnnouncementItem key={a.id} a={a} onDelete={handleDelete} deleting={deletingId === a.id} />
              ))}
            </ul>
          )}
        </section>
      </main>

      <footer className="bg-gray-900 p-6 text-center text-sm text-white mt-auto">
        © 2025 Barangay San Agustin - Admin Portal. All rights reserved.
      </footer>
    </div>
  );
} 