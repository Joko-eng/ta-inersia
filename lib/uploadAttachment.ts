export const ALLOWED_ATTACHMENT_TYPES = [
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/webp",
  "application/pdf",
];

export const MAX_ATTACHMENT_SIZE = 5 * 1024 * 1024; // 5MB

export function validateAttachmentFile(file: File): string | null {
  if (!ALLOWED_ATTACHMENT_TYPES.includes(file.type)) {
    return "Tipe file tidak didukung. Gunakan JPG, PNG, WEBP, atau PDF.";
  }
  if (file.size > MAX_ATTACHMENT_SIZE) {
    return "Ukuran file maksimal 5MB";
  }
  return null;
}

export async function uploadAttachment(file: File): Promise<{
  url: string;
  publicId: string;
  resourceType: string;
}> {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch("/api/upload", {
    method: "POST",
    body: formData,
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data?.error || "Gagal mengupload file");
  }

  return data;
}

export async function deleteAttachment(publicId: string): Promise<void> {
  await fetch("/api/upload", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ publicId }),
  });
}

export function isImageUrl(url: string): boolean {
  return /\.(png|jpe?g|webp|gif)$/i.test(url);
}
