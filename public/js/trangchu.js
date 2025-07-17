/* ------------------------slider----------------------------- */
const slides = document.querySelectorAll(".slides img");
let slideIndex = 0;
let intervalId = null;

//initializeSlider();
document.addEventListener("DOMContentLoaded", initializeSlider);

function initializeSlider() {
    if (slides.length > 0) {
        slides[slideIndex].classList.add("displaySlide");
        intervalId = setInterval(nextSlide, 5000);
    }
}
function showSlide(index) {
    if (index >= slides.length) {
        slideIndex = 0;
    } else if (index < 0) {
        slideIndex = slides.length - 1;
    }
    slides.forEach((slide) => {
        slide.classList.remove("displaySlide");
    });
    slides[slideIndex].classList.add("displaySlide");
}
function prevSlide() {
    clearInterval(intervalId);
    slideIndex--;
    showSlide(slideIndex);
}
function nextSlide() {
    slideIndex++;
    showSlide(slideIndex);
}

/* ------------------------Product Loading----------------------------- */
// Load products from data.json
async function loadProducts() {
    try {
        const response = await fetch("../src/data.json");
        const data = await response.json();

        // Load random products for popular and new sections
        loadRandomProducts(data.products, "popular-products", 4);
        loadRandomProducts(data.products, "new-products", 4);

        console.log("Products loaded successfully");
    } catch (error) {
        console.error("Error loading products:", error);
    }
}

// Load random products into specified container
function loadRandomProducts(products, containerId, count) {
    const container = document.getElementById(containerId);
    if (!container) {
        console.error(`Container with id ${containerId} not found`);
        return;
    }

    // Show loading state
    container.innerHTML =
        '<div class="loading-placeholder product-loading"><p>Đang tải sản phẩm...</p></div>';

    // Simulate loading delay for better UX
    setTimeout(() => {
        try {
            // Get random products
            const randomProducts = getRandomProducts(products, count);

            // Clear existing content
            container.innerHTML = "";

            // Generate HTML for each product
            randomProducts.forEach((product) => {
                const productHTML = createProductHTML(product);
                container.appendChild(productHTML);
            });

            console.log(
                `Loaded ${randomProducts.length} products into ${containerId}`
            );
        } catch (error) {
            console.error("Error loading products:", error);
            container.innerHTML =
                '<div class="error-message"><p>Không thể tải sản phẩm. Vui lòng thử lại sau.</p></div>';
        }
    }, 300); // 300ms delay for loading effect
}

// Get random products from array
function getRandomProducts(products, count) {
    const shuffled = [...products].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
}

// Create product HTML element
function createProductHTML(product) {
    const li = document.createElement("li");

    // Calculate discount percentage
    const discountPercent = product.original_price
        ? Math.round((1 - product.price / product.original_price) * 100)
        : 0;

    // Format price
    const formattedPrice = formatPrice(product.price);
    const formattedOriginalPrice = product.original_price
        ? formatPrice(product.original_price)
        : null;

    // Get rating stars
    const stars = generateStars(product.rating);

    li.innerHTML = `
        <section class="section__product-item">
            <p class="product-id" hidden>${product.id}</p>
            <div class="section__product-item--top">
                <a href="" class="product-thumb">
                    <img src="${product.image_url}" alt="${
        product.name
    }" class="product-thumb--img">
                </a>
                <a href="./product_items.html?id=${
                    product.id
                }" class="div__a--buy-now" onclick="addToCart('${
                    product.id
                }')">
                    <i class="fa fa-shopping-cart shopping-cart"></i>Mua ngay
                </a>
                ${
                    discountPercent > 0
                        ? `<span class="div__span--sale-label">Giảm ${discountPercent}%</span>`
                        : ""
                }
            </div>
            <div class="section__product-item--info">
                <a href="./product_items.html?id=${
                    product.id
                } " class="product-name">${product.name}</a>
                <p><span>${product.rating} ${stars}</span></p>   
                <span class="product-price"> 
                    <strong>₫${formattedPrice}</strong> 
                    ${
                        formattedOriginalPrice
                            ? `<del>₫${formattedOriginalPrice}</del>`
                            : ""
                    }
                </span>
            </div> 
        </section>
    `;

    return li;
}

// Format price to Vietnamese currency format
function formatPrice(price) {
    return price.toLocaleString("vi-VN");
}

// Generate star rating HTML
function generateStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    let starsHTML = "";

    // Full stars
    for (let i = 0; i < fullStars; i++) {
        starsHTML += '<i class="fa fa-star"></i>';
    }

    // Half star
    if (hasHalfStar) {
        starsHTML += '<i class="fa fa-star-half-o"></i>';
    }

    // Empty stars
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    for (let i = 0; i < emptyStars; i++) {
        starsHTML += '<i class="fa fa-star-o"></i>';
    }

    return starsHTML;
}

// Add to cart function (placeholder)
function addToCart(productId) {
    // Prevent default link behavior
    event.preventDefault();

    try {
        // Add to cart logic (integrate with existing cart system)
        if (typeof window.cartManager !== "undefined") {
            // If cart manager exists, use it
            window.cartManager.addToCart(productId);
        } else {
            // Simple fallback
            let cart = JSON.parse(localStorage.getItem("cart")) || [];
            const existingItem = cart.find((item) => item.id === productId);

            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                cart.push({ id: productId, quantity: 1 });
            }

            localStorage.setItem("cart", JSON.stringify(cart));

            // Show success message
            showNotification("Sản phẩm đã được thêm vào giỏ hàng!", "success");
        }
    } catch (error) {
        console.error("Error adding to cart:", error);
        showNotification(
            "Có lỗi xảy ra khi thêm sản phẩm vào giỏ hàng!",
            "error"
        );
    }
}

// Show notification function
function showNotification(message, type = "info") {
    // Create notification element
    const notification = document.createElement("div");
    notification.className = `notification notification-${type}`;
    notification.textContent = message;

    // Style notification
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 5px;
        color: white;
        font-weight: bold;
        z-index: 1000;
        animation: slideIn 0.3s ease-in-out;
        ${
            type === "success"
                ? "background-color: #4CAF50;"
                : "background-color: #f44336;"
        }
    `;

    // Add to DOM
    document.body.appendChild(notification);

    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = "slideOut 0.3s ease-in-out";
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Initialize products when page loads
document.addEventListener("DOMContentLoaded", function () {
    loadProducts();
});
