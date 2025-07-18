// Cart functionality - Chức năng giỏ hàng
class CartManager {
    constructor() {
        this.cart = this.loadCart();
        this.initEventListeners();
        this.renderCart();
        this.updateCartCount();
    }

    // Load giỏ hàng từ localStorage
    loadCart() {
        const cart = localStorage.getItem("cart");
        return cart ? JSON.parse(cart) : [];
    }

    // Lưu giỏ hàng vào localStorage
    saveCart() {
        localStorage.setItem("cart", JSON.stringify(this.cart));
        this.updateCartCount();
        // Trigger event để các component khác có thể lắng nghe
        window.dispatchEvent(
            new CustomEvent("cartUpdated", {
                detail: { cart: this.cart },
            })
        );
    }

    // Thêm sản phẩm vào giỏ hàng
    addToCart(product) {
        const existingItem = this.cart.find((item) => item.id === product.id);

        if (existingItem) {
            existingItem.quantity += product.quantity || 1;
        } else {
            this.cart.push({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image,
                quantity: product.quantity || 1,
            });
        }

        this.saveCart();
        this.renderCart();
        this.showNotification("Đã thêm sản phẩm vào giỏ hàng!");
    }

    // Xóa sản phẩm khỏi giỏ hàng
    removeFromCart(productId) {
        this.cart = this.cart.filter((item) => item.id !== productId);
        this.saveCart();
        this.renderCart();
        this.showNotification("Đã xóa sản phẩm khỏi giỏ hàng!");
    }

    // Cập nhật số lượng sản phẩm
    updateQuantity(productId, quantity) {
        const item = this.cart.find((item) => item.id === productId);
        if (item) {
            if (quantity <= 0) {
                this.removeFromCart(productId);
            } else {
                item.quantity = quantity;
                this.saveCart();
                this.renderCart();
            }
        }
    }

    // Tính tổng tiền
    calculateTotal() {
        return this.cart.reduce((total, item) => {
            return total + item.price * item.quantity;
        }, 0);
    }

    // Tính tổng số lượng sản phẩm
    getTotalItems() {
        return this.cart.reduce((total, item) => total + item.quantity, 0);
    }

    // Cập nhật số lượng trên icon giỏ hàng
    updateCartCount() {
        const cartCountElements = document.querySelectorAll(
            "#cartCount, .cart-count"
        );
        const totalItems = this.getTotalItems();

        cartCountElements.forEach((element) => {
            if (element) {
                element.textContent = totalItems;
                element.style.display =
                    totalItems > 0 ? "inline-block" : "none";
            }
        });

        // Cập nhật cho cart_util.js compatibility
        if (window.updateCartCounter) {
            window.updateCartCounter();
        }
    }

    // Render giỏ hàng trên trang cart.html
    renderCart() {
        const cartContainer = document.getElementById("added-to-cart");
        const cartSubtotal = document.getElementById("subtotal");
        const cartTotal = document.getElementById("total-amount");
        const shippingFee = document.getElementById("shipping-fee");
        const checkoutBtn = document.querySelector(".cart-summary__button");
        const cartTitle = document.querySelector(".cart-items__title");

        if (!cartContainer) return; // Không phải trang cart.html

        // Cập nhật tiêu đề giỏ hàng
        if (cartTitle) {
            cartTitle.textContent = `Giỏ hàng của bạn (${this.getTotalItems()} sản phẩm)`;
        }

        // Hiển thị thông báo giỏ hàng trống
        if (this.cart.length === 0) {
            cartContainer.innerHTML = `
                <div class="empty-cart-message">
                    <i class="fas fa-shopping-cart" style="font-size: 48px; color: #ccc; margin-bottom: 20px;"></i>
                    <p>Giỏ hàng của bạn đang trống</p>
                    <a href="./Catalog_Page.html" class="continue-shopping-btn">Tiếp tục mua sắm</a>
                </div>
            `;

            if (cartSubtotal) cartSubtotal.textContent = "0 VNĐ";
            if (cartTotal) cartTotal.textContent = "0 VNĐ";
            if (shippingFee) shippingFee.textContent = "Miễn phí";
            if (checkoutBtn) checkoutBtn.disabled = true;
            return;
        }

        // Render các sản phẩm trong giỏ hàng
        cartContainer.innerHTML = `
            <h2 class="cart-items__title">Giỏ hàng của bạn (${this.getTotalItems()} sản phẩm)</h2>
            ${this.cart
                .map(
                    (item) => `
                <div class="cart-item" data-id="${item.id}">
                    <img
                        src="${item.image}"
                        alt="${item.name}"
                        class="cart-item__image"
                        onerror="this.src='./images/image.png'"
                    />
                    <div class="cart-item__details">
                        <h3 class="cart-item__name">${item.name}</h3>
                        <p class="cart-item__price">${this.formatPrice(
                            item.price
                        )}</p>
                        <div class="cart-item__quantity">
                            <button class="cart-item__quantity-button--decrease" data-id="${
                                item.id
                            }">-</button>
                            <input
                                type="text"
                                value="${item.quantity}"
                                class="cart-item__quantity-input"
                                data-id="${item.id}"
                                readonly
                            />
                            <button class="cart-item__quantity-button--increase" data-id="${
                                item.id
                            }">+</button>
                        </div>
                        <div class="cart-item__total">
                            Tổng: ${this.formatPrice(
                                item.price * item.quantity
                            )}
                        </div>
                    </div>
                    <button class="cart-item__remove" data-id="${
                        item.id
                    }">Xóa</button>
                </div>
            `
                )
                .join("")}
        `;

        // Cập nhật tổng tiền
        const subtotal = this.calculateTotal();
        const shipping = subtotal >= 150000 ? 0 : 30000; // Miễn phí vận chuyển cho đơn hàng trên 500k
        const total = subtotal + shipping;

        if (cartSubtotal) cartSubtotal.textContent = this.formatPrice(subtotal);
        if (shippingFee) {
            shippingFee.textContent =
                shipping === 0 ? "Miễn phí" : this.formatPrice(shipping);
        }
        if (cartTotal) cartTotal.textContent = this.formatPrice(total);

        // Enable checkout button
        if (checkoutBtn) {
            checkoutBtn.disabled = false;
        }
    }

    // Format giá tiền
    formatPrice(price) {
        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
        }).format(price);
    }

    // Khởi tạo event listeners
    initEventListeners() {
        // Event delegation for cart items
        document.addEventListener("click", (e) => {
            const target = e.target;
            const productId = target.dataset.id;

            // Nút tăng số lượng (cart.html style)
            if (
                target.classList.contains(
                    "cart-item__quantity-button--increase"
                )
            ) {
                const item = this.cart.find((item) => item.id === productId);
                if (item) {
                    this.updateQuantity(productId, item.quantity + 1);
                }
            }

            // Nút giảm số lượng (cart.html style)
            if (
                target.classList.contains(
                    "cart-item__quantity-button--decrease"
                )
            ) {
                const item = this.cart.find((item) => item.id === productId);
                if (item && item.quantity > 1) {
                    this.updateQuantity(productId, item.quantity - 1);
                }
            }

            // Nút tăng số lượng (original style)
            if (target.classList.contains("plus")) {
                const item = this.cart.find((item) => item.id === productId);
                if (item) {
                    this.updateQuantity(productId, item.quantity + 1);
                }
            }

            // Nút giảm số lượng (original style)
            if (target.classList.contains("minus")) {
                const item = this.cart.find((item) => item.id === productId);
                if (item && item.quantity > 1) {
                    this.updateQuantity(productId, item.quantity - 1);
                }
            }

            // Nút xóa sản phẩm
            if (target.classList.contains("cart-item__remove")) {
                if (
                    confirm("Bạn có chắc muốn xóa sản phẩm này khỏi giỏ hàng?")
                ) {
                    this.removeFromCart(productId);
                }
            }

            // Nút thanh toán (cart.html style)
            if (target.classList.contains("cart-summary__button")) {
                this.checkout();
            }

            // Nút thanh toán (original style)
            if (target.id === "checkout-btn") {
                this.checkout();
            }

            // Nút xóa toàn bộ giỏ hàng
            if (target.id === "clear-cart-btn") {
                if (confirm("Bạn có chắc muốn xóa toàn bộ giỏ hàng?")) {
                    this.clearCart();
                }
            }
        });

        // Xử lý input quantity change
        document.addEventListener("change", (e) => {
            const target = e.target;
            if (target.classList.contains("cart-item__quantity-input")) {
                const productId = target.dataset.id;
                const newQuantity = parseInt(target.value);

                if (newQuantity && newQuantity > 0) {
                    this.updateQuantity(productId, newQuantity);
                } else {
                    // Reset to current quantity if invalid
                    const item = this.cart.find(
                        (item) => item.id === productId
                    );
                    if (item) {
                        target.value = item.quantity;
                    }
                }
            }
        });

        // Lắng nghe event từ các trang khác
        window.addEventListener("addToCart", (e) => {
            this.addToCart(e.detail);
        });
    }

    // Xóa toàn bộ giỏ hàng
    clearCart() {
        this.cart = [];
        this.saveCart();
        this.renderCart();
        this.showNotification("Đã thanh toán!");
    }

    // Thanh toán
    checkout() {
        if (!isUserLoggedIn()) {
            alert("Vui lòng đăng nhập để thanh toán!");
            window.location.href = "./dangnhap.html";
            return;
        }

        if (this.cart.length === 0) {
            alert("Giỏ hàng của bạn đang trống!");
            return;
        }

        // Tạo đơn hàng
        const order = {
            id: "ORDER_" + Date.now(),
            items: [...this.cart],
            total: this.calculateTotal(),
            date: new Date().toISOString(),
            status: "pending",
            user: getUserData(),
        };

        // Lưu đơn hàng vào localStorage
        const orders = JSON.parse(localStorage.getItem("orders") || "[]");
        orders.push(order);
        localStorage.setItem("orders", JSON.stringify(orders));

        // Xóa giỏ hàng
        this.clearCart();

        alert(`Đặt hàng thành công! Mã đơn hàng: ${order.id}`);
    }

    // Hiển thị thông báo
    showNotification(message) {
        // Tạo notification element
        const notification = document.createElement("div");
        notification.className = "cart-notification";
        notification.textContent = message;

        // Thêm styles
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #4CAF50;
            color: white;
            padding: 12px 20px;
            border-radius: 6px;
            z-index: 1000;
            opacity: 0;
            transform: translateX(100%);
            transition: all 0.3s ease;
        `;

        document.body.appendChild(notification);

        // Animate in
        setTimeout(() => {
            notification.style.opacity = "1";
            notification.style.transform = "translateX(0)";
        }, 100);

        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.opacity = "0";
            notification.style.transform = "translateX(100%)";
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
}

// Hàm helper để thêm sản phẩm từ các trang khác
function addToCart(product) {
    if (window.cartManager) {
        window.cartManager.addToCart(product);
    } else {
        // Fallback: lưu vào localStorage và dispatch event
        const cart = JSON.parse(localStorage.getItem("cart") || "[]");
        const existingItem = cart.find((item) => item.id === product.id);

        if (existingItem) {
            existingItem.quantity += product.quantity || 1;
        } else {
            cart.push({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image,
                quantity: product.quantity || 1,
            });
        }

        localStorage.setItem("cart", JSON.stringify(cart));

        // Dispatch event
        window.dispatchEvent(
            new CustomEvent("addToCart", {
                detail: product,
            })
        );

        alert("Đã thêm sản phẩm vào giỏ hàng!");
    }
}

// Khởi tạo cart manager khi DOM loaded
document.addEventListener("DOMContentLoaded", function () {
    window.cartManager = new CartManager();

    // Thêm CSS cho empty cart message
    const style = document.createElement("style");
    style.textContent = `
        .empty-cart-message {
            text-align: center;
            padding: 60px 20px;
            color: #666;
        }
        
        .empty-cart-message p {
            margin: 20px 0;
            font-size: 18px;
        }
        
        .continue-shopping-btn {
            display: inline-block;
            padding: 12px 24px;
            background-color: #007bff;
            color: white;
            text-decoration: none;
            border-radius: 6px;
            transition: background-color 0.3s;
        }
        
        .continue-shopping-btn:hover {
            background-color: #0056b3;
            color: white;
        }
        
        .cart-item__total {
            font-size: 14px;
            color: #666;
            margin-top: 8px;
        }
        
        .cart-summary__button:disabled {
            background-color: #ccc;
            cursor: not-allowed;
        }
    `;
    document.head.appendChild(style);
});

// Export functions for global use
window.addToCart = addToCart;
window.CartManager = CartManager;
