let cart = JSON.parse(localStorage.getItem("cart")) || [];

function displayCart() {
    const container = document.getElementById("cartContainer");
    container.innerHTML = "";

    let total = 0;

    cart.forEach((item, index) => {

        total += item.price * item.qty;

        container.innerHTML += `
        <div class="card">
            <img src="${item.image}">
            <h3>${item.title}</h3>
            <p>₹${item.price}</p>

            <div class="qty-box">
                <button onclick="changeQty(${index}, -1)">➖</button>
                <span>${item.qty}</span>
                <button onclick="changeQty(${index}, 1)">➕</button>
            </div>

            <button onclick="removeItem(${index})">❌ Remove</button>
        </div>
        `;
    });

    document.getElementById("totalPrice").innerText = total;
}

function changeQty(index, change) {
    cart[index].qty += change;

    if (cart[index].qty <= 0) {
        cart.splice(index, 1);
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    displayCart();
}

function removeItem(index) {
    cart.splice(index, 1);
    localStorage.setItem("cart", JSON.stringify(cart));
    displayCart();
}

displayCart();