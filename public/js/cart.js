const dataPath = "../src/data.json"; // Đường dẫn đến file JSON chứa dữ liệu sản phẩm

fetch(dataPath)
    .then(function (response) {
        if (!response.ok) {
            throw new Error(
                "Lỗi mạng hoặc không tìm thấy file dữ liệu: " +
                response.statusText
            );
        }
        return response.json();
    })
    .then(function (data) {
        const allProducts = data.products; // Toàn bộ danh sách sản phẩm từ data.json

        // 2. Lấy dữ liệu giỏ hàng từ localStorage
        // Giả định cartItems là một MẢNG CÁC CHUỖI ID: ["sp001", "sp100"]
        const cartItems = JSON.parse(localStorage.getItem("cart")) || [];

        let cartHtmls = [];
        let totalCartPrice = 0; // Biến để tính tổng tiền

        // Sử dụng một Set để tránh thêm cùng một sản phẩm nhiều lần vào HTML nếu bạn chỉ muốn hiển thị mỗi loại sản phẩm một lần
        // Nếu bạn muốn hiển thị mỗi lần thêm vào là một dòng riêng biệt, bỏ qua Set này.
        const processedProductIds = new Set(); 

        // 4. Lặp qua CÁC ID TRONG GIỎ HÀNG để tìm thông tin sản phẩm đầy đủ và tạo HTML
        cartItems.forEach((productIdInCart) => {
            // Kiểm tra xem sản phẩm này đã được xử lý (và thêm vào HTML) chưa
            // Nếu bạn muốn hiển thị mỗi ID là một dòng riêng, bỏ qua dòng này và `if` bên dưới
            if (processedProductIds.has(productIdInCart)) {
                // Nếu sản phẩm đã được xử lý, bạn có thể tăng số lượng trong giỏ hàng hiển thị
                // Hoặc bỏ qua nếu chỉ muốn mỗi loại sản phẩm hiển thị một dòng duy nhất
                // Để đơn giản, ví dụ này sẽ chỉ hiển thị một dòng duy nhất cho mỗi loại sản phẩm
                return; 
            }
            processedProductIds.add(productIdInCart); // Đánh dấu ID này đã được xử lý

            const foundProduct = allProducts.find((p) => p.id === productIdInCart); // So sánh p.id với productIdInCart

            if (foundProduct) {
                const formattedPrice = foundProduct.price.toLocaleString("vi-VN") + " VNĐ";
                
                // Đếm số lượng của sản phẩm này trong giỏ hàng (nếu bạn cho phép trùng lặp ID trong cartItems)
                const quantity = cartItems.filter(id => id === productIdInCart).length;
                
                totalCartPrice += foundProduct.price * quantity; // Cộng vào tổng tiền

                cartHtmls.push(`
                    <div class="cart-item" data-product-id="${foundProduct.id}">
                        <img
                            src="${foundProduct.image_url}"
                            alt="${foundProduct.name}"
                            class="cart-item__image"
                        />
                        <div class="cart-item__details">
                            <h3 class="cart-item__name">${foundProduct.name}</h3>
                            <p class="cart-item__price">${formattedPrice}</p>
                            <div class="cart-item__quantity">
                                <button
                                    class="cart-item__quantity-button--decrease"
                                    data-id="${foundProduct.id}"
                                >
                                    -
                                </button>
                                <input
                                    type="number"
                                    value="${quantity}" // Hiển thị số lượng đã đếm được
                                    class="cart-item__quantity-input"
                                    data-id="${foundProduct.id}"
                                    readonly // Không cho phép nhập trực tiếp, chỉ cho phép +/-
                                />
                                <button
                                    class="cart-item__quantity-button--increase"
                                    data-id="${foundProduct.id}"
                                >
                                    +
                                </button>
                            </div>
                        </div>
                        <button class="cart-item__remove" data-id="${foundProduct.id}">Xóa</button>
                    </div>`);
            }
        });

        // 5. Nối các chuỗi HTML lại và chèn vào phần tử có ID "added-to-cart"
        const cartContainer = document.getElementById("added-to-cart");
        if (cartHtmls.length > 0) {
            cartContainer.innerHTML = cartHtmls.join("");
            // Cập nhật tổng tiền vào phần tóm tắt giỏ hàng
            document.getElementById('cart-subtotal').textContent = totalCartPrice.toLocaleString('vi-VN') + ' VNĐ';
            document.getElementById('cart-total').textContent = totalCartPrice.toLocaleString('vi-VN') + ' VNĐ';
            // Bạn sẽ cần các id 'cart-subtotal' và 'cart-total' trong HTML của summary
        } else {
            cartContainer.innerHTML = `
                <div class="cart-empty">
                    <p>Giỏ hàng của bạn đang trống.</p>
                    <a href="trangchu.html" class="cart-empty__link">Tiếp tục mua sắm</a>
                </div>
            `;
            // Cũng ẩn hoặc reset tổng tiền nếu giỏ hàng trống
            document.getElementById('cart-subtotal').textContent = '0 VNĐ';
            document.getElementById('cart-total').textContent = '0 VNĐ';
        }

        // --- Cần thêm logic để xử lý sự kiện cho các nút sau khi DOM được cập nhật ---
        setupCartEventListeners(allProducts); // Truyền allProducts để có thể dùng khi cần

    })
    .catch(function (error) {
        console.error("Đã xảy ra lỗi khi tải dữ liệu sản phẩm:", error);
        document.getElementById("added-to-cart").innerHTML = `
            <p style="color: red; text-align: center;">Không thể tải dữ liệu giỏ hàng. Vui lòng thử lại sau.</p>
        `;
    });

// Hàm xử lý sự kiện cho các nút trong giỏ hàng
function setupCartEventListeners(allProducts) {
    const cartContainer = document.getElementById("added-to-cart");

    cartContainer.addEventListener('click', (event) => {
        const target = event.target;
        const productId = target.dataset.id;
        if (!productId) return; // Không phải nút liên quan đến sản phẩm

        // Lấy giỏ hàng hiện tại
        let cart = JSON.parse(localStorage.getItem("cart")) || [];

        if (target.classList.contains('cart-item__quantity-button--decrease')) {
            // Giảm số lượng
            const indexToRemove = cart.indexOf(productId);
            if (indexToRemove > -1) {
                cart.splice(indexToRemove, 1); // Xóa một ID sản phẩm
            }
            console.log(`Giảm số lượng cho sản phẩm: ${productId}. Giỏ hàng mới:`, cart);
        } else if (target.classList.contains('cart-item__quantity-button--increase')) {
            // Tăng số lượng
            cart.push(productId); // Thêm một ID sản phẩm nữa
            console.log(`Tăng số lượng cho sản phẩm: ${productId}. Giỏ hàng mới:`, cart);
        } else if (target.classList.contains('cart-item__remove')) {
            // Xóa tất cả các ID của sản phẩm này khỏi giỏ hàng
            cart = cart.filter(id => id !== productId);
            console.log(`Xóa tất cả sản phẩm: ${productId}. Giỏ hàng mới:`, cart);
        }

        // Sau khi thay đổi giỏ hàng, lưu lại vào localStorage
        localStorage.setItem("cart", JSON.stringify(cart));

        // Cuối cùng, tải lại giỏ hàng để cập nhật giao diện
        // Cách đơn giản nhất là gọi lại hàm hiển thị giỏ hàng
        // Bạn có thể cân nhắc một hàm riêng để render giỏ hàng mà không cần fetch lại data.json
        // Ví dụ: displayCartItems(allProducts, cart);
        window.location.reload(); // Cách đơn giản nhất để refresh giao diện giỏ hàng

    });
}