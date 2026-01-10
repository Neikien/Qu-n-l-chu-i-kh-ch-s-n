// components/Chatbot.jsx
"use client";

import { useState, useRef, useEffect } from "react";
// Import hàm gọi API từ lib/api.js
import { askChatbot } from "@/lib/api";

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "bot",
      content: "Xin chào! Tôi là trợ lý ảo AI. Tôi có thể giúp gì cho bạn về đặt phòng và dịch vụ khách sạn?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Tự động cuộn xuống tin nhắn mới nhất
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    // 1. Thêm tin nhắn của user vào list
    const userMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      // 2. Gọi API Backend
      // Lưu ý: Hàm askChatbot trong lib/api.js có sử dụng getAuthHeaders()
      // Nếu backend yêu cầu đăng nhập mới chat được, bạn cần xử lý lỗi 401 ở đây.
      const data = await askChatbot(userMessage.content);

      // Giả định backend trả về { answer: "Nội dung trả lời" } hoặc { message: "..." }
      // Bạn cần kiểm tra xem backend thực tế trả về key gì. Ở đây tôi lấy data.answer hoặc data.response
      const botResponseContent = data.answer || data.response || data.message || JSON.stringify(data);

      const botMessage = { role: "bot", content: botResponseContent };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Chatbot error:", error);
      const errorMessage = {
        role: "bot",
        content: "Xin lỗi, tôi đang gặp sự cố kết nối. Vui lòng thử lại sau."
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2 font-sans">
      {/* --- CỬA SỔ CHAT --- */}
      {isOpen && (
        <div className="w-[350px] h-[450px] bg-white rounded-xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 duration-300">

          {/* Header Chat */}
          <div className="bg-primary text-white p-4 flex justify-between items-center">
            <h3 className="font-bold text-lg">Hỗ trợ trực tuyến</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="hover:bg-white/20 p-1 rounded transition"
            >
              <i className="fa-solid fa-xmark"></i>
            </button>
          </div>

          {/* Nội dung tin nhắn */}
          <div className="flex-1 overflow-y-auto p-4 bg-gray-50 space-y-4">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg text-sm leading-relaxed shadow-sm ${
                    msg.role === "user"
                      ? "bg-primary text-white rounded-br-none"
                      : "bg-white border border-gray-200 text-gray-800 rounded-bl-none"
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white border border-gray-200 p-3 rounded-lg rounded-bl-none shadow-sm">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-75"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150"></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Chat */}
          <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-gray-200 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Nhập câu hỏi..."
              className="flex-1 border border-gray-300 rounded-full px-4 py-2 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="bg-primary text-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-primary/90 disabled:opacity-50 transition shadow-sm"
            >
              <i className="fa-solid fa-paper-plane text-xs"></i>
            </button>
          </form>
        </div>
      )}

      {/* --- NÚT TRÒN TOGGLE --- */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        // Tôi đã tăng kích thước w-16 h-16 (64px) để nút to và đẹp hơn một chút
        className="w-16 h-16 bg-primary text-white rounded-full shadow-xl flex items-center justify-center hover:scale-110 transition-transform duration-200"
      >
        {isOpen ? (
          // Icon khi đang mở cửa sổ chat (dấu mũi tên xuống hoặc dấu X)
          <i className="fa-solid fa-chevron-down text-xl"></i>
        ) : (
          // [THAY ĐỔI Ở ĐÂY] Thay icon comments bằng icon robot
          // <i className="fa-solid fa-comments text-2xl"></i>  <-- Dòng cũ
          <i className="fa-solid fa-robot text-3xl"></i> // <-- Dòng mới (icon to hơn chút)
        )}
      </button>
    </div>
  );
}