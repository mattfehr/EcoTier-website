# EcoTier Solutions

EcoTier Solutions is a modular aeroponic farming concept designed to make sustainable food production, decorative urban greenery, and creator-driven customization more accessible to everyday consumers. The project was developed for the BRDG Innovation Challenge, where it placed 2nd overall in a statewide sustainability competition.

This repository contains the full-stack web platform for the EcoTier ecosystem: a marketplace and community experience where users can browse modular tower products, publish their own listings, manage creator profiles, and attach 3D model files to custom designs.

## Why EcoTier Exists

As urbanization increases and usable farmland declines, sustainable food production becomes harder to access at the household level. Aeroponic growing systems can reduce water usage, improve space efficiency, and support faster plant growth, but adoption is often limited by cost, complexity, and a lack of beginner-friendly community support.

EcoTier addresses those barriers by combining three ideas:

- Affordability through modular, 3D-printable hardware concepts.
- Customization through interchangeable tower sections, modules, and add-ons.
- Community through a marketplace-style web platform for discovery, sharing, and creator engagement.

## What Makes It Different

Most home aeroponic products stop at the hardware. EcoTier is more technically interesting because it treats the grow system as part of a broader platform:

- A modular hardware concept built around configurable tower components.
- A creator marketplace where users can publish and manage product listings.
- Community features such as favorites, following, creator pages, comments, and ratings.
- Support for 3D model uploads and previews so designs can be shared with richer product detail.
- A broader product vision that connects physical growing hardware, digital customization, and future IoT monitoring.

The current codebase implements the marketplace and community platform. The hardware prototype and sensor platform are part of the overall product story, but firmware and embedded code are not included in this repository.

## Target Users

- Urban gardeners
- Sustainability-focused households
- Apartment residents with limited space
- DIY makers and 3D-print creators
- Home gardening hobbyists
- Design-conscious consumers interested in functional decor
- Tech enthusiasts exploring smart indoor growing systems

## Product Features

### In This Repository Today

- User authentication with Supabase Auth
- User profiles with editable bio and profile image
- Public product catalog with sorting
- Creator library pages and individual user pages
- Favorites, following, and social discovery features
- Product creation and editing for towers, modules, and add-ons
- 3D model file upload and preview support for product listings
- Cart management and checkout flow
- Product comments and ratings

### Broader EcoTier Product Vision

- Modular aeroponic tower hardware
- 3D-printable components
- Twist-lock assembly system
- Expandable indoor tower configurations
- ESP32-based environmental monitoring

## How It Works

### Marketplace and Community Flow

Users sign in with Supabase, browse public products, visit creator pages, save favorites, and follow other builders. Authenticated users can also create or edit their own product listings, upload product images and 3D model files, and manage their personal library.

### Product Creation Flow

The editor lets a creator create a new product record, upload a product image to Supabase Storage, and attach a 3D model file. The backend stores product metadata in PostgreSQL via Prisma, while the client can render supported model formats directly in the browser with Three.js.

### Checkout Flow

Cart actions are persisted through the API. When a user checks out, the backend converts cart items into an order record with order items and clears the cart.

## Architecture Overview

```text
EcoTier Client (React + Vite)
  -> Supabase Auth and Storage
  -> EcoTier API (Express)
      -> Prisma ORM
      -> PostgreSQL / Supabase database
  -> Shared TypeScript types

Broader product vision:
Modular aeroponic tower hardware
  -> Future sensor monitoring and connected applications
```

The `client/` app handles the user experience, routing, and direct integration with Supabase Auth and Storage. The `server/` app exposes REST endpoints for marketplace, profile, cart, order, favorite, follow, and comment workflows. Shared domain types live in `shared/`.

## Quick Start

### 1. Start the backend

```bash
cd server
npm install
```

Create `server/.env` with placeholder values:

```env
DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public
PORT=3000
```

Then run:

```bash
npx prisma migrate dev
npm run seed
npm run dev
```

### 2. Start the client

```bash
cd client
npm install
```

Create `client/.env` with placeholder values:

```env
VITE_API_URL=http://localhost:3000
VITE_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
```

Then run:

```bash
npm run dev
```

Open `http://localhost:5173`.

## Repository Layout

```text
EcoTier-website/
|-- client/                # React frontend for the marketplace and community experience
|-- server/                # Express + Prisma backend API
|-- shared/                # Shared TypeScript domain types
|-- package.json           # Root package metadata
`-- README.md              # Project overview and repo orientation
```

## Documentation

| Doc | What it covers |
| --- | --- |
| [`README.md`](./README.md) | Product overview, architecture, and repo orientation |
| [`client/README.md`](./client/README.md) | Frontend structure, environment setup, routing, and API integration |
| [`server/README.md`](./server/README.md) | Backend architecture, modules, database model, and local development workflow |
| [`shared/README.md`](./shared/README.md) | Shared code between frontend and backend |
