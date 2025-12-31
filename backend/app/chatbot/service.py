from app.services.rules_chatbot_service import generate_reply
from app.services.oti_knowledge import OTI_KNOWLEDGE


async def ai_reply(message: str) -> str:
    reply = generate_reply(message)

    # Nếu rule không match → trả lời AI-style mặc định
    if "Xin chào! Tôi là trợ lý ảo" in reply:
        return (
            "Tôi là trợ lý ảo của hệ thống khách sạn OTI.\n"
            "Tôi có thể hỗ trợ:\n"
            "- Thông tin phòng và giá\n"
            "- Tình trạng phòng trống\n"
            "- Chi nhánh và dịch vụ\n\n"
            "Bạn có thể hỏi: 'Khách sạn còn phòng không?'"
        )

    return reply
