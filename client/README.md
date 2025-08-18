# Frontend Structure (client/)

This is the frontend portion of the EcoTier Platform. It is built using React, Vite, Tailwind CSS, and TypeScript.

## 📁 Folder Structure
```
client/
├── public/                  # Static assets like favicon, vite.svg, etc.
├── src/
│   ├── assets/              # Images, SVGs, logos
│   ├── components/          # Reusable UI components (Button, Modal, Card, etc.)
│   ├── layouts/             # Page-level layout components (MainLayout, AuthLayout)
│   ├── pages/               # Route-level pages (Home, Shop, Editor, etc.)
│   ├── editor/              # Custom tower/module editor logic and UI — this is special so it gets its own folder XD
│   │   ├── EditorPage.tsx        # Route-level component
│   │   ├── ModuleCanvas.tsx      # Drawing surface
│   │   ├── ProductDragger.tsx    # Drag logic
│   │   ├── Toolbar.tsx           # Tool picker
│   │   ├── types.ts              # Editor-specific types
│   │   └── utils.ts              # Editor-specific logic
│   ├── hooks/               # Custom React hooks
│   ├── context/             # React context for auth, cart, etc.
│   ├── utils/               # Utility functions and API logic
│   ├── style.css            # Tailwind CSS import file
│   ├── App.tsx              # Main app component
│   └── main.tsx             # Vite entry point
├── index.html               # HTML shell used by Vite
├── vite.config.ts           # Vite configuration
├── tsconfig.json            # TypeScript config
├── package.json             # Project metadata and scripts
└── README.md
```

## 🚀 Setup Instructions
```bash
cd client
npm install
npm run dev
```

## 🧠 Notes
- Uses Tailwind via @tailwindcss/vite plugin
- Organized for easy routing and scaling
- Follow atomic design for components
