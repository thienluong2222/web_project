
const formdangnhap = document.getElementById("formdangnhap");
const EmailElement = document.getElementById("email");
const passwordElement = document.getElementById("password");
const AlertError = document.getElementById("AlertError");

//Lắng nghe sự kiện submit từ form đăng nhập tài khoản
formdangnhap.addEventListener("submit", function(e) {
    //Ngăn sự kiện load lại trang
    e.preventDefault();

    const userLocal = JSON.parse(localStorage.getItem("user")) || [];
//Tìm kiếm email, mật khẩu và số điện thoại mà người dùng nhập vào có tồn tại (từ form đăng ký)?
    const findUser = userLocal.find(user => 
        user.email === EmailElement.value &&
        user.password === passwordElement.value
    );

    if (!findUser) {
        AlertError.style.display = "block";//Nếu không thì thông báo lỗi để user nhập lại
    } else {
        window.location.href = "trangchu.html";//Nếu có thì đăng nhập thành công và chuyển về trang chủ
    }
});


