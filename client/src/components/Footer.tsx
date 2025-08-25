const Footer = () => {
  return (
    <footer className="bg-gray-100 text-gray-700 text-sm p-6 md:p-8">
      <div className="flex flex-col md:flex-row justify-between gap-8 max-w-6xl mx-auto">
        <div className="flex-1">
          <h3 className="font-semibold mb-2 text-base">Get to Know Us</h3>
          <ul className="space-y-1">
            <li><a href="/" className="hover:text-green-700">About Us</a></li>
            <li><a href="/" className="hover:text-green-700">Contact Us</a></li>
            <li><a href="/" className="hover:text-green-700">Careers</a></li>
            <li><a href="/" className="hover:text-green-700">Press Releases</a></li>
          </ul>
        </div>
        <div className="flex-1">
          <h3 className="font-semibold mb-2 text-base">Resources</h3>
          <ul className="space-y-1">
            <li><a href="/" className="hover:text-green-700">Getting Started</a></li>
            <li><a href="/" className="hover:text-green-700">More About Tower</a></li>
            <li><a href="/" className="hover:text-green-700">Documentation</a></li>
            <li><a href="/" className="hover:text-green-700">Blog</a></li>
          </ul>
        </div>
        <div className="flex-1">
          <h3 className="font-semibold mb-2 text-base">Support</h3>
          <ul className="space-y-1">
            <li><a href="/" className="hover:text-green-700">FAQ</a></li>
            <li><a href="/" className="hover:text-green-700">Shipping</a></li>
            <li><a href="/" className="hover:text-green-700">Returns & Exchanges</a></li>
            <li><a href="/" className="hover:text-green-700">Customer Service</a></li>
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
