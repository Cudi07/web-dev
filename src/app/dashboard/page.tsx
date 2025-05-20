import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "~/server/db";
import { fileUploads } from "~/server/db/schema";
import { eq, and } from "drizzle-orm";
import AdminNav from "~/app/_components/AdminNav";
import { QuickUploadForm } from "~/app/_components/QuickUploadForm";
import { LatestActivity } from "~/app/_components/LatestActivity";

async function getDashboardStats() {
  const pendingRequests = await db
    .select()
    .from(fileUploads)
    .where(eq(fileUploads.status, "pending"));

  const totalDocuments = await db
    .select()
    .from(fileUploads)
    .where(
      and(
        eq(fileUploads.requestType, "document"),
        eq(fileUploads.status, "approved")
      )
    );

  return {
    pendingCount: pendingRequests.length,
    totalDocuments: totalDocuments.length,
  };
}

export default async function DashboardPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const stats = await getDashboardStats();

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow mx-6 mt-30 md:mx-20 lg:mx-40">
        <AdminNav />

        {/* Main Dashboard Section */}
        <section>
          <h2 className="mb-8 text-center text-3xl font-bold text-amber-600">
            Dashboard Overview
          </h2>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
            <div className="rounded-lg bg-gray-100 p-6 shadow-md">
              <h3 className="text-xl font-semibold text-gray-700">
                Pending Request
              </h3>
              <p className="mt-4 text-3xl font-bold text-amber-600">
                {stats.pendingCount}
              </p>
            </div>
            <div className="rounded-lg bg-gray-100 p-6 shadow-md">
              <h3 className="text-xl font-semibold text-gray-700">
                Uploaded Documents
              </h3>
              <p className="mt-4 text-3xl font-bold text-amber-600">
                {stats.totalDocuments}
              </p>
            </div>
          </div>
        </section>

        {/* Latest Activity Section */}
        <section className="mt-16 rounded-lg bg-gray-100 p-6 shadow-md">
          <h2 className="mb-4 text-xl font-semibold text-gray-800">
            🔔 Latest Activity
          </h2>
          <LatestActivity />
        </section>

        {/* Quick Upload Section */}
        <section className="mt-16">
          <h2 className="mb-6 text-center text-2xl font-bold text-amber-600">
            Quick Upload
          </h2>
          <div className="mx-auto w-full max-w-xl rounded-lg bg-gray-100 p-6 shadow-md">
            <QuickUploadForm />
          </div>
        </section>
      </main>
      <footer className="w-full bg-gray-900 p-6 text-center text-sm text-white mt-auto">
        © 2025 Barangay San Agustin - Admin Portal. All rights reserved.
      </footer>
    </div>
  );
}
