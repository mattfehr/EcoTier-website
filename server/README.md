# EcoTier Server

Express and Prisma backend for the EcoTier marketplace platform. This service owns the REST API used by the React client for product discovery, creator profiles, social interactions, cart state, checkout, comments, and product metadata updates.

For the broader product context, see the root [`README.md`](../README.md).

## Architecture

```text
React client
  -> Express API (`src/index.ts`)
      -> Route modules in `src/routes/`
          -> Prisma client in `src/db/prisma.ts`
              -> PostgreSQL via Supabase / `DATABASE_URL`

Shared TypeScript contracts
  -> `../shared/types`
```

The current backend is intentionally simple: route modules contain request handling and Prisma queries directly, with shared domain types imported from `shared/`.

## Modules and Responsibilities

| Module | Responsibility |
| --- | --- |
| `src/index.ts` | App bootstrap, JSON middleware, CORS policy, health route, and route mounting |
| `src/db/prisma.ts` | Shared Prisma client instance |
| `src/routes/productsRoutes.ts` | Product listing, product detail, creator library, create, update, delete, and model metadata patch |
| `src/routes/userRoutes.ts` | Public profile reads, profile updates, following list, follow, and unfollow |
| `src/routes/favoritesRoutes.ts` | Favorite toggle, favorite membership checks, ID list, and full favorite list |
| `src/routes/cartRoutes.ts` | Cart membership checks, cart listing, add/update/remove behavior through a single toggle endpoint |
| `src/routes/orderRoutes.ts` | Checkout flow and order creation from cart contents |
| `src/routes/commentsRoutes.ts` | Product comments, ratings, update, and delete |
| `prisma/schema.prisma` | Database schema and relations |
| `prisma/seed.ts` | Local seed data for users, products, and tower components |

## Request, Auth, and Data Flow

```text
Client request
  -> Express route
      -> Prisma query / mutation
          -> PostgreSQL tables
  -> JSON response
```

Current auth model:

1. The client signs users in through Supabase Auth on the frontend.
2. Many API requests include `userID` from the signed-in client session.
3. Selected mutation routes enforce ownership checks by comparing submitted `userID` with stored record ownership.
4. The backend does not currently validate Supabase JWTs at the API boundary.

```text
TODO: Add server-side auth middleware so user identity is derived from verified tokens rather than client-submitted IDs.
```

## Data Ownership and Database Structure

The Prisma schema models both marketplace data and community relationships.

| Model | Purpose |
| --- | --- |
| `User` | Account identity, profile metadata, and creator ownership |
| `Product` | Marketplace listing for towers, modules, and add-ons |
| `ProductConfig` | JSON-backed configuration metadata for a product |
| `TowerComponent` | Mapping between tower products and component products |
| `Favorite` | User-to-product saved items |
| `CartItem` | User cart contents and quantities |
| `Order` | Checkout record for a user purchase |
| `OrderItem` | Line items captured at purchase time |
| `Comment` | Product reviews and ratings |
| `Follow` | Creator following relationship |
| `Question` | Additional user-authored question content present in the schema |

High-level relationship map:

```text
User
  -> Products
  -> Favorites
  -> CartItems
  -> Orders
  -> Comments
  -> Follow / following

Product
  -> Creator (User)
  -> Favorites
  -> CartItems
  -> OrderItems
  -> Comments
  -> TowerComponent links
  -> Optional ProductConfig
```

## Important Feature Flows

### Product Catalog and Creator Library

`productsRoutes.ts` serves the public shop feed, creator library pages, and individual product pages. Responses are shaped into the shared frontend `Product` contract, including creator metadata and model file metadata when present.

### Product Creation and Model Metadata

Creators can create products, update listing content, and patch model file metadata after uploading assets to Supabase Storage from the client. The backend stores public listing data plus model URL, filename, size, and format.

### Favorites and Following

Favorites and follows are implemented as join tables. The API exposes both toggle-style operations and convenience reads such as membership checks and ID lists so the client can render UI state efficiently.

### Cart and Checkout

Cart operations are consolidated around `POST /api/cart/toggle`, where quantity controls whether an item is added, updated, or removed. Checkout reads the cart, computes the order total, creates `Order` and `OrderItem` records, and then clears the cart.

### Comments and Ratings

Comments are stored per product and returned with author metadata. Ratings are optional in the schema but default to `5` when not supplied.

## Local Development Setup

### 1. Install dependencies

```bash
cd server
npm install
```

### 2. Configure environment

Create `server/.env` with placeholder values:

```env
DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public
PORT=3000
```

### 3. Apply schema and seed local data

```bash
npx prisma migrate dev
npm run seed
```

### 4. Start the API

```bash
npm run dev
```

The default local server URL is `http://localhost:3000`.

## Smoke Test Commands

```bash
curl http://localhost:3000/health
curl http://localhost:3000/api/products
```

If you seeded data locally, a basic checkout sanity check can also start from:

```bash
curl http://localhost:3000/api/products/library/11111111-1111-1111-1111-111111111111
```

## API Examples

Get public products:

```bash
curl "http://localhost:3000/api/products?sort=new&order=desc"
```

Create a product:

```bash
curl -X POST "http://localhost:3000/api/products" \
  -H "Content-Type: application/json" \
  -d '{
    "userID": "11111111-1111-1111-1111-111111111111",
    "name": "EcoTower Prototype",
    "productType": "towers",
    "price": 199.99,
    "description": "Indoor modular grow tower",
    "public": true
  }'
```

Update cart state:

```bash
curl -X POST "http://localhost:3000/api/cart/toggle" \
  -H "Content-Type: application/json" \
  -d '{
    "userID": "11111111-1111-1111-1111-111111111111",
    "productID": 1,
    "quantity": 2
  }'
```

Checkout:

```bash
curl -X POST "http://localhost:3000/api/orders/checkout" \
  -H "Content-Type: application/json" \
  -d '{
    "userID": "11111111-1111-1111-1111-111111111111",
    "fullName": "Example User",
    "address": "123 Example Street"
  }'
```

## Implementation Pattern

The current implementation pattern is:

```text
Express app
  -> route module
      -> Prisma client
          -> database
```

This is lighter-weight than a full controller-service-repository split. The repository already includes placeholder folders for `controllers/`, `middleware/`, `services/`, and `utils/`, which suggests room to grow into a more layered architecture later.

```text
TODO: If the API surface grows, move route-level data logic into dedicated controllers or services before adding more complex business rules.
```

## Backend Layout

```text
server/
|-- package.json
|-- tsconfig.json
|-- prisma/
|   |-- schema.prisma
|   |-- seed.ts
|   `-- migrations/
`-- src/
    |-- index.ts
    |-- db/
    |   `-- prisma.ts
    |-- routes/
    |   |-- cartRoutes.ts
    |   |-- commentsRoutes.ts
    |   |-- favoritesRoutes.ts
    |   |-- orderRoutes.ts
    |   |-- productsRoutes.ts
    |   `-- userRoutes.ts
    |-- controllers/    # Reserved, currently only `.gitkeep`
    |-- middleware/     # Reserved, currently only `.gitkeep`
    |-- services/       # Reserved, currently only `.gitkeep`
    `-- utils/          # Reserved, currently only `.gitkeep`
```

## Deployment Note

The previous backend README referenced a Render deployment at:

```text
https://ecotier-website.onrender.com
```

```text
TODO: Confirm whether this deployment URL is still current before treating it as an active environment.
```
