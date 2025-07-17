# 🔑 HƯỚNG DẪN ĐĂNG NHẬP ADMIN

## 📋 Thông tin đăng nhập Admin

### Tài khoản Admin mặc định:

-   **Email:** `admin@lenmoc.com`
-   **Password:** `admin123`
-   **Role:** `admin`

---

## 🚀 Các cách đăng nhập Admin

### 🎯 Cách 1: Đăng nhập thủ công

1. Truy cập trang đăng nhập: `/dangnhap.html`
2. Nhập thông tin:
    - Email: `admin@lenmoc.com`
    - Password: `admin123`
3. Nhấn "Đăng nhập"
4. Hệ thống sẽ tự động chuyển đến trang Admin Panel

### 🎯 Cách 2: Sử dụng nút đăng nhập nhanh

1. Truy cập trang đăng nhập: `/dangnhap.html`
2. Cuộn xuống dưới form đăng nhập
3. Nhấn nút **"👑 Đăng nhập Admin"** màu đỏ
4. Hệ thống sẽ tự động điền thông tin và đăng nhập

### 🎯 Cách 3: Tạo admin qua Console (Development)

```javascript
// Mở Developer Tools (F12) và chạy lệnh sau:
const adminUser = {
    id: "admin_001",
    fullname: "Administrator",
    fullName: "Administrator",
    email: "admin@lenmoc.com",
    password: "admin123",
    phone: "0123456789",
    role: "admin",
    registrationDate: new Date().toLocaleDateString(),
};

const users = JSON.parse(localStorage.getItem("user") || "[]");
users.push(adminUser);
localStorage.setItem("user", JSON.stringify(users));
console.log("✅ Admin account created!");
```

---

## 🛡️ Tính năng Admin Panel

Sau khi đăng nhập thành công với quyền admin, bạn sẽ được chuyển đến `/admin.html` với các tính năng:

### 📊 Dashboard

-   Thống kê tổng quan
-   Số lượng users
-   Số lượng đơn hàng
-   Doanh thu

### 👥 Quản lý Users

-   Xem danh sách users
-   Thêm user mới
-   Sửa thông tin user
-   Xóa user
-   Tìm kiếm user

### 🛍️ Quản lý Sản phẩm (Đang phát triển)

-   Thêm sản phẩm
-   Sửa sản phẩm
-   Xóa sản phẩm
-   Quản lý danh mục

### 📦 Quản lý Đơn hàng (Đang phát triển)

-   Xem danh sách đơn hàng
-   Cập nhật trạng thái đơn hàng
-   In hóa đơn

---

## 🔧 Troubleshooting

### ❌ Không thể đăng nhập Admin

1. **Kiểm tra thông tin đăng nhập:**

    - Email: `admin@lenmoc.com`
    - Password: `admin123`

2. **Xóa dữ liệu cũ và tạo lại:**

    ```javascript
    // Mở Console (F12)
    localStorage.removeItem("user");
    location.reload(); // Script sẽ tự tạo lại admin
    ```

3. **Kiểm tra quyền hiện tại:**
    ```javascript
    // Mở Console (F12)
    checkCurrentUserRole(); // Function từ create-admin.js
    ```

### ❌ Bị chuyển về trang chủ thay vì admin panel

-   Đảm bảo user có `role: 'admin'`
-   Kiểm tra localStorage:
    ```javascript
    console.log(JSON.parse(localStorage.getItem("userData")));
    ```

### ❌ Trang admin.html báo "không có quyền truy cập"

-   Đăng xuất và đăng nhập lại bằng tài khoản admin
-   Xóa cache và reload trang

---

## 💡 Tips

1. **Để debug:** Sử dụng `checkCurrentUserRole()` trong Console
2. **Tạo user test:** Script sẽ tự tạo user test với email `test@example.com`, password `123456`
3. **Demo mode:** Có thể dùng nút đăng nhập nhanh để test
4. **Reset dữ liệu:** Xóa localStorage để reset về trạng thái ban đầu

---

## 🔒 Bảo mật

⚠️ **Chú ý:** Đây là hệ thống demo với localStorage. Trong production:

-   Sử dụng database thực
-   Mã hóa mật khẩu
-   Implement JWT tokens
-   Thêm rate limiting
-   Validate input đầy đủ
