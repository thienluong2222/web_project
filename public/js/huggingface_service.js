// Hugging Face NLP Service - Optimized for Vietnamese Yarn Shop Chatbot
class HuggingFaceNLPService {
    constructor() {
        // Validate dependencies
        if (typeof HUGGINGFACE_CONFIG === "undefined") {
            console.error(
                "❌ HUGGINGFACE_CONFIG not found. Make sure nlp-config.js is loaded first."
            );
            throw new Error("HUGGINGFACE_CONFIG is required but not found");
        }

        if (typeof VIETNAMESE_PATTERNS === "undefined") {
            console.error("❌ VIETNAMESE_PATTERNS not found");
            throw new Error("VIETNAMESE_PATTERNS is required but not found");
        }

        this.config = HUGGINGFACE_CONFIG;
        this.patterns = VIETNAMESE_PATTERNS;
        this.entityPatterns = ENTITY_PATTERNS;
        this.responseTemplates = RESPONSE_TEMPLATES;

        // API management
        this.requestCount = 0;
        this.lastRequestTime = 0;
        this.cache = new Map();
        this.isModelLoading = new Map();

        console.log("✅ Hugging Face NLP Service initialized successfully");
        console.log("📊 Available models:", Object.keys(this.config.models));
    }

    // Rate limiting để tránh vượt quá giới hạn API
    async checkRateLimit() {
        const now = Date.now();
        const timeDiff = now - this.lastRequestTime;

        if (timeDiff < 60000) {
            // 1 phút
            if (this.requestCount >= this.config.rateLimit.requestsPerMinute) {
                const waitTime = 60000 - timeDiff;
                console.log(`⏳ Rate limit reached, waiting ${waitTime}ms`);
                await new Promise((resolve) => setTimeout(resolve, waitTime));
                this.requestCount = 0;
            }
        } else {
            this.requestCount = 0;
        }

        this.requestCount++;
        this.lastRequestTime = now;
    }

    // Gọi API Hugging Face với retry logic
    async callHuggingFaceAPI(modelName, input, options = {}) {
        const cacheKey = `${modelName}:${JSON.stringify(input)}`;

        // Kiểm tra cache trước
        if (this.cache.has(cacheKey)) {
            console.log("📋 Using cached result for:", modelName);
            return this.cache.get(cacheKey);
        }

        await this.checkRateLimit();

        const url = `${this.config.baseUrl}/${modelName}`;
        let retries = 0;

        while (retries < this.config.rateLimit.maxRetries) {
            try {
                const response = await fetch(url, {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${this.config.apiKey}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        inputs: input,
                        options: {
                            wait_for_model: true,
                            use_cache: true,
                            ...options,
                        },
                    }),
                    signal: AbortSignal.timeout(this.config.timeout),
                });

                if (response.status === 503) {
                    // Model đang loading
                    console.log(`🔄 Model ${modelName} is loading, waiting...`);
                    await new Promise((resolve) => setTimeout(resolve, 2000));
                    retries++;
                    continue;
                }

                if (!response.ok) {
                    throw new Error(
                        `API Error: ${response.status} - ${response.statusText}`
                    );
                }

                const result = await response.json();

                // Cache kết quả thành công
                this.cache.set(cacheKey, result);

                // Giới hạn kích thước cache
                if (this.cache.size > 100) {
                    const firstKey = this.cache.keys().next().value;
                    this.cache.delete(firstKey);
                }

                return result;
            } catch (error) {
                retries++;
                console.error(`❌ Attempt ${retries} failed:`, error.message);

                if (retries >= this.config.rateLimit.maxRetries) {
                    throw new Error(
                        `Failed after ${retries} attempts: ${error.message}`
                    );
                }

                await new Promise((resolve) =>
                    setTimeout(resolve, this.config.rateLimit.retryDelay)
                );
            }
        }
    }

    // Phân tích cảm xúc
    async analyzeSentiment(message) {
        try {
            const result = await this.callHuggingFaceAPI(
                this.config.models.sentiment,
                message
            );

            if (result && result.length > 0) {
                const sentiment = result[0];
                return {
                    label: sentiment.label,
                    score: sentiment.score,
                    confidence:
                        sentiment.score > 0.7
                            ? "high"
                            : sentiment.score > 0.4
                            ? "medium"
                            : "low",
                };
            }

            return { label: "NEUTRAL", score: 0.5, confidence: "low" };
        } catch (error) {
            console.error("❌ Sentiment analysis failed:", error);
            return {
                label: "NEUTRAL",
                score: 0.5,
                confidence: "low",
                error: true,
            };
        }
    }

    // Phân tích intent từ patterns local
    analyzeIntent(message) {
        const lowerMessage = message.toLowerCase();

        for (const [intentType, keywords] of Object.entries(this.patterns)) {
            for (const keyword of keywords) {
                if (lowerMessage.includes(keyword.toLowerCase())) {
                    return {
                        intent: intentType,
                        confidence: 0.8,
                        keyword: keyword,
                    };
                }
            }
        }

        return {
            intent: "unknown",
            confidence: 0.1,
            keyword: null,
        };
    }

    // Trích xuất entities
    extractEntities(message) {
        const entities = [];
        const lowerMessage = message.toLowerCase();

        for (const [entityType, patterns] of Object.entries(
            this.entityPatterns
        )) {
            if (Array.isArray(patterns)) {
                for (const pattern of patterns) {
                    if (lowerMessage.includes(pattern.toLowerCase())) {
                        entities.push({
                            type: entityType,
                            value: pattern,
                            confidence: 0.9,
                        });
                    }
                }
            } else if (patterns instanceof RegExp) {
                const matches = message.match(patterns);
                if (matches) {
                    matches.forEach((match) => {
                        entities.push({
                            type: entityType,
                            value: match,
                            confidence: 0.95,
                        });
                    });
                }
            }
        }

        return entities;
    }

    // Tạo phản hồi thông minh
    async generateResponse(message) {
        try {
            console.log("🤖 Analyzing message:", message);

            // Phân tích parallel
            const [sentiment, intent] = await Promise.all([
                this.analyzeSentiment(message),
                Promise.resolve(this.analyzeIntent(message)),
            ]);

            const entities = this.extractEntities(message);

            console.log("📊 Analysis results:", {
                sentiment,
                intent,
                entities,
            });

            // Tạo phản hồi dựa trên intent
            let response = await this.generateIntentBasedResponse(
                intent,
                entities,
                sentiment
            );

            // Nếu không có phản hồi phù hợp, sử dụng AI generation
            if (!response || response.includes("Xin lỗi")) {
                response = await this.generateAIResponse(
                    message,
                    intent,
                    sentiment
                );
            }

            return {
                response,
                analysis: {
                    sentiment,
                    intent,
                    entities,
                    confidence: this.calculateOverallConfidence(
                        sentiment,
                        intent,
                        entities
                    ),
                },
            };
        } catch (error) {
            console.error("❌ Response generation failed:", error);
            return {
                response:
                    "Xin lỗi, tôi đang gặp sự cố kỹ thuật. Bạn có thể thử lại sau hoặc liên hệ trực tiếp với shop qua hotline.",
                analysis: {
                    sentiment: {
                        label: "NEUTRAL",
                        score: 0.5,
                        confidence: "low",
                    },
                    intent: { intent: "unknown", confidence: 0.1 },
                    entities: [],
                    confidence: "low",
                    error: true,
                },
            };
        }
    }

    // Tạo phản hồi dựa trên intent
    async generateIntentBasedResponse(intent, entities, sentiment) {
        const intentType = intent.intent;

        switch (intentType) {
            case "greetings":
                return this.getRandomResponse("greeting");

            case "product_inquiry":
                return this.handleProductInquiry(entities);

            case "price_inquiry":
                return this.handlePriceInquiry(entities);

            case "order_inquiry":
                return this.getRandomResponse("order_help");

            case "support_inquiry":
                return this.handleSupportInquiry(entities);

            case "farewell":
                return this.getRandomResponse("farewell");

            default:
                return null; // Sẽ fallback to AI response
        }
    }

    // Xử lý câu hỏi về sản phẩm
    handleProductInquiry(entities) {
        const productEntities = entities.filter(
            (e) => e.type === "yarn_types" || e.type === "knitting_tools"
        );

        if (productEntities.length > 0) {
            const product = productEntities[0].value;
            return `Chúng tôi có sản phẩm ${product} với nhiều màu sắc và kích cỡ khác nhau. Bạn muốn biết thêm thông tin gì về ${product}? Hoặc bạn có thể xem chi tiết trên website của shop.`;
        }

        return this.getRandomResponse("product_info");
    }

    // Xử lý câu hỏi về giá
    handlePriceInquiry(entities) {
        const productEntities = entities.filter(
            (e) => e.type === "yarn_types" || e.type === "knitting_tools"
        );

        if (productEntities.length > 0) {
            const product = productEntities[0].value;
            return `Giá ${product} tùy thuộc vào loại và chất lượng. Thông thường từ 15k-100k. Bạn có thể xem giá chi tiết trên website hoặc liên hệ shop để được tư vấn giá tốt nhất.`;
        }

        return this.getRandomResponse("price_info");
    }

    // Xử lý hỗ trợ
    handleSupportInquiry(entities) {
        return "Tôi có thể hỗ trợ bạn về: 🧶 Tư vấn sản phẩm len và dụng cụ, 💰 Thông tin giá cả, 📦 Hướng dẫn đặt hàng, 🚚 Chính sách giao hàng. Bạn cần hỗ trợ về vấn đề gì?";
    }

    // Tạo phản hồi bằng AI khi không match intent
    async generateAIResponse(message, intent, sentiment) {
        try {
            // Sử dụng conversational model để tạo phản hồi
            const context = `Tôi là trợ lý ảo của shop len đan móc. Khách hàng hỏi: "${message}"`;

            const result = await this.callHuggingFaceAPI(
                this.config.models.conversational,
                context,
                { max_length: 100, temperature: 0.7 }
            );

            if (result && result.generated_text) {
                let aiResponse = result.generated_text;

                // Post-process AI response
                aiResponse = this.postProcessAIResponse(aiResponse);

                return aiResponse;
            }
        } catch (error) {
            console.error("❌ AI response generation failed:", error);
        }

        // Fallback response
        return "Cảm ơn bạn đã liên hệ! Tôi sẽ chuyển câu hỏi của bạn cho nhân viên tư vấn. Hoặc bạn có thể liên hệ trực tiếp qua hotline để được hỗ trợ nhanh nhất.";
    }

    // Xử lý hậu kỳ cho AI response
    postProcessAIResponse(response) {
        // Loại bỏ context
        response = response.replace(/Tôi là trợ lý ảo.*?hỏi:\s*"/gi, "");
        response = response.replace(/^["']|["']$/g, "");

        // Đảm bảo phản hồi phù hợp với ngữ cảnh shop len
        if (
            !response.includes("len") &&
            !response.includes("shop") &&
            !response.includes("đan")
        ) {
            response +=
                " Bạn có cần tư vấn thêm về sản phẩm len hoặc dụng cụ đan móc không?";
        }

        return response.trim();
    }

    // Lấy phản hồi ngẫu nhiên từ template
    getRandomResponse(type) {
        const responses = this.responseTemplates[type];
        if (responses && responses.length > 0) {
            return responses[Math.floor(Math.random() * responses.length)];
        }
        return "Cảm ơn bạn đã liên hệ với shop len đan móc!";
    }

    // Tính toán độ tin cậy tổng thể
    calculateOverallConfidence(sentiment, intent, entities) {
        const sentimentConf =
            sentiment.confidence === "high"
                ? 0.8
                : sentiment.confidence === "medium"
                ? 0.6
                : 0.3;
        const intentConf = intent.confidence;
        const entityConf = entities.length > 0 ? 0.7 : 0.3;

        const overall = (sentimentConf + intentConf + entityConf) / 3;

        if (overall > 0.7) return "high";
        if (overall > 0.5) return "medium";
        return "low";
    }

    // Kiểm tra trạng thái service
    getStatus() {
        return {
            provider: "Hugging Face",
            modelsAvailable: Object.keys(this.config.models),
            cacheSize: this.cache.size,
            requestCount: this.requestCount,
            lastRequestTime: new Date(this.lastRequestTime).toLocaleString(),
            status: "active",
        };
    }

    // Clear cache
    clearCache() {
        this.cache.clear();
        console.log("🗑️ Cache cleared");
    }
}

// Global instance for browser usage
if (typeof window !== "undefined") {
    window.HuggingFaceNLPService = HuggingFaceNLPService;
}

// Export for modules
if (typeof module !== "undefined" && module.exports) {
    module.exports = HuggingFaceNLPService;
}
