// js/cart.js

document.addEventListener('DOMContentLoaded', () => {
    const cartItemsContainer = document.querySelector('.cart-items');
    const cartSummaryContainer = document.querySelector('.cart-summary');
    const cartTotalLabel = document.querySelector('.cart-summary__row--total .cart-summary__value');
    const cartSubtotalLabel = document.querySelector('.cart-summary__row:first-of-type .cart-summary__value');

    
    let cart = [
        {
            id: 'len-hong-cao-cap',
            name: 'Cuộn Len Hồng Cao Cấp',
            price: 55000,
            imageUrl: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBxMREhUTExIWFhUWGBgYFxYYFhgbGxYVFxcXFxYWFxgYHSgiGxomGxcZITEiJSkrLjAuGh8zODMsOCgtMisBCgoKDg0OGxAQGy0lHyY1LTItLS0tLS8tLi0tLS0tLS0vLSstLS0tLy0tLS0tLSstLy01Ly0tLS0tKzUtKy0tLf/AABEIAOEA4QMBIgACEQEDEQH/xAAbAAEAAgMBAQAAAAAAAAAAAAAAAQIDBAYFB//EAEAQAAEDAgMFBQUFBwQDAQEAAhEDIQQSMQVBUWFxEyIygZEGQqGxwSNSYtHwBxQzcoLh8RVDksJTg6KyFv/EABkBAQADAQEAAAAAAAAAAAAAAAABAgMEBf/EAC0RAQABAgUDAgMJAAAAAAAAAAABAhEDBBIx8CFBUSKRQmHhBRMUcYGxwdHx/9oADAMBAAIRAxEAPj7YxohWyjgjNFKCMo4JlHBSiCMo4JlClEEZQmUKUQRlCZQpRBGUJlClEEZRwTKFKIIyjgmUcFKIIyjgmUcFKIIyjgmUcFKIIyjgoyBWRBXIOCZBwVkQVyDgmQcFZEFcg4IWDgrKCg1MoUoiDZZorKtPRWQEREBERAREQEREBERAREQEREBERAREQEREBFCIJRQiCVBRCg1UUIg2qegVlWnoFZAREQEREBFgxWKbTEuMBeDiPaRrrU8x5hpPTcomqIaUYNde0OjdUA1K13Y9g3rljjifE919zpb/lQ9xjcf1xuq63RGU8y6Krtdg0WL/WOQ9VzxqNGuZvmY9dPirxOhkdW/UfVRqlp+Gph7NbaztwWr/rjhqR6Lz3HqOsgeossFag2qMrgHAag/nwKjVK9OBR3huu9o3HwAu6C30WN236+sAdSFrPcG24TYfQBab8VwY8/D8lXVPlrGDR2pe7Q9oqo8TQfP+y9Kh7QMOoIXHdo/7gH8xVqb3R7s8gSpiuVK8rRLv6OPpu0cFsBwK+dsL9zz6fmVsYfF1WG1Q/rzWorc9WU8S71F4OztvA2f6/2Xs08S12hCvE3ctVFVO7KiSilQREQEKIUGmilEG0zRWVWaKyAiLHXqZWk8BKC7jC8rHbYDLNuvFxXtDncaUOnkDy1Og1WlkcZLXGf6TGlokLOa/Dtw8rPxtvGY/tTcEc8unSRC1wSdHk/1CfQiFibiHNs4A6XMtJ6T+aucrrgAHg4RP9USqXdsUaYtZlDjME68RB9RYqpYAbWPIx6bj6KGibXEatJkfFA4CASGzoHGQekomxmI5nh4XfEweqrkBNhB5WPUt0PwVntOliOEk/8AFw0PLyVH0w6ReeBEObwyn6omGti8U6nca8LQ74CDb9WShiDXYHNzsE3tlniLj4jy5atXaJpuFOpTe8E2cxhcRGhcwCR1APos+L2c+s4TUc1m9vhPQb468N6rdppiN+nzZmmbA2GobYAc3HU/HkqMdJIYC4gxI03jxG5vwR9WkAGNb2kWyN0FpgjT1UOc4D7RwptFgxhlzid30gKUWXygG5vwbc9FA+mNuYHUTe/Hwqs9p0sRwkf+LhqeXkqTpmEWi88CIc3HKfqiYY2Lxeo3GvC0O+Ag2/VkpYg12BzOzmTe2WeIuPjPLkG4rG3acX/AKnI+4x4H8l6WD2lQrbYVnO6/Q/K4/Ba/hR5D8ljpYprhcEEcQdFVa1oNqmrw4+f9XU2PtVrqjS0tO4ggrs+z7tXNb+FfPm7U/d5P1P+V2ewcT2lNr98K1E9Hk5dpimrolQVKFXcbUREUjZZorKtPRWQERFARFCIJURERCKFCIglERBCiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICFEKDWREQbGailQzRSgIiICCIgiICIiAiIgIiICIiAiIgIiICIiAiIgIiICFEKDWREQf//Z',
            quantity: 1
        },
        {
            id: 'bo-kim-moc-da-nang',
            name: 'Bộ Kim Móc Đa Năng',
            price: 120000,
            imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQHvj-l19cxQtlxnHs6GtKqgSYSkf2b9QwJxQ&s',
            quantity: 1
        },
        {
            id: 'tui-phu-kien-len-moc',
            name: 'Túi Phụ Kiện Len Móc',
            price: 30000,
            imageUrl: 'data:image/jpeg;base64,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',
            quantity: 2
        }
    ];

    
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