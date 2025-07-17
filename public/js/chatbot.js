// Yarn Shop Chatbot - Optimized for Hugging Face NLP
class YarnShopChatbot {
    constructor() {
        this.isOpen = false;
        this.messages = [];
        this.products = [];
        this.nlpService = null;
        this.conversationContext = {
            currentTopic: null,
            userIntent: null,
            entities: {},
            sessionId: this.generateSessionId(),
            messageCount: 0,
        };
        this.init();
        this.loadProducts();
        this.initializeHuggingFaceNLP();
    }

    async loadProducts() {
        try {
            const response = await fetch("/src/data.json");
            const data = await response.json();
            this.products = data.products || [];
            console.log(`📦 Loaded ${this.products.length} products`);
        } catch (error) {
            console.error("❌ Lỗi khi tải dữ liệu sản phẩm:", error);
            this.products = [];
        }
    }

    async initializeHuggingFaceNLP() {
        try {
            // Đợi configs load xong
            await this.waitForConfigs();

            this.nlpService = new HuggingFaceNLPService();
            console.log("✅ Hugging Face NLP Service initialized successfully");

            // Test service
            const status = this.nlpService.getStatus();
            console.log("🤖 NLP Service Status:", status);
        } catch (error) {
            console.error(
                "❌ Failed to initialize Hugging Face NLP Service:",
                error
            );
            this.nlpService = null;
        }
    }

    async waitForConfigs() {
        let attempts = 0;
        const maxAttempts = 50; // 5 seconds

        while (attempts < maxAttempts) {
            if (
                typeof HUGGINGFACE_CONFIG !== "undefined" &&
                typeof VIETNAMESE_PATTERNS !== "undefined"
            ) {
                return;
            }
            await new Promise((resolve) => setTimeout(resolve, 100));
            attempts++;
        }

        throw new Error("Required configs not loaded after 5 seconds");
    }

    generateSessionId() {
        return (
            "session_" +
            Date.now() +
            "_" +
            Math.random().toString(36).substr(2, 9)
        );
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
                        <span>Hỗ trợ khách hàng - Len Đan Móc</span>
                        <small>Powered by Hugging Face AI</small>
                    </div>
                    
                    <div class="chatbot-messages" id="chatbotMessages">
                        <!-- Messages will be added here -->
                    </div>
                    
                    <div class="chatbot-input-container">
                        <input type="text" class="chatbot-input" id="chatbotInput" 
                               placeholder="Nhập tin nhắn của bạn...">
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

        toggleBtn.addEventListener("click", () => this.toggleChatbot());
        sendBtn.addEventListener("click", () => this.sendMessage());
        input.addEventListener("keypress", (e) => {
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
        } else {
            button.classList.remove("active");
            window.classList.remove("show");
        }
    }

    addWelcomeMessage() {
        const welcomeMessage =
            "Xin chào! Tôi là trợ lý AI của shop len đan móc. Tôi có thể giúp bạn:";
        const quickReplies = [
            "Tìm sản phẩm len",
            "Dụng cụ đan móc",
            "Xem bảng giá",
            "Hướng dẫn đặt hàng",
            "Liên hệ shop",
        ];

        this.addMessage(welcomeMessage, "bot");
        setTimeout(() => {
            this.addQuickReplies(quickReplies);
        }, 1000);
    }

    addMessage(text, sender, quickReplies = null) {
        const messagesContainer = document.getElementById("chatbotMessages");
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

        this.messages.push({
            text: text,
            sender: sender,
            timestamp: new Date(),
            quickReplies: quickReplies,
        });
    }

    showTypingIndicator() {
        const messagesContainer = document.getElementById("chatbotMessages");
        const typingDiv = document.createElement("div");
        typingDiv.className = "chatbot-message bot typing-indicator";
        typingDiv.id = "typingIndicator";

        typingDiv.innerHTML = `
            <div class="message-avatar">
                <i class="fas fa-robot"></i>
            </div>
            <div class="message-content">
                <div class="typing-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
        `;

        messagesContainer.appendChild(typingDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    hideTypingIndicator() {
        const typingIndicator = document.getElementById("typingIndicator");
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }

    sendMessage() {
        const input = document.getElementById("chatbotInput");
        const message = input.value.trim();

        if (!message) return;

        this.addMessage(message, "user");
        input.value = "";

        // Show typing indicator
        this.showTypingIndicator();

        // Process with NLP or fallback
        setTimeout(() => {
            this.hideTypingIndicator();
            this.generateBotResponse(message);
        }, 1500);
    }

    handleQuickReply(reply) {
        this.addMessage(reply, "user");

        this.showTypingIndicator();
        setTimeout(() => {
            this.hideTypingIndicator();
            this.generateBotResponse(reply);
        }, 1000);
    }

    async generateBotResponse(userMessage) {
        try {
            // Use Hugging Face NLP service if available
            if (this.nlpService) {
                await this.generateHuggingFaceResponse(userMessage);
            } else {
                this.generateFallbackResponse(userMessage);
            }
        } catch (error) {
            console.error("❌ Error generating response:", error);
            this.generateFallbackResponse(userMessage);
        }
    }

    async generateHuggingFaceResponse(userMessage) {
        try {
            // Tăng số lượng tin nhắn
            this.conversationContext.messageCount++;

            console.log(
                `🤖 Processing message #${this.conversationContext.messageCount}: "${userMessage}"`
            );

            // Sử dụng Hugging Face NLP Service
            const result = await this.nlpService.generateResponse(userMessage);

            console.log("📊 Hugging Face Analysis:", result.analysis);

            // Cập nhật context
            this.updateConversationContext(result.analysis, userMessage);

            // Hiển thị response
            this.addMessage(result.response, "bot");

            // Thêm quick replies dựa trên intent
            this.addContextualQuickReplies(result.analysis.intent.intent);
        } catch (error) {
            console.error("❌ Hugging Face NLP Response Error:", error);
            this.generateFallbackResponse(userMessage);
        }
    }

    updateConversationContext(analysis, originalMessage) {
        // Cập nhật context với thông tin từ Hugging Face
        this.conversationContext.userIntent = analysis.intent.intent;
        this.conversationContext.lastMessage = originalMessage;
        this.conversationContext.lastSentiment = analysis.sentiment.label;
        this.conversationContext.confidence = analysis.confidence;

        // Lưu entities
        analysis.entities.forEach((entity) => {
            if (!this.conversationContext.entities[entity.type]) {
                this.conversationContext.entities[entity.type] = [];
            }
            this.conversationContext.entities[entity.type].push(entity.value);
        });

        // Cập nhật topic dựa trên intent
        switch (analysis.intent.intent) {
            case "product_inquiry":
                this.conversationContext.currentTopic = "products";
                break;
            case "price_inquiry":
                this.conversationContext.currentTopic = "pricing";
                break;
            case "order_inquiry":
                this.conversationContext.currentTopic = "ordering";
                break;
            case "support_inquiry":
                this.conversationContext.currentTopic = "support";
                break;
            case "greetings":
                this.conversationContext.currentTopic = "welcome";
                break;
            case "farewell":
                this.conversationContext.currentTopic = "goodbye";
                break;
        }

        console.log(
            "📋 Updated conversation context:",
            this.conversationContext
        );
    }

    // Thêm quick replies dựa trên intent
    addContextualQuickReplies(intent) {
        let quickReplies = [];

        switch (intent) {
            case "greetings":
                quickReplies = [
                    "Xem sản phẩm len",
                    "Dụng cụ đan móc",
                    "Bảng giá",
                    "Hướng dẫn đặt hàng",
                ];
                break;

            case "product_inquiry":
                quickReplies = [
                    "Len Yarnart Jeans",
                    "Len Susan Family",
                    "Kim móc Tulip",
                    "Xem thêm sản phẩm",
                ];
                break;

            case "price_inquiry":
                quickReplies = [
                    "Giá len các loại",
                    "Giá kim móc",
                    "Khuyến mãi hiện tại",
                    "So sánh giá",
                ];
                break;

            case "order_inquiry":
                quickReplies = [
                    "Cách đặt hàng",
                    "Phương thức thanh toán",
                    "Chính sách giao hàng",
                    "Liên hệ đặt hàng",
                ];
                break;

            default:
                quickReplies = ["Sản phẩm", "Giá cả", "Đặt hàng", "Liên hệ"];
        }

        if (quickReplies.length > 0) {
            setTimeout(() => {
                this.addQuickReplies(quickReplies);
            }, 500);
        }
    }

    // Thêm quick replies
    addQuickReplies(replies) {
        if (!replies || replies.length === 0) return;

        const messagesContainer = document.getElementById("chatbotMessages");
        const quickRepliesContainer = document.createElement("div");
        quickRepliesContainer.className = "quick-replies-container";

        replies.forEach((reply) => {
            const button = document.createElement("button");
            button.className = "quick-reply-btn";
            button.textContent = reply;
            button.onclick = () => this.handleQuickReply(reply);
            quickRepliesContainer.appendChild(button);
        });

        messagesContainer.appendChild(quickRepliesContainer);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    // Fallback response khi NLP không khả dụng
    generateFallbackResponse(message) {
        const lowerMessage = message.toLowerCase();
        let response = "";
        let quickReplies = [];

        if (
            lowerMessage.includes("xin chào") ||
            lowerMessage.includes("hello") ||
            lowerMessage.includes("chào")
        ) {
            response =
                "Xin chào! Tôi là trợ lý ảo của shop len đan móc. Tôi có thể giúp bạn tìm hiểu về sản phẩm len, kim đan, và dụng cụ đan móc. Bạn cần hỗ trợ gì?";
            quickReplies = [
                "Sản phẩm len",
                "Dụng cụ đan",
                "Bảng giá",
                "Hướng dẫn đặt hàng",
            ];
        } else if (
            lowerMessage.includes("len") ||
            lowerMessage.includes("sợi")
        ) {
            response =
                "Chúng tôi có nhiều loại len chất lượng cao như:\n• Len Yarnart Jeans\n• Len Susan Family\n• Len Mohair\n• Len Milkcotton\n\nBạn quan tâm loại len nào?";
            quickReplies = [
                "Len Yarnart",
                "Len Susan",
                "Xem tất cả",
                "Tư vấn chọn len",
            ];
        } else if (
            lowerMessage.includes("giá") ||
            lowerMessage.includes("bao nhiêu")
        ) {
            response =
                "Giá sản phẩm của shop:\n• Len các loại: 15k-50k/cuộn\n• Kim móc: 20k-100k/bộ\n• Dụng cụ hỗ trợ: 10k-50k\n\nBạn muốn biết giá chi tiết sản phẩm nào?";
            quickReplies = [
                "Giá len",
                "Giá kim móc",
                "Khuyến mãi",
                "So sánh giá",
            ];
        } else if (
            lowerMessage.includes("đặt hàng") ||
            lowerMessage.includes("mua")
        ) {
            response =
                "Để đặt hàng bạn có thể:\n1. Thêm sản phẩm vào giỏ hàng trên website\n2. Liên hệ hotline để đặt hàng\n3. Inbox fanpage của shop\n\nChúng tôi hỗ trợ COD và chuyển khoản.";
            quickReplies = [
                "Cách đặt hàng",
                "Thanh toán",
                "Giao hàng",
                "Liên hệ",
            ];
        } else if (
            lowerMessage.includes("kim") ||
            lowerMessage.includes("dụng cụ")
        ) {
            response =
                "Shop có đầy đủ dụng cụ đan len:\n• Kim móc các size\n• Kim đan\n• Kéo chuyên dụng\n• Máy đếm mũi\n• Ghim cài và phụ kiện\n\nTất cả chính hãng, chất lượng cao!";
            quickReplies = [
                "Kim móc Tulip",
                "Kim đan",
                "Set dụng cụ",
                "Phụ kiện",
            ];
        } else if (
            lowerMessage.includes("cảm ơn") ||
            lowerMessage.includes("tạm biệt")
        ) {
            response =
                "Cảm ơn bạn đã quan tâm đến shop! Chúc bạn đan móc vui vẻ và tạo ra những sản phẩm đẹp! 🧶✨";
            quickReplies = [];
        } else {
            response =
                "Tôi có thể hỗ trợ bạn về:\n🧶 Tư vấn sản phẩm len và dụng cụ\n💰 Thông tin giá cả\n📦 Hướng dẫn đặt hàng\n📞 Thông tin liên hệ\n\nBạn muốn hỏi về gì?";
            quickReplies = ["Sản phẩm", "Giá cả", "Đặt hàng", "Liên hệ"];
        }

        this.addMessage(response, "bot");
        if (quickReplies.length > 0) {
            setTimeout(() => {
                this.addQuickReplies(quickReplies);
            }, 500);
        }
    }

    // Tìm kiếm sản phẩm đơn giản
    searchProducts(productKeywords, colors = []) {
        if (!this.products || this.products.length === 0) {
            return [];
        }

        return this.products.filter((product) => {
            const nameMatch = productKeywords.some((keyword) =>
                product.name.toLowerCase().includes(keyword.toLowerCase())
            );

            const colorMatch =
                colors.length === 0 ||
                colors.some((color) =>
                    (product.description || "")
                        .toLowerCase()
                        .includes(color.toLowerCase())
                );

            return nameMatch && colorMatch;
        });
    }

    // Lấy trạng thái chatbot
    getStatus() {
        return {
            isOpen: this.isOpen,
            messageCount: this.messages.length,
            nlpAvailable: !!this.nlpService,
            conversationContext: this.conversationContext,
            productsLoaded: this.products.length,
        };
    }
}

// Khởi tạo chatbot khi trang web load xong
document.addEventListener("DOMContentLoaded", () => {
    console.log("🚀 Initializing Yarn Shop Chatbot with Hugging Face NLP...");
    window.yarnShopChatbot = new YarnShopChatbot();
});
