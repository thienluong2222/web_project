// Script tạo tài khoản admin
document.addEventListener("DOMContentLoaded", function () {
    // Tạo admin account nếu chưa có
    const existingUsers = JSON.parse(localStorage.getItem("user") || "[]");

    // Kiểm tra xem đã có admin chưa
    const existingAdmin = existingUsers.find((user) => user.role === "admin");

    if (!existingAdmin) {
        const adminUser = {
            id: "admin_001",
            fullname: "Administrator",
            fullName: "Administrator", // Thêm cả hai key để tương thích
            email: "admin@lenmoc.com",
            password: "admin123",
            phone: "0123456789",
            role: "admin",
            registrationDate: new Date().toLocaleDateString(),
        };

        existingUsers.push(adminUser);
        localStorage.setItem("user", JSON.stringify(existingUsers));

        console.log("🔑 Đã tạo tài khoản admin:");
        console.log("📧 Email: admin@lenmoc.com");
        console.log("🔒 Password: admin123");
        console.log("👑 Role: admin");

        // Hiển thị thông báo trên trang
        showAdminCreatedNotification();
    } else {
        console.log("✅ Tài khoản admin đã tồn tại:");
        console.log("📧 Email:", existingAdmin.email);
        console.log("👑 Role:", existingAdmin.role);
    }

    // Thêm nút đăng nhập admin nhanh nếu đang ở trang đăng nhập
    if (window.location.pathname.includes("dangnhap.html")) {
        addAdminLoginButton();
    }
});

function showAdminCreatedNotification() {
    const notification = document.createElement("div");
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #28a745;
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        z-index: 10000;
        font-family: 'Quicksand', sans-serif;
        max-width: 300px;
    `;

    notification.innerHTML = `
        <h4 style="margin: 0 0 10px 0;">🔑 Tài khoản Admin đã được tạo!</h4>
        <p style="margin: 5px 0;"><strong>Email:</strong> admin@lenmoc.com</p>
        <p style="margin: 5px 0;"><strong>Password:</strong> admin123</p>
        <p style="margin: 10px 0 0 0; font-size: 12px; opacity: 0.9;">
            Sử dụng thông tin này để đăng nhập admin
        </p>
    `;

    document.body.appendChild(notification);

    // Tự động ẩn sau 8 giây
    setTimeout(() => {
        notification.style.opacity = "0";
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 8000);
}

function addAdminLoginButton() {
    const loginForm = document.getElementById("formdangnhap");
    if (loginForm) {
        // Tạo container cho các nút test
        const testContainer = document.createElement("div");
        testContainer.style.cssText = `
            margin-top: 15px;
            padding: 15px;
            border-top: 1px solid #eee;
        `;

        // Nút đăng nhập admin
        const adminButton = document.createElement("button");
        adminButton.type = "button";
        adminButton.innerHTML = "👑 Đăng nhập Admin";
        adminButton.style.cssText = `
            width: 100%;
            padding: 12px;
            margin-bottom: 8px;
            background: #dc3545;
            color: white;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-size: 14px;
            font-weight: 600;
            transition: background 0.3s ease;
        `;

        adminButton.addEventListener("mouseover", () => {
            adminButton.style.background = "#c82333";
        });

        adminButton.addEventListener("mouseout", () => {
            adminButton.style.background = "#dc3545";
        });

        adminButton.addEventListener("click", function () {
            document.getElementById("email").value = "admin@lenmoc.com";
            document.getElementById("password").value = "admin123";

            // Trigger submit
            const submitEvent = new Event("submit", {
                bubbles: true,
                cancelable: true,
            });
            loginForm.dispatchEvent(submitEvent);
        });

        // Nút đăng nhập user thường
        const userButton = document.createElement("button");
        userButton.type = "button";
        userButton.innerHTML = "👤 Đăng nhập User (test@example.com)";
        userButton.style.cssText = `
            width: 100%;
            padding: 12px;
            background: #28a745;
            color: white;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-size: 14px;
            font-weight: 600;
            transition: background 0.3s ease;
        `;

        userButton.addEventListener("mouseover", () => {
            userButton.style.background = "#218838";
        });

        userButton.addEventListener("mouseout", () => {
            userButton.style.background = "#28a745";
        });

        userButton.addEventListener("click", function () {
            document.getElementById("email").value = "test@example.com";
            document.getElementById("password").value = "123456";

            // Trigger submit
            const submitEvent = new Event("submit", {
                bubbles: true,
                cancelable: true,
            });
            loginForm.dispatchEvent(submitEvent);
        });

        // Thêm title
        const title = document.createElement("h4");
        title.textContent = "🧪 Test Login";
        title.style.cssText = `
            margin: 0 0 10px 0;
            color: #666;
            font-size: 14px;
            text-align: center;
        `;

        testContainer.appendChild(title);
        testContainer.appendChild(adminButton);
        testContainer.appendChild(userButton);

        loginForm.appendChild(testContainer);
    }
}

// Hàm kiểm tra xem có phải admin không (cho debugging)
function checkCurrentUserRole() {
    const userData = JSON.parse(localStorage.getItem("userData") || "null");
    if (userData) {
        console.log("👤 Current user:", userData.name);
        console.log("📧 Email:", userData.email);
        console.log("👑 Role:", userData.role);
        console.log("🔐 Is Admin:", userData.role === "admin");
    } else {
        console.log("❌ No user logged in");
    }
}

// Export function to global scope for debugging
window.checkCurrentUserRole = checkCurrentUserRole;
