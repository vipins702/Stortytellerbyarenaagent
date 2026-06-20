const mb = 1024 * 1024;

export const allowedUploadTypes = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/svg+xml",
  "video/mp4",
  "video/webm",
  "model/gltf-binary",
  "model/gltf+json",
  "application/octet-stream"
];

export function validateUpload(file: File) {
  const extension = file.name.split(".").pop()?.toLowerCase();
  const isModel = ["glb", "gltf"].includes(extension || "");
  const isAllowed = allowedUploadTypes.includes(file.type) || isModel;
  if (!isAllowed) {
    throw new Error("Unsupported file type. Use images, MP4/WebM video, GLB or GLTF files.");
  }
  const maxSize = file.type.startsWith("video/") ? 80 * mb : isModel ? 50 * mb : 12 * mb;
  if (file.size > maxSize) {
    throw new Error(file.type.startsWith("video/") ? "Video must be under 80 MB." : isModel ? "3D model must be under 50 MB." : "Image must be under 12 MB.");
  }
}
