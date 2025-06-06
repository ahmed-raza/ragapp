"use client";

import { useState, useRef, useEffect } from "react";

export default function Chat() {
  const [messages, setMessages] = useState<string[]>([]);
  const [input, setInput] = useState("");
  const socket = useRef<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const streamBufferRef = useRef(""); // holds accumulating message
  const chatContainerRef = useRef<HTMLDivElement | null>(null); // for scrolling

  // Scrolls to bottom
  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const wsUrl = `ws://localhost:8000/ws?token=${encodeURIComponent(token)}`;
    socket.current = new WebSocket(wsUrl);

    socket.current.onopen = () => {
      console.log("✅ WebSocket connected");
      setIsConnected(true);
    };

    socket.current.onmessage = (event) => {
      const msg = event.data;

      if (msg === "[end]") {
        setMessages((prev) => [
          ...prev.slice(0, -1),
          `Bot: ${streamBufferRef.current.trim()}`,
        ]);
        streamBufferRef.current = "";
      } else {
        streamBufferRef.current += " " + msg;

        setMessages((prev) => {
          const updated = [...prev];
          if (updated.length === 0 || !updated[updated.length - 1].startsWith("Bot:")) {
            updated.push("Bot: ");
          }
          updated[updated.length - 1] = `Bot: ${streamBufferRef.current.trim()}`;
          return updated;
        });
      }
    };

    socket.current.onclose = () => {
      console.log("❌ WebSocket disconnected");
      setIsConnected(false);
    };

    return () => {
      socket.current?.close();
    };
  }, []);

  // Scroll to bottom every time messages update
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || socket.current?.readyState !== WebSocket.OPEN) return;

    socket.current.send(input);
    setMessages((prev) => [...prev, `You: ${input}`]);
    setInput("");
  };

  return (
    <main className="flex flex-col items-center justify-center px-4">
      {isConnected ? (
        <span className="flex w-3 h-3 me-3 bg-green-500 rounded-full"></span>
      ) : (
        <span className="flex w-3 h-3 me-3 bg-gray-200 rounded-full"></span>
      )}

      <div
        ref={chatContainerRef}
        className="w-full mt-8 max-w-2xl h-[80vh] bg-white rounded-xl shadow p-4 overflow-y-auto mb-4 flex flex-col space-y-4"
      >
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
