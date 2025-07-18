// Simple Chatbot for Yarn Shop - Compatible with chatbot.css
class SimpleChatbot {
    constructor() {
        this.isOpen = false;
        this.messages = [];
        this.init();
    }

    init() {
        this.createChatbotHTML();
        this.bindEvents();
        this.addWelcomeMessage();
    }

    createChatbotHTML() {
        const chatbotHTML = `
            <div class="chatbot-container">
                <button class="chatbot-button" id="chatbotToggle">
                    <i class="fas fa-comments"></i>
                    <i class="fas fa-times"></i>
                </button>
                
                <div class="chatbot-window" id="chatbotWindow">
                    <div class="chatbot-header">
                        <i class="fas fa-robot"></i>
                        <div>
                            <span>Hỗ trợ khách hàng</span>
                            <small>Shop Len Đan Móc</small>
                        </div>
                    </div>
                    
                    <div class="chatbot-messages" id="chatbotMessages">
                        <!-- Messages will be added here -->
                    </div>
                    
                    <div class="chatbot-input-container">
                        <input type="text" class="chatbot-input" id="chatbotInput" 
                               placeholder="Nhập tin nhắn..." maxlength="300">
                        <button class="chatbot-send-btn" id="chatbotSend">
                            <i class="fas fa-paper-plane"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML("beforeend", chatbotHTML);
    }

    bindEvents() {
        const toggleBtn = document.getElementById("chatbotToggle");
        const sendBtn = document.getElementById("chatbotSend");
        const input = document.getElementById("chatbotInput");

        toggleBtn?.addEventListener("click", () => this.toggleChatbot());
        sendBtn?.addEventListener("click", () => this.sendMessage());
        input?.addEventListener("keypress", (e) => {
            if (e.key === "Enter") {
                this.sendMessage();
            }
        });
    }

    toggleChatbot() {
        const button = document.getElementById("chatbotToggle");
        const window = document.getElementById("chatbotWindow");

        this.isOpen = !this.isOpen;

        if (this.isOpen) {
            button.classList.add("active");
            window.classList.add("show");
            document.getElementById("chatbotInput")?.focus();
        } else {
            button.classList.remove("active");
            window.classList.remove("show");
        }
    }

    addWelcomeMessage() {
        const welcomeMsg = `Xin chào! 👋 Tôi là trợ lý ảo của shop len đan móc.

Tôi có thể hỗ trợ bạn về:
• Sản phẩm len các loại
• Dụng cụ đan móc
• Thông tin giá cả
• Hướng dẫn đặt hàng

Bạn cần hỗ trợ gì ạ?`;

        this.addMessage(welcomeMsg, "bot");
    }

    addMessage(text, sender) {
        const messagesContainer = document.getElementById("chatbotMessages");
        if (!messagesContainer) return;

        const messageDiv = document.createElement("div");
        messageDiv.className = `chatbot-message ${sender}`;

        const avatar = document.createElement("div");
        avatar.className = "message-avatar";
        avatar.innerHTML =
            sender === "bot"
                ? '<i class="fas fa-robot"></i>'
                : '<i class="fas fa-user"></i>';

        const content = document.createElement("div");
        content.className = "message-content";
        content.innerHTML = text.replace(/\n/g, "<br>");

        const timestamp = document.createElement("div");
        timestamp.className = "message-timestamp";
        timestamp.textContent = new Date().toLocaleTimeString("vi-VN", {
            hour: "2-digit",
            minute: "2-digit",
        });

        messageDiv.appendChild(avatar);
        messageDiv.appendChild(content);
        messageDiv.appendChild(timestamp);

        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    sendMessage() {
        const input = document.getElementById("chatbotInput");
        const message = input?.value.trim();

        if (!message) return;

        this.addMessage(message, "user");
        input.value = "";

        // Simulate typing delay
        setTimeout(() => {
            this.generateResponse(message);
        }, 500);
    }

    generateResponse(userMessage) {
        const msg = userMessage.toLowerCase();
        let response = "";

        // Simple keyword matching
        if (msg.includes("chào") || msg.includes("hello")) {
            response =
                "Xin chào! Cảm ơn bạn đã liên hệ với shop len đan móc. Tôi có thể giúp gì cho bạn?";
        } else if (msg.includes("len") || msg.includes("sản phẩm")) {
            response = `Chúng tôi có nhiều loại len chất lượng:

🧶 Len Yarnart Jeans - 25.000đ
🧶 Len Susan Family - 20.000đ  
🧶 Len Mohair - 45.000đ
🧶 Len Milkcotton - 30.000đ

Bạn quan tâm loại nào ạ?`;
        } else if (msg.includes("kim") || msg.includes("dụng cụ")) {
            response = `Dụng cụ đan móc của shop:

🪡 Kim móc (size 2-10mm) - 15.000đ
🪡 Kim đan thẳng - 25.000đ
✂️ Kéo chuyên dụng - 35.000đ
📏 Thước đo - 10.000đ

Tất cả đều chính hãng, bảo hành 6 tháng!`;
        } else if (msg.includes("giá") || msg.includes("bao nhiêu")) {
            response = `Bảng giá tham khảo:

💰 Len: 15.000 - 50.000đ/cuộn
💰 Kim móc: 15.000 - 100.000đ
💰 Phụ kiện: 10.000 - 50.000đ

🚚 Miễn phí ship từ 300.000đ
🎁 Giảm 10% cho khách hàng mới`;
        } else if (msg.includes("đặt hàng") || msg.includes("mua")) {
            response = `Cách đặt hàng tại shop:

📱 Cách 1: Gọi hotline 0123.456.789
💬 Cách 2: Nhắn tin Facebook
🌐 Cách 3: Đặt hàng trên website
📧 Cách 4: Email: shop@lendan.com

Hỗ trợ COD toàn quốc!`;
        } else if (msg.includes("liên hệ") || msg.includes("địa chỉ")) {
            response = `Thông tin liên hệ:

📞 Hotline: 0123.456.789
📧 Email: shop@lendan.com
🏪 Địa chỉ: Đại học Cần Thơ
⏰ Giờ mở cửa: 8h - 20h (T2-CN)
📱 Facebook: /lendan.cantho`;
        } else if (msg.includes("cảm ơn") || msg.includes("bye")) {
            response =
                "Cảm ơn bạn đã quan tâm đến shop! 🧶 Chúc bạn đan móc vui vẻ và tạo ra những sản phẩm tuyệt đẹp! ✨";
        } else {
            response = `Tôi có thể hỗ trợ bạn về:

🧶 Sản phẩm len và chất lượng
🪡 Dụng cụ đan móc
💰 Thông tin giá cả
📦 Hướng dẫn đặt hàng
📞 Thông tin liên hệ

Bạn muốn hỏi về chủ đề nào ạ?`;
        }

        this.addMessage(response, "bot");
    }
}

// Initialize chatbot when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
    new SimpleChatbot();
    console.log("✅ Simple Chatbot initialized!");
});
