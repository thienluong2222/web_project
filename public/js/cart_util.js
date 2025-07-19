// Tác giả: Phan Lương Thiện B2308392
// Nguồn: youtube.com

// Cart counter utility
function updateCartCounter() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const cartCounter = document.getElementById("cart-counter");
    const cartIcon = document.querySelector(".navbar__cart");

    if (cartCounter) {
        cartCounter.textContent = cart.length;

        // Hiển thị hoặc ẩn counter dựa trên số lượng
        if (cart.length > 0) {
            cartCounter.style.display = "inline-block";
        } else {
            cartCounter.style.display = "none";
        }
    }
}

// Gọi hàm khi trang được tải
document.addEventListener("DOMContentLoaded", updateCartCounter);

// Lắng nghe sự kiện thay đổi localStorage
window.addEventListener("storage", function (e) {
    if (e.key === "cart") {
        updateCartCounter();
    }
});

// Hàm helper để thêm sản phẩm vào giỏ hàng (có thể dùng từ các trang khác)
function addToCartGlobal(productId, quantity = 1) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    // Thêm sản phẩm theo số lượng
    for (let i = 0; i < quantity; i++) {
        cart.push(productId);
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCounter();

    // Trigger custom event để các trang khác có thể lắng nghe
    window.dispatchEvent(
        new CustomEvent("cartUpdated", {
            detail: {
                cart: cart,
                action: "add",
                productId: productId,
                quantity: quantity,
            },
        })
    );
}

// Lắng nghe custom event để update counter
window.addEventListener("cartUpdated", updateCartCounter);
