// Navbar Component - Tái sử dụng cho tất cả các trang
function createNavbar() {
    return `
        <nav class="navbar">
            <div class="navbar__container">
                <!-- Logo -->
                <a href="./trangchu.html" class="navbar__brand">
                    <img
                        src="./images/image.png"
                        alt="Len Móc Logo"
                        class="navbar__logo"
                    />
                    <span class="navbar__brand-text">Len Móc</span>
                </a>

                <!-- Mobile Toggle Button -->
                <button class="navbar__toggle" id="navbarToggle">
                    <i class="fas fa-bars"></i>
                </button>

                <!-- Navigation Links -->
                <ul class="navbar__links" id="navbarLinks">
                    <li>
                        <a href="./trangchu.html" class="navbar__link">Trang Chủ</a>
                    </li>
                    <li>
                        <a href="./Catalog_Page.html" class="navbar__link">Sản Phẩm</a>
                    </li>
                    <li><a href="./tintuc.html" class="navbar__link">Tin tức</a></li>
                    <li><a href="./contact.html" class="navbar__link">Liên Hệ</a></li>
                </ul>

                <!-- Auth Links (Before Login) -->
                <ul class="navbar__auth" id="navbarAuth">
                    <li>
                        <a href="./dangky.html" class="navbar__auth-link">Đăng Ký</a>
                    </li>
                    <li>
                        <a href="./dangnhap.html" class="navbar__auth-link navbar__auth-link--primary">Đăng Nhập</a>
                    </li>
                </ul>

                <!-- User Links (After Login) -->
                <ul class="navbar__after" id="navbarAfter" style="display: none;">
                    <li>
                        <a href="./cart.html" class="navbar__cart">
                            <i class="fa fa-shopping-bag"></i>
                            <span id="cart-counter" class="cart-counter">0</span>
                        </a>
                    </li>
                    <li>
                        <a href="./profile.html" class="navbar__profile">
                            <i class="fa fa-user-o"></i>
                        </a>
                    </li>
                    <li>
                        <a href="#" id="logoutBtn" class="navbar__logout" title="Đăng xuất">
                            <i class="fas fa-sign-out-alt"></i>
                        </a>
                    </li>
                </ul>
            </div>
        </nav>
        
        <!-- Chatbot Button -->
        <div class="chatbot-container">
            <button class="chatbot-toggle" id="chatbotToggle" title="Trợ lý ảo">
                <i class="fas fa-comment-dots"></i>
            </button>
            <div class="chatbot-popup" id="chatbotPopup" style="display: none;">
                <div class="chatbot-header">
                    <h4>Trợ lý ảo</h4>
                    <button class="chatbot-close" id="chatbotClose">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="chatbot-messages" id="chatbotMessages">
                    <div class="chatbot-message chatbot-message--bot">
                        <p>Xin chào! Tôi có thể giúp gì cho bạn?</p>
                    </div>
                </div>
                <div class="chatbot-input">
                    <input type="text" id="chatbotInput" placeholder="Nhập tin nhắn..." />
                    <button id="chatbotSend">
                        <i class="fas fa-paper-plane"></i>
                    </button>
                </div>
            </div>
        </div>
    `;
}

// Hàm khởi tạo navbar
function initNavbar() {
    // Tìm header và chèn navbar vào
    const header = document.querySelector("header");
    if (header) {
        header.innerHTML = createNavbar();
    }

    // Khởi tạo event listeners
    const toggleBtn = document.getElementById("navbarToggle");
    const links = document.getElementById("navbarLinks");
    const auth = document.getElementById("navbarAuth");
    const after = document.getElementById("navbarAfter");

    if (toggleBtn) {
        toggleBtn.addEventListener("click", () => {
            links.classList.toggle("show");
            if (isUserLoggedIn()) {
                after.classList.toggle("show");
            } else {
                auth.classList.toggle("show");
            }
        });
    }

    // Event listener cho nút logout
    const logoutBtn = document.getElementById("logoutBtn");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", function (e) {
            e.preventDefault();
            logout();
        });
    }

    // Khởi tạo chatbot
    initChatbot();

    // Cập nhật số lượng giỏ hàng
    updateCartCount();

    // Cập nhật trạng thái navbar
    updateNavbarState();
}

// Khởi tạo chatbot
function initChatbot() {
    const chatbotToggle = document.getElementById("chatbotToggle");
    const chatbotPopup = document.getElementById("chatbotPopup");
    const chatbotClose = document.getElementById("chatbotClose");
    const chatbotInput = document.getElementById("chatbotInput");
    const chatbotSend = document.getElementById("chatbotSend");
    const chatbotMessages = document.getElementById("chatbotMessages");

    if (!chatbotToggle) return;

    // Toggle chatbot popup
    chatbotToggle.addEventListener("click", () => {
        const isVisible = chatbotPopup.style.display !== "none";
        chatbotPopup.style.display = isVisible ? "none" : "block";

        if (!isVisible) {
            chatbotInput.focus();
        }
    });

    // Close chatbot
    if (chatbotClose) {
        chatbotClose.addEventListener("click", () => {
            chatbotPopup.style.display = "none";
        });
    }

    // Send message
    function sendMessage() {
        const message = chatbotInput.value.trim();
        if (!message) return;

        // Add user message
        addChatMessage(message, "user");
        chatbotInput.value = "";

        // Simulate bot response
        setTimeout(() => {
            const response = generateBotResponse(message);
            addChatMessage(response, "bot");
        }, 1000);
    }

    // Event listeners for sending messages
    if (chatbotSend) {
        chatbotSend.addEventListener("click", sendMessage);
    }

    if (chatbotInput) {
        chatbotInput.addEventListener("keypress", (e) => {
            if (e.key === "Enter") {
                sendMessage();
            }
        });
    }

    // Add message to chat
    function addChatMessage(message, sender) {
        const messageDiv = document.createElement("div");
        messageDiv.className = `chatbot-message chatbot-message--${sender}`;
        messageDiv.innerHTML = `<p>${message}</p>`;

        chatbotMessages.appendChild(messageDiv);
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    }

    // Generate bot response
    function generateBotResponse(userMessage) {
        const message = userMessage.toLowerCase();

        // Câu trả lời dựa trên từ khóa
        if (message.includes("sản phẩm") || message.includes("len")) {
            return "Chúng tôi có nhiều loại len chất lượng cao như len Yarn Art Jeans, len sợi bông, len mohair. Bạn có muốn xem danh mục sản phẩm không?";
        }

        if (message.includes("giá") || message.includes("tiền")) {
            return "Giá sản phẩm của chúng tôi rất cạnh tranh. Bạn có thể xem giá cụ thể từng sản phẩm trong trang Sản Phẩm.";
        }

        if (message.includes("giao hàng") || message.includes("vận chuyển")) {
            return "Chúng tôi hỗ trợ giao hàng toàn quốc. Phí vận chuyển từ 30.000đ tùy theo khu vực.";
        }

        if (message.includes("thanh toán")) {
            return "Chúng tôi hỗ trợ thanh toán COD (thanh toán khi nhận hàng) và chuyển khoản ngân hàng.";
        }

        if (message.includes("đăng ký") || message.includes("tài khoản")) {
            return "Bạn có thể đăng ký tài khoản miễn phí để theo dõi đơn hàng và nhận ưu đãi đặc biệt.";
        }

        if (message.includes("liên hệ")) {
            return "Bạn có thể liên hệ với chúng tôi qua trang Liên Hệ hoặc hotline: 0123-456-789";
        }

        if (message.includes("giỏ hàng")) {
            return "Bạn có thể thêm sản phẩm vào giỏ hàng và thanh toán dễ dàng. Giỏ hàng sẽ được lưu ngay cả khi bạn chưa đăng nhập.";
        }

        // Câu trả lời mặc định
        const defaultResponses = [
            "Cảm ơn bạn đã liên hệ! Tôi có thể giúp bạn tìm hiểu về sản phẩm len, giá cả, giao hàng.",
            "Bạn có thể hỏi tôi về sản phẩm, giá cả, giao hàng, thanh toán hoặc cách đăng ký tài khoản.",
            "Tôi luôn sẵn sàng hỗ trợ bạn! Hãy hỏi tôi về bất kỳ điều gì liên quan đến sản phẩm len của chúng tôi.",
        ];

        return defaultResponses[
            Math.floor(Math.random() * defaultResponses.length)
        ];
    }
}

// Hàm cập nhật số lượng giỏ hàng
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

    // Cập nhật theo template navbar-template-complete.html
    const cartCountEl = document.getElementById("cart-counter");
    if (cartCountEl) {
        cartCountEl.textContent = totalItems;
        cartCountEl.style.display = totalItems > 0 ? "inline-block" : "none";
    }

    // Backward compatibility
    const oldCartCountEl = document.getElementById("cartCount");
    if (oldCartCountEl) {
        oldCartCountEl.textContent = totalItems;
        oldCartCountEl.style.display = totalItems > 0 ? "inline-block" : "none";
    }
}

// Khởi tạo khi DOM load
document.addEventListener("DOMContentLoaded", function () {
    initNavbar();
});

// Export functions
if (typeof window !== "undefined") {
    window.initNavbar = initNavbar;
    window.updateCartCount = updateCartCount;
}
