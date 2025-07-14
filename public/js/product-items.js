// phần tăng giảm số lượng
const minus = document.querySelector(".minus");
const plus = document.querySelector(".plus");
const quantity = document.getElementById("quantity");

minus.onclick = () => {
  let current = parseInt(quantity.textContent);
  if (current >= 1) quantity.textContent = current - 1;
};
plus.onclick = () => {
  let current = parseInt(quantity.textContent);
  quantity.textContent = current + 1;
};
// Hàm định dạng tiền VND
const formatCurrency = (amount, locale = "vi-VN") => {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "VND",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
};

// Áp dụng định dạng giá
const priceValue = document.querySelector(".price-value");
const flashSaleText = document.querySelector(".flash-sale-text");

priceValue.textContent = formatCurrency(Number(priceValue.textContent));
flashSaleText.textContent = formatCurrency(Number(flashSaleText.textContent));
// Thêm vào giỏ hàng (localStorage)
const addToCart = (item) => {
  if (item.quantity <= 0) {
    alert("Vui lòng chọn số lượng trước khi thêm vào giỏ!");
    return;
  }

  let cart = JSON.parse(localStorage.getItem("cartItems")) || [];
  let index = cart.findIndex((p) => p.id === item.id);

  if (index >= 0) {
    cart[index].quantity += item.quantity;
  } else {
    cart.push(item);
  }

  localStorage.setItem("cartItems", JSON.stringify(cart));
  alert("Đã thêm vào giỏ hàng!");
};

// Mua ngay: lưu vào giỏ rồi chuyển trang
const buyNow = (item) => {
  addToCart(item); // lưu vào giỏ
  window.location.href = ""; // chuyển đến trang giỏ hàng
};

// Gán sự kiện
document.querySelector(".product-add-to-cart-btn").onclick = () => {
  const item = getProductInfo();
  addToCart(item);
};

document.querySelector(".product-add-to-cart-voucher").onclick = () => {
  const item = getProductInfo();
  buyNow(item);
};

document.addEventListener("DOMContentLoaded", function () {
  let currentIndex = 0;
  const items = document.querySelectorAll(".img-item");
  const totalItems = items.length;

  const showItem = (index) => {
    items.forEach((item, i) => {
      item.classList.remove("active");
      if (i === index) item.classList.add("active");
    });
  };

  const nextItem = () => {
    currentIndex = (currentIndex + 1) % totalItems;
    showItem(currentIndex);
  };

  const prevItem = () => {
    currentIndex = (currentIndex - 1 + totalItems) % totalItems;
    showItem(currentIndex);
  };

  // Auto change image every 3 seconds
  setInterval(nextItem, 3000);

  // Click events for next/prev
  document
    .querySelector(".carousel-control-next")
    .addEventListener("click", (e) => {
      e.preventDefault();
      nextItem();
    });

  document
    .querySelector(".carousel-control-prev")
    .addEventListener("click", (e) => {
      e.preventDefault();
      prevItem();
    });
});

const tabs = document.querySelectorAll(".tab");
const panes = document.querySelectorAll(".tab-pane");

tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    // Xóa active ở tất cả tab và pane
    tabs.forEach((t) => t.classList.remove("active"));
    panes.forEach((p) => p.classList.remove("active"));

    // Thêm active cho tab được click
    tab.classList.add("active");
    document.getElementById(tab.dataset.tab).classList.add("active");
  });
});
