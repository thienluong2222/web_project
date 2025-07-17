// Admin Panel JavaScript
document.addEventListener("DOMContentLoaded", function () {
    // Check if user is admin
    checkAdminAccess();

    // Load admin data
    loadAdminInfo();
    loadDashboardStats();
    loadUserList();
});

// Check admin access
function checkAdminAccess() {
    if (!isAdminLoggedIn()) {
        alert("Bạn không có quyền truy cập trang này!");
        window.location.href = "./dangnhap.html";
        return;
    }
}

// Load admin info
function loadAdminInfo() {
    const adminData = getUserData();
    if (adminData) {
        document.getElementById(
            "admin-welcome"
        ).textContent = `Welcome, ${adminData.name}`;
        document.getElementById("admin-email").textContent = adminData.email;
    }
}

// Navigation functions
function showSection(sectionId) {
    // Hide all sections
    document.querySelectorAll(".admin-section").forEach((section) => {
        section.classList.remove("active");
    });

    // Remove active class from all buttons
    document.querySelectorAll(".admin-nav-btn").forEach((btn) => {
        btn.classList.remove("active");
    });

    // Show selected section
    document.getElementById(sectionId).classList.add("active");

    // Add active class to clicked button
    event.target.classList.add("active");

    // Load section data
    switch (sectionId) {
        case "dashboard":
            loadDashboardStats();
            break;
        case "users":
            loadUserList();
            break;
    }
}

// Dashboard functions
function loadDashboardStats() {
    const users = JSON.parse(localStorage.getItem("user")) || [];

    document.getElementById("total-users").textContent = users.length;
    document.getElementById("total-orders").textContent = "0"; // Placeholder
    document.getElementById("total-revenue").textContent = "0đ"; // Placeholder
}

// User management functions
function loadUserList() {
    const users = JSON.parse(localStorage.getItem("user")) || [];
    const tbody = document.getElementById("users-tbody");

    tbody.innerHTML = "";

    users.forEach((user, index) => {
        const row = `
            <tr>
                <td>${user.id || index + 1}</td>
                <td>${user.fullname || "N/A"}</td>
                <td>${user.email}</td>
                <td>${user.phone || "N/A"}</td>
                <td>${user.registrationDate || "N/A"}</td>
                <td>
                    <button class="btn btn-edit" onclick="editUser(${index})">
                        <i class="fas fa-edit"></i> Sửa
                    </button>
                    <button class="btn btn-delete" onclick="deleteUser(${index})">
                        <i class="fas fa-trash"></i> Xóa
                    </button>
                </td>
            </tr>
        `;
        tbody.innerHTML += row;
    });
}

function openAddUserModal() {
    document.getElementById("addUserModal").style.display = "block";
}

function deleteUser(index) {
    if (confirm("Bạn có chắc chắn muốn xóa user này?")) {
        const users = JSON.parse(localStorage.getItem("user")) || [];
        users.splice(index, 1);
        localStorage.setItem("user", JSON.stringify(users));
        loadUserList();
        loadDashboardStats();
        alert("Đã xóa user thành công!");
    }
}

function editUser(index) {
    const users = JSON.parse(localStorage.getItem("user")) || [];
    const user = users[index];

    const newName = prompt("Nhập tên mới:", user.fullname);
    const newPhone = prompt("Nhập số điện thoại mới:", user.phone);

    if (newName !== null) {
        users[index].fullname = newName;
    }
    if (newPhone !== null) {
        users[index].phone = newPhone;
    }

    localStorage.setItem("user", JSON.stringify(users));
    loadUserList();
    alert("Đã cập nhật user thành công!");
}

// Form handling
document.getElementById("addUserForm").addEventListener("submit", function (e) {
    e.preventDefault();

    const formData = new FormData(e.target);
    const newUser = {
        id: Date.now(),
        fullname: formData.get("fullname"),
        email: formData.get("email"),
        phone: formData.get("phone"),
        password: formData.get("password"),
        registrationDate: new Date().toLocaleDateString(),
    };

    const users = JSON.parse(localStorage.getItem("user")) || [];

    // Check if email already exists
    if (users.find((user) => user.email === newUser.email)) {
        alert("Email này đã tồn tại!");
        return;
    }

    users.push(newUser);
    localStorage.setItem("user", JSON.stringify(users));

    closeModal("addUserModal");
    loadUserList();
    loadDashboardStats();
    alert("Đã thêm user mới thành công!");

    e.target.reset();
});

// Utility functions
function closeModal(modalId) {
    document.getElementById(modalId).style.display = "none";
}

function refreshUserList() {
    loadUserList();
    alert("Đã làm mới danh sách users!");
}

function refreshProductList() {
    loadProductList();
    alert("Đã làm mới danh sách sản phẩm!");
}

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

// Close modal when clicking outside
window.onclick = function (event) {
    const modals = document.querySelectorAll(".modal");
    modals.forEach((modal) => {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    });
};
