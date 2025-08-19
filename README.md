# EcoTier Website 🌱

A full-stack web platform for customizing, sharing, and purchasing modular aeroponic towers.

## 🔧 Stack
- **Frontend**: React + Vite + Tailwind CSS
- **Backend**: Node.js + Express + PostgreSQL (via Prisma ORM)
- **Auth**: Supabase Auth
- **Hosting**:
  - Frontend: Vercel or Netlify
  - Backend: Render or Railway
  - Database: Supabase

## 📁 Project Structure
```
/client     - Frontend React app
/server     - Express backend API
```

## 🚀 Features
- 🛠 Drag-and-drop editor for tower/module customization
- 🛒 Marketplace to buy/sell builds and modules
- 👤 User libraries and profiles
- 🔒 Auth system with login/register/logout
- 📦 Shopping cart and order flow
- 📱 Companion app for tower monitoring (WIP)

## 🧠 Planned Features
- Likes, comments, and public galleries
- Sensor data integration and automation
- AI-based grow recommendations (Eco/Max/Custom)
- Notifications for maintenance or performance
- Mobile app built with React Native (future phase)

## ⚙️ Setup Instructions (WIP)
### Frontend
```
cd client
npm install
npm run dev
```

### Backend
```
cd server
npm install
npx prisma migrate dev
npm run dev
```

### Env Variables
Create `.env` files in `/client` and `/server` folders for your keys and database URIs.

## 👥 Team
- Matthew Fehr
- Grace Li

## 📜 License
Private project - All Rights Reserved.
