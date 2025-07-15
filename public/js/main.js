const email = document.getElementById("email");
const password = document.getElementById("password");
const submitButton = document.getElementById("login-button");
const loginButton = document.querySelector("ul.navbar__auth");
const profileButton = document.querySelector("ul.navbar__after");

if (localStorage.getItem("isLoginedIn") === "true") {
    loginButton.setAttribute("style", "display: none");
    profileButton.setAttribute("style", "display: flex");
}

//Lấy dữ liệu từ data.json
const dataPath = "../src/data.json";
fetch(dataPath)
    .then(function (response) {
        return response.json();
    })
    .then(function (data) {
        const products = data.products;

        function createProductHtml(product) {
            const formattedPrice = product.price.toLocaleString('vi-VN') + ' VNĐ';
            const formattedOriginalPrice = product.original_price.toLocaleString('vi-VN') + ' VNĐ';

            return `
            <div class="main__div--produce">
                <img src="${product.image_url}" alt="${product.name}" class="div__img--produce">
                <div class="div__produce-item--info">
                    <p class="item--id">Mã Sản Phẩm : ${product.id}</p>
                    <h3 class="item--name">${product.name}</h3>
                    <hr>
                    <h2>${formattedPrice}</h2>
                    ${product.original_price && product.original_price > product.price ? 
                        `<p class="item--original-price">Giá gốc: <s>${formattedOriginalPrice}</s></p>` : ''}
                </div>
                <a class="div__add-cart" href="#">Xem Chi Tiết</a>
            </div>`;
        }

        const len_catalogs = products
            .filter(product => product.category_id === "Len")
            .map(createProductHtml);

        const thoiTrang_catalogs = products
            .filter(product => product.category_id === "Thoi_Trang")
            .map(createProductHtml);

        const phuKien_catalogs = products
            .filter(product => product.category_id === "Phu_Kien")
            .map(createProductHtml);
        const thuBong_catalogs = products
            .filter(product => product.category_id === "Thu_Bong")
            .map(createProductHtml);

        document.getElementById("Len_catalog").innerHTML = len_catalogs.join("");
        document.getElementById("ThoiTrang_catalog").innerHTML = thoiTrang_catalogs.join("");
        document.getElementById("PhuKien_catalog").innerHTML = phuKien_catalogs.join("");
        document.getElementById("thuBong_catalog").innerHTML = thuBong_catalogs.join("");
    });

(function ($) {
    "use strict";

    // Dropdown on mouse hover
    $(document).ready(function () {
        function toggleNavbarMethod() {
            if ($(window).width() > 992) {
                $(".navbar .dropdown")
                    .on("mouseover", function () {
                        $(".dropdown-toggle", this).trigger("click");
                    })
                    .on("mouseout", function () {
                        $(".dropdown-toggle", this).trigger("click").blur();
                    });
            } else {
                $(".navbar .dropdown").off("mouseover").off("mouseout");
            }
        }
        toggleNavbarMethod();
        $(window).resize(toggleNavbarMethod);
    });

    // Back to top button
    $(window).scroll(function () {
        if ($(this).scrollTop() > 100) {
            $(".back-to-top").fadeIn("slow");
        } else {
            $(".back-to-top").fadeOut("slow");
        }
    });
    $(".back-to-top").click(function () {
        $("html, body").animate({ scrollTop: 0 }, 1500, "easeInOutExpo");
        return false;
    });

    // Vendor carousel
    $(".vendor-carousel").owlCarousel({
        loop: true,
        margin: 29,
        nav: false,
        autoplay: true,
        smartSpeed: 1000,
        responsive: {
            0: {
                items: 2,
            },
            576: {
                items: 3,
            },
            768: {
                items: 4,
            },
            992: {
                items: 5,
            },
            1200: {
                items: 6,
            },
        },
    });

    // Related carousel
    $(".related-carousel").owlCarousel({
        loop: true,
        margin: 29,
        nav: false,
        autoplay: true,
        smartSpeed: 1000,
        responsive: {
            0: {
                items: 1,
            },
            576: {
                items: 2,
            },
            768: {
                items: 3,
            },
            992: {
                items: 4,
            },
        },
    });

    // Product Quantity
    $(".quantity button").on("click", function () {
        var button = $(this);
        var oldValue = button.parent().parent().find("input").val();
        if (button.hasClass("btn-plus")) {
            var newVal = parseFloat(oldValue) + 1;
        } else {
            if (oldValue > 0) {
                var newVal = parseFloat(oldValue) - 1;
            } else {
                newVal = 0;
            }
        }
        button.parent().parent().find("input").val(newVal);
    });
})(jQuery);
