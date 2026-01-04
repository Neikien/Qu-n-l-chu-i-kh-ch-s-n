import { CHATBOT_API } from "@/src/config/api";

export async function sendMessageToBot(message) {
  const res = await fetch(CHATBOT_API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ message }),
  });

  if (!res.ok) {
    throw new Error("Chatbot API error");
  }

  return await res.json();
}
