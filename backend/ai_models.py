"""
File: ai_model.py
Module: AI Model for HotelEase Chatbot
Description:
    This module implements the AI logic for the HotelEase web chatbot system.
    The chatbot is responsible for interacting with users, providing hotel-related
    recommendations, answering frequently asked questions, and assisting with
    customer service queries.

Author: [Nhóm của bạn]
Course: Web Application Development - Term Project
Date: [Cập nhật ngày nộp bài]
"""

import random


# Predefined sample responses (for offline chatbot simulation)
SUGGESTIONS = {
    "destination": [
        "Bạn có thể đến Đà Lạt, Sapa hoặc Phú Quốc — đều có resort rất đẹp.",
        "Nếu bạn yêu thích biển, Nha Trang và Phú Quốc là lựa chọn tuyệt vời.",
        "Hà Nội có nhiều khách sạn trung tâm tiện cho công tác và tham quan."
    ],
    "room": [
        "Hiện tại chúng tôi có phòng đơn, phòng đôi và phòng suite cao cấp.",
        "Phòng đôi đang có khuyến mãi 15% trong tuần này.",
        "Phòng suite hướng biển hiện còn trống 3 phòng, bạn có muốn xem chi tiết không?"
    ],
    "branch": [
        "Hệ thống có chi nhánh tại Hà Nội, Đà Nẵng, TP.HCM và Phú Quốc.",
        "Chi nhánh Đà Lạt nằm trên đường Trần Phú, gần khu chợ đêm trung tâm.",
        "Chi nhánh TP.HCM có dịch vụ đưa đón sân bay miễn phí."
    ],
    "support": [
        "Bộ phận chăm sóc khách hàng hoạt động 24/7 qua hotline 1800 9999.",
        "Bạn có thể phản hồi chất lượng dịch vụ qua ứng dụng hoặc website chính thức.",
        "Chúng tôi luôn sẵn sàng hỗ trợ bạn bất kỳ lúc nào, xin vui lòng cho biết vấn đề bạn gặp phải."
    ]
}


def generate_reply(user_message: str, db_results=None) -> str:
    """
    Generate chatbot reply based on user input and optional database results.

    Args:
        user_message (str): Message sent by the user.
        db_results (any, optional): Data retrieved from the SQL database
                                    related to hotel information (default: None).

    Returns:
        str: The chatbot's reply message.
    """

    message = user_message.lower()

    # 1️⃣ If query results from the database exist, append them to the response
    if db_results:
        return f"Dưới đây là thông tin hệ thống tìm thấy:\n{db_results}"

    # 2️⃣ Simple keyword-based intent detection
    if any(word in message for word in ["địa điểm", "đi đâu", "du lịch", "đến đâu"]):
        return random.choice(SUGGESTIONS["destination"])

    elif any(word in message for word in ["phòng", "đặt", "trống", "giá"]):
        return random.choice(SUGGESTIONS["room"])

    elif any(word in message for word in ["chi nhánh", "cơ sở", "địa chỉ"]):
        return random.choice(SUGGESTIONS["branch"])

    elif any(word in message for word in ["chăm sóc", "hỗ trợ", "liên hệ", "phản hồi"]):
        return random.choice(SUGGESTIONS["support"])

    # 3️⃣ Default fallback response if no intent is recognized
    return (
        "Xin chào! Tôi là trợ lý ảo của hệ thống khách sạn HotelEase. "
        "Tôi có thể giúp bạn đặt phòng, gợi ý địa điểm du lịch, "
        "hoặc cung cấp thông tin về các chi nhánh. "
        "Bạn muốn tôi hỗ trợ điều gì trước ạ?"
    )
