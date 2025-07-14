
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
const dataPath = '../src/data.json'
fetch(dataPath)
    .then(function(response) {
        return response.json();
    })
    .then(function(products) {
        let htmls = products.map(function(product) {
            return `<div class="main__div--produce">
        //   <img src="${product.products.image_url}" alt="img" class="div__img--produce">
          <div class="div__produce-item--info">
            <p class="item--id">Mã Sản  Phẩm : ${product.products.id}</p>
            <h3 class="item--name">${product.products.name}</h3>
            <hr>
            <h2>  ${product.products.price}</h2>
          </div>
          <a class="div__add-cart" href="#">Xem Chi Tiết</a>
        </div>`;
        });
        var html = htmls.join('');
        document.getElementById('Len').innerHTML = html;
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


