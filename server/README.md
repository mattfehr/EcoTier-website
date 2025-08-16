# Backend Structure (server/)

This is the backend API for the EcoTier Platform, built using Node.js, Express, and MongoDB.

## 📁 Folder Structure
```
server/
├── src/
│   ├── controllers/         # Logic for handling requests (business logic)
│   ├── routes/              # Express route definitions (modularized)
│   ├── models/              # Mongoose schemas for MongoDB collections
│   ├── middleware/          # Auth, error handling, logging
│   ├── services/            # Firebase, external APIs, helpers
│   ├── utils/               # Utility functions (validation, formatting, etc.)
│   └── index.ts             # App entry point
├── .env                     # Environment variables
├── package.json             # NPM config and scripts
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
