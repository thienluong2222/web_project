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
        const cartContainer = document.getElementById("cart-items");
        const cartTotal = document.getElementById("cart-total");
        const cartCount = document.getElementById("cart-item-count");
        const emptyCartMessage = document.getElementById("empty-cart");
        const checkoutBtn = document.getElementById("checkout-btn");

        if (!cartContainer) return; // Không phải trang cart.html

        // Cập nhật số lượng sản phẩm
        if (cartCount) {
            cartCount.textContent = this.getTotalItems();
        }

        // Hiển thị thông báo giỏ hàng trống
        if (this.cart.length === 0) {
            if (emptyCartMessage) {
                emptyCartMessage.style.display = "block";
            }
            if (cartContainer) {
                cartContainer.innerHTML = "";
            }
            if (cartTotal) {
                cartTotal.textContent = "0";
            }
            if (checkoutBtn) {
                checkoutBtn.disabled = true;
            }
            return;
        }

        // Ẩn thông báo giỏ hàng trống
        if (emptyCartMessage) {
            emptyCartMessage.style.display = "none";
        }

        // Render các sản phẩm trong giỏ hàng
        cartContainer.innerHTML = this.cart
            .map(
                (item) => `
            <div class="cart-item" data-id="${item.id}">
                <div class="cart-item__image">
                    <img src="${item.image}" alt="${
                    item.name
                }" onerror="this.src='./images/image.png'">
                </div>
                <div class="cart-item__info">
                    <h3 class="cart-item__name">${item.name}</h3>
                    <div class="cart-item__price">${this.formatPrice(
                        item.price
                    )}</div>
                </div>
                <div class="cart-item__quantity">
                    <button class="quantity-btn minus" data-id="${
                        item.id
                    }">-</button>
                    <span class="quantity">${item.quantity}</span>
                    <button class="quantity-btn plus" data-id="${
                        item.id
                    }">+</button>
                </div>
                <div class="cart-item__total">
                    ${this.formatPrice(item.price * item.quantity)}
                </div>
                <button class="cart-item__remove" data-id="${item.id}">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `
            )
            .join("");

        // Cập nhật tổng tiền
        if (cartTotal) {
            cartTotal.textContent = this.formatPrice(this.calculateTotal());
        }

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

            // Nút tăng số lượng
            if (target.classList.contains("plus")) {
                const item = this.cart.find((item) => item.id === productId);
                if (item) {
                    this.updateQuantity(productId, item.quantity + 1);
                }
            }

            // Nút giảm số lượng
            if (target.classList.contains("minus")) {
                const item = this.cart.find((item) => item.id === productId);
                if (item && item.quantity > 1) {
                    this.updateQuantity(productId, item.quantity - 1);
                }
            }

            // Nút xóa sản phẩm
            if (
                target.classList.contains("cart-item__remove") ||
                target.closest(".cart-item__remove")
            ) {
                const removeBtn = target.closest(".cart-item__remove");
                if (removeBtn) {
                    const id = removeBtn.dataset.id;
                    if (
                        confirm(
                            "Bạn có chắc muốn xóa sản phẩm này khỏi giỏ hàng?"
                        )
                    ) {
                        this.removeFromCart(id);
                    }
                }
            }

            // Nút thanh toán
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
        this.showNotification("Đã xóa toàn bộ giỏ hàng!");
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

        // Redirect đến trang đơn hàng hoặc trang chủ
        window.location.href = "./profile.html?tab=orders";
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
});

// Export functions for global use
window.addToCart = addToCart;
window.CartManager = CartManager;
