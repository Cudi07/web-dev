import { createUploadthing, type FileRouter } from "uploadthing/next";
import { auth } from "@clerk/nextjs/server";
import { db } from "~/server/db";
import { fileUploads } from "~/server/db/schema";
import { z } from "zod";

const f = createUploadthing();

const uploadMetadataSchema = z.object({
  fullName: z.string().optional(),
  address: z.string().optional(),
  documentType: z.string().optional(),
  purpose: z.string().optional(),
  email: z.string().optional().nullable(),
  phone: z.string().optional().nullable(),
  requestType: z.string().optional(),
  status: z.string().optional(),
});

export type UploadMetadata = {
  fullName?: string;
  address?: string;
  documentType?: string;
  purpose?: string;
  email?: string | null;
  phone?: string | null;
  requestType?: string;
  status?: string;
};

// This is the type for the metadata returned by the middleware
type MiddlewareMetadata = UploadMetadata & {
  userId: string;
};

export const ourFileRouter = {
  documentUploader: f({
    image: { maxFileSize: "4MB", maxFileCount: 1 },
    pdf: { maxFileSize: "8MB", maxFileCount: 1 },
  })
    .input(uploadMetadataSchema)
    .middleware(async ({ req, input }) => {
      const safeInput = input ?? {};
      const { userId } = await auth();
      if (!userId) throw new Error("Unauthorized");
      return { userId, ...safeInput };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      await db.insert(fileUploads).values({
        fileName: file.name,
        fileSize: file.size,
        mimeType: file.type,
        fileData: file.url,
        uploadedBy: metadata.userId,
        status: (metadata as any).status ?? 'approved',
        fullName: '',
        address: '',
        documentType: (metadata as any).documentType ?? file.name,
        purpose: (metadata as any).purpose ?? '',
        requestType: 'document',
        email: null,
        phone: null
      });
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter; 