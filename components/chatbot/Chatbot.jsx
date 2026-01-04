"use client";

import { useState } from "react";
import { sendMessageToBot } from "@/services/chatbot.service";
import "./chatbot.css";

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { from: "bot", text: "Xin chào 👋 Tôi có thể hỗ trợ gì cho bạn?" },
  ]);
  const [input, setInput] = useState("");

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg = { from: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    try {
      const res = await sendMessageToBot(input);
      setMessages((prev) => [
        ...prev,
        { from: "bot", text: res.reply || "Xin vui lòng thử lại." },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { from: "bot", text: "Hệ thống đang bận, vui lòng thử lại sau." },
      ]);
    }
  };

  return (
    <>
      {/* ===== BUTTON FLOAT ===== */}
      <button className="chatbot-toggle" onClick={() => setOpen(!open)}>
        💬
      </button>

      {/* ===== CHATBOT PANEL ===== */}
      <div className={`chatbot-wrapper ${open ? "open" : ""}`}>
        <div className="chatbot-header">
          Hỗ trợ khách sạn
          <span className="chatbot-close" onClick={() => setOpen(false)}>
            ✕
          </span>
        </div>

        <div className="chatbot-messages">
          {messages.map((msg, i) => (
            <div key={i} className={`chatbot-message ${msg.from}`}>
              {msg.text}
            </div>
          ))}
        </div>

        <div className="chatbot-input">
          <input
            placeholder="Nhập câu hỏi..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
          />
          <button onClick={handleSend}>Gửi</button>
        </div>
      </div>
    </>
  );
}
