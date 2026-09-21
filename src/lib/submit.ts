import type { ApiResponse } from "@/lib/apiTypes";
import { fr } from "@/content/fr";

/** Envoi multipart avec progression (XMLHttpRequest, car `fetch` n'expose pas la progression d'envoi). */
export function submitApplication(
  formData: FormData,
  onProgress: (percent: number) => void,
): Promise<ApiResponse> {
  return new Promise((resolve) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/api/candidature");
    xhr.responseType = "json";
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) onProgress(Math.min(99, Math.round((e.loaded / e.total) * 100)));
    };
    xhr.onload = () => {
      const body = xhr.response as ApiResponse | null;
      if (body && typeof body === "object" && "ok" in body) resolve(body);
      else resolve({ ok: false, code: "server", message: fr.form.serverError });
    };
    xhr.onerror = () => resolve({ ok: false, code: "server", message: fr.form.networkError });
    xhr.ontimeout = xhr.onerror;
    xhr.send(formData);
  });
}
