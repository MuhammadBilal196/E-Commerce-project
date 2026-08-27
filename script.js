// ==========================================
// FEATURE 1: SHOPPING CART LOGIC
// ==========================================

// Update the cart number in the header on every page
function updateCartCount() {
    // Get cart from local storage, or create an empty array if it doesn't exist
    let cart = JSON.parse(localStorage.getItem('techstore_cart')) || [];
    const cartCountEl = document.getElementById('cart-count');
    
    if (cartCountEl) {
        cartCountEl.innerText = cart.length;
    }
}

// Function to add a product to the cart
function addToCart(productName, price) {
    let cart = JSON.parse(localStorage.getItem('techstore_cart')) || [];
    
    // Add new item to the array
    cart.push({ name: productName, price: price });
    
    // Save array back to local storage
    localStorage.setItem('techstore_cart', JSON.stringify(cart));
    
    // Update the number in the navigation bar immediately
    updateCartCount();
    alert(productName + " has been added to your cart!");
}

// Function to render items on the cart.html page
function renderCart() {
    const cartList = document.getElementById('cart-items');
    const totalPriceEl = document.getElementById('cart-total-price');
    
    // Only run this if we are actually on the cart page
    if (!cartList) return;

    let cart = JSON.parse(localStorage.getItem('techstore_cart')) || [];
    cartList.innerHTML = ''; // Clear existing content
    let total = 0;

    if (cart.length === 0) {
        cartList.innerHTML = '<li class="cart-item" style="justify-content: center; color: #64748b;">Your cart is currently empty.</li>';
    } else {
        cart.forEach((item) => {
            let li = document.createElement('li');
            li.className = 'cart-item';
            li.innerHTML = `<span><strong>${item.name}</strong></span> <span style="color: #0284c7; font-weight: 600;">$${item.price.toFixed(2)}</span>`;
            cartList.appendChild(li);
            total += item.price;
        });
    }

    if (totalPriceEl) {
        totalPriceEl.innerText = total.toFixed(2);
    }
}

// Function to clear the entire cart
function clearCart() {
    localStorage.removeItem('techstore_cart');
    updateCartCount();
    renderCart();
}


// ==========================================
// FEATURE 2: DYNAMIC PRODUCT PAGE LOGIC
// ==========================================

// Our product database
const products = {
  headphones: {
    name: "Premium Wireless Headphones",
    price: 99.00,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80",
    description: "Experience industry-leading noise cancellation and crystal-clear audio with our premium over-ear wireless headphones. Features a 30-hour battery life, plush ear cushions for all-day comfort, and seamless Bluetooth 5.0 connectivity."
  },
  watch: {
    name: "Next-Gen Smart Watch",
    price: 149.00,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80",
    description: "Stay connected and track your fitness goals with our advanced Smart Watch. Features a vibrant OLED display, 24/7 heart rate monitoring, sleep tracking, and a water-resistant design perfect for any workout."
  },
  keyboard: {
    name: "RGB Mechanical Keyboard",
    price: 85.00,
    image: "https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&w=800&q=80",
    description: "Elevate your typing and gaming experience. This mechanical keyboard features tactile blue switches for satisfying feedback, customizable per-key RGB lighting, and an ergonomic aluminum frame built to last."
  }
};

// Function to read the URL and load the correct product
function loadProductDetails() {
  // Grab the '?item=xxx' from the browser URL
  const urlParams = new URLSearchParams(window.location.search);
  const itemId = urlParams.get('item');
  const titleEl = document.getElementById('product-title');

  // Check if we are on the product page and if the item exists in our database
  if (titleEl && itemId && products[itemId]) {
    const product = products[itemId];
    
    // Inject the data into the HTML
    document.getElementById('product-img').src = product.image;
    document.getElementById('product-img').alt = product.name;
    titleEl.innerText = product.name;
    document.getElementById('product-price').innerText = "$" + product.price.toFixed(2);
    document.getElementById('product-desc').innerText = product.description;
    
    // Set up the Add to Cart button to use the correct product info
    const btn = document.getElementById('add-to-cart-btn');
    btn.setAttribute('onclick', `addToCart('${product.name}', ${product.price})`);
  } else if (titleEl) {
    // Error message if someone visits the page without clicking a valid product
    titleEl.innerText = "Product Not Found";
  }
}

// ==========================================
// INITIALIZATION
// ==========================================

// Run these functions immediately when any page loads to ensure the UI is up to date
updateCartCount();
renderCart();
loadProductDetails();