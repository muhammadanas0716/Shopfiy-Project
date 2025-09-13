SpoilerShelf (Next.js + Tailwind)

Overview
- Stack: Next.js App Router, React 18, Tailwind CSS
- Payment: Cash on Delivery only (no Stripe or gateways)
- Data: MongoDB Atlas via Mongoose (orders collection)
- Auth: None

What’s Included
- Landing page with hero and two featured products matching the current Django UI
- Product pages:
  - 991 GT3 RS Spoiler Shelf
  - License Plate Posters
- Client‑side cart with variants + quantity management
- Checkout posts orders to MongoDB (normal/express shipping)
- Success page loads order by `orderId` from DB and renders details

Project Structure
- `app/` — Next.js App Router pages
- `components/` — Navbar, Footer, Cart context/provider
- `tailwind.config.js`, `postcss.config.js` — Tailwind setup
- `next.config.js` — Remote images allowed for Googleusercontent assets

Getting Started
1) Install deps
   npm install

2) Run dev server
   npm run dev

3) Open
   http://localhost:3000

Notes
- No Python/Django is used; the Next.js app is fully self‑contained.
- Product images currently use the same Google Drive URLs referenced by the original templates.
- Orders are persisted to MongoDB Atlas `spoilershelf-db` using Mongoose. Provide `MONGODB_URI` in `.env.local` (already added for you).

Next Steps (Optional)
- Add admin dashboard for order management (status updates, search)
- Add sitemap/SEO, structured data, and metadata for product pages

Environment
- Tailwind CSS v3.x (`tailwindcss@3.4.x`). No Tailwind v4 is used.
- Set `MONGODB_URI` in `.env.local`.
