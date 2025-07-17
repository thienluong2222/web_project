// Authentication utilities
function isUserLoggedIn() {
    return localStorage.getItem("isLoggedIn") === "true";
}

function isAdminLoggedIn() {
    const userData = getUserData();
    return isUserLoggedIn() && userData && userData.role === "admin";
}

function setUserLoginStatus(isLoggedIn, userData = null) {
    localStorage.setItem("isLoggedIn", isLoggedIn.toString());
    if (isLoggedIn && userData) {
        localStorage.setItem("userData", JSON.stringify(userData));
    } else {
        localStorage.removeItem("userData");
    }
    updateNavbarState();
}

function setAdminLoginStatus(isLoggedIn, adminData = null) {
    const adminInfo = {
        ...adminData,
        role: "admin",
    };
    setUserLoginStatus(isLoggedIn, adminInfo);
}

function getUserData() {
    const userData = localStorage.getItem("userData");
    return userData ? JSON.parse(userData) : null;
}

function logout() {
    console.log("logout() function called from auth-utils.js");
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userData");
    localStorage.removeItem("isLoginedIn"); // Remove old key too
    // Có thể giữ lại giỏ hàng hoặc xóa tùy theo yêu cầu
    // localStorage.removeItem("cart"); // Uncomment nếu muốn xóa giỏ hàng khi logout
    updateNavbarState();

    // Redirect về trang chủ hoặc trang đăng nhập
    if (window.location.pathname.includes("profile.html")) {
        alert("Đăng xuất thành công!");
        window.location.href = "trangchu.html";
    }
}

// Make functions globally available
window.logout = logout;
window.isUserLoggedIn = isUserLoggedIn;
window.setUserLoginStatus = setUserLoginStatus;
window.getUserData = getUserData;

function updateNavbarState() {
    const navbarAuth = document.querySelector(".navbar__auth");
    const navbarAfter = document.querySelector(".navbar__after");

    if (!navbarAuth && !navbarAfter) return;

    if (isUserLoggedIn()) {
        // Desktop: Ẩn nút đăng ký/đăng nhập, hiển thị icon profile và giỏ hàng
        if (navbarAuth) navbarAuth.style.display = "none";
        if (navbarAfter) navbarAfter.style.display = "flex";

        // Mobile responsive: Ẩn .show class nếu có
        if (navbarAuth) navbarAuth.classList.remove("show");

        // Thêm nút logout vào auth section cho mobile
        updateAuthSectionForMobile(true);

        // Cập nhật cart count - sử dụng cả ID cũ và mới
        if (window.updateCartCount) {
            window.updateCartCount();
        }
        if (window.cartManager) {
            window.cartManager.updateCartCount();
        }

        // Cập nhật cho cart-utils.js compatibility
        const cart = JSON.parse(localStorage.getItem("cart") || "[]");
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

        // Template cart counter
        const cartCounter = document.getElementById("cart-counter");
        if (cartCounter) {
            cartCounter.textContent = totalItems;
            cartCounter.style.display =
                totalItems > 0 ? "inline-block" : "none";
        }

        // Legacy cart count
        const cartCount = document.getElementById("cartCount");
        if (cartCount) {
            cartCount.textContent = totalItems;
            cartCount.style.display = totalItems > 0 ? "inline-block" : "none";
        }
    } else {
        // Desktop: Hiển thị nút đăng ký/đăng nhập, ẩn icon profile và giỏ hàng
        if (navbarAuth) navbarAuth.style.display = "flex";
        if (navbarAfter) navbarAfter.style.display = "none";

        // Mobile responsive: Ẩn .show class nếu có
        if (navbarAfter) navbarAfter.classList.remove("show");

        // Khôi phục auth section ban đầu cho mobile
        updateAuthSectionForMobile(false);
    }
}

function updateAuthSectionForMobile(isLoggedIn) {
    const navbarAuth = document.querySelector(".navbar__auth");
    if (!navbarAuth) return;

    if (isLoggedIn) {
        // Thay thế nội dung auth section bằng nút logout
        navbarAuth.innerHTML = `
            <li>
                <a href="#" id="logout-btn" class="navbar__auth-link navbar__auth-link--primary">
                    <i class="fas fa-sign-out-alt"></i> Đăng Xuất
                </a>
            </li>
        `;

        // Thêm event listener cho nút logout mới
        const logoutBtn = document.getElementById("logout-btn");
        if (logoutBtn) {
            logoutBtn.addEventListener("click", function (e) {
                e.preventDefault();
                logout();
            });
        }
    } else {
        // Khôi phục nội dung auth section ban đầu
        navbarAuth.innerHTML = `
            <li>
                <a href="./dangky.html" class="navbar__auth-link">Đăng Ký</a>
            </li>
            <li>
                <a href="./dangnhap.html" class="navbar__auth-link navbar__auth-link--primary">Đăng Nhập</a>
            </li>
        `;
    }
}

// Khởi tạo navbar state khi trang load
document.addEventListener("DOMContentLoaded", function () {
    updateNavbarState();

    // Thêm event listener cho nút logout nếu có
    const logoutBtn = document.getElementById("logout-btn");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", function (e) {
            e.preventDefault();
            logout();
        });
    }
});

// Hàm demo để test đăng nhập (sẽ được thay thế bằng logic thực tế)
function demoLogin() {
    const userData = {
        id: "user123",
        name: "Người dùng Demo",
        email: "demo@example.com",
    };
    setUserLoginStatus(true, userData);
    alert("Đăng nhập thành công!");
}

function demoLogout() {
    logout();
    alert("Đăng xuất thành công!");
}
