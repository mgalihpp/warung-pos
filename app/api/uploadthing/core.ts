import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

export const uploadRouter = {
  productImage: f({
    image: { maxFileSize: "4MB", maxFileCount: 1 },
  })
    .middleware(async () => ({ uploadedAt: new Date().toISOString() }))
    .onUploadComplete(async ({ file }) => ({ url: file.url })),
} satisfies FileRouter;

export type AppFileRouter = typeof uploadRouter;