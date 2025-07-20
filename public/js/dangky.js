/*Tác giả: Đỗ Thanh Uyên - B2205387 // Đồng tác giả: Phan Lương Thiện - B2308392
Nguồn tham khảo: ChatGPT.com, https://www.w3schools.com/, https://www.youtube.com/watch?v=u3xILzeQPEg, 
https://getbootstrap.com/docs/5.3/getting-started/introduction/ */
//js của trang Dang ky//

//Lấy Element của trang đăng ký//
const formdangky = document.getElementById("formdangky");
const UserNameElement = document.getElementById("UserName");
const EmailElement = document.getElementById("email");
const sdtElement = document.getElementById("sdt");

const passwordElement = document.getElementById("InputPassword");
const togglePassIcon = document.getElementById("toggleEye");

if (togglePassIcon) {
    togglePassIcon.addEventListener("click", function () {
        const isHidden = passwordElement.type === "password";
        passwordElement.type = isHidden ? "text" : "password";
        togglePassIcon.classList.toggle("fa-eye");
        togglePassIcon.classList.toggle("fa-eye-slash");
    });
}

const repasslElement = document.getElementById("ReInputPassword");
const toggleEyeRePass = document.getElementById("toggleEyeRePass");

if (toggleEyeRePass && repasslElement) {
    toggleEyeRePass.addEventListener("click", function () {
        const isHidden = repasslElement.type === "password";
        repasslElement.type = isHidden ? "text" : "password";
        toggleEyeRePass.classList.toggle("fa-eye");
        toggleEyeRePass.classList.toggle("fa-eye-slash");
    });
}

const locationElement = document.getElementById("location");

//Element liên quan đến lỗi//
const errorUserName = document.getElementById("errorUserName");
const errorEmail = document.getElementById("errorEmail");
const errorSdt = document.getElementById("errorSdt");
const errorPassword = document.getElementById("errorPassword");
const errorRePassword = document.getElementById("errorRePassword");
const errorLocation = document.getElementById("errorLocation");

//Lấy dữ liệu từ local
const userLocal = JSON.parse(localStorage.getItem("user")) || [];

/**
 * Validate địa chỉ Email - sử dụng regex đơn giản để đồng bộ với dangnhap.js
 * @param {*} email : Chuỗi email người dùng nhập vào
 * @returns : true nếu email đúng định dạng, false nếu email không đúng định dạng
 */
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Validate mật khẩu - phải có ít nhất 6 ký tự để đồng bộ với dangnhap.js
 * @param {*} password : Mật khẩu người dùng nhập vào
 * @returns : true nếu mật khẩu hợp lệ, false nếu không hợp lệ
 */
function validatePassword(password) {
    return password.length >= 6;
}

/**
 * Kiểm tra email đã tồn tại chưa
 * @param {*} email : Email cần kiểm tra
 * @returns : true nếu email đã tồn tại, false nếu chưa
 */
function isEmailExists(email) {
    return userLocal.some((user) => user.email === email);
}

formdangky.addEventListener("submit", function (e) {
    e.preventDefault();

    // Reset tất cả lỗi trước khi validate
    errorUserName.style.display = "none";
    errorEmail.style.display = "none";
    errorSdt.style.display = "none";
    errorPassword.style.display = "none";
    errorRePassword.style.display = "none";
    errorLocation.style.display = "none";

    let hasError = false;

    // Validate UserName
    if (!UserNameElement.value.trim()) {
        errorUserName.style.display = "block";
        errorUserName.innerHTML = "Vui lòng nhập tên người dùng";
        hasError = true;
    }

    // Validate Email
    if (!EmailElement.value.trim()) {
        errorEmail.style.display = "block";
        errorEmail.innerHTML = "Vui lòng nhập email";
        hasError = true;
    } else if (!validateEmail(EmailElement.value)) {
        errorEmail.style.display = "block";
        errorEmail.innerHTML = "Email không đúng định dạng";
        hasError = true;
    } else if (isEmailExists(EmailElement.value)) {
        errorEmail.style.display = "block";
        errorEmail.innerHTML = "Email đã được sử dụng";
        hasError = true;
    }

    // Validate SDT
    if (!sdtElement.value.trim()) {
        errorSdt.style.display = "block";
        errorSdt.innerHTML = "Vui lòng nhập số điện thoại";
        hasError = true;
    }

    // Validate Password
    if (!passwordElement.value) {
        errorPassword.style.display = "block";
        errorPassword.innerHTML = "Vui lòng nhập mật khẩu";
        hasError = true;
    } else if (!validatePassword(passwordElement.value)) {
        errorPassword.style.display = "block";
        errorPassword.innerHTML = "Mật khẩu phải có ít nhất 6 ký tự";
        hasError = true;
    }

    // Validate RePassword
    if (!repasslElement.value) {
        errorRePassword.style.display = "block";
        errorRePassword.innerHTML = "Vui lòng nhập lại mật khẩu";
        hasError = true;
    } else if (passwordElement.value !== repasslElement.value) {
        errorRePassword.style.display = "block";
        errorRePassword.innerHTML = "Mật khẩu không khớp";
        hasError = true;
    }

    // Validate Location
    if (!locationElement.value.trim()) {
        errorLocation.style.display = "block";
        errorLocation.innerHTML = "Vui lòng nhập địa chỉ";
        hasError = true;
    }

    // Nếu không có lỗi thì tạo user
    if (!hasError) {
        //Lấy dữ liệu và tạo thành user
        const user = {
            userID: Math.ceil(Math.random() * 1000000000), //Tạo id//
            UserName: UserNameElement.value.trim(),
            email: EmailElement.value.trim(),
            sdt: sdtElement.value.trim(),
            password: passwordElement.value,
            location: locationElement.value.trim(),
            role: "user", // Thêm role mặc định
            createdAt: new Date().toISOString(), // Thêm thời gian tạo
        };

        //Push user vào mảng userLocal
        userLocal.push(user);

        //Lưu trữ dữ liệu lên Local từ dữ liệu người dùng đã nhập ở trên nè
        localStorage.setItem("user", JSON.stringify(userLocal));

        alert("Đăng ký thành công!");
        //Chuyển hướng sang trang đăng nhập khi đăng ký thành công
        window.location.href = "dangnhap.html";
    }
});
