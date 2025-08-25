import { routes } from "../utils/routes";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gray-100 text-gray-700 text-sm p-6 md:p-8">
      <div className="flex flex-col md:flex-row justify-between gap-8 max-w-6xl mx-auto">
        <div className="flex-1">
          <h3 className="font-semibold mb-2 text-base">Get to Know Us</h3>
          <ul className="space-y-1">
            <li><Link to={routes.home} className="hover:text-green-700">About Us</Link></li>
            <li><Link to={routes.home} className="hover:text-green-700">Contact Us</Link></li>
            <li><Link to={routes.home} className="hover:text-green-700">Careers</Link></li>
            <li><Link to={routes.home} className="hover:text-green-700">Press Releases</Link></li>
          </ul>
        </div>
        <div className="flex-1">
          <h3 className="font-semibold mb-2 text-base">Resources</h3>
          <ul className="space-y-1">
            <li><Link to={routes.home} className="hover:text-green-700">Getting Started</Link></li>
            <li><Link to={routes.home} className="hover:text-green-700">More About Tower</Link></li>
            <li><Link to={routes.home} className="hover:text-green-700">Documentation</Link></li>
            <li><Link to={routes.home} className="hover:text-green-700">Blog</Link></li>
          </ul>
        </div>
        <div className="flex-1">
          <h3 className="font-semibold mb-2 text-base">Support</h3>
          <ul className="space-y-1">
            <li><Link to={routes.faq} className="hover:text-green-700">FAQ</Link></li>
            <li><Link to={routes.home} className="hover:text-green-700">Shipping</Link></li>
            <li><Link to={routes.home} className="hover:text-green-700">Returns & Exchanges</Link></li>
            <li><Link to={routes.home} className="hover:text-green-700">Customer Service</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-gray-300 mt-8 pt-6 text-center text-xs text-gray-500 max-w-6xl mx-auto">
        © {new Date().getFullYear()} EcoTier Solutions. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
