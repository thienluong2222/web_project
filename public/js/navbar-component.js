// Navbar Component - Tái sử dụng cho tất cả các trang
function createNavbar() {
    return `
        <nav class="navbar">
            <div class="navbar__container">
                <button class="navbar__toggle" id="navbarToggle">
                    <i class="fas fa-bars"></i>
                </button>
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
                <ul class="navbar__auth" id="navbarAuth">
                    <li><a href="./dangky.html" class="navbar__auth-link">Đăng Ký</a></li>
                    <li>
                        <a href="./dangnhap.html" class="navbar__auth-link navbar__auth-link--primary">Đăng Nhập</a>
                    </li>
                </ul>
                <ul class="navbar__after" id="navbarAfter" style="display: none;">
                    <li>
                        <a href="./cart.html" class="navbar__icon-link" title="Giỏ hàng">
                            <i class="fas fa-shopping-cart"></i>
                            <span class="cart-count" id="cartCount">0</span>
                        </a>
                    </li>
                    <li>
                        <a href="./profile.html" class="navbar__icon-link" title="Tài khoản">
                            <i class="fas fa-user"></i>
                        </a>
                    </li>
                    <li>
                        <a href="#" id="logoutBtn" class="navbar__icon-link" title="Đăng xuất">
                            <i class="fas fa-sign-out-alt"></i>
                        </a>
                    </li>
                </ul>
            </div>
        </nav>
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

    // Cập nhật số lượng giỏ hàng
    updateCartCount();

    // Cập nhật trạng thái navbar
    updateNavbarState();
}

// Hàm cập nhật số lượng giỏ hàng
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const cartCountEl = document.getElementById("cartCount");
    if (cartCountEl) {
        cartCountEl.textContent = totalItems;
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
