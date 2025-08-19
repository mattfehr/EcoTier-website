// src/layouts/MainLayout.tsx
import { Outlet } from "react-router-dom";
import Header from "../components/Header";

export default function MainLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Global Header */}
      <Header />

      {/* Page Content */}
      <main className="flex-1 p-6">
        <Outlet />
      </main>

      {/* (Optional) Footer */}
      <footer className="border-t border-gray-200 p-4 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} EcoTier Solutions. All rights reserved.
      </footer>
    </div>
  );
}
