// phần tăng giảm số lượng
const minus = document.querySelector(".minus");
const plus = document.querySelector(".plus");
const quantity = document.getElementById("quantity");

// Đường dẫn đến file JSON chứa tất cả sản phẩm của bạn
const dataPath = "../src/data.json"; // Đảm bảo đúng đường dẫn

const productDetailContainer = document.getElementById(
    "product-container"
);

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
        console.log('Khong tim thay du lieu')
        return;
    }

    // loadingMessage.style.display = "block"; // Hiển thị thông báo đang tải
    productDetailContainer.style.display = "none"; // Ẩn container chi tiết

    try {
        const response = await fetch(dataPath);
        if (!response.ok) {
            throw new Error(
                "Lỗi mạng hoặc không tìm thấy file dữ liệu sản phẩm."
            );
        }
        const data = await response.json();
        const products = data.products; // Lấy mảng sản phẩm từ đối tượng data

        // Tìm sản phẩm có ID khớp
        const product = products.find((p) => p.id === productId);

        if (product) {
            // Nếu tìm thấy sản phẩm, điền dữ liệu vào HTML
            productDetailContainer.innerHTML = `
                <div class="product-describe">
                    <div class="product-describe__img">
                        <div class="single-image">
                            <div id="product-carousel">
                                <div class="img">
                                    <div class="img-item active">
                                        <img
                                            class="w-100 h-100"
                                            src="${product.image_url}"
                                            alt="Image"
                                        />
                                    </div>
                                </div>

                                <!-- Nút điều hướng -->
                                <a class="carousel-control-prev" href="#">
                                    <i
                                        class="fa fa-2x fa-angle-left text-dark"
                                    ></i>
                                </a>
                                <a class="carousel-control-next" href="#">
                                    <i
                                        class="fa fa-2x fa-angle-right text-dark"
                                    ></i>
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
                                    <span class="rating-text"> (${product.rating})</span>
                                    <span class="rating-count">
                                        | (100 đánh giá)</span
                                    >
                                </div>
                            </div>
                            <div class="product-describe__price">
                                <div class="price-value">${product.original_price}</div>
                                <div class="flash-sale-text">${product.price}</div>
                            </div>
                            <div class="product-mini-vouchers">
                                <h2 class="product-mini-vouchers-title">
                                    <i class="fas fa-gift"></i>
                                    Voucher giảm giá của shop
                                </h2>
                                <div class="product-mini-vouchers-list">
                                    <div class="product-mini-voucher">
                                        Giảm 10%
                                    </div>
                                    <div class="product-mini-voucher">
                                        Giảm 15%
                                    </div>
                                    <div class="product-mini-voucher">
                                        Giảm 20%
                                    </div>
                                </div>
                            </div>
                            <div class="product-quantity-box">
                                <label class="product-quantity-label"
                                    >Số Lượng</label
                                >
                                <div class="product-quantity-group">
                                    <div class="product-quantity-btn minus">
                                        −
                                    </div>
                                    <div
                                        class="product-quantity-value"
                                        id="quantity"
                                    >
                                        0
                                    </div>
                                    <div class="product-quantity-btn plus">
                                        +
                                    </div>
                                </div>
                            </div>
                            <div></div>
                            <div class="product-add-to-cart">
                                <button class="product-add-to-cart-btn" id="add-to-cart-button">
                                    <i class="fas fa-shopping-cart"></i> Thêm
                                    vào giỏ hàng
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
                            <button class="tab active" data-tab="desc">
                                Mô tả sản phẩm
                            </button>
                            <button class="tab" data-tab="review">
                                Đánh giá
                            </button>
                        </div>
                        <!-- Thanh chuyển giữa mô tả và đánh giá -->
                        <!-- Phần nội dung của mô tả -->
                        <div class="tab-content">
                            <div id="desc" class="tab-pane active">
                                <div
                                    class="product-items-information-description"
                                >
                                    ${product.description}
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
