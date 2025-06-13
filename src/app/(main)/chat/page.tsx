"use client";

import { useSession } from "next-auth/react";
import { useState, useRef, useEffect } from "react";

export default function Chat() {
  const { data: session, status } = useSession();
  const [messages, setMessages] = useState<string[]>([]);
  const [input, setInput] = useState("");
  const socket = useRef<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const streamBufferRef = useRef(""); // holds accumulating message
  const chatContainerRef = useRef<HTMLDivElement | null>(null); // for scrolling
  const [isTyping, setIsTyping] = useState(false);
  const [processing, setProcessing] = useState(false);

  // Scrolls to bottom
  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    const token = session?.accessToken;
    if (!token) return;

    const wsUrl = `ws://localhost:8000/ws?token=${encodeURIComponent(token)}`;
    socket.current = new WebSocket(wsUrl);

    socket.current.onopen = () => {
      console.log("✅ WebSocket connected");
      setIsConnected(true);
    };

    socket.current.onmessage = (event) => {
      const msg = event.data;
      setIsTyping(true);
      setProcessing(false);
      if (msg === "[end]") {
        setIsTyping(false);
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
  }, [session]);

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
    setProcessing(true);
  };

  return (
    <main className="flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-4xl mt-4 flex items-center gap-4 bg-white rounded-t-xl shadow px-4 py-3 border-b border-gray-200">
        <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-lg">
          🤖
        </div>
        <div className="flex flex-col">
          <span className="font-semibold text-lg text-gray-800">AI Assistant</span>
          <div className="flex items-center gap-1">
            <span
              className={`h-2 w-2 rounded-full ${
                isConnected ? "bg-green-500" : "bg-gray-400"
              }`}
            />
            <span className="text-sm text-gray-500">
              {isConnected ? "Online" : "Offline"}
              {isTyping && (<> • <span className="animate-pulse">Bot is typing...</span></>)}
              {processing && (<> • <span className="animate-pulse">Processing...</span></>)}
              {status === "loading" && (<> • <span className="animate-pulse">Connecting...</span></>)}
            </span>
          </div>
        </div>
      </div>

      <div
        ref={chatContainerRef}
        className="w-full max-w-4xl h-[77vh] bg-white rounded-b-xl shadow p-4 overflow-y-auto mb-4 flex flex-col space-y-4"
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

      <form onSubmit={sendMessage} className="w-full max-w-4xl flex gap-2">
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
