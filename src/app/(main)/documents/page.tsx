"use client";

import { useState } from "react";
import api from "@/utils/api";

export default function DocumentsPage() {
  const [files, setFiles] = useState<FileList | null>(null);
  const [status, setStatus] = useState<"idle" | "uploading" | "success" | "error">("idle");
  const [message, setMessage] = useState<string>("");

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
      formData.append("files", files[i]); // name MUST match backend
    }

    console.log("Uploading files:", formData.getAll("files"));

    try {
      await api.post("/documents/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setStatus("success");
      setMessage("All files uploaded successfully.");
      setFiles(null);
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
    <div className="flex flex-col gap-6 p-4 max-w-xl mx-auto">
      <h1 className="text-4xl font-bold">Documents</h1>

      <div className="flex flex-col gap-2">
        <input
          type="file"
          accept=".pdf,.docx,.csv"
          multiple
          onChange={handleFileChange}
          className="file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />
        <button
          disabled={!files || status === "uploading"}
          onClick={handleSubmit}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded disabled:opacity-50"
        >
          {status === "uploading" ? "Uploading..." : "Upload"}
        </button>

        {message && (
          <p className={`text-sm ${status === "success" ? "text-green-600" : "text-red-600"}`}>
            {message}
          </p>
        )}
      </div>
    </div>
  );
}
