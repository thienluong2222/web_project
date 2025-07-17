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

//Lắng nghe sự kiện submit từ form đăng nhập tài khoản
formdangnhap.addEventListener("submit", function (e) {
    //Ngăn sự kiện load lại trang
    e.preventDefault();

    const userLocal = JSON.parse(localStorage.getItem("user")) || [];
    //Tìm kiếm email, mật khẩu và số điện thoại mà người dùng nhập vào có tồn tại (từ form đăng ký)?
    const findUser = userLocal.find(
        (user) =>
            user.email === EmailElement.value &&
            user.password === passwordElement.value
    );

    if (!findUser) {
        AlertError.style.display = "block"; //Nếu không thì thông báo lỗi để user nhập lại
        AlertError.textContent = "Email hoặc mật khẩu không đúng!";
    } else {
        // Sử dụng hệ thống auth mới
        const userData = {
            id: findUser.id || "user_" + Date.now(),
            name:
                findUser.fullName ||
                findUser.fullname ||
                findUser.name ||
                "User",
            email: findUser.email,
            phone: findUser.phone,
            role: findUser.role || "user",
        };

        // Cập nhật trạng thái đăng nhập mới - phân biệt admin và user
        if (userData.role === "admin") {
            setAdminLoginStatus(true, userData);
            alert(
                "🎉 Đăng nhập Admin thành công! Chuyển đến trang quản trị..."
            );
            window.location.href = "admin.html";
        } else {
            setUserLoginStatus(true, userData);
            alert("Đăng nhập thành công!");
            window.location.href = "trangchu.html";
        }

        // Xóa trạng thái cũ
        localStorage.removeItem("isLoginedIn");
        //Nếu có thì đăng nhập thành công và chuyển về trang chủ
    }
});


