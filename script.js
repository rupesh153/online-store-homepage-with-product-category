let allProducts = [];
let filteredProducts = [];
let cartCount = 0;

// FETCH PRODUCTS (FROM LOCAL JSON)
fetch('products.json')
    .then(res => res.json())
    .then(data => {
        // Convert rating number → object (so your existing code works)
        allProducts = data.map(p => ({
            ...p,
            rating: { rate: p.rating }
        }));

        filteredProducts = allProducts;
        displayProducts(filteredProducts);
        updateCartCount();
    });

// DISPLAY PRODUCTS
function displayProducts(products) {
    const container = document.getElementById("productContainer");
    container.innerHTML = "";

    const gradients = [
        "linear-gradient(135deg, #f07b6e, #1fb9c4)",
        "linear-gradient(135deg, #a18cd1, #fbc2eb)",
        "linear-gradient(135deg, #65e5f6, #fd85ed)",
        "linear-gradient(135deg, #84fab0, #8fd3f4)",
        "linear-gradient(135deg, #5bc920, #28fbf1)"
    ];

    products.forEach(p => {

        const randomGradient = gradients[Math.floor(Math.random() * gradients.length)];

        const card = `
        <div class="card" style="background:${randomGradient}">
            <img src="${p.image}">
            <h3>${p.title}</h3>
            <p class="price">₹${p.price}</p>
            <p class="rating">⭐ ${p.rating.rate}</p>
            <button class="add-cart" onclick="openCartPopup(${p.id})">
                Add to Cart
            </button>
        </div>
        `;

        container.innerHTML += card;
    });
}

let selectedProduct = null;
let quantity = 1;

// OPEN POPUP
function openCartPopup(id) {
    selectedProduct = allProducts.find(p => p.id === id);
    quantity = 1;

    document.getElementById("popupImg").src = selectedProduct.image;
    document.getElementById("popupTitle").innerText = selectedProduct.title;
    document.getElementById("popupPrice").innerText = "₹" + selectedProduct.price;
    document.getElementById("qty").innerText = quantity;

    document.getElementById("cartPopup").style.display = "flex";
}

// CLOSE POPUP
function closePopup() {
    document.getElementById("cartPopup").style.display = "none";
}

// CHANGE QUANTITY
function changeQty(val) {
    quantity += val;
    if (quantity < 1) quantity = 1;
    document.getElementById("qty").innerText = quantity;
}

// CONFIRM ADD (ONLY ONE FUNCTION)
function confirmAddToCart() {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    let existing = cart.find(item => item.id === selectedProduct.id);

    if (existing) {
        existing.qty += quantity;
    } else {
        cart.push({
            id: selectedProduct.id,
            title: selectedProduct.title,
            price: selectedProduct.price,
            image: selectedProduct.image,
            qty: quantity
        });
    }

    localStorage.setItem("cart", JSON.stringify(cart));

    updateCartCount();
    closePopup();
}

// CATEGORY FILTER
function filterCategory(category) {
    if (category === "all") {
        filteredProducts = allProducts;
    } else {
        filteredProducts = allProducts.filter(p => p.category === category);
    }
    applyFilters();
}

// SEARCH
document.getElementById("search").addEventListener("input", function () {
    applyFilters();
});

// PRICE FILTER
document.getElementById("priceRange").addEventListener("input", function () {
    document.getElementById("priceValue").innerText = this.value;
    applyFilters();
});

// SORT
document.getElementById("sortPrice").addEventListener("change", applyFilters);

// RATING FILTER
document.getElementById("ratingFilter").addEventListener("change", applyFilters);

// APPLY ALL FILTERS
function applyFilters() {
    let result = [...filteredProducts];

    const searchText = document.getElementById("search").value.toLowerCase();
    const maxPrice = document.getElementById("priceRange").value;
    const sortValue = document.getElementById("sortPrice").value;
    const ratingValue = document.getElementById("ratingFilter").value;

    // SEARCH
    result = result.filter(p =>
        p.title.toLowerCase().includes(searchText)
    );

    // PRICE
    result = result.filter(p => p.price <= maxPrice);

    // RATING
    if (ratingValue !== "all") {
        result = result.filter(p => p.rating.rate >= ratingValue);
    }

    // SORT
    if (sortValue === "low") {
        result.sort((a, b) => a.price - b.price);
    } else if (sortValue === "high") {
        result.sort((a, b) => b.price - a.price);
    }

    displayProducts(result);
}

// GO TO CART PAGE
function goToCart() {
    window.location.href = "cart.html";
}

// UPDATE CART COUNT
function updateCartCount() {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    let total = cart.reduce((sum, item) => sum + item.qty, 0);

    document.getElementById("cartCount").innerText = total;
}