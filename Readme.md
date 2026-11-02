# TechStore — E-Commerce Storefront

A responsive, multi-page e-commerce storefront built with **vanilla HTML, CSS and JavaScript** — no frameworks, no build step. Created as part of the Web Development Internship at **Nexium Technologies** (Task 1).

## ✨ Features

| Area | Highlights |
| --- | --- |
| **Storefront** | Hero banner, feature strip, product grid rendered from a single catalogue, sort by price or rating |
| **Product page** | Dynamic details via `?item=` URL parameter, breadcrumb, specs list, quantity selector, "not found" state |
| **Cart** | Quantities (+/−), remove item, empty cart, live subtotal / shipping / tax / total, free-shipping progress |
| **Persistence** | Cart saved in `localStorage` and synced across open tabs |
| **Contact** | Client-side validation with inline error messages and success feedback |
| **UX** | Toast notifications instead of `alert()`, animated cart badge, page fade-in, hover effects |
| **Responsive** | Mobile hamburger menu, fluid typography, Grid/Flexbox layouts |
| **Accessibility** | Semantic landmarks, skip link, `aria-*` labels, visible focus styles, `prefers-reduced-motion` support |
| **Extras** | Custom 404 page, SVG favicon, meta descriptions on every page |

## 🗂️ Project Structure

```
E-Commerce-project/
├── index.html      # Home / storefront
├── product.html    # Product details (dynamic)
├── cart.html       # Shopping cart & order summary
├── about.html      # About the store
├── contact.html    # Contact form
├── 404.html        # Not-found page
├── style.css       # Design tokens, components, responsive rules
├── script.js       # Catalogue, cart store, page logic
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
