const API_BASE_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:8000";

export async function uploadFile(file: File) {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(`${API_BASE_URL}/upload`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) throw new Error("Upload failed");
  const data = await res.json();
  return {
    ...data,
    url: `${API_BASE_URL}/uploads/${data.filename}`,
  };
}

export async function savePortfolio(userId: string, items: any[]) {
  const res = await fetch(`${API_BASE_URL}/save-portfolio`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ user_id: userId, items }),
  });

  if (!res.ok) throw new Error("Save failed");
  return await res.json();
}

export async function loadPortfolio(userId: string) {
  const res = await fetch(`${API_BASE_URL}/load-portfolio/${userId}`);
  if (!res.ok) throw new Error("Load failed");
  return await res.json();
}

export async function removeMedia(userId: string, mediaId: string) {
  const res = await fetch(`${API_BASE_URL}/remove-media`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ user_id: userId, media_id: mediaId }),
  });

  if (!res.ok) throw new Error("Failed to remove media");
  return await res.json();
}
