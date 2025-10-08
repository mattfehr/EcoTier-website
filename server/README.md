# Backend Structure (server/)

This is the backend API for the EcoTier Platform, built using **Node.js**, **Express**, **Prisma**, and **PostgreSQL**, with **Supabase Auth** for authentication.


## 📁 Folder Structure
```
server/
├── prisma/                  # Prisma schema and migrations
│   ├── schema.prisma        # Prisma schema
│   └── migrations/          # Migration history
├── src/
│   ├── controllers/         # Business logic
│   ├── routes/              # Express route modules
│   ├── db/                  # Prisma client instance
│   ├── middleware/          # Supabase auth middleware / guards
│   ├── services/            # Supabase client setup, helpers
│   ├── utils/               # Utility functions
│   └── index.ts             # App entry point
├── .env                     # Environment variables (Supabase keys, DB URL)
├── package.json             # NPM dependencies and scripts
├── tsconfig.json            # TypeScript config
└── README.md
```

## 🚀 Setup Instructions
```bash
cd server
npm install
npm run dev
```

## 📦 Features
- Express REST API
- MongoDB (via Mongoose)
- JWT or Firebase-based authentication
- Modular, scalable folder structure

## Render Deployment
https://ecotier-website.onrender.com
