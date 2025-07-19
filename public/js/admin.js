// Admin Panel JavaScript
document.addEventListener("DOMContentLoaded", function () {
    console.log("Admin panel loaded");

    // Check if user is admin
    if (!checkAdminAccess()) {
        return;
    }

    // Load admin data
    loadAdminInfo();
    loadDashboardStats();

    // Initialize with sample data if empty
    initializeSampleData();

    // Load user list initially (hidden)
    loadUserList();
});

// Check admin access
function checkAdminAccess() {
    if (!isAdminLoggedIn()) {
        alert("Bạn không có quyền truy cập trang này!");
        window.location.href = "./dangnhap.html";
        return false;
    }
    return true;
}

// Initialize sample data if localStorage is empty
function initializeSampleData() {
    const users = JSON.parse(localStorage.getItem("user")) || [];

    // Add sample users if none exist
    if (users.length === 0) {
        const sampleUsers = [
            {
                userID: 1001,
                UserName: "Nguyễn Văn A",
                email: "nguyenvana@gmail.com",
                sdt: "0123456789",
                password: "123456",
                location: "Hà Nội",
                role: "user",
                createdAt: "2024-01-15T00:00:00.000Z",
                // Fields cũ để tương thích
                id: "user001",
                fullName: "Nguyễn Văn A",
                fullname: "Nguyễn Văn A",
                name: "Nguyễn Văn A",
                phone: "0123456789",
                address: "Hà Nội",
                status: "active",
                registrationDate: "2024-01-15",
            },
            {
                userID: 1002,
                UserName: "Trần Thị B",
                email: "tranthib@gmail.com",
                sdt: "0987654321",
                password: "123456",
                location: "Hồ Chí Minh",
                role: "user",
                createdAt: "2024-02-10T00:00:00.000Z",
                // Fields cũ để tương thích
                id: "user002",
                fullName: "Trần Thị B",
                fullname: "Trần Thị B",
                name: "Trần Thị B",
                phone: "0987654321",
                address: "Hồ Chí Minh",
                status: "active",
                registrationDate: "2024-02-10",
            },
            {
                userID: 1003,
                UserName: "Lê Văn C",
                email: "levanc@gmail.com",
                sdt: "0111222333",
                password: "123456",
                location: "Đà Nẵng",
                role: "user",
                createdAt: "2024-03-05T00:00:00.000Z",
                // Fields cũ để tương thích
                id: "user003",
                fullName: "Lê Văn C",
                fullname: "Lê Văn C",
                name: "Lê Văn C",
                phone: "0111222333",
                address: "Đà Nẵng",
                status: "banned",
                registrationDate: "2024-03-05",
            },
        ];

        localStorage.setItem("user", JSON.stringify(sampleUsers));
        console.log("Sample users added to localStorage");
    }
}

// Load admin info
function loadAdminInfo() {
    const adminData = getUserData();
    if (adminData) {
        const adminNameEl = document.getElementById("admin-name");
        const adminIdEl = document.getElementById("admin-id");

        if (adminNameEl) {
            adminNameEl.textContent = adminData.name || "Admin";
        }
        if (adminIdEl) {
            adminIdEl.textContent = adminData.id || "admin";
        }
    }
}

// Navigation functions
function showUserManagement() {
    console.log("showUserManagement called");

    if (!checkAdminAccess()) {
        console.log("Access denied");
        return;
    }

    const mainContent = document.getElementById("main-content");
    const userManagement = document.getElementById("user-management");

    console.log("Elements found:", {
        mainContent: !!mainContent,
        userManagement: !!userManagement,
    });

    if (mainContent) mainContent.style.display = "none";
    if (userManagement) userManagement.style.display = "block";

    loadUserList();
}

// Show dashboard function
function showDashboard() {
    console.log("showDashboard called");

    const mainContent = document.getElementById("main-content");
    const userManagement = document.getElementById("user-management");

    if (mainContent) mainContent.style.display = "block";
    if (userManagement) userManagement.style.display = "none";

    // Update dashboard stats
    loadDashboardStats();
    console.log("Dashboard displayed");
}

// Dashboard functions
function loadDashboardStats() {
    const users = JSON.parse(localStorage.getItem("user")) || [];
    const orders = JSON.parse(localStorage.getItem("orders")) || [];

    const totalUsersEl = document.getElementById("total-users");
    const totalOrdersEl = document.getElementById("total-orders");
    const totalRevenueEl = document.getElementById("total-revenue");

    if (totalUsersEl) {
        totalUsersEl.textContent = users.length;
    }

    if (totalOrdersEl) {
        totalOrdersEl.textContent = orders.length;
    }

    if (totalRevenueEl) {
        const totalRevenue = orders.reduce(
            (sum, order) => sum + (order.total || 0),
            0
        );
        totalRevenueEl.textContent = formatCurrency(totalRevenue);
    }
}

// User management functions
function loadUserList() {
    console.log("loadUserList called");

    const users = JSON.parse(localStorage.getItem("user")) || [];
    const userListEl = document.getElementById("userList");

    console.log("Users found:", users.length);
    console.log("userListEl found:", !!userListEl);

    if (!userListEl) {
        console.error("userList element not found");
        return;
    }

    if (users.length === 0) {
        userListEl.innerHTML = `
            <div class="empty-state">
                <p>Chưa có người dùng nào đăng ký</p>
                <p><small>Hãy thử tạo một tài khoản mới hoặc kiểm tra localStorage</small></p>
            </div>
        `;
        return;
    }

    let html = `
        <table class="user-table">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Tên</th>
                    <th>Email</th>
                    <th>Số điện thoại</th>
                    <th>Ngày đăng ký</th>
                    <th>Hành động</th>
                </tr>
            </thead>
            <tbody>
    `;

    users.forEach((user, index) => {
        html += `
            <tr>
                <td>${user.id || index + 1}</td>
                <td>${user.fullName || user.fullname || user.name || "N/A"}</td>
                <td>${user.email}</td>
                <td>${user.sdt || user.phone || "N/A"}</td>
                <td>${
                    user.registrationDate || new Date().toLocaleDateString()
                }</td>
                <td>
                    <button onclick="editUser(${index})" class="btn btn-edit">
                        <i class="fas fa-edit"></i> Sửa
                    </button>
                    <button onclick="deleteUser(${index})" class="btn btn-delete">
                        <i class="fas fa-trash"></i> Xóa
                    </button>
                </td>
            </tr>
        `;
    });

    html += `</tbody></table>`;
    userListEl.innerHTML = html;
    console.log("User list rendered successfully");
}

function refreshUserList() {
    loadUserList();
    alert("Đã làm mới danh sách người dùng!");
}

// Add new user function
function addNewUser() {
    const name = prompt("Nhập tên người dùng:");
    if (!name || name.trim() === "") {
        alert("Vui lòng nhập tên!");
        return;
    }

    const email = prompt("Nhập email:");
    if (!email || email.trim() === "") {
        alert("Vui lòng nhập email!");
        return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert("Email không đúng định dạng!");
        return;
    }

    const phone = prompt("Nhập số điện thoại:");
    if (!phone || phone.trim() === "") {
        alert("Vui lòng nhập số điện thoại!");
        return;
    }

    const password = prompt("Nhập mật khẩu (ít nhất 6 ký tự):");
    if (!password || password.trim() === "") {
        alert("Vui lòng nhập mật khẩu!");
        return;
    }

    if (password.length < 6) {
        alert("Mật khẩu phải có ít nhất 6 ký tự!");
        return;
    }

    const location = prompt("Nhập địa chỉ:");
    if (!location || location.trim() === "") {
        alert("Vui lòng nhập địa chỉ!");
        return;
    }

    // Get existing users from localStorage
    const users = JSON.parse(localStorage.getItem("user")) || [];

    // Check if email already exists
    const existingUser = users.find((user) => user.email === email.trim());
    if (existingUser) {
        alert("Email đã tồn tại!");
        return;
    }

    // Create new user object - đồng bộ với cấu trúc từ dangky.js
    const newUser = {
        userID: Math.ceil(Math.random() * 1000000000), // Đồng bộ với dangky.js
        UserName: name.trim(), // Đồng bộ với dangky.js (chữ U viết hoa)
        email: email.trim(),
        sdt: phone.trim(),
        password: password.trim(),
        location: location.trim(), // Đồng bộ với dangky.js
        role: "user",
        createdAt: new Date().toISOString(), // Thêm thời gian tạo
        // Giữ lại các field cũ để tương thích
        id: "user" + Date.now(),
        fullName: name.trim(),
        fullname: name.trim(),
        name: name.trim(),
        phone: phone.trim(),
        address: location.trim(),
        status: "active",
        registrationDate: new Date().toLocaleDateString(),
    };

    // Add new user to array
    users.push(newUser);

    // Save to localStorage with key "user" (not "users")
    localStorage.setItem("user", JSON.stringify(users));

    alert("Đã thêm người dùng mới thành công!");
    loadUserList();
    loadDashboardStats();
}

function searchUsers() {
    const searchTerm = document
        .getElementById("userSearch")
        .value.toLowerCase();
    const users = JSON.parse(localStorage.getItem("user")) || [];
    const userListEl = document.getElementById("userList");

    if (!userListEl) return;

    const filteredUsers = users.filter(
        (user) =>
            (user.fullName || user.fullname || user.name || "")
                .toLowerCase()
                .includes(searchTerm) ||
            user.email.toLowerCase().includes(searchTerm) ||
            (user.sdt || user.phone || "").toLowerCase().includes(searchTerm)
    );

    if (filteredUsers.length === 0) {
        userListEl.innerHTML = `
            <div class="empty-state">
                <p>Không tìm thấy người dùng nào với từ khóa: "${searchTerm}"</p>
            </div>
        `;
        return;
    }

    let html = `
        <table class="user-table">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Tên</th>
                    <th>Email</th>
                    <th>Số điện thoại</th>
                    <th>Ngày đăng ký</th>
                    <th>Hành động</th>
                </tr>
            </thead>
            <tbody>
    `;

    filteredUsers.forEach((user, filteredIndex) => {
        const originalIndex = users.findIndex((u) => u.email === user.email);

        html += `
            <tr>
                <td>${user.id || originalIndex + 1}</td>
                <td>${user.fullName || user.fullname || user.name || "N/A"}</td>
                <td>${user.email}</td>
                <td>${user.sdt || user.phone || "N/A"}</td>
                <td>${
                    user.registrationDate || new Date().toLocaleDateString()
                }</td>
                <td>
                    <button onclick="editUser(${originalIndex})" class="btn btn-edit">
                        <i class="fas fa-edit"></i> Sửa
                    </button>
                    <button onclick="deleteUser(${originalIndex})" class="btn btn-delete">
                        <i class="fas fa-trash"></i> Xóa
                    </button>
                </td>
            </tr>
        `;
    });

    html += `</tbody></table>`;
    userListEl.innerHTML = html;
}

function deleteUser(index) {
    if (confirm("Bạn có chắc chắn muốn xóa user này?")) {
        const users = JSON.parse(localStorage.getItem("user")) || [];
        if (users[index]) {
            const deletedUser = users.splice(index, 1)[0];
            localStorage.setItem("user", JSON.stringify(users));
            alert(
                `Đã xóa người dùng ${
                    deletedUser.fullName || deletedUser.name
                } thành công!`
            );
            loadUserList();
            loadDashboardStats();
        }
    }
}

function editUser(index) {
    const users = JSON.parse(localStorage.getItem("user")) || [];
    const user = users[index];

    if (!user) return;

    const newName = prompt(
        "Nhập tên mới:",
        user.fullName || user.fullname || user.name || ""
    );
    const newPhone = prompt(
        "Nhập số điện thoại mới:",
        user.sdt || user.phone || ""
    );

    if (newName !== null && newName.trim() !== "") {
        user.fullName = newName.trim();
        user.fullname = newName.trim(); // Compatibility
        user.name = newName.trim();
    }

    if (newPhone !== null && newPhone.trim() !== "") {
        user.sdt = newPhone.trim();
        user.phone = newPhone.trim(); // Compatibility
    }

    localStorage.setItem("user", JSON.stringify(users));
    loadUserList();
    alert("Đã cập nhật thông tin user thành công!");
}

// Add function management
function addFunction(functionName) {
    const activeFunctions = document.getElementById("active-functions");
    if (activeFunctions) {
        const li = document.createElement("li");
        li.textContent = functionName;
        activeFunctions.appendChild(li);
    }
    alert(`Đã thêm chức năng: ${functionName}`);
}

// Utility functions
function formatCurrency(amount) {
    return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
    }).format(amount);
}

function adminLogout() {
    if (confirm("Bạn có chắc chắn muốn đăng xuất?")) {
        logout();
    }
}

// Make functions globally available
window.showUserManagement = showUserManagement;
window.refreshUserList = refreshUserList;
window.searchUsers = searchUsers;
window.addNewUser = addNewUser;
window.deleteUser = deleteUser;
window.editUser = editUser;
window.adminLogout = adminLogout;

// Add CSS styles for better UX
document.addEventListener("DOMContentLoaded", function () {
    const style = document.createElement("style");
    style.textContent = `
        .user-table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
        }
        
        .user-table th,
        .user-table td {
            border: 1px solid #ddd;
            padding: 12px;
            text-align: left;
        }
        
        .user-table th {
            background-color: #f2f2f2;
            font-weight: bold;
        }
        
        .user-table tr:nth-child(even) {
            background-color: #f9f9f9;
        }
        
        .status-active {
            color: #28a745;
            font-weight: bold;
        }
        
        .status-banned {
            color: #dc3545;
            font-weight: bold;
        }
        
        .btn-toggle {
            background-color: #ffc107;
            color: #212529;
            border: none;
            padding: 6px 12px;
            border-radius: 4px;
            cursor: pointer;
            margin-right: 5px;
        }
        
        .btn-toggle:hover {
            background-color: #e0a800;
        }
        
        .btn-delete {
            background-color: #dc3545;
            color: white;
            border: none;
            padding: 6px 12px;
            border-radius: 4px;
            cursor: pointer;
        }
        
        .btn-delete:hover {
            background-color: #c82333;
        }
        
        .empty-state {
            text-align: center;
            padding: 40px;
            color: #666;
        }
        
        .user-controls {
            margin-bottom: 20px;
            display: flex;
            gap: 10px;
            align-items: center;
        }
        
        .btn-refresh {
            background-color: #007bff;
            color: white;
            border: none;
            padding: 8px 16px;
            border-radius: 4px;
            cursor: pointer;
        }
        
        .btn-refresh:hover {
            background-color: #0056b3;
        }
        
        #userSearch {
            padding: 8px;
            border: 1px solid #ddd;
            border-radius: 4px;
            width: 300px;
        }
        
        .user-table select {
            padding: 4px;
            border: 1px solid #ddd;
            border-radius: 4px;
        }
        
        .btn-edit {
            background-color: #28a745;
            color: white;
            border: none;
            padding: 6px 12px;
            border-radius: 4px;
            cursor: pointer;
            margin-right: 5px;
        }
        
        .btn-edit:hover {
            background-color: #218838;
        }
    `;
    document.head.appendChild(style);
});
