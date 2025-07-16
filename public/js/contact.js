document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("contactForm");
  const nameInput = document.getElementById("name");
  const emailInput = document.getElementById("email");
  const numberInput = document.getElementById("number");
  const messageInput = document.getElementById("message");

  function validateEmail(email) {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault(); // Ngăn gửi mặc định

    let isValid = true;

    // Xóa thông báo lỗi trước
    const errorElements = form.querySelectorAll(".help-block");
    errorElements.forEach((el) => (el.textContent = ""));

    // ===== Kiểm tra tên =====
    const nameValue = nameInput.value.trim();
    if (!nameValue) {
      nameInput.nextElementSibling.textContent = "Vui lòng nhập tên.";
      isValid = false;
    } else if (!/^[a-zA-ZÀ-ỹ\s]{3,}$/u.test(nameValue)) {
      nameInput.nextElementSibling.textContent =
        "Tên chỉ được chứa chữ cái và ít nhất 3 ký tự.";
      isValid = false;
    } else {
      nameInput.nextElementSibling.textContent = "";
    }

    // ===== Kiểm tra email =====
    const emailValue = emailInput.value.trim();
    if (!emailValue) {
      emailInput.nextElementSibling.textContent = "Vui lòng nhập email.";
      isValid = false;
    } else if (!validateEmail(emailValue)) {
      emailInput.nextElementSibling.textContent = "Email không hợp lệ.";
      isValid = false;
    } else {
      emailInput.nextElementSibling.textContent = "";
    }

    // ===== Kiểm tra số điện thoại =====
    const numberValue = numberInput.value.trim();
    if (!numberValue) {
      numberInput.nextElementSibling.textContent =
        "Vui lòng nhập số điện thoại.";
      isValid = false;
    } else if (!/^\d{9,11}$/.test(numberValue)) {
      numberInput.nextElementSibling.textContent =
        "Số điện thoại phải gồm 9 đến 11 chữ số.";
      isValid = false;
    } else {
      numberInput.nextElementSibling.textContent = "";
    }

    // ===== Kiểm tra nội dung =====
    const messageValue = messageInput.value.trim();
    if (!messageValue) {
      messageInput.nextElementSibling.textContent = "Vui lòng nhập nội dung.";
      isValid = false;
    } else if (messageValue.length < 10) {
      messageInput.nextElementSibling.textContent =
        "Nội dung phải từ 10 ký tự trở lên.";
      isValid = false;
    } else {
      messageInput.nextElementSibling.textContent = "";
    }

    // ===== Nếu hợp lệ =====
    if (isValid) {
      alert("Cảm ơn bạn đã liên hệ! Chúng tôi sẽ phản hồi sớm nhất.");
      form.reset(); // Xóa form sau khi gửi thành công
    }
  });
});
