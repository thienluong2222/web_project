/* Tác giả: Phan Lương Thiện B2308392
*/

// hàm này chuyển sang trang đăng nhập khi người dùng đăng xuất
function logout() {
  localStorage.setItem("isLoginedIn", "false");
  window.location.href = "./dangnhap.html";
}
// hàm này chuyển sang các tab (Thông tin của tôi, Địa chỉ của tôi, Đánh giá của tôi)
document.addEventListener("DOMContentLoaded", function () {
  // chọn những thẻ có class nav-link và data-tab-target
  const tabs = document.querySelectorAll(".nav-link[data-tab-target]");
  //    chọn những thẻ có class tab-pane
  const tabPanes = document.querySelectorAll(".tab-pane");
  // gán sự kiện click vào tab-pane tương ứng
  tabs.forEach((tab) => {
    tab.addEventListener("click", function () {
      // xoá active của tab cũ
      tabs.forEach((t) => t.classList.remove("active"));
      // ẩn nội dung
      tabPanes.forEach((pane) => pane.classList.remove("active", "show"));
      // thêm active vào tab đang click
      this.classList.add("active");
      // hiện nội dung tương ứng vs tab active
      const targetId = this.getAttribute("data-tab-target");
      const targetPane = document.querySelector(targetId);
      if (targetPane) {
        targetPane.classList.add("active", "show");
      }
    });
  });
});
// phần upload ảnh
document.addEventListener("DOMContentLoaded", function () {
  // lấy button chọn ảnh
  const uploadButton = document.getElementById("uploadButton");
  //   lấy input type=file
  const uploadInput = document.getElementById("uploadInput");
  //   thẻ img hiển thị ảnh
  const userImage = document.querySelector(".img-user");

  // Khi bấm vào nút "Chọn ảnh"
  uploadButton.addEventListener("click", function () {
    uploadInput.click(); // Kích hoạt input file
  });

  // Khi người dùng chọn file
  uploadInput.addEventListener("change", function () {
    const file = this.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        alert("Vui lòng chọn một tập tin hình ảnh.");
        return;
      }

      // Giới hạn dung lượng 1MB
      if (file.size > 1024 * 1024) {
        alert("Ảnh vượt quá 1MB. Vui lòng chọn ảnh nhỏ hơn.");
        return;
      }

      const reader = new FileReader();
      reader.onload = function (e) {
        userImage.src = e.target.result; // Gán ảnh xem trước
        localStorage.setItem("userImage", e.target.result); // Lưu ảnh vào localStorage
      };
      reader.readAsDataURL(file);
    }
  });
});

document.addEventListener("DOMContentLoaded", function () {
    const toggleBtn = document.getElementById("navbarToggle");
    const links = document.querySelector(".navbar__links");
    const auth = document.querySelector(".navbar__auth");
    const after = document.querySelector(".navbar__after");

    toggleBtn.addEventListener("click", function () {
      links.classList.toggle("active");
      auth.classList.toggle("active");
      after.classList.toggle("active");
    });
  });