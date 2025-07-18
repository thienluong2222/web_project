function formatDescription(description) {
  //chỉnh description
  if (!description) return "";

  return (
    description
      // Đổi ❌ thành <span class="warning">❌</span>
      .replace(/❌/g, '<span class="warning">❌</span>')

      // Đổi xuống dòng thành <br>
      .replace(/\n/g, "<br>")
  );
}

// Đường dẫn đến file JSON chứa tất cả sản phẩm của bạn
const dataPath = "../src/data.json"; // Đảm bảo đúng đường dẫn

const productDetailContainer = document.getElementById("product-container");

// Hàm để lấy tham số từ URL
function getParameterByName(name, url = window.location.href) {
  name = name.replace(/[\[\]]/g, "\\$&");
  var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
    results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return "";
  return decodeURIComponent(results[2].replace(/\+/g, " "));
}

async function loadProductDetail() {
  const productId = getParameterByName("id"); // Lấy ID sản phẩm từ URL

  if (!productId) {
    productDetailContainer.style.display = "none";
    console.log("Khong tim thay du lieu");
    return;
  }

  // loadingMessage.style.display = "block"; // Hiển thị thông báo đang tải
  productDetailContainer.style.display = "none"; // Ẩn container chi tiết

  try {
    const response = await fetch(dataPath);
    if (!response.ok) {
      throw new Error("Lỗi mạng hoặc không tìm thấy file dữ liệu sản phẩm.");
    }
    const data = await response.json();
    const products = data.products; // Lấy mảng sản phẩm từ đối tượng data

    // Tìm sản phẩm có ID khớp
    const product = products.find((p) => p.id === productId);

    if (product) {
      // Nếu tìm thấy sản phẩm, điền dữ liệu vào HTML
      productDetailContainer.innerHTML = `<div class="main-product__items" id="product-container">
        <div class="product-describe__img">
          <div class="single-image">
            <div id="product-carousel">
              <div class="img">
                <div class="img-item active">
                  <img
                    class="w-100 h-100"
                    src=" ${product.image_url} "
                    alt="Image"
                  />
                </div>
                <div class="img-item">
                  <img
                    class="w-100 h-100"
                    src="${product.alt_images[0]}"
                    alt="Image"
                  />
                </div>
                <div class="img-item">
                  <img
                    class="w-100 h-100"
                    src="${product.alt_images[1]}"
                    alt="Image"
                  />
                </div>
                

              </div>

              <!-- Nút điều hướng -->
              <a class="carousel-control-prev" href="#">
                <i class="fa fa-2x fa-angle-left text-dark"></i>
              </a>
              <a class="carousel-control-next" href="#">
                <i class="fa fa-2x fa-angle-right text-dark"></i>
              </a>
            </div>
          </div>

          <!--hình ảnh sản phẩm-->
          <!--phần content sản phẩm-->
          <div class="product-describe__content">
            <h1 class="content-title">
               ${product.name}
            </h1>
            <div class="product-rating">
              <div class="star-rating">
                <div class="star">
                  <i class="fas fa-star"></i>
                  <i class="fas fa-star"></i>
                  <i class="fas fa-star"></i>
                  <i class="fas fa-star"></i>
                  <i class="fas fa-star-half-alt"></i>
                </div>
                <span class="rating-text"> ${product.rating} </span>
                <span class="rating-count"> | (100 đánh giá)</span>
              </div>
            </div>
            <div class="product-describe__price">
              <div class="price-value"> ${product.price} </div>
              <div class="flash-sale-text"> ${product.original_price} </div>
            </div>
            <div class="product-mini-vouchers">
              <h2 class="product-mini-vouchers-title">
                <i class="fas fa-gift"></i>
                Voucher giảm giá của shop
              </h2>
              <div class="product-mini-vouchers-list">
                <div class="product-mini-voucher">Giảm 10%</div>
                <div class="product-mini-voucher">Giảm 15%</div>
                <div class="product-mini-voucher">Giảm 20%</div>
              </div>
            </div>
            <div class="product-quantity-box">
              <label class="product-quantity-label">Số Lượng</label>
              <div class="product-quantity-group">
                <div class="product-quantity-btn minus">−</div>
                <div class="product-quantity-value" id="quantity">0</div>
                <div class="product-quantity-btn plus">+</div>
              </div>
            </div>
            <div class="product-add-to-cart">
              <button class="product-add-to-cart-btn">
                <i class="fas fa-shopping-cart"></i> Thêm vào giỏ hàng
              </button>
              <button class="product-add-to-cart-voucher">
                Mua với voucher
              </button>
            </div>
          </div>
        </div>
        <!--phần content sản phẩm-->
        <!--Phần mô tả đánh giá-->
        <!-- Thanh chuyển giữa mô tả và đánh giá -->
        <div class="product-items-information">
          <div class="tabs">
            <button class="tab active" data-tab="desc">Mô tả sản phẩm</button>
            <button class="tab" data-tab="review">Đánh giá</button>
          </div>
          <!-- Thanh chuyển giữa mô tả và đánh giá -->
          <!-- Phần nội dung của mô tả -->
          <div class="tab-content">
            <div id="desc" class="tab-pane active">
              <div class="product-items-information-description">
                ${formatDescription(product.description)}
              </div>
            </div>
            <!-- Phần nội dung của mô tả -->
            <!-- Phần nội dung của đánh giá -->
            <div id="review" class="tab-pane">
              <p>Chưa có đánh giá</p>
            </div>
            <!-- Phần nội dung của đánh giá -->
          </div>
        </div>
      </div>
            `;
      // Ẩn thông báo đang tải
      productDetailContainer.style.display = "flex"; // Hiển thị container chi tiết
      bindProductEvents(product);
    } else {
      errorMessage.textContent = `Không tìm thấy sản phẩm với ID: ${productId}.`;
      errorMessage.style.display = "block";
    }
  } catch (error) {
    console.error("Lỗi khi tải chi tiết sản phẩm:", error);
    errorMessage.textContent =
      "Đã xảy ra lỗi khi tải dữ liệu sản phẩm. Vui lòng thử lại.";
    errorMessage.style.display = "block";
  }
}

// Gọi hàm khi trang HTML đã được tải đầy đủ
document.addEventListener("DOMContentLoaded", loadProductDetail);

// productDetailContainer.addEventListener("click", function (event) {
//     if (event.target.id === "add-to-cart-button") {
//         const productId = getParameterByName("id");
//         alert(
//             `Đã thêm sản phẩm ${productId} vào giỏ hàng! (Logic giỏ hàng cần được triển khai)`
//         );
//         localStorage.setItem('cart', JSON.stringify(productId));
//     }
// });
function bindProductEvents(product) {
  // Tăng giảm số lượng
  const minus = document.querySelector(".minus");
  const plus = document.querySelector(".plus");
  const quantity = document.getElementById("quantity");

  minus.onclick = () => {
    let current = parseInt(quantity.textContent);
    if (current > 0) quantity.textContent = current - 1;
  };

  plus.onclick = () => {
    let current = parseInt(quantity.textContent);
    quantity.textContent = current + 1;
  };

  // Format giá
  const formatCurrency = (amount) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      minimumFractionDigits: 0,
    }).format(amount);

  const priceValue = document.querySelector(".price-value");
  const flashSaleText = document.querySelector(".flash-sale-text");

  priceValue.textContent = formatCurrency(product.original_price);
  flashSaleText.textContent = formatCurrency(product.price);

  // Tabs
  const tabs = document.querySelectorAll(".tab");
  const panes = document.querySelectorAll(".tab-pane");
  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabs.forEach((t) => t.classList.remove("active"));
      panes.forEach((p) => p.classList.remove("active"));

      tab.classList.add("active");
      document.getElementById(tab.dataset.tab).classList.add("active");
    });
  });

  // Carousel
  let currentIndex = 0;
  const items = document.querySelectorAll(".img-item");
  const showItem = (index) => {
    items.forEach((item, i) => {
      item.classList.toggle("active", i === index);
    });
  };
  document
    .querySelector(".carousel-control-next")
    .addEventListener("click", (e) => {
      e.preventDefault();
      currentIndex = (currentIndex + 1) % items.length;
      showItem(currentIndex);
    });

  document
    .querySelector(".carousel-control-prev")
    .addEventListener("click", (e) => {
      e.preventDefault();
      currentIndex = (currentIndex - 1 + items.length) % items.length;
      showItem(currentIndex);
    });

  setInterval(() => {
    currentIndex = (currentIndex + 1) % items.length;
    showItem(currentIndex);
  }, 3000);

  // Giỏ hàng
  const getItem = () => ({
    id: product.id,
    name: product.name,
    price: Number(product.price),
    image: product.image_url,
    quantity: parseInt(quantity.textContent),
  });

  const addToCartHandler = (item) => {
    if (item.quantity <= 0) {
      alert("Vui lòng chọn số lượng!");
      return;
    }

    // Sử dụng hệ thống giỏ hàng mới
    if (window.addToCart) {
      window.addToCart(item);
    } else {
      // Fallback cho hệ thống cũ
      let cart = JSON.parse(localStorage.getItem("cart")) || [];
      let existingItem = cart.find((p) => p.id === item.id);

      if (existingItem) {
        existingItem.quantity += item.quantity;
      } else {
        cart.push(item);
      }

      localStorage.setItem("cart", JSON.stringify(cart));

      // Trigger event để cập nhật cart count
      window.dispatchEvent(
        new CustomEvent("cartUpdated", {
          detail: { cart: cart },
        })
      );

      alert("Đã thêm vào giỏ hàng!");
    }
  };

  // Event listener cho nút thêm vào giỏ hàng
  const addToCartBtn = document.querySelector(".product-add-to-cart-voucher");
  if (addToCartBtn) {
    addToCartBtn.onclick = () => {
      addToCartHandler(getItem());
      // Chuyển đến trang giỏ hàng sau khi thêm sản phẩm
      setTimeout(() => {
        window.location.href = "cart.html";
      }, 1000);
    };
  }

  // Thêm event listener cho nút thêm vào giỏ hàng nhanh (nếu có)
  const quickAddBtn = document.querySelector(".product-add-to-cart-btn");
  if (quickAddBtn) {
    quickAddBtn.onclick = () => {
      addToCartHandler(getItem());
    };
  }
}
