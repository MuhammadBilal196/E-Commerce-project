/**
 * TechStore — client-side storefront logic
 *
 * Features:
 *  - Single product catalogue used by every page
 *  - Persistent cart (localStorage) with quantities
 *  - Dynamic home grid (with sorting), product page and cart page
 *  - Toast notifications, mobile navigation, contact-form validation
 */
(function () {
    'use strict';

    /* ======================================================================
       1. PRODUCT CATALOGUE
       ====================================================================== */

    const PRODUCTS = [
        {
            id: 'headphones',
            name: 'Premium Wireless Headphones',
            category: 'Audio',
            price: 99.0,
            rating: 4.8,
            reviews: 214,
            tag: 'Bestseller',
            image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
            description:
                'Experience industry-leading noise cancellation and crystal-clear audio with our premium over-ear wireless headphones. Plush ear cushions keep you comfortable all day long.',
            specs: ['Active noise cancellation', '30-hour battery life', 'Bluetooth 5.0 connectivity', 'Foldable design with travel case']
        },
        {
            id: 'watch',
            name: 'Next-Gen Smart Watch',
            category: 'Wearables',
            price: 149.0,
            rating: 4.6,
            reviews: 158,
            tag: 'New',
            image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80',
            description:
                'Stay connected and track your fitness goals with our advanced smart watch. A vibrant display and water-resistant build make it perfect for any workout.',
            specs: ['Vibrant OLED display', '24/7 heart-rate monitoring', 'Sleep & activity tracking', 'Water resistant up to 50 m']
        },
        {
            id: 'keyboard',
            name: 'RGB Mechanical Keyboard',
            category: 'Accessories',
            price: 85.0,
            rating: 4.7,
            reviews: 97,
            tag: '',
            image: 'https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&w=800&q=80',
            description:
                'Elevate your typing and gaming experience with tactile switches, customisable lighting and an ergonomic frame built to last.',
            specs: ['Tactile blue switches', 'Per-key RGB lighting', 'Aluminium frame', 'Detachable USB-C cable']
        }
    ];

    const CART_KEY = 'techstore_cart_v2';
    const FREE_SHIPPING_THRESHOLD = 100;
    const SHIPPING_FEE = 9.99;
    const TAX_RATE = 0.08;

    const findProduct = (id) => PRODUCTS.find((p) => p.id === id);

    const currency = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });
    const formatPrice = (value) => currency.format(value);

    /** Escape text before inserting it into HTML templates. */
    const escapeHTML = (str) =>
        String(str).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

    const renderStars = (rating) => {
        const full = Math.round(rating);
        return '★'.repeat(full) + '☆'.repeat(5 - full);
    };

    /* ======================================================================
       2. CART STORE
       ====================================================================== */

    const Cart = {
        /** @returns {{id: string, qty: number}[]} */
        get() {
            try {
                const data = JSON.parse(localStorage.getItem(CART_KEY));
                // Drop anything that no longer exists in the catalogue
                return Array.isArray(data) ? data.filter((i) => findProduct(i.id) && i.qty > 0) : [];
            } catch {
                return [];
            }
        },

        save(items) {
            localStorage.setItem(CART_KEY, JSON.stringify(items));
            updateCartBadge(true);
        },

        add(id, qty = 1) {
            const items = this.get();
            const existing = items.find((i) => i.id === id);
            if (existing) existing.qty += qty;
            else items.push({ id, qty });
            this.save(items);
        },

        setQty(id, qty) {
            const items = this.get()
                .map((i) => (i.id === id ? { ...i, qty } : i))
                .filter((i) => i.qty > 0);
            this.save(items);
        },

        remove(id) {
            this.save(this.get().filter((i) => i.id !== id));
        },

        clear() {
            this.save([]);
        },

        count() {
            return this.get().reduce((sum, i) => sum + i.qty, 0);
        },

        totals() {
            const subtotal = this.get().reduce((sum, i) => sum + findProduct(i.id).price * i.qty, 0);
            const shipping = subtotal === 0 || subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
            const tax = subtotal * TAX_RATE;
            return { subtotal, shipping, tax, total: subtotal + shipping + tax };
        }
    };

    function updateCartBadge(animate = false) {
        const count = Cart.count();
        document.querySelectorAll('[data-cart-count]').forEach((el) => {
            el.textContent = count;
            if (animate) {
                el.classList.remove('bump');
                void el.offsetWidth; // restart animation
                el.classList.add('bump');
            }
        });
    }

    /* ======================================================================
       3. UI HELPERS
       ====================================================================== */

    function toast(message, { type = 'success', link } = {}) {
        let container = document.querySelector('.toast-container');
        if (!container) {
            container = document.createElement('div');
            container.className = 'toast-container';
            container.setAttribute('role', 'status');
            container.setAttribute('aria-live', 'polite');
            document.body.appendChild(container);
        }

        const el = document.createElement('div');
        el.className = `toast ${type === 'error' ? 'error' : ''}`;
        el.innerHTML = `<span>${escapeHTML(message)}</span>${link ? `<a href="${link.href}">${escapeHTML(link.label)}</a>` : ''}`;
        container.appendChild(el);

        setTimeout(() => {
            el.classList.add('hide');
            el.addEventListener('animationend', () => el.remove(), { once: true });
        }, 3200);
    }

    function initNavigation() {
        const toggle = document.querySelector('.nav-toggle');
        const links = document.getElementById('nav-links');
        if (!toggle || !links) return;

        toggle.addEventListener('click', () => {
            const open = links.classList.toggle('open');
            toggle.setAttribute('aria-expanded', String(open));
        });
    }

    function setFooterYear() {
        document.querySelectorAll('[data-year]').forEach((el) => (el.textContent = new Date().getFullYear()));
    }

    /* ======================================================================
       4. HOME PAGE — product grid
       ====================================================================== */

    function productCardHTML(p) {
        const url = `product.html?item=${encodeURIComponent(p.id)}`;
        return `
        <article class="product-card">
            <a href="${url}" class="product-card-media" tabindex="-1" aria-hidden="true">
                <img src="${p.image}" alt="" loading="lazy" width="400" height="300">
                ${p.tag ? `<span class="tag">${escapeHTML(p.tag)}</span>` : ''}
            </a>
            <div class="product-card-body">
                <span class="product-category">${escapeHTML(p.category)}</span>
                <h3><a href="${url}">${escapeHTML(p.name)}</a></h3>
                <div class="rating" aria-label="Rated ${p.rating} out of 5">${renderStars(p.rating)}<small>(${p.reviews})</small></div>
                <div class="product-card-footer">
                    <span class="price">${formatPrice(p.price)}</span>
                    <button class="btn btn-sm" data-add-to-cart="${p.id}" aria-label="Add ${escapeHTML(p.name)} to cart">Add to Cart</button>
                </div>
            </div>
        </article>`;
    }

    function initProductGrid() {
        const grid = document.getElementById('product-grid');
        if (!grid) return;

        const sortSelect = document.getElementById('sort-select');

        const render = () => {
            const list = [...PRODUCTS];
            switch (sortSelect && sortSelect.value) {
                case 'price-asc':
                    list.sort((a, b) => a.price - b.price);
                    break;
                case 'price-desc':
                    list.sort((a, b) => b.price - a.price);
                    break;
                case 'rating':
                    list.sort((a, b) => b.rating - a.rating);
                    break;
            }
            grid.innerHTML = list.map(productCardHTML).join('');
        };

        render();
        if (sortSelect) sortSelect.addEventListener('change', render);

        grid.addEventListener('click', (e) => {
            const btn = e.target.closest('[data-add-to-cart]');
            if (!btn) return;
            const product = findProduct(btn.dataset.addToCart);
            Cart.add(product.id);
            toast(`${product.name} added to cart`, { link: { href: 'cart.html', label: 'View cart' } });
        });
    }

    /* ======================================================================
       5. PRODUCT DETAIL PAGE
       ====================================================================== */

    function initProductPage() {
        const container = document.getElementById('product-detail');
        if (!container) return;

        const id = new URLSearchParams(window.location.search).get('item');
        const product = findProduct(id);

        if (!product) {
            document.title = 'Product Not Found | TechStore';
            container.innerHTML = `
            <div class="card empty-state">
                <div class="empty-state-icon" aria-hidden="true">🔍</div>
                <h2>Product not found</h2>
                <p>The product you're looking for doesn't exist or may have been removed.</p>
                <a href="index.html#shop" class="btn">Browse Products</a>
            </div>`;
            return;
        }

        document.title = `${product.name} | TechStore`;
        const crumb = document.getElementById('breadcrumb-current');
        if (crumb) crumb.textContent = product.name;

        container.innerHTML = `
        <div class="product-detail">
            <div class="product-detail-media">
                <img src="${product.image}" alt="${escapeHTML(product.name)}" width="800" height="800">
            </div>
            <div>
                <span class="product-category">${escapeHTML(product.category)}</span>
                <h1>${escapeHTML(product.name)}</h1>
                <div class="rating" aria-label="Rated ${product.rating} out of 5">${renderStars(product.rating)}<small>${product.rating} · ${product.reviews} reviews</small></div>
                <p class="price">${formatPrice(product.price)}</p>
                <p class="product-description">${escapeHTML(product.description)}</p>
                <ul class="spec-list">${product.specs.map((s) => `<li>${escapeHTML(s)}</li>`).join('')}</ul>
                <div class="purchase-row">
                    <div class="qty" role="group" aria-label="Quantity">
                        <button type="button" data-qty="-1" aria-label="Decrease quantity">−</button>
                        <output id="qty-value" aria-live="polite">1</output>
                        <button type="button" data-qty="1" aria-label="Increase quantity">+</button>
                    </div>
                    <button id="add-to-cart-btn" class="btn">Add to Cart</button>
                    <a href="index.html#shop" class="btn btn-outline">Continue Shopping</a>
                </div>
                <p class="stock">● In stock — ships within 24 hours</p>
            </div>
        </div>`;

        let qty = 1;
        const qtyValue = document.getElementById('qty-value');

        container.querySelectorAll('[data-qty]').forEach((btn) =>
            btn.addEventListener('click', () => {
                qty = Math.min(10, Math.max(1, qty + Number(btn.dataset.qty)));
                qtyValue.textContent = qty;
            })
        );

        document.getElementById('add-to-cart-btn').addEventListener('click', () => {
            Cart.add(product.id, qty);
            toast(`${qty} × ${product.name} added to cart`, { link: { href: 'cart.html', label: 'View cart' } });
        });
    }

    /* ======================================================================
       6. CART PAGE
       ====================================================================== */

    const TRASH_ICON =
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/></svg>';

    function initCartPage() {
        const root = document.getElementById('cart-root');
        if (!root) return;

        const render = () => {
            const items = Cart.get();

            if (items.length === 0) {
                root.innerHTML = `
                <div class="card empty-state">
                    <div class="empty-state-icon" aria-hidden="true">🛒</div>
                    <h2>Your cart is empty</h2>
                    <p>Looks like you haven't added anything yet.</p>
                    <a href="index.html#shop" class="btn">Start Shopping</a>
                </div>`;
                return;
            }

            const { subtotal, shipping, tax, total } = Cart.totals();
            const remaining = FREE_SHIPPING_THRESHOLD - subtotal;

            root.innerHTML = `
            <div class="cart-layout">
                <section class="card" aria-label="Cart items">
                    <ul class="cart-items">
                        ${items
                            .map(({ id, qty }) => {
                                const p = findProduct(id);
                                const url = `product.html?item=${encodeURIComponent(p.id)}`;
                                return `
                            <li class="cart-item">
                                <img src="${p.image}" alt="" width="80" height="80" loading="lazy">
                                <div class="cart-item-info">
                                    <a href="${url}" class="cart-item-name">${escapeHTML(p.name)}</a>
                                    <div class="cart-item-unit">${formatPrice(p.price)} each</div>
                                </div>
                                <div class="qty qty-sm" role="group" aria-label="Quantity for ${escapeHTML(p.name)}">
                                    <button type="button" data-action="dec" data-id="${p.id}" aria-label="Decrease quantity">−</button>
                                    <span>${qty}</span>
                                    <button type="button" data-action="inc" data-id="${p.id}" aria-label="Increase quantity">+</button>
                                </div>
                                <span class="cart-item-total">${formatPrice(p.price * qty)}</span>
                                <button class="icon-btn" data-action="remove" data-id="${p.id}" aria-label="Remove ${escapeHTML(p.name)}">${TRASH_ICON}</button>
                            </li>`;
                            })
                            .join('')}
                    </ul>
                    <div class="cart-actions">
                        <a href="index.html#shop" class="btn btn-outline">← Continue Shopping</a>
                        <button class="btn btn-danger" data-action="clear">Empty Cart</button>
                    </div>
                </section>

                <aside class="card summary" aria-label="Order summary">
                    <h2>Order Summary</h2>
                    <div class="summary-row"><span>Subtotal</span><span>${formatPrice(subtotal)}</span></div>
                    <div class="summary-row"><span>Shipping</span><span>${shipping === 0 ? 'Free' : formatPrice(shipping)}</span></div>
                    <div class="summary-row"><span>Estimated tax (8%)</span><span>${formatPrice(tax)}</span></div>
                    <div class="summary-row total"><span>Total</span><span>${formatPrice(total)}</span></div>
                    <p class="summary-note">${
                        remaining > 0
                            ? `Add ${formatPrice(remaining)} more to get <strong>free shipping</strong>.`
                            : '🎉 Your order qualifies for free shipping.'
                    }</p>
                    <button class="btn btn-block" data-action="checkout">Proceed to Checkout</button>
                </aside>
            </div>`;
        };

        root.addEventListener('click', (e) => {
            const btn = e.target.closest('[data-action]');
            if (!btn) return;
            const { action, id } = btn.dataset;
            const item = Cart.get().find((i) => i.id === id);

            switch (action) {
                case 'inc':
                    Cart.setQty(id, Math.min(10, item.qty + 1));
                    break;
                case 'dec':
                    Cart.setQty(id, item.qty - 1);
                    break;
                case 'remove':
                    Cart.remove(id);
                    toast(`${findProduct(id).name} removed from cart`, { type: 'error' });
                    break;
                case 'clear':
                    if (confirm('Remove all items from your cart?')) Cart.clear();
                    break;
                case 'checkout':
                    Cart.clear();
                    toast('Order placed successfully! Thank you for shopping with TechStore.');
                    break;
            }
            render();
        });

        render();
    }

    /* ======================================================================
       7. CONTACT FORM
       ====================================================================== */

    function initContactForm() {
        const form = document.getElementById('contact-form');
        if (!form) return;

        const success = document.getElementById('form-success');
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        const validators = {
            name: (v) => v.trim().length >= 2,
            email: (v) => emailPattern.test(v.trim()),
            message: (v) => v.trim().length >= 10
        };

        const validateField = (field) => {
            const valid = validators[field.name] ? validators[field.name](field.value) : true;
            field.closest('.form-group').classList.toggle('invalid', !valid);
            field.setAttribute('aria-invalid', String(!valid));
            return valid;
        };

        form.querySelectorAll('input, textarea').forEach((field) => {
            field.addEventListener('blur', () => validateField(field));
            // Clear the error as soon as the user fixes it (avoids layout jumps on blur)
            field.addEventListener('input', () => {
                if (field.closest('.form-group').classList.contains('invalid')) validateField(field);
            });
        });

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const fields = [...form.querySelectorAll('input, textarea')];
            const allValid = fields.map(validateField).every(Boolean);

            if (!allValid) {
                fields.find((f) => f.getAttribute('aria-invalid') === 'true').focus();
                return;
            }

            form.reset();
            success.classList.add('show');
            success.focus();
            setTimeout(() => success.classList.remove('show'), 6000);
        });
    }

    /* ======================================================================
       8. INITIALISATION
       ====================================================================== */

    document.addEventListener('DOMContentLoaded', () => {
        updateCartBadge();
        initNavigation();
        setFooterYear();
        initProductGrid();
        initProductPage();
        initCartPage();
        initContactForm();
    });

    // Keep the cart badge in sync across open tabs
    window.addEventListener('storage', (e) => {
        if (e.key === CART_KEY) updateCartBadge();
    });
})();
