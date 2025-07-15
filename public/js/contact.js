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

          // Kiểm tra tên
          if (!nameInput.value.trim()) {
            nameInput.nextElementSibling.textContent = "Vui lòng nhập tên.";
            isValid = false;
          }

          // Kiểm tra email
          if (!emailInput.value.trim()) {
            emailInput.nextElementSibling.textContent = "Vui lòng nhập email.";
            isValid = false;
          } else if (!validateEmail(emailInput.value)) {
            emailInput.nextElementSibling.textContent = "Email không hợp lệ.";
            isValid = false;
          }

          // Kiểm tra số điện thoại
          if (!numberInput.value.trim()) {
            numberInput.nextElementSibling.textContent =
              "Vui lòng nhập số điện thoại.";
            isValid = false;
          }

          // Kiểm tra nội dung
          if (!messageInput.value.trim()) {
            messageInput.nextElementSibling.textContent =
              "Vui lòng nhập nội dung.";
            isValid = false;
          }

          if (isValid) {
            alert("Cảm ơn bạn đã liên hệ! Chúng tôi sẽ phản hồi sớm nhất.");
            form.reset(); // Xoá form sau khi gửi thành công
          }
        });
      });