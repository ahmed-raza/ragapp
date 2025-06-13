"use client";

import { useEffect, useState } from "react";
import { createAPIClient } from "@/utils/api";
import { useSession } from "next-auth/react";

interface Document {
  id: number;
  filename: string;
  filepath: string;
  uploaded_at: string;
}

export default function DocumentsPage() {
  const { data: session } = useSession();
  const [files, setFiles] = useState<FileList | null>(null);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [status, setStatus] = useState<"idle" | "uploading" | "success" | "error">("idle");
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    const token = session?.accessToken;
    if (token) {
      fetchDocuments(token);
    }
  }, [session]);

  const fetchDocuments = async (token: string | undefined) => {
    try {
      if (!token) {
        console.error("No access token found");
        return;
      }
      const api = createAPIClient(token);
      const res = await api.get("/documents");
      setDocuments(res.data);
    } catch (error) {
      console.error("Failed to fetch documents", error);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFiles(e.target.files);
    setStatus("idle");
    setMessage("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!files || files.length === 0) return;

    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append("files", files[i]);
    }

    setStatus("uploading");

    try {
      const token = session?.accessToken;
      const api = createAPIClient(token);
      await api.post("/documents/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setStatus("success");
      setMessage("All files uploaded successfully.");
      setFiles(null);
      fetchDocuments(token);
    } catch (error: any) {
      setStatus("error");
      const err = error.response?.data;
      if (Array.isArray(err?.detail)) {
        const messages = err.detail.map((d: any) => d.msg || JSON.stringify(d)).join("; ");
        setMessage(messages);
      } else {
        setMessage(err?.detail || "Upload failed.");
      }
    }
  };

  return (
    <div className="flex flex-col gap-8 p-6 max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold">Documents</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="file"
          accept=".pdf,.docx,.csv"
          multiple
          onChange={handleFileChange}
          className="file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />
        <button
          disabled={!files || status === "uploading"}
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded disabled:opacity-50"
        >
          {status === "uploading" ? "Uploading..." : "Upload"}
        </button>

        {message && (
          <p className={`text-sm ${status === "success" ? "text-green-600" : "text-red-600"}`}>
            {message}
          </p>
        )}
      </form>

      <div>
        <h2 className="text-2xl font-semibold mb-4">Your Uploaded Documents</h2>
        {documents.length === 0 ? (
          <p className="text-gray-600">No documents uploaded yet.</p>
        ) : (
          <ul className="space-y-4">
            {documents.map((doc) => (
              <li
                key={doc.id}
                className="border p-4 rounded-lg shadow-sm flex items-center justify-between bg-white"
              >
                <div>
                  <p className="font-medium">{doc.filename}</p>
                  <p className="text-sm text-gray-500">
                    Uploaded: {new Date(doc.uploaded_at).toLocaleString()}
                  </p>
                </div>
                <a
                  href={`${process.env.NEXT_PUBLIC_API_URL}/${doc.filepath}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  View
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
