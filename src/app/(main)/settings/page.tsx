"use client";

import { useEffect, useState } from "react";
import { createAPIClient } from "@/utils/api";
import { useSession } from "next-auth/react";

export default function SettingsPage() {
  const { data: session, status } = useSession();
  const [user, setUser] = useState({ username: "", email: "" });

  useEffect(() => {
    const token = session?.accessToken;
    if (!token) {
      return;
    }
    const api = createAPIClient(token);

    api
      .get("/settings")
      .then((res) => {
        setUser(res.data);
      })
      .catch((err) => {
        console.error("Failed to fetch user", err);
      });
  }, [session]);

  return (
    <main className="max-w-xl mx-auto p-6 bg-white rounded shadow mt-10">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>
      <form className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">Name</label>
          <input
            type="text"
            defaultValue={user.username}
            className="w-full border px-3 py-2 rounded"
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Email</label>
          <input
            type="email"
            defaultValue={user.email}
            className="w-full border px-3 py-2 rounded"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Save Changes
        </button>
      </form>
    </main>
  );
}
