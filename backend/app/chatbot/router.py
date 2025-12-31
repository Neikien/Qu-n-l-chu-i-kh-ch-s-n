from fastapi import APIRouter
from pydantic import BaseModel
from app.chatbot.service import ai_reply

router = APIRouter(prefix="/chatbot", tags=["Chatbot"])

class ChatRequest(BaseModel):
    message: str

@router.post("/chat")
async def chat(req: ChatRequest):
    reply = await ai_reply(req.message)
    return {"reply": reply}
