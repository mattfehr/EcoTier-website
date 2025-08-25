// src/components/Header.tsx
import { Link, NavLink, useNavigate } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import betterlogo from "../assets/betterlogo.png";
import { useAuth } from "../context/AuthContext";
import { routes } from "../utils/routes"; // adjust path as needed

export default function Header() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `text-sm font-medium hover:text-green-600 ${
      isActive ? "text-green-600" : "text-gray-600"
    }`;

  const handleLogout = async () => {
    const confirmLogout = window.confirm("Are you sure you want to log out?");
    if (!confirmLogout) return;

    await signOut();
    navigate(routes.home); // ✅ uses route helper now
  };

  return (
    <header className="flex items-center justify-between px-6 py-3 border-b border-gray-200 bg-white shadow-sm">
      {/* Left side */}
      <div className="flex items-center space-x-6">
        <Link to={routes.home} className="flex items-center space-x-2">
          <img src={betterlogo} alt="EcoTier Solutions" className="h-8 w-8" />
          <span className="font-bold text-lg">EcoTier Solutions</span>
        </Link>

        <NavLink to={routes.home} className={navLinkClass}>
          Home
        </NavLink>
        <NavLink to={routes.shop} className={navLinkClass}>
          Shop / Forum
        </NavLink>
        <NavLink to={routes.library} className={navLinkClass}>
          Library
        </NavLink>
        <NavLink to={routes.favorites} className={navLinkClass}>
          Favorites
        </NavLink>
        <NavLink to={routes.following} className={navLinkClass}>
          Following
        </NavLink>
      </div>

      {/* Right side */}
      <div className="flex items-center space-x-4">
        <NavLink to={routes.cart} className="relative">
          <ShoppingCart className="h-6 w-6 text-gray-700 hover:text-green-600" />
          <span className="absolute -top-1 -right-2 text-xs bg-green-600 text-white rounded-full px-1">
            0
          </span>
        </NavLink>

        {user ? (
          <button
            onClick={handleLogout}
            className="px-3 py-1 rounded-md bg-red-500 text-white text-sm hover:bg-red-600"
          >
            Log Out
          </button>
        ) : (
          <NavLink
            to={routes.login}
            className="px-3 py-1 rounded-md bg-blue-500 text-white text-sm hover:bg-blue-600"
          >
            Log In
          </NavLink>
        )}
      </div>
    </header>
  );
}
