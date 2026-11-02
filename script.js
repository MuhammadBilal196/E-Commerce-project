/**
 * TechStore — client-side storefront logic
 *
 *  1. Product catalogue (single source of truth)
 *  2. Cart + coupon store (localStorage)
 *  3. UI helpers (toasts, nav, image fallbacks, newsletter)
 *  4. Home page   — product grid with category filter, search and sort
 *  5. Product page — details, quantity, related products
 *  6. Cart page   — quantities, coupon, order summary
 *  7. Checkout    — shipping + payment (card / wallet / cash on delivery)
 *  8. Contact form validation
 */
(function () {
    'use strict';

    /* ======================================================================
       1. PRODUCT CATALOGUE
       ====================================================================== */

    const img = (id) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=800&q=80`;

    const PRODUCTS = [
        {
            id: 'headphones',
            name: 'Premium Wireless Headphones',
            category: 'Audio',
            price: 99.0,
            oldPrice: 129.0,
            rating: 4.8,
            reviews: 214,
            tag: 'Bestseller',
            image: img('photo-1505740420928-5e560c06d30e'),
            description:
                'Industry-leading noise cancellation and crystal-clear audio in a lightweight over-ear design. Plush ear cushions keep you comfortable all day long.',
            specs: ['Active noise cancellation', '30-hour battery life', 'Bluetooth 5.3', 'Foldable with travel case']
        },
        {
            id: 'watch',
            name: 'Next-Gen Smart Watch',
            category: 'Wearables',
            price: 149.0,
            rating: 4.6,
            reviews: 158,
            tag: 'New',
            image: img('photo-1523275335684-37898b6baf30'),
            description:
                'Track workouts, sleep and heart rate with a vibrant always-on display and a water-resistant build made for everyday adventures.',
            specs: ['1.4" AMOLED display', '24/7 heart-rate monitor', 'Sleep & activity tracking', 'Water resistant to 50 m']
        },
        {
            id: 'keyboard',
            name: 'RGB Mechanical Keyboard',
            category: 'Accessories',
            price: 85.0,
            rating: 4.7,
            reviews: 97,
            image: img('photo-1595225476474-87563907a212'),
            description:
                'Tactile switches, customisable per-key lighting and a solid aluminium frame make every keystroke satisfying — at work or in game.',
            specs: ['Tactile mechanical switches', 'Per-key RGB lighting', 'Aluminium top plate', 'Detachable USB-C cable']
        },
        {
            id: 'earbuds',
            name: 'True Wireless Earbuds Pro',
            category: 'Audio',
            price: 79.0,
            oldPrice: 99.0,
            rating: 4.5,
            reviews: 342,
            tag: 'Hot',
            image: img('photo-1590658268037-6bf12165a8df'),
            description:
                'Pocket-sized earbuds with rich bass, transparency mode and a compact charging case that delivers a full day of listening.',
            specs: ['Hybrid noise cancelling', '28 h total with case', 'IPX4 sweat resistant', 'Touch controls']
        },
        {
            id: 'mouse',
            name: 'Ergonomic Wireless Mouse',
            category: 'Accessories',
            price: 39.0,
            rating: 4.4,
            reviews: 121,
            image: img('photo-1527864550417-7fd91fc51a46'),
            description:
                'A sculpted, palm-friendly design with a precision sensor and silent clicks — perfect for long work sessions.',
            specs: ['4000 DPI optical sensor', 'Silent click buttons', '70-day battery life', 'Multi-device pairing']
        },
        {
            id: 'speaker',
            name: 'Portable Bluetooth Speaker',
            category: 'Audio',
            price: 59.0,
            oldPrice: 75.0,
            rating: 4.6,
            reviews: 188,
            image: img('photo-1608043152269-423dbba4e7e1'),
            description:
                '360° sound with deep bass in a rugged, waterproof body. Take the party to the beach, the park or the shower.',
            specs: ['360° surround sound', '15-hour playtime', 'IP67 waterproof', 'Built-in microphone']
        },
        {
            id: 'laptop',
            name: 'UltraBook Pro 14"',
            category: 'Computers',
            price: 1099.0,
            oldPrice: 1249.0,
            rating: 4.9,
            reviews: 76,
            tag: 'Premium',
            image: img('photo-1496181133206-80ce9b88a853'),
            description:
                'A featherweight aluminium laptop with a stunning 14" display, all-day battery and the power to handle creative work on the go.',
            specs: ['14" 2.8K display', '16 GB RAM · 512 GB SSD', 'Up to 18 h battery', 'Backlit keyboard']
        },
        {
            id: 'monitor',
            name: '27" 4K UHD Monitor',
            category: 'Computers',
            price: 329.0,
            rating: 4.7,
            reviews: 64,
            image: img('photo-1527443224154-c4a3942d3acf'),
            description:
                'Razor-sharp 4K resolution with wide colour coverage and a slim bezel design that looks great in any workspace.',
            specs: ['3840 × 2160 IPS panel', '99% sRGB colour', 'USB-C with 65 W charging', 'Height-adjustable stand']
        },
        {
            id: 'camera',
            name: 'Mirrorless Camera Kit',
            category: 'Cameras',
            price: 749.0,
            rating: 4.8,
            reviews: 53,
            image: img('photo-1516035069371-29a1b244cc32'),
            description:
                'Capture stunning photos and 4K video with a compact mirrorless body and a versatile kit lens included.',
            specs: ['24 MP APS-C sensor', '4K 30p video', 'In-body stabilisation', '18–55 mm kit lens']
        },
        {
            id: 'smartphone',
            name: 'Galaxy-Class Smartphone',
            category: 'Phones & Tablets',
            price: 699.0,
            oldPrice: 799.0,
            rating: 4.6,
            reviews: 205,
            tag: 'Deal',
            image: img('photo-1511707171634-5f897ff02aa9'),
            description:
                'A brilliant edge-to-edge display, pro-grade triple camera and a battery that easily lasts all day.',
            specs: ['6.5" 120 Hz OLED', 'Triple 50 MP camera', '5000 mAh battery', '256 GB storage']
        },
        {
            id: 'tablet',
            name: '11" Pro Tablet',
            category: 'Phones & Tablets',
            price: 499.0,
            rating: 4.7,
            reviews: 89,
            image: img('photo-1544244015-0df4b3ffc6b0'),
            description:
                'Sketch, stream and multitask on a gorgeous 11" display. Pairs perfectly with a keyboard case for productivity anywhere.',
            specs: ['11" Liquid display', '128 GB storage', 'Stylus support', 'Up to 10 h battery']
        },
        {
            id: 'controller',
            name: 'Wireless Game Controller',
            category: 'Gaming',
            price: 59.0,
            rating: 4.5,
            reviews: 167,
            image: img('photo-1592840496694-26d035b52b48'),
            description:
                'Responsive triggers, precise thumbsticks and a comfortable grip for marathon gaming sessions on PC and console.',
            specs: ['Low-latency wireless', 'Rechargeable battery', 'Haptic feedback', 'PC & console compatible']
        }
    ];

    const CATEGORY_ICONS = {
        Audio: '🎧',
        Wearables: '⌚',
        Accessories: '⌨️',
        Computers: '💻',
        Cameras: '📷',
        'Phones & Tablets': '📱',
        Gaming: '🎮'
    };

    const COUPONS = {
        TECH10: { percent: 10, label: '10% off your order' },
        STUDENT15: { percent: 15, label: '15% student discount' }
    };

    const CART_KEY = 'techstore_cart_v2';
    const COUPON_KEY = 'techstore_coupon';
    const FREE_SHIPPING_THRESHOLD = 100;
    const SHIPPING_FEE = 9.99;
    const TAX_RATE = 0.08;
    const MAX_QTY = 10;

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

    const discountPercent = (p) => (p.oldPrice ? Math.round((1 - p.price / p.oldPrice) * 100) : 0);

    const productUrl = (p) => `product.html?item=${encodeURIComponent(p.id)}`;

    /** Image tag with a graceful fallback if the remote image fails to load. */
    const productImg = (p, attrs = '') =>
        `<img src="${p.image}" data-fallback="${CATEGORY_ICONS[p.category] || '🛍️'}" ${attrs}>`;

    /* ======================================================================
       2. CART & COUPON STORE
       ====================================================================== */

    const storage = {
        get(key, fallback) {
            try {
                const v = JSON.parse(localStorage.getItem(key));
                return v === null ? fallback : v;
            } catch {
                return fallback;
            }
        },
        set(key, value) {
            try {
                localStorage.setItem(key, JSON.stringify(value));
            } catch {
                /* storage unavailable (private mode) — ignore */
            }
        }
    };

    const Cart = {
        /** @returns {{id: string, qty: number}[]} */
        get() {
            const data = storage.get(CART_KEY, []);
            return Array.isArray(data) ? data.filter((i) => findProduct(i.id) && i.qty > 0) : [];
        },

        save(items) {
            storage.set(CART_KEY, items);
            updateCartBadge(true);
        },

        add(id, qty = 1) {
            const items = this.get();
            const existing = items.find((i) => i.id === id);
            if (existing) existing.qty = Math.min(MAX_QTY, existing.qty + qty);
            else items.push({ id, qty: Math.min(MAX_QTY, qty) });
            this.save(items);
        },

        setQty(id, qty) {
            const items = this.get()
                .map((i) => (i.id === id ? { ...i, qty: Math.min(MAX_QTY, qty) } : i))
                .filter((i) => i.qty > 0);
            this.save(items);
        },

        remove(id) {
            this.save(this.get().filter((i) => i.id !== id));
        },

        clear() {
            this.save([]);
            Coupon.remove();
        },

        count() {
            return this.get().reduce((sum, i) => sum + i.qty, 0);
        },

        totals() {
            const subtotal = this.get().reduce((sum, i) => sum + findProduct(i.id).price * i.qty, 0);
            const coupon = Coupon.get();
            const discount = coupon ? subtotal * (COUPONS[coupon].percent / 100) : 0;
            const afterDiscount = subtotal - discount;
            const shipping = afterDiscount === 0 || afterDiscount >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
            const tax = afterDiscount * TAX_RATE;
            return { subtotal, coupon, discount, afterDiscount, shipping, tax, total: afterDiscount + shipping + tax };
        }
    };

    const Coupon = {
        get() {
            const code = storage.get(COUPON_KEY, null);
            return code && COUPONS[code] ? code : null;
        },
        apply(code) {
            const normalised = String(code).trim().toUpperCase();
            if (!COUPONS[normalised]) return false;
            storage.set(COUPON_KEY, normalised);
            return true;
        },
        remove() {
            localStorage.removeItem(COUPON_KEY);
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

    /** Shared HTML for the order totals block (cart + checkout). */
    function totalsHTML(t) {
        return `
            <div class="summary-row"><span>Subtotal</span><span>${formatPrice(t.subtotal)}</span></div>
            ${t.coupon ? `<div class="summary-row discount"><span>Discount (${t.coupon})</span><span>−${formatPrice(t.discount)}</span></div>` : ''}
            <div class="summary-row"><span>Shipping</span><span>${t.shipping === 0 ? 'Free' : formatPrice(t.shipping)}</span></div>
            <div class="summary-row"><span>Estimated tax (8%)</span><span>${formatPrice(t.tax)}</span></div>
            <div class="summary-row total"><span>Total</span><span>${formatPrice(t.total)}</span></div>`;
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

    /** Replace broken images with a branded gradient placeholder. */
    function initImageFallbacks() {
        const placeholder = (emoji) =>
            'data:image/svg+xml,' +
            encodeURIComponent(
                `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#e0f2fe"/><stop offset="1" stop-color="#e0e7ff"/></linearGradient></defs><rect width="400" height="400" fill="url(#g)"/><text x="200" y="225" font-size="120" text-anchor="middle">${emoji}</text></svg>`
            );

        document.addEventListener(
            'error',
            (e) => {
                const el = e.target;
                if (el.tagName === 'IMG' && el.dataset.fallback && !el.dataset.failed) {
                    el.dataset.failed = 'true';
                    el.src = placeholder(el.dataset.fallback);
                }
            },
            true
        );

        // Images that failed before this listener was attached
        document.querySelectorAll('img[data-fallback]').forEach((el) => {
            if (el.complete && el.naturalWidth === 0) el.dispatchEvent(new Event('error'));
        });
    }

    function initNewsletter() {
        document.querySelectorAll('[data-newsletter]').forEach((form) =>
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                const input = form.querySelector('input[type="email"]');
                if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value.trim())) {
                    toast('Please enter a valid email address', { type: 'error' });
                    input.focus();
                    return;
                }
                form.reset();
                toast("You're subscribed! Watch your inbox for exclusive deals.");
            })
        );
    }

    function setFooterYear() {
        document.querySelectorAll('[data-year]').forEach((el) => (el.textContent = new Date().getFullYear()));
    }

    /* ======================================================================
       4. HOME PAGE — product grid
       ====================================================================== */

    function productCardHTML(p) {
        const off = discountPercent(p);
        return `
        <article class="product-card">
            <div class="product-card-media">
                ${productImg(p, `alt="" loading="lazy" width="400" height="340"`)}
                ${p.tag ? `<span class="tag">${escapeHTML(p.tag)}</span>` : ''}
                ${off ? `<span class="tag sale">−${off}%</span>` : ''}
                <button class="btn btn-sm btn-dark quick-add" data-add-to-cart="${p.id}" aria-label="Add ${escapeHTML(p.name)} to cart">+ Add to Cart</button>
            </div>
            <div class="product-card-body">
                <span class="product-category">${escapeHTML(p.category)}</span>
                <h3><a href="${productUrl(p)}">${escapeHTML(p.name)}</a></h3>
                <div class="rating" aria-label="Rated ${p.rating} out of 5">${renderStars(p.rating)}<small>${p.rating} (${p.reviews})</small></div>
                <div class="price-row">
                    <span class="price">${formatPrice(p.price)}</span>
                    ${p.oldPrice ? `<span class="old-price">${formatPrice(p.oldPrice)}</span>` : ''}
                </div>
            </div>
        </article>`;
    }

    function bindAddToCart(container) {
        container.addEventListener('click', (e) => {
            const btn = e.target.closest('[data-add-to-cart]');
            if (!btn) return;
            e.preventDefault();
            const product = findProduct(btn.dataset.addToCart);
            Cart.add(product.id);
            toast(`${product.name} added to cart`, { link: { href: 'cart.html', label: 'View cart' } });
        });
    }

    function initProductGrid() {
        const grid = document.getElementById('product-grid');
        if (!grid) return;

        const chips = document.getElementById('category-chips');
        const search = document.getElementById('search-input');
        const sortSelect = document.getElementById('sort-select');
        const countEl = document.getElementById('result-count');
        let category = 'All';

        // Build category chips from the catalogue
        const categories = ['All', ...new Set(PRODUCTS.map((p) => p.category))];
        chips.innerHTML = categories
            .map((c) => `<button type="button" class="chip${c === 'All' ? ' active' : ''}" data-category="${escapeHTML(c)}" aria-pressed="${c === 'All'}">${c === 'All' ? 'All' : `${CATEGORY_ICONS[c]} ${escapeHTML(c)}`}</button>`)
            .join('');

        const render = () => {
            const term = search.value.trim().toLowerCase();
            let list = PRODUCTS.filter(
                (p) =>
                    (category === 'All' || p.category === category) &&
                    (!term || [p.name, p.category, p.description].join(' ').toLowerCase().includes(term))
            );

            switch (sortSelect.value) {
                case 'price-asc':
                    list.sort((a, b) => a.price - b.price);
                    break;
                case 'price-desc':
                    list.sort((a, b) => b.price - a.price);
                    break;
                case 'rating':
                    list.sort((a, b) => b.rating - a.rating);
                    break;
                case 'discount':
                    list.sort((a, b) => discountPercent(b) - discountPercent(a));
                    break;
            }

            countEl.textContent = `${list.length} product${list.length === 1 ? '' : 's'}`;
            grid.innerHTML = list.length
                ? list.map(productCardHTML).join('')
                : `<div class="results-empty"><div class="empty-state-icon" aria-hidden="true">🔍</div><h3>No products found</h3><p>Try a different search or category.</p></div>`;
        };

        chips.addEventListener('click', (e) => {
            const chip = e.target.closest('[data-category]');
            if (!chip) return;
            category = chip.dataset.category;
            chips.querySelectorAll('.chip').forEach((c) => {
                c.classList.toggle('active', c === chip);
                c.setAttribute('aria-pressed', String(c === chip));
            });
            render();
        });

        search.addEventListener('input', render);
        sortSelect.addEventListener('change', render);
        bindAddToCart(grid);
        render();
    }

    /* ======================================================================
       5. PRODUCT DETAIL PAGE
       ====================================================================== */

    function initProductPage() {
        const container = document.getElementById('product-detail');
        if (!container) return;

        const product = findProduct(new URLSearchParams(window.location.search).get('item'));

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
        const off = discountPercent(product);

        container.innerHTML = `
        <div class="card product-detail">
            <div class="product-detail-media">
                ${productImg(product, `alt="${escapeHTML(product.name)}" width="800" height="800"`)}
                ${off ? `<span class="tag sale">−${off}%</span>` : ''}
            </div>
            <div>
                <span class="product-category">${CATEGORY_ICONS[product.category]} ${escapeHTML(product.category)}</span>
                <h1>${escapeHTML(product.name)}</h1>
                <div class="rating" aria-label="Rated ${product.rating} out of 5">${renderStars(product.rating)}<small>${product.rating} · ${product.reviews} reviews</small></div>
                <div class="price-row">
                    <span class="price">${formatPrice(product.price)}</span>
                    ${product.oldPrice ? `<span class="old-price">${formatPrice(product.oldPrice)}</span><span class="save-pill">Save ${formatPrice(product.oldPrice - product.price)}</span>` : ''}
                </div>
                <p class="product-description">${escapeHTML(product.description)}</p>
                <ul class="spec-list">${product.specs.map((s) => `<li>${escapeHTML(s)}</li>`).join('')}</ul>
                <div class="purchase-row">
                    <div class="qty" role="group" aria-label="Quantity">
                        <button type="button" data-qty="-1" aria-label="Decrease quantity">−</button>
                        <output id="qty-value" aria-live="polite">1</output>
                        <button type="button" data-qty="1" aria-label="Increase quantity">+</button>
                    </div>
                    <button id="add-to-cart-btn" class="btn btn-lg">Add to Cart</button>
                    <button id="buy-now-btn" class="btn btn-lg btn-outline">Buy Now</button>
                </div>
                <div class="perks">
                    <div>🚚 Free shipping over $100</div>
                    <div>↩️ 30-day returns</div>
                    <div>🛡️ 1-year warranty</div>
                </div>
            </div>
        </div>`;

        let qty = 1;
        const qtyValue = document.getElementById('qty-value');

        container.querySelectorAll('[data-qty]').forEach((btn) =>
            btn.addEventListener('click', () => {
                qty = Math.min(MAX_QTY, Math.max(1, qty + Number(btn.dataset.qty)));
                qtyValue.textContent = qty;
            })
        );

        document.getElementById('add-to-cart-btn').addEventListener('click', () => {
            Cart.add(product.id, qty);
            toast(`${qty} × ${product.name} added to cart`, { link: { href: 'cart.html', label: 'View cart' } });
        });

        document.getElementById('buy-now-btn').addEventListener('click', () => {
            Cart.add(product.id, qty);
            window.location.href = 'checkout.html';
        });

        // Related products: same category first, then others
        const related = document.getElementById('related-grid');
        if (related) {
            const others = PRODUCTS.filter((p) => p.id !== product.id).sort(
                (a, b) => (b.category === product.category) - (a.category === product.category) || b.rating - a.rating
            );
            related.innerHTML = others.slice(0, 4).map(productCardHTML).join('');
            bindAddToCart(related);
            document.getElementById('related-section').hidden = false;
        }
    }

    /* ======================================================================
       6. CART PAGE
       ====================================================================== */

    const TRASH_ICON =
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/></svg>';

    const emptyCartHTML = `
        <div class="card empty-state">
            <div class="empty-state-icon" aria-hidden="true">🛒</div>
            <h2>Your cart is empty</h2>
            <p>Looks like you haven't added anything yet.</p>
            <a href="index.html#shop" class="btn">Start Shopping</a>
        </div>`;

    function initCartPage() {
        const root = document.getElementById('cart-root');
        if (!root) return;

        const render = () => {
            const items = Cart.get();
            if (items.length === 0) {
                root.innerHTML = emptyCartHTML;
                return;
            }

            const t = Cart.totals();
            const remaining = FREE_SHIPPING_THRESHOLD - t.afterDiscount;
            const progress = Math.min(100, (t.afterDiscount / FREE_SHIPPING_THRESHOLD) * 100);

            root.innerHTML = `
            <div class="cart-layout">
                <section class="card" aria-label="Cart items">
                    <ul class="cart-items">
                        ${items
                            .map(({ id, qty }) => {
                                const p = findProduct(id);
                                return `
                            <li class="cart-item">
                                ${productImg(p, `alt="" width="84" height="84" loading="lazy"`)}
                                <div class="cart-item-info">
                                    <a href="${productUrl(p)}" class="cart-item-name">${escapeHTML(p.name)}</a>
                                    <div class="cart-item-unit">${escapeHTML(p.category)} · ${formatPrice(p.price)} each</div>
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
                    ${totalsHTML(t)}
                    ${
                        t.coupon
                            ? `<div class="coupon-applied"><span>🏷️ <strong>${t.coupon}</strong> — ${COUPONS[t.coupon].label}</span><button type="button" data-action="remove-coupon">Remove</button></div>`
                            : `<form class="coupon" data-coupon-form>
                                   <label for="coupon-input" class="visually-hidden">Coupon code</label>
                                   <input id="coupon-input" placeholder="Coupon code" autocomplete="off">
                                   <button class="btn btn-sm btn-dark" type="submit">Apply</button>
                               </form>
                               <p class="coupon-hint">Try <strong>TECH10</strong> for 10% off.</p>`
                    }
                    <div class="summary-note">
                        ${remaining > 0 ? `Add <strong>${formatPrice(remaining)}</strong> more for free shipping.` : '🎉 Your order qualifies for <strong>free shipping</strong>.'}
                        <div class="progress" aria-hidden="true"><span style="width:${progress}%"></span></div>
                    </div>
                    <a href="checkout.html" class="btn btn-block btn-lg">Proceed to Checkout →</a>
                    <p class="secure-note">🔒 Secure checkout · Card, wallet or cash on delivery</p>
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
                    if (item.qty >= MAX_QTY) toast(`Maximum ${MAX_QTY} per item`, { type: 'error' });
                    Cart.setQty(id, item.qty + 1);
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
                case 'remove-coupon':
                    Coupon.remove();
                    break;
            }
            render();
        });

        root.addEventListener('submit', (e) => {
            if (!e.target.matches('[data-coupon-form]')) return;
            e.preventDefault();
            const input = e.target.querySelector('input');
            if (Coupon.apply(input.value)) {
                toast(`Coupon ${input.value.trim().toUpperCase()} applied!`);
                render();
            } else {
                toast('That coupon code is not valid', { type: 'error' });
                input.select();
            }
        });

        // Keep in sync with other tabs
        window.addEventListener('storage', (e) => {
            if (e.key === CART_KEY || e.key === COUPON_KEY) render();
        });

        render();
    }

    /* ======================================================================
       7. CHECKOUT & PAYMENT
       ====================================================================== */

    const PATTERNS = {
        email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        phone: /^\+?[0-9\s-]{10,15}$/,
        wallet: /^03[0-9]{9}$/,
        postal: /^[0-9A-Za-z\s-]{4,10}$/
    };

    /** Luhn checksum — validates card number format (no real payment is made). */
    function luhnValid(number) {
        const digits = number.replace(/\D/g, '');
        if (digits.length < 13 || digits.length > 19) return false;
        let sum = 0;
        for (let i = 0; i < digits.length; i++) {
            let d = Number(digits[digits.length - 1 - i]);
            if (i % 2 === 1) {
                d *= 2;
                if (d > 9) d -= 9;
            }
            sum += d;
        }
        return sum % 10 === 0;
    }

    function detectCardBrand(number) {
        const n = number.replace(/\D/g, '');
        if (/^4/.test(n)) return 'VISA';
        if (/^(5[1-5]|2[2-7])/.test(n)) return 'MASTERCARD';
        if (/^3[47]/.test(n)) return 'AMEX';
        if (/^(6011|65)/.test(n)) return 'DISCOVER';
        return '';
    }

    function expiryValid(value) {
        const m = value.match(/^(0[1-9]|1[0-2])\s*\/\s*(\d{2})$/);
        if (!m) return false;
        const month = Number(m[1]);
        const year = 2000 + Number(m[2]);
        const now = new Date();
        const endOfMonth = new Date(year, month, 0, 23, 59, 59);
        return endOfMonth >= now && year <= now.getFullYear() + 15;
    }

    const VALIDATORS = {
        fullName: (v) => v.trim().length >= 3,
        email: (v) => PATTERNS.email.test(v.trim()),
        phone: (v) => PATTERNS.phone.test(v.trim()),
        address: (v) => v.trim().length >= 6,
        city: (v) => v.trim().length >= 2,
        postal: (v) => PATTERNS.postal.test(v.trim()),
        cardNumber: (v) => luhnValid(v),
        cardName: (v) => v.trim().length >= 3,
        cardExpiry: (v) => expiryValid(v),
        cardCvc: (v) => /^[0-9]{3,4}$/.test(v.trim()),
        walletNumber: (v) => PATTERNS.wallet.test(v.replace(/[\s-]/g, ''))
    };

    function validateField(field) {
        const check = VALIDATORS[field.name];
        if (!check) return true;
        const valid = check(field.value);
        field.closest('.form-group').classList.toggle('invalid', !valid);
        field.setAttribute('aria-invalid', String(!valid));
        return valid;
    }

    function initCheckoutPage() {
        const root = document.getElementById('checkout-root');
        if (!root) return;

        if (Cart.get().length === 0) {
            root.innerHTML = emptyCartHTML;
            return;
        }

        const form = document.getElementById('checkout-form');
        const summaryEl = document.getElementById('checkout-summary');
        const panels = form.querySelectorAll('[data-panel]');
        const cardInput = form.querySelector('#cardNumber');
        const brandEl = document.getElementById('card-brand');
        const expiryInput = form.querySelector('#cardExpiry');
        const submitBtn = document.getElementById('place-order-btn');

        // --- Order summary
        const renderSummary = () => {
            const t = Cart.totals();
            summaryEl.innerHTML = `
                <h2>Order Summary</h2>
                <ul class="mini-items">
                    ${Cart.get()
                        .map(({ id, qty }) => {
                            const p = findProduct(id);
                            return `<li class="mini-item">
                                <div class="thumb">${productImg(p, `alt="" width="52" height="52"`)}<span class="count">${qty}</span></div>
                                <span class="name">${escapeHTML(p.name)}</span>
                                <span class="amount">${formatPrice(p.price * qty)}</span>
                            </li>`;
                        })
                        .join('')}
                </ul>
                ${totalsHTML(t)}
                <a href="cart.html" class="btn btn-outline btn-block btn-sm" style="margin-top:1rem">Edit cart</a>`;
            submitBtn.querySelector('[data-total]').textContent = formatPrice(t.total);
        };

        // --- Payment method switching
        const currentMethod = () => form.querySelector('input[name="paymentMethod"]:checked').value;

        const showPanel = () => {
            const method = currentMethod();
            panels.forEach((panel) => {
                const active = panel.dataset.panel === method;
                panel.hidden = !active;
                // Disable hidden inputs so they're skipped by validation
                panel.querySelectorAll('input').forEach((i) => (i.disabled = !active));
            });
        };

        form.querySelectorAll('input[name="paymentMethod"]').forEach((r) => r.addEventListener('change', showPanel));

        // --- Input formatting
        cardInput.addEventListener('input', () => {
            const digits = cardInput.value.replace(/\D/g, '').slice(0, 19);
            cardInput.value = digits.replace(/(.{4})/g, '$1 ').trim();
            brandEl.textContent = detectCardBrand(digits);
        });

        expiryInput.addEventListener('input', (e) => {
            let digits = expiryInput.value.replace(/\D/g, '').slice(0, 4);
            if (digits.length >= 3) digits = `${digits.slice(0, 2)}/${digits.slice(2)}`;
            else if (digits.length === 2 && e.inputType !== 'deleteContentBackward') digits += '/';
            expiryInput.value = digits;
        });

        form.querySelectorAll('[data-digits-only]').forEach((input) =>
            input.addEventListener('input', () => (input.value = input.value.replace(/\D/g, '')))
        );

        // --- Live validation
        form.querySelectorAll('input').forEach((field) => {
            field.addEventListener('blur', () => field.value && validateField(field));
            field.addEventListener('input', () => {
                if (field.closest('.form-group')?.classList.contains('invalid')) validateField(field);
            });
        });

        // --- Submit
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const fields = [...form.querySelectorAll('input:not([disabled])')].filter((f) => VALIDATORS[f.name]);
            const results = fields.map(validateField);

            if (results.includes(false)) {
                const firstInvalid = fields[results.indexOf(false)];
                firstInvalid.focus();
                toast('Please check the highlighted fields', { type: 'error' });
                return;
            }

            const method = currentMethod();
            const data = new FormData(form);
            const t = Cart.totals();
            const items = Cart.get();

            let paymentLabel = 'Cash on Delivery';
            if (method === 'card') {
                const digits = data.get('cardNumber').replace(/\D/g, '');
                paymentLabel = `${detectCardBrand(digits) || 'Card'} •••• ${digits.slice(-4)}`;
            } else if (method === 'wallet') {
                const number = data.get('walletNumber').replace(/\D/g, '');
                paymentLabel = `${data.get('walletType')} •••• ${number.slice(-4)}`;
            }

            // Simulate payment processing
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span class="spinner" aria-hidden="true"></span> Processing payment…';

            setTimeout(() => {
                const orderId = 'TS-' + Date.now().toString(36).toUpperCase().slice(-6);
                const itemCount = items.reduce((s, i) => s + i.qty, 0);
                Cart.clear();
                // Card details are never stored — clear the form
                form.reset();

                document.querySelectorAll('.steps li').forEach((li) => {
                    li.classList.remove('current');
                    li.classList.add('done');
                });

                root.innerHTML = `
                <div class="card card-narrow confirmation fade-in">
                    <div class="success-icon" aria-hidden="true">✓</div>
                    <h2>Thank you for your order!</h2>
                    <p>A confirmation has been sent to <strong>${escapeHTML(data.get('email'))}</strong>.</p>
                    <div class="order-meta">
                        <div><span>Order number</span><strong>${orderId}</strong></div>
                        <div><span>Items</span><strong>${itemCount}</strong></div>
                        <div><span>Payment</span><strong>${escapeHTML(paymentLabel)}</strong></div>
                        <div><span>Total ${method === 'cod' ? 'due on delivery' : 'paid'}</span><strong>${formatPrice(t.total)}</strong></div>
                    </div>
                    <p class="coupon-hint" style="margin-bottom:1.5rem">Shipping to ${escapeHTML(data.get('address'))}, ${escapeHTML(data.get('city'))}. Estimated delivery: 3–5 business days.</p>
                    <a href="index.html" class="btn btn-lg">Continue Shopping</a>
                </div>`;
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }, 1500);
        });

        showPanel();
        renderSummary();
    }

    /* ======================================================================
       8. CONTACT FORM
       ====================================================================== */

    function initContactForm() {
        const form = document.getElementById('contact-form');
        if (!form) return;

        const success = document.getElementById('form-success');
        const rules = {
            name: (v) => v.trim().length >= 2,
            email: (v) => PATTERNS.email.test(v.trim()),
            message: (v) => v.trim().length >= 10
        };

        const check = (field) => {
            const valid = rules[field.name] ? rules[field.name](field.value) : true;
            field.closest('.form-group').classList.toggle('invalid', !valid);
            field.setAttribute('aria-invalid', String(!valid));
            return valid;
        };

        form.querySelectorAll('input, textarea').forEach((field) => {
            field.addEventListener('blur', () => check(field));
            // Clear the error as soon as the user fixes it (avoids layout jumps on blur)
            field.addEventListener('input', () => {
                if (field.closest('.form-group').classList.contains('invalid')) check(field);
            });
        });

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const fields = [...form.querySelectorAll('input, textarea')];
            const results = fields.map(check);

            if (results.includes(false)) {
                fields[results.indexOf(false)].focus();
                return;
            }

            form.reset();
            success.classList.add('show');
            success.focus();
            setTimeout(() => success.classList.remove('show'), 6000);
        });
    }

    /* ======================================================================
       INITIALISATION
       ====================================================================== */

    document.addEventListener('DOMContentLoaded', () => {
        initImageFallbacks();
        updateCartBadge();
        initNavigation();
        initNewsletter();
        setFooterYear();
        initProductGrid();
        initProductPage();
        initCartPage();
        initCheckoutPage();
        initContactForm();
    });

    // Keep the cart badge in sync across open tabs
    window.addEventListener('storage', (e) => {
        if (e.key === CART_KEY) updateCartBadge();
    });
})();
