
    const Footer = () => {
    return (
    <footer className="bg-black text-white p-10">
    <div className="flex flex-col md:flex-row justify-between gap-8 max-w-6xl mx-auto">
        <div className="flex-1">
            <h3 className="font-bold mb-3 text-lg">Get to Know Us</h3>
            <ul className="space-y-2">
                <li>
                    <a href="/" className="text-gray-300 hover:text-white transition-colors duration-200">
                        <span>About Us</span>
                    </a>
                </li>
                <li>
                    <a href="/" className="text-gray-300 hover:text-white transition-colors duration-200">
                        <span>Contact Us</span>
                    </a>
                </li>
                <li>
                    <a href="/" className="text-gray-300 hover:text-white transition-colors duration-200">
                        <span>Careers</span>
                    </a>
                </li>
                <li>
                    <a href="/" className="text-gray-300 hover:text-white transition-colors duration-200">
                        <span>Press Releases</span>
                    </a>
                </li>
            </ul>
        </div>
        <div className="flex-1">
            <h3 className="font-bold mb-3 text-lg">Resources</h3>
            <ul className="space-y-2">
                <li>
                    <a href="/" className="text-gray-300 hover:text-white transition-colors duration-200">
                        <span>Getting Started</span>
                    </a>
                </li>
                <li>
                    <a href="/" className="text-gray-300 hover:text-white transition-colors duration-200">
                        <span>More About Tower</span>
                    </a>
                </li>
                <li>
                    <a href="/" className="text-gray-300 hover:text-white transition-colors duration-200">
                        <span>Documentation</span>
                    </a>
                </li>
                <li>
                    <a href="/" className="text-gray-300 hover:text-white transition-colors duration-200">
                        <span>Blog</span>
                    </a>
                </li>
            </ul>
        </div>
        <div className="flex-1">
            <h3 className="font-bold mb-3 text-lg">Support</h3>
            <ul className="space-y-2">
                <li>
                    <a href="/" className="text-gray-300 hover:text-white transition-colors duration-200">
                        <span>FAQ</span>
                    </a>
                </li>
                <li>
                    <a href="/" className="text-gray-300 hover:text-white transition-colors duration-200">
                        <span>Shipping</span>
                    </a>
                </li>
                <li>
                    <a href="/" className="text-gray-300 hover:text-white transition-colors duration-200">
                        <span>Returns & Exchanges</span>
                    </a>
                </li>
                <li>
                    <a href="/" className="text-gray-300 hover:text-white transition-colors duration-200">
                        <span>Customer Service</span>
                    </a>
                </li>
            </ul>
        </div>
    </div>
    <div className="border-t border-gray-700 mt-12 pt-8 text-center text-sm text-gray-400 max-w-6xl mx-auto">
        © {new Date().getFullYear()} EcoTier Solutions. All rights reserved.
    </div>
    </footer>
    );
    };

    export default Footer;