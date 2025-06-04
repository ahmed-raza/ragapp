"use client"

import { useState, useRef, useEffect } from "react";

export default function Chat() {
  const [messages, setMessages] = useState<string[]>([]);
  const [input, setInput] = useState("");
  const socket = useRef<WebSocket | null>(null);

  useEffect(() => {
    socket.current = new WebSocket("ws://localhost:8000/ws");

    socket.current.onopen = () => {
      console.log("WebSocket connected");
    };

    socket.current.onmessage = (event) => {
      setMessages((prev) => [...prev, `Bot: ${event.data}`]);
    };

    socket.current.onclose = () => {
      console.log("WebSocket disconnected");
    };

    return () => {
      socket.current?.close();
    };
  }, []);

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !socket.current?.readyState) return;

    socket.current.send(input);
    setMessages((prev) => [...prev, `You: ${input}`]);
    setInput("");
  };

  return (
    <main className="flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-2xl h-[80vh] bg-white rounded-xl shadow p-4 overflow-y-auto mb-4 flex flex-col space-y-4">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`max-w-[75%] px-4 py-2 rounded-lg ${
              msg.startsWith("You:")
                ? "self-end bg-blue-500 text-white"
                : "self-start bg-gray-200 text-gray-800"
            }`}
          >
            {msg}
          </div>
        ))}
      </div>

      <form onSubmit={sendMessage} className="w-full max-w-2xl flex gap-2">
        <textarea
          rows={2}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              sendMessage(e);
            }
          }}
          className="flex-1 p-3 border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Type your message"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700"
        >
          Send
        </button>
      </form>
    </main>
  );
}
