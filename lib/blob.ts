import { put } from "@vercel/blob";

export async function uploadBufferToBlob(input: { pathname: string; body: Buffer | Blob | File; contentType?: string }) {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    throw new Error("BLOB_READ_WRITE_TOKEN is missing. Connect Vercel Blob in your Vercel project.");
  }
  return put(input.pathname, input.body, {
    access: "public",
    contentType: input.contentType,
    addRandomSuffix: true
  });
}
