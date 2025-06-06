"use client";

import { useEffect, useState } from "react";
import api from "@/utils/api";

export default function SettingsPage() {
  const [user, setUser] = useState({});

  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log("Fetching user settings with token:", token);
    if (!token) return;

    api
      .get("/settings", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        console.log("User settings fetched successfully:", res.data);
        setUser(res.data);
      })
      .catch((err) => {
        console.error("Failed to fetch user", err);
      });
  }, []);

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
