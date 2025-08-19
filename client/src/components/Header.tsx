// src/components/Header.tsx
import { Link, NavLink } from "react-router-dom";
import { ShoppingCart } from "lucide-react";

export default function Header() {
  // Helper for active link styling
  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `text-sm font-medium hover:text-green-600 ${
      isActive ? "text-green-600" : "text-gray-600"
    }`;

  return (
    <header className="flex items-center justify-between px-6 py-3 border-b border-gray-200 bg-white shadow-sm">
      {/* Left side: Logo + Nav */}
      <div className="flex items-center space-x-6">
        <Link to="/" className="flex items-center space-x-2">
          <img src="/logo.svg" alt="EcoTier Solutions" className="h-8 w-8" />
          <span className="font-bold text-lg">EcoTier Solutions</span>
        </Link>

        <NavLink to="/about" className={navLinkClass}>
          About
        </NavLink>

        <NavLink to="/shop" className={navLinkClass}>
          Shop / Forum
        </NavLink>

        <NavLink to="/library" className={navLinkClass}>
          Library
        </NavLink>

        <NavLink to="/favorites" className={navLinkClass}>
          Favorites
        </NavLink>

        <NavLink to="/following" className={navLinkClass}>
          Following
        </NavLink>
      </div>

      {/* Right side: Cart + Login */}
      <div className="flex items-center space-x-4">
        <NavLink to="/cart" className="relative">
          <ShoppingCart className="h-6 w-6 text-gray-700 hover:text-green-600" />
          <span className="absolute -top-1 -right-2 text-xs bg-green-600 text-white rounded-full px-1">
            0
          </span>
        </NavLink>

        <NavLink
          to="/login"
          className="px-3 py-1 rounded-md bg-blue-500 text-white text-sm hover:bg-blue-600"
        >
          Log In
        </NavLink>
      </div>
    </header>
  );
}
