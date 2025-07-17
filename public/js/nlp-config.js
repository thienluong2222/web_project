// Hugging Face API Configuration - Optimized for Vietnamese Chatbot
const HUGGINGFACE_CONFIG = {
    apiKey: process.env.HUGGINGFACE_API_KEY || "YOUR_API_KEY_HERE", // Move to environment variable
    baseUrl: "https://api-inference.huggingface.co/models",
    timeout: 15000,

    // Vietnamese Language Models
    models: {
        // Phân tích cảm xúc tiếng Việt
        sentiment: "wonrax/phobert-base-vietnamese-sentiment",

        // Tạo văn bản đối thoại
        conversational: "microsoft/DialoGPT-medium",

        // Phân loại văn bản (intent classification)
        classification: "vinai/phobert-base",

        // Question Answering cho tiếng Việt
        questionAnswering: "deepset/roberta-base-squad2",

        // Text generation
        textGeneration: "gpt2",
    },

    // Rate limiting
    rateLimit: {
        requestsPerMinute: 100,
        maxRetries: 3,
        retryDelay: 1000,
    },
};

// Patterns for Vietnamese yarn/knitting shop
const VIETNAMESE_PATTERNS = {
    // Lời chào
    greetings: [
        "xin chào",
        "chào bạn",
        "hello",
        "hi",
        "hế lô",
        "chào shop",
        "chào em",
        "chào anh",
        "chào chị",
    ],

    // Hỏi về sản phẩm
    product_inquiry: [
        "sản phẩm",
        "hàng hóa",
        "len",
        "kim móc",
        "kim đan",
        "dụng cụ",
        "công cụ",
        "đồ đan",
        "chỉ",
        "tìm kiếm",
        "có bán",
        "bán gì",
        "hàng gì",
        "loại nào",
    ],

    // Hỏi giá
    price_inquiry: [
        "giá",
        "bao nhiêu tiền",
        "giá bao nhiêu",
        "cost",
        "price",
        "tiền",
        "phí",
        "chi phí",
        "đắt không",
        "rẻ không",
    ],

    // Đặt hàng
    order_inquiry: [
        "đặt hàng",
        "mua",
        "order",
        "đặt mua",
        "thanh toán",
        "ship",
        "giao hàng",
        "vận chuyển",
        "nhận hàng",
    ],

    // Hỗ trợ
    support_inquiry: [
        "hỗ trợ",
        "giúp đỡ",
        "help",
        "liên hệ",
        "hotline",
        "tư vấn",
        "hướng dẫn",
        "cách sử dụng",
        "hướng dẫn đan",
    ],

    // Lời tạm biệt
    farewell: [
        "tạm biệt",
        "bye",
        "goodbye",
        "cảm ơn",
        "thanks",
        "kết thúc",
        "hẹn gặp lại",
        "chào nhé",
    ],

    // Sản phẩm cụ thể
    yarn_products: [
        "len yarnart",
        "len susan",
        "len milkcotton",
        "len mohair",
        "len xulamtoc",
        "len baby",
        "len silky wool",
    ],

    tools_products: [
        "kim móc",
        "kim đan",
        "kéo đan",
        "thước đo",
        "ghim cài",
        "túi đựng kim",
        "đếm mũi",
        "máy đếm",
        "kim tulip",
    ],
};

// Enhanced entity patterns for yarn shop
const ENTITY_PATTERNS = {
    // Sản phẩm len
    yarn_types: [
        "len yarnart jeans",
        "len xulamtoc",
        "len susan family",
        "len mohair",
        "len milkcotton",
        "len baby",
        "len silky wool",
    ],

    // Dụng cụ đan len
    knitting_tools: [
        "kim móc",
        "kim đan",
        "kim khâu",
        "kéo đan",
        "thước đo",
        "ghim cài",
        "máy đếm",
        "túi đựng",
        "kim tulip",
        "kim nhật",
    ],

    // Màu sắc
    colors: [
        "đỏ",
        "xanh dương",
        "xanh lá",
        "vàng",
        "đen",
        "trắng",
        "hồng",
        "tím",
        "cam",
        "nâu",
        "xám",
        "be",
    ],

    // Kích thước
    sizes: [
        "nhỏ",
        "vừa",
        "lớn",
        "xl",
        "l",
        "m",
        "s",
        "size 1",
        "size 2",
        "size 3",
        "số 3",
        "số 4",
        "số 5",
    ],

    // Số lượng và giá
    numbers: /\d+/g,
    price_range: /\d+[k]?(?:\s*-\s*\d+[k]?)?/g,

    // Thương hiệu
    brands: [
        "yarnart",
        "susan",
        "tulip",
        "hamanaka",
        "etimo",
        "lavender",
        "milkcotton",
    ],
};

// Responses templates for Hugging Face
const RESPONSE_TEMPLATES = {
    greeting: [
        "Xin chào! Tôi là trợ lý ảo của shop len đan móc. Tôi có thể giúp bạn tìm hiểu về sản phẩm len, kim đan, và dụng cụ đan móc. Bạn cần hỗ trợ gì?",
        "Chào bạn! Chào mừng đến với shop len đan móc. Tôi sẵn sàng tư vấn về các loại len, kim móc và hướng dẫn đan cho bạn.",
        "Hi! Tôi là chatbot hỗ trợ khách hàng. Bạn muốn tìm hiểu về sản phẩm nào trong shop?",
    ],

    product_info: [
        "Shop chúng tôi có nhiều loại len chất lượng cao như Yarnart Jeans, Susan Family, Mohair, Milkcotton. Bạn quan tâm loại len nào?",
        "Chúng tôi có đầy đủ dụng cụ đan len từ kim móc, kim đan đến các phụ kiện như kéo, thước đo, máy đếm mũi.",
        "Sản phẩm của shop bao gồm: len các loại, kim móc/đan, dụng cụ hỗ trợ, và các mẫu đan có sẵn.",
    ],

    price_info: [
        "Giá len từ 15k-50k/cuộn tùy loại. Kim móc từ 20k-100k/bộ. Bạn muốn biết giá cụ thể sản phẩm nào?",
        "Chúng tôi có nhiều mức giá phù hợp với mọi nhu cầu. Bạn có thể xem giá chi tiết trên website hoặc hỏi tôi về sản phẩm cụ thể.",
    ],

    order_help: [
        "Để đặt hàng, bạn có thể: 1) Thêm sản phẩm vào giỏ hàng trên website, 2) Liên hệ hotline, hoặc 3) Inbox fanpage. Tôi có thể hướng dẫn chi tiết!",
        "Chúng tôi hỗ trợ thanh toán COD, chuyển khoản và ship toàn quốc. Bạn muốn đặt hàng sản phẩm nào?",
    ],

    farewell: [
        "Cảm ơn bạn đã quan tâm đến shop! Chúc bạn đan móc vui vẻ và tạo ra những sản phẩm đẹp!",
        "Hẹn gặp lại bạn! Nếu có thắc mắc gì thêm, đừng ngần ngại liên hệ shop nhé!",
        "Tạm biệt và cảm ơn bạn! Chúc bạn có những giây phút thư giãn với hobby đan len!",
    ],
};

// Export for both ES6 modules and global scope
if (typeof module !== "undefined" && module.exports) {
    module.exports = {
        HUGGINGFACE_CONFIG,
        VIETNAMESE_PATTERNS,
        ENTITY_PATTERNS,
        RESPONSE_TEMPLATES,
    };
} else {
    // Global scope for browser
    window.HUGGINGFACE_CONFIG = HUGGINGFACE_CONFIG;
    window.VIETNAMESE_PATTERNS = VIETNAMESE_PATTERNS;
    window.ENTITY_PATTERNS = ENTITY_PATTERNS;
    window.RESPONSE_TEMPLATES = RESPONSE_TEMPLATES;
}
