// js/cart.js

document.addEventListener('DOMContentLoaded', () => {
    const cartItemsContainer = document.querySelector('.cart-items');
    const cartSummaryContainer = document.querySelector('.cart-summary');
    const cartTotalLabel = document.querySelector('.cart-summary__row--total .cart-summary__value');
    const cartSubtotalLabel = document.querySelector('.cart-summary__row:first-of-type .cart-summary__value');

   
    function renderCart() {
        cartItemsContainer.innerHTML = '<h2 class="cart-items__title">Giỏ hàng của bạn</h2>'; // Xóa nội dung cũ
        if (cart.length === 0) {
            cartItemsContainer.innerHTML += `
                <div class="cart-empty">
                    <p>Giỏ hàng của bạn đang trống.</p>
                    <a href="./Catalog_Page.html" class="cart-empty__link">Quay lại trang sản phẩm</a>
                </div>
            `;
            cartSummaryContainer.style.display = 'none'; // Ẩn box tổng tiền nếu giỏ hàng trống
        } else {
            cartSummaryContainer.style.display = 'block'; // Hiển thị box tổng tiền

            cart.forEach(item => {
                const cartItemElement = document.createElement('div');
                cartItemElement.classList.add('cart-item');
                cartItemElement.setAttribute('data-id', item.id); // Dùng data-id để dễ dàng thao tác

                cartItemElement.innerHTML = `
                    <img src="${item.imageUrl}" alt="${item.name}" class="cart-item__image">
                    <div class="cart-item__details">
                        <h3 class="cart-item__name">${item.name}</h3>
                        <p class="cart-item__price">${item.price.toLocaleString('vi-VN')} VNĐ</p>
                        <div class="cart-item__quantity">
                            <button class="cart-item__quantity-button cart-item__quantity-button--decrease" data-id="${item.id}">-</button>
                            <input type="text" value="${item.quantity}" class="cart-item__quantity-input" data-id="${item.id}" readonly>
                            <button class="cart-item__quantity-button cart-item__quantity-button--increase" data-id="${item.id}">+</button>
                        </div>
                    </div>
                    <button class="cart-item__remove" data-id="${item.id}">Xóa</button>
                `;
                cartItemsContainer.appendChild(cartItemElement);
            });

            // Sau khi render xong các item, thêm event listeners
            addEventListenersToCartItems();
        }
        updateCartSummary(); // Cập nhật tổng tiền sau mỗi lần render
    }

    
    function addEventListenersToCartItems() {
        
        document.querySelectorAll('.cart-item__quantity-button--increase').forEach(button => {
            button.removeEventListener('click', handleIncreaseQuantity); 
            button.addEventListener('click', handleIncreaseQuantity);
        });

        document.querySelectorAll('.cart-item__quantity-button--decrease').forEach(button => {
            button.removeEventListener('click', handleDecreaseQuantity);
            button.addEventListener('click', handleDecreaseQuantity);
        });

        
        document.querySelectorAll('.cart-item__remove').forEach(button => {
            button.removeEventListener('click', handleRemoveItem);
            button.addEventListener('click', handleRemoveItem);
        });
    }

    
    function handleIncreaseQuantity(event) {
        const itemId = event.target.dataset.id;
        const item = cart.find(p => p.id === itemId);
        if (item) {
            item.quantity++;
            
            const inputElement = document.querySelector(`.cart-item__quantity-input[data-id="${itemId}"]`);
            if (inputElement) {
                inputElement.value = item.quantity;
            }
            updateCartSummary();
        }
    }

    
    function handleDecreaseQuantity(event) {
        const itemId = event.target.dataset.id;
        const item = cart.find(p => p.id === itemId);
        if (item && item.quantity > 1) { 
            item.quantity--;
            
            const inputElement = document.querySelector(`.cart-item__quantity-input[data-id="${itemId}"]`);
            if (inputElement) {
                inputElement.value = item.quantity;
            }
            updateCartSummary();
        }
    }

    
    function handleRemoveItem(event) {
        const itemId = event.target.dataset.id;
        cart = cart.filter(item => item.id !== itemId); 
        renderCart(); 
    }

    
    function updateCartSummary() {
        let subtotal = 0;
        cart.forEach(item => {
            subtotal += item.price * item.quantity;
        });

        const shippingFee = 0; 
        const total = subtotal + shippingFee;

        cartSubtotalLabel.textContent = `${subtotal.toLocaleString('vi-VN')} VNĐ`;
        cartTotalLabel.textContent = `${total.toLocaleString('vi-VN')} VNĐ`;
    }

    
    renderCart();

    
});