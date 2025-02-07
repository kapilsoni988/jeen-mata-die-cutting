document.addEventListener("DOMContentLoaded", () => {
    const productCatalog = document.getElementById("product-catalog");
    const cartSummary = document.getElementById("cart-summary");
    const categorySelect = document.getElementById("category-select");
    const cartSummaryDetails = document.createElement("div");
    cartSummaryDetails.classList.add("cart-summary-details");
    document.body.appendChild(cartSummaryDetails);

    let cartItems = [];
    let totalQuantity = 0;
    let cartVisible = false;

    function createProductTiles(category = "all") {
        if (!productCatalog) return; // Ensure the product catalog exists

        productCatalog.innerHTML = "";
        for (let i = 1; i <= 50; i++) {
            let productCategory = "category" + (i % 3 + 1);
            if (category !== "all" && productCategory !== category) continue;

            const product = document.createElement("div");
            product.classList.add("product-tile");
            const productId = `Product ${i}`;
            product.innerHTML = `
                <img src="https://via.placeholder.com/150" alt="${productId}">
                <h3>${productId}</h3>
                <p>Price: ₹${Math.floor(Math.random() * 50) + 10}</p>
                <div class="product-controls">
                    <input type="number" class="quantity-input" min="0" value="0" data-id="${productId}">
                    <button class="add-to-cart" data-id="${productId}">Add to Cart</button>
                </div>
            `;
            productCatalog.appendChild(product);
        }
    }

    function updateCartSummary() {
        cartSummaryDetails.innerHTML = ""; // Clear previous summary

        // **Top Buttons: Back, Clear Cart & Order**
        const topButtonContainer = document.createElement("div");
        topButtonContainer.classList.add("cart-summary-buttons");

        const backButton = document.createElement("button");
        backButton.classList.add("cart-button");
        backButton.innerText = "Back";
        backButton.addEventListener("click", () => {
            cartSummaryDetails.style.display = "none";
            cartVisible = false;
        });

        const clearCartButton = document.createElement("button");
        clearCartButton.classList.add("cart-button");
        clearCartButton.innerText = "Clear Cart";
        clearCartButton.addEventListener("click", () => {
            if (confirm("Are you sure you want to clear the cart?")) {
                cartItems = [];
                updateCartSummary();
            }
        });

        const orderButton = document.createElement("button");
        orderButton.classList.add("cart-button");
        orderButton.innerText = "Order";
        orderButton.addEventListener("click", sendWhatsAppOrder);

        topButtonContainer.appendChild(backButton);
        topButtonContainer.appendChild(clearCartButton);
        topButtonContainer.appendChild(orderButton);
        cartSummaryDetails.appendChild(topButtonContainer);

        // **Cart Items**
        if (cartItems.length > 0) {
            cartItems.forEach(item => {
                const tile = document.createElement("div");
                tile.classList.add("cart-item-tile");
                tile.innerHTML = `<strong>${item.productId}</strong><br> Qty: ${item.quantity}`;
                cartSummaryDetails.appendChild(tile);
            });
        } else {
            cartSummaryDetails.innerHTML += "<p>No items in cart</p>";
        }

        totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);
        cartSummary.innerHTML = `🛒 Cart (${totalQuantity})`;

        cartSummaryDetails.style.display = cartVisible ? "flex" : "none";
    }

    function sendWhatsAppOrder() {
        if (cartItems.length === 0) {
            alert("Your cart is empty!");
            return;
        }

        let message = "🛍 Order Details:\n\n";
        cartItems.forEach(item => {
            message += `${item.productId} - Qty: ${item.quantity}\n`;
        });

        const phoneNumber = "7597877959";
        const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
        window.open(whatsappURL, "_blank");
    }

    productCatalog.addEventListener("click", (event) => {
        if (event.target.classList.contains("add-to-cart")) {
            const productId = event.target.getAttribute("data-id");
            const quantityInput = document.querySelector(`.quantity-input[data-id='${productId}']`);
            const quantity = parseInt(quantityInput.value, 10);

            if (quantity > 0) {
                const existingItem = cartItems.find(item => item.productId === productId);

                if (existingItem) {
                    existingItem.quantity = quantity;
                } else {
                    cartItems.push({ productId, quantity });
                }
            } else {
                cartItems = cartItems.filter(item => item.productId !== productId);
            }

            updateCartSummary();
        }
    });

    productCatalog.addEventListener("input", (event) => {
        if (event.target.classList.contains("quantity-input")) {
            const productId = event.target.getAttribute("data-id");
            const newQuantity = parseInt(event.target.value, 10);

            if (newQuantity === 0) {
                cartItems = cartItems.filter(item => item.productId !== productId);
            } else {
                const existingItem = cartItems.find(item => item.productId === productId);
                if (existingItem) {
                    existingItem.quantity = newQuantity;
                }
            }

            updateCartSummary();
        }
    });

    cartSummary.addEventListener("click", () => {
        cartVisible = !cartVisible;
        updateCartSummary();
    });

    // **Fix: Only attach Contact button event if it exists**
    const contactButton = document.getElementById("contact-button");
    if (contactButton) {
        contactButton.addEventListener("click", () => {
            window.open("https://wa.me/917597877959", "_blank");
        });
    }

    createProductTiles();
    categorySelect.addEventListener("change", () => createProductTiles(categorySelect.value));
});
