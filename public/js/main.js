const email = document.getElementById("email");
const password = document.getElementById("password");
const submitButton = document.getElementById("login-button");
const loginButton = document.querySelector("ul.navbar__auth");
const profileButton = document.querySelector("ul.navbar__after");

// if (localStorage.getItem("isLoginedIn") === "true") {
//     loginButton.setAttribute("style", "display: none");
//     profileButton.setAttribute("style", "display: flex");
// }

//Lấy dữ liệu từ data.json
const dataPath = "../src/data.json";
fetch(dataPath)
    .then(function (response) {
        return response.json();
    })
    .then(function (data) {
        const products = data.products;

        function createProductHtml(product) {
            const formattedPrice =
                product.price.toLocaleString("vi-VN") + " VNĐ";
            const formattedOriginalPrice =
                product.original_price.toLocaleString("vi-VN") + " VNĐ";

            return `
            <div class="main__div--produce">
                <img src="${
                    product.image_url
                }" alt="${product.name}" class="div__img--produce">
                <div class="div__produce-item--info">
                    <p class="item--id">Mã Sản Phẩm : ${product.id}</p>
                    <h3 class="item--name">${product.name}</h3>
                    <hr>
                    <h2>${formattedPrice}</h2>
                    ${
                        product.original_price &&
                        product.original_price > product.price
                            ? `<p class="item--original-price">Giá gốc: <s>${formattedOriginalPrice}</s></p>`
                            : ""
                    }
                </div>
                <a class="div__add-cart" href="./product_items.html?id=${
                    product.id
                }">Xem Chi Tiết</a>
            </div>`;
        }

        const len_catalogs = products
            .filter((product) => product.category_id === "Len")
            .map(createProductHtml);

        const thoiTrang_catalogs = products
            .filter((product) => product.category_id === "Thoi_Trang")
            .map(createProductHtml);

        const phuKien_catalogs = products
            .filter((product) => product.category_id === "Phu_Kien")
            .map(createProductHtml);

        const thuBong_catalogs = products
            .filter((product) => product.category_id === "Thu_Bong")
            .map(createProductHtml);
        
        document.getElementById("Len_catalog").innerHTML =
            len_catalogs.join("");
        document.getElementById("ThoiTrang_catalog").innerHTML =
            thoiTrang_catalogs.join("");
        document.getElementById("PhuKien_catalog").innerHTML =
            phuKien_catalogs.join("");
        document.getElementById("thuBong_catalog").innerHTML =
            thuBong_catalogs.join("");
    });

