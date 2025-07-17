// Test script để tạo user mẫu cho việc test đăng nhập
document.addEventListener("DOMContentLoaded", function () {
    // Tạo user test nếu chưa có
    const existingUsers = JSON.parse(localStorage.getItem("user") || "[]");

    if (existingUsers.length === 0) {
        const testUser = {
            id: "test_user_001",
            fullName: "Người Dùng Test",
            email: "test@example.com",
            password: "123456",
            phone: "0123456789",
            role: "user",
        };

        localStorage.setItem("user", JSON.stringify([testUser]));
        console.log("Đã tạo user test:");
        console.log("Email: test@example.com");
        console.log("Password: 123456");
    }

    // Thêm nút test đăng nhập nhanh (chỉ cho development)
    if (window.location.pathname.includes("dangnhap.html")) {
        const loginForm = document.getElementById("formdangnhap");
        if (loginForm) {
            const testButton = document.createElement("button");
            testButton.type = "button";
            testButton.textContent = "Đăng nhập test (test@example.com)";
            testButton.style.cssText = `
                width: 100%;
                padding: 12px;
                margin-top: 10px;
                background: #28a745;
                color: white;
                border: none;
                border-radius: 6px;
                cursor: pointer;
                font-size: 14px;
            `;

            testButton.addEventListener("click", function () {
                document.getElementById("email").value = "test@example.com";
                document.getElementById("password").value = "123456";

                // Trigger submit
                const submitEvent = new Event("submit", {
                    bubbles: true,
                    cancelable: true,
                });
                loginForm.dispatchEvent(submitEvent);
            });

            loginForm.appendChild(testButton);
        }
    }
});
