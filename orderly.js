let cart = {};

function updateCartCount() {
  let total = 0;
  for (const id in cart) {
    total += cart[id].quantity;
  }
  document.getElementById("cart-count").textContent = total;
}

function addToCart(productId, productInfo) {
  if (cart[productId]) {
    cart[productId].quantity++;
  } else {
    cart[productId] = {
      name: productInfo.name,
      price: parseFloat(productInfo.price),
      quantity: 1,
    };
  }
  updateCartCount();
}

function removeFromCart(productId) {
  delete cart[productId];
}

const modal = document.getElementById("modal");
const modalBody = document.getElementById("modal-body");
const closeModalBtn = document.querySelector(".close-modal");

function openModal(contentHtml) {
  modalBody.innerHTML = contentHtml;
  modal.style.display = "flex";
}

function closeModal() {
  modal.style.display = "none";
}

closeModalBtn.addEventListener("click", closeModal);
modal.addEventListener("click", (e) => {
  if (e.target === modal) {
    closeModal();
  }
});

document.querySelectorAll(".product img").forEach((img) => {
  img.addEventListener("click", () => {
    const productCard = img.parentElement;
    openProductModal(productCard);
  });
});

function openProductModal(productCard) {
  const productId = productCard.dataset.id;
  const name = productCard.dataset.name;
  const price = productCard.dataset.price;
  const description = productCard.dataset.description;
  const imgSrc = productCard.dataset.img;
  const content = `
    <img src="${imgSrc}" alt="${name}">
    <h2>${name}</h2>
    <p class="price">$${price}</p>
    <p>${description}</p>
    <button class="modal-add-to-cart" data-product-id="${productId}" data-name="${name}" data-price="${price}">Add to Cart</button>
  `;
  openModal(content);

  document
    .querySelector(".modal-add-to-cart")
    .addEventListener("click", function () {
      const pid = this.dataset.productId;
      addToCart(pid, { name: this.dataset.name, price: this.dataset.price });
      this.textContent = "Added!";
      setTimeout(() => {
        this.textContent = "Add to Cart";
      }, 800);
    });
}

document.getElementById("cart-btn").addEventListener("click", openCartModal);

function openCartModal() {
  let content = "<h2>Your Cart</h2>";
  if (Object.keys(cart).length === 0) {
    content += "<p>Your cart is empty.</p>";
  } else {
    content += "<ul style='list-style:none; padding:0;'>";
    let total = 0;
    for (const id in cart) {
      const item = cart[id];
      const itemTotal = item.price * item.quantity;
      total += itemTotal;
      content += `<li style="margin:10px 0; display:flex; justify-content:space-between; align-items:center;">
                    <span>${item.name} (x${
        item.quantity
      }) - $${itemTotal.toFixed(2)}</span>
                    <button class="remove-item" data-product-id="${id}" style="background:#e91e63; color:#fff; border:none; padding:5px 10px; border-radius:5px;">Remove</button>
                  </li>`;
    }
    content += "</ul>";
    content += `<p style="font-weight:bold;">Total: $${total.toFixed(2)}</p>`;
    content += `<button id="checkout-btn" style="padding:10px 15px; background:#558fcf; color:#fff; border:none; border-radius:5px;">Checkout</button>`;
  }
  openModal(content);

  document.querySelectorAll(".remove-item").forEach((button) => {
    button.addEventListener("click", () => {
      const pid = button.dataset.productId;
      removeFromCart(pid);
      openCartModal();
      updateCartCount();
    });
  });

  const checkoutBtn = document.getElementById("checkout-btn");
  if (checkoutBtn) {
    checkoutBtn.addEventListener("click", () => {
      alert("Thank you for your purchase!");
      cart = {};
      updateCartCount();
      closeModal();
    });
  }
}

document.querySelectorAll(".add-to-cart").forEach((button) => {
  button.addEventListener("click", () => {
    const productCard = button.parentElement;
    const productId = productCard.dataset.id;
    const name = productCard.dataset.name;
    const price = productCard.dataset.price;
    addToCart(productId, { name, price });
    button.textContent = "Added!";
    setTimeout(() => {
      button.textContent = "Add to Cart";
    }, 800);
  });
});

document.querySelectorAll(".filter-btn").forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter;
    filterProducts(filter);
  });
});

function filterProducts(filter) {
  const products = document.querySelectorAll(".product");
  products.forEach((product) => {
    const category = product.dataset.category;
    if (filter === "all" || category === filter) {
      product.style.display = "block";
    } else {
      product.style.display = "none";
    }
  });
}
