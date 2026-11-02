# TechStore — E-Commerce Storefront

A responsive, multi-page e-commerce storefront built with **vanilla HTML, CSS and JavaScript** — no frameworks, no build step. Created as part of the Web Development Internship at **Nexium Technologies** (Task 1).

## ✨ Features

| Area | Highlights |
| --- | --- |
| **Storefront** | Hero section, 12 products across 7 categories, category filter chips, live search, sort by price / rating / discount |
| **Product page** | Dynamic details via `?item=` URL parameter, sale pricing, specs, quantity selector, "Buy Now", related products |
| **Cart** | Quantities (+/−), remove item, coupon codes, live subtotal / discount / shipping / tax, free-shipping progress bar |
| **Checkout & Payment** | Shipping form + three payment methods: **Credit/Debit Card** (Luhn check, brand detection, expiry validation), **Mobile Wallet** (JazzCash / Easypaisa) and **Cash on Delivery**, with order confirmation |
| **Persistence** | Cart and coupon saved in `localStorage` and synced across open tabs |
| **Contact & Newsletter** | Client-side validation with inline errors and success feedback |
| **UX** | Toast notifications, animated cart badge, gradient UI, hover effects, image fallbacks |
| **Responsive** | Mobile hamburger menu, fluid typography, Grid/Flexbox layouts |
| **Accessibility** | Semantic landmarks, skip link, `aria-*` labels, visible focus styles, `prefers-reduced-motion` support |

> 💡 **Demo only:** no real payment is processed and card details are never stored. Use the test card `4242 4242 4242 4242` with any future expiry date, and try coupon codes `TECH10` or `STUDENT15`.

## 🗂️ Project Structure

```
E-Commerce-project/
├── index.html      # Home / storefront
├── product.html    # Product details (dynamic)
├── cart.html       # Shopping cart & order summary
├── checkout.html   # Shipping details, payment & confirmation
├── about.html      # About the store
├── contact.html    # Contact form
├── 404.html        # Not-found page
├── style.css       # Design tokens, components, responsive rules
├── script.js       # Catalogue, cart store, checkout & page logic
└── favicon.svg
```

## 🚀 Getting Started

No installation required.

```bash
git clone https://github.com/MuhammadBilal196/E-Commerce-project.git
cd E-Commerce-project
```

Then open `index.html` in your browser — or, for the best experience, serve the folder locally (e.g. the **Live Server** extension in VS Code, or `npx serve .`).

## 🛠️ Adding a Product

All products live in the `PRODUCTS` array at the top of `script.js`. Add an object and it automatically appears on the home page, gets its own product page and works in the cart:

```js
{
  id: 'mouse',
  name: 'Wireless Gaming Mouse',
  category: 'Accessories',
  price: 49.0,
  oldPrice: 59.0,        // optional — shows a sale badge
  rating: 4.5,
  reviews: 61,
  tag: 'New',
  image: 'https://…',
  description: 'Short product description.',
  specs: ['Feature one', 'Feature two']
}
```

## 🧰 Tech Stack

- HTML5 (semantic markup)
- CSS3 (custom properties, Grid, Flexbox, keyframe animations)
- JavaScript ES6+ (modules pattern, `localStorage`, `Intl.NumberFormat`)

## 👤 Author

**Muhammad Bilal Raza** — [GitHub @MuhammadBilal196](https://github.com/MuhammadBilal196)

## 📄 License

Released under the [MIT License](LICENSE).
