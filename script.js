const productCatalog = document.getElementById("productCatalog");
const categoryDropdown = document.getElementById("categoryDropdown");
const totalItemsElement = document.getElementById("total-items");
const totalQuantityElement = document.getElementById("total-quantity");
const placeOrderButton = document.getElementById("place-order");

let cart = {}; // Store cart items (productId: quantity)

// Generate 10 categories, each with 100 products
let products = [];
for (let cat = 1; cat <= 10; cat++) {
    for (let i = 1; i <= 100; i++) {
        products.push({
            id: `P${cat}${i}`,
            name: `Product ${cat}-${i}`,
            image: "placeholder.jpg", 
            category: `${cat}`
        });
    }
}

// Function to display products based on selected category
function displayProducts(category) {
    productCatalog.innerHTML = "";
    let filteredProducts = category === "all" ? products : products.filter(p => p.category === category);

    filteredProducts.forEach(product => {
        const tile = document.createElement("div");
        tile.classList.add("product-tile");
        tile.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <h4>${product.name}</h4>
            <input type="number" id="qty-${product.id}" min="0" value="0">
            <button onclick="addToCart('${product.id}')">Add to Cart</button>
        `;
        productCatalog.appendChild(tile);
    });
}

// Function to update cart summary
function updateCartSummary() {
    let totalItems = Object.keys(cart).length;
    let totalQuantity = Object.values(cart).reduce((sum, qty) => sum + qty, 0);

    totalItemsElement.textContent = totalItems;
    totalQuantityElement.textContent = totalQuantity;
}

// Function to add/update cart
function addToCart(productId) {
    let qtyInput = document.getElementById(`qty-${productId}`);
    let quantity = parseInt(qtyInput.value);

    if (quantity > 0) {
        cart[productId] = quantity;
    } else {
        delete cart[productId];
    }

    updateCartSummary();
}

// Function to place order via WhatsApp
function placeOrder() {
    if (Object.keys(cart).length === 0) {
        alert("Cart is empty. Add products before placing an order.");
        return;
    }

    let message = "Order Details:%0A";
    Object.keys(cart).forEach(productId => {
        message += `${productId}: ${cart[productId]}%0A`;
    });

    let phoneNumber = "917597877959"; // Replace with your WhatsApp number
    let whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;
    window.open(whatsappUrl, "_blank");
}

// Event Listeners
categoryDropdown.addEventListener("change", () => displayProducts(categoryDropdown.value));
placeOrderButton.addEventListener("click", placeOrder);

// Initial Display
displayProducts("all");
