# EcoTier Client

React frontend for the EcoTier marketplace and community platform. This app is responsible for product discovery, creator-facing product management, account flows, and browser-based 3D model preview.

For the broader product context, see the root [`README.md`](../README.md).

## Tech Stack

| Layer | Choice |
| --- | --- |
| Framework | React 19 |
| Language | TypeScript |
| Build tool | Vite 7 |
| Styling | Tailwind CSS 4 via `@tailwindcss/vite` |
| Routing | `react-router-dom` |
| Auth | Supabase Auth |
| Storage | Supabase Storage |
| 3D rendering | Three.js |
| Linting | ESLint 9 |

## Quick Start

```bash
cd client
npm install
npm run dev
```

Other useful commands:

```bash
npm run build
npm run preview
npm run lint
npm run type-check
```

## Environment Configuration

Create `client/.env` with placeholder values only:

```env
VITE_API_URL=http://localhost:3000
VITE_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
```

What these variables do:

- `VITE_API_URL`: Base URL for the Express API used by product, cart, order, profile, favorite, follow, and comment requests.
- `VITE_SUPABASE_URL`: Supabase project URL used by the auth and storage client.
- `VITE_SUPABASE_ANON_KEY`: Public client key used to initialize Supabase in the browser.

`src/lib/supabase.ts` throws at startup if the Supabase variables are missing, so the app fails fast during local setup.

## App Entry and Navigation

- Entry point: `src/main.tsx`
- Top-level app router: `src/App.tsx`
- Route helpers: `src/utils/routes.ts`
- Shared page shell: `src/layouts/MainLayout.tsx`

Current route map:

| Route | Purpose |
| --- | --- |
| `/` | Home page with featured products and project information |
| `/shop` | Public product catalog |
| `/library` | Current user's created products |
| `/favorites` | Current user's saved products |
| `/following` | Current user's followed creators |
| `/cart` | Cart and checkout flow |
| `/login` | Sign up and sign in |
| `/faq` | FAQ page |
| `/product/:id` | Product detail page |
| `/user/:id` | Public creator profile |
| `/editor/new` | Create a new product |
| `/editor/:id` | Edit an existing product |

## Source Layout

```text
client/
|-- index.html
|-- package.json
|-- vite.config.ts
|-- eslint.config.js
|-- tsconfig.json
`-- src/
    |-- App.tsx
    |-- main.tsx
    |-- style.css
    |-- assets/            # Project images, branding, and page media
    |-- components/        # Reusable UI pieces used across pages
    |-- context/           # Auth and cart providers
    |-- editor/            # Product editor flow and editor-specific utilities
    |-- hooks/             # TODO: currently reserved for future custom hooks
    |-- layouts/           # Shared page shells
    |-- lib/               # External client setup such as Supabase
    |-- pages/             # Route-level pages
    `-- utils/             # Route helpers and utility functions
```

## Feature Organization Convention

The client follows a pragmatic feature split:

- `pages/` contains route-level screens and data-fetching entry points.
- `components/` contains reusable UI that can appear on multiple pages.
- `context/` holds app-wide state providers, currently auth and cart.
- `editor/` is a self-contained feature area for product creation, model uploads, and preview.
- `lib/` holds third-party setup code.
- `utils/` contains helpers shared across features.

The `editor/` folder is the clearest example of the convention in practice: the route component, upload flow, canvas helpers, and editor-specific types live together instead of being scattered across generic folders.

## How the Client Communicates with the Backend

```text
Browser UI
  -> Supabase Auth for sign-up, sign-in, session handling
  -> Supabase Storage for uploaded product images and model files
  -> Express REST API for marketplace and social data
```

In practice, the client uses two integration paths:

| Integration | Used for |
| --- | --- |
| Supabase client | Auth session management, registration, login, storage uploads, and selected direct table reads such as username-to-email lookup |
| Express API at `VITE_API_URL` | Products, user profiles, follows, favorites, comments, cart state, and checkout |

Representative API calls from the client:

- `GET /api/products`
- `GET /api/products/:id`
- `POST /api/products`
- `PATCH /api/products/:id/model`
- `GET /api/users/:id`
- `POST /api/favorites/toggle`
- `POST /api/cart/toggle`
- `POST /api/orders/checkout`

## 3D Model Support

The editor can upload `STL`, `OBJ`, `3MF`, and `STEP` files through Supabase Storage. Browser preview is currently implemented for `STL`, `OBJ`, and `3MF` in `src/components/ModelViewer.tsx`. `STEP` files are stored and offered as downloads, but they are not rendered in-browser yet.

## Local Development Notes

- The app expects the backend API to be running before pages that fetch marketplace data can load correctly.
- Product image uploads use the Supabase `images` bucket.
- Product model uploads use the Supabase `models` bucket.
- Auth and cart state are provided globally by `AuthProvider` and `CartProvider` in `src/main.tsx`.
