const formdangnhap = document.getElementById("formdangnhap");
const EmailElement = document.getElementById("email");
const passwordElement = document.getElementById("password");
const toggleEyeLogin = document.getElementById("toggleEyeLogin");

if (toggleEyeLogin) {
  toggleEyeLogin.addEventListener("click", function () {
    const isHidden = passwordElement.type === "password";
    passwordElement.type = isHidden ? "text" : "password";
    toggleEyeLogin.classList.toggle("fa-eye");
    toggleEyeLogin.classList.toggle("fa-eye-slash");
  });
}

const AlertError = document.getElementById("AlertError");

// Hàm load dữ liệu admin từ data.json
async function loadAdminData() {
    try {
        const response = await fetch("../src/data.json");
        const data = await response.json();
        return data.admin || [];
    } catch (error) {
        console.error("Lỗi khi load dữ liệu admin:", error);
        return [];
    }
}

// Hàm xác thực admin
async function authenticateAdmin(email, password) {
    const adminData = await loadAdminData();

    // Kiểm tra thông tin admin từ data.json
    const adminUser = adminData.find(
        (admin) => admin.email === email && password === "admin123" // Mật khẩu mặc định cho admin
    );

    if (adminUser) {
        // Log admin login attempt
        console.log("Admin login successful:", adminUser.email);

        return {
            id: adminUser.id,
            name: adminUser.full_name || adminUser.username,
            email: adminUser.email,
            phone: adminUser.phone,
            address: adminUser.address,
            role: "admin",
            loginTime: new Date().toISOString(),
        };
    }

    return null;
}

// Hàm xác thực user từ localStorage
function authenticateUser(email, password) {
    const userLocal = JSON.parse(localStorage.getItem("user")) || [];

    const findUser = userLocal.find(
        (user) => user.email === email && user.password === password
    );

    if (findUser) {
        // Log user login attempt
        console.log("User login successful:", findUser.email);

        return {
            id: findUser.userID || "user_" + Date.now(),
            name:
                findUser.fullName ||
                findUser.fullname ||
                findUser.UserName ||
                findUser.name,
            email: findUser.email,
            phone: findUser.sdt || findUser.phone,
            address: findUser.address,
            role: findUser.role || "user",
            loginTime: new Date().toISOString(),
        };
    }

    return null;
}

// Hàm validate email
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Hàm validate password
function validatePassword(password) {
    return password.length >= 6; // Tối thiểu 6 ký tự
}

// Hàm xử lý lỗi đăng nhập
function handleLoginError(email, errorMessage) {
    const loginHistory = JSON.parse(localStorage.getItem("loginHistory")) || [];
    loginHistory.push({
        email: email,
        timestamp: new Date().toISOString(),
        success: false,
        error: errorMessage,
    });

    // Chỉ giữ lại 10 lần thử gần nhất
    if (loginHistory.length > 10) {
        loginHistory.splice(0, loginHistory.length - 10);
    }

    localStorage.setItem("loginHistory", JSON.stringify(loginHistory));
    showError(errorMessage);
}

// Hàm hiển thị thông báo lỗi
function showError(message) {
    AlertError.style.display = "block";
    AlertError.textContent = message;
}

// Hàm ẩn thông báo lỗi
function hideError() {
    AlertError.style.display = "none";
}

// Hàm xử lý đăng nhập thành công
function handleLoginSuccess(userData) {
    // Lưu thông tin login attempt
    const loginHistory = JSON.parse(localStorage.getItem("loginHistory")) || [];
    loginHistory.push({
        email: userData.email,
        role: userData.role,
        timestamp: new Date().toISOString(),
        success: true,
    });

    // Chỉ giữ lại 10 lần đăng nhập gần nhất
    if (loginHistory.length > 10) {
        loginHistory.splice(0, loginHistory.length - 10);
    }

    localStorage.setItem("loginHistory", JSON.stringify(loginHistory));

    if (userData.role === "admin") {
        setAdminLoginStatus(true, userData);
        alert("🎉 Đăng nhập Admin thành công! Chuyển đến trang quản trị...");
        window.location.href = "admin.html";
    } else {
        setUserLoginStatus(true, userData);
        alert("Đăng nhập thành công!");
        window.location.href = "trangchu.html";
    }

    // Xóa trạng thái cũ
    localStorage.removeItem("isLoginedIn");
}

// Lắng nghe sự kiện submit từ form đăng nhập
formdangnhap.addEventListener("submit", async function (e) {
    // Ngăn sự kiện load lại trang
    e.preventDefault();

    // Lấy giá trị input
    const email = EmailElement.value.trim();
    const password = passwordElement.value.trim();

    // Kiểm tra input trống
    if (!email || !password) {
        handleLoginError(email, "Vui lòng nhập đầy đủ email và mật khẩu!");
        return;
    }

    // Validate email format
    if (!validateEmail(email)) {
        handleLoginError(email, "Định dạng email không hợp lệ!");
        return;
    }

    // Validate password length
    if (!validatePassword(password)) {
        handleLoginError(email, "Mật khẩu phải có ít nhất 6 ký tự!");
        return;
    }

    // Ẩn thông báo lỗi trước khi xử lý
    hideError();

    try {
        // Xác thực admin trước
        const adminAuth = await authenticateAdmin(email, password);
        if (adminAuth) {
            handleLoginSuccess(adminAuth);
            return;
        }

        // Nếu không phải admin, xác thực user
        const userAuth = authenticateUser(email, password);
        if (userAuth) {
            handleLoginSuccess(userAuth);
            return;
        }

        // Nếu không tìm thấy tài khoản nào
        handleLoginError(email, "Email hoặc mật khẩu không đúng!");
    } catch (error) {
        console.error("Lỗi trong quá trình đăng nhập:", error);
        handleLoginError(
            email,
            "Có lỗi xảy ra trong quá trình đăng nhập. Vui lòng thử lại!"
        );
    }
});


