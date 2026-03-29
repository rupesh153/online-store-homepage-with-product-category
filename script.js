let allProducts = [];
let filteredProducts = [];
let cartCount = 0;

// FETCH PRODUCTS
fetch('https://fakestoreapi.com/products')
    .then(res => res.json())
    .then(data => {
        allProducts = data;
        filteredProducts = data;
        displayProducts(data);
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

        // ✅ IMPORTANT: generate gradient INSIDE loop
        const randomGradient = gradients[Math.floor(Math.random() * gradients.length)];

        const card = `
        <div class="card" style="background:${randomGradient}">
            <img src="${p.image}">
            <h3>${p.title}</h3>
            <p class="price">₹${(p.price * 80).toFixed(0)}</p>
            <p class="rating">⭐ ${p.rating.rate}</p>
            <button class="add-cart" onclick="addToCart()">Add to Cart</button>
        </div>
        `;

        container.innerHTML += card;
    });
}

// ADD TO CART
function addToCart() {
    cartCount++;
    document.getElementById("cartCount").innerText = cartCount;
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
    result = result.filter(p => (p.price * 80) <= maxPrice);

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
