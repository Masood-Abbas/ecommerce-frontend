import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  ArrowRight,
} from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-black text-white py-12">
      <div
        className="
          main-container
          flex flex-col 
          sm:flex-row 
          sm:flex-wrap
          lg:flex-nowrap
          justify-between
          gap-10
        "
      >
        {/* Exclusive */}
        <div className="flex-1 min-w-[200px]">
          <h2 className="text-xl font-bold mb-3">Exclusive</h2>
          <p className="font-medium mb-3">Subscribe</p>
          <p className="text-sm mb-4">Get 10% off your first order</p>

          <div className="flex items-center border border-gray-600 rounded px-3 py-2">
            <input
              type="email"
              placeholder="Enter your email"
              className="bg-transparent outline-none text-sm flex-1 placeholder-gray-400"
            />
            <ArrowRight size={18} className="cursor-pointer" />
          </div>
        </div>

        {/* Support */}
        <div className="flex-1 min-w-[200px]">
          <h2 className="text-xl font-bold mb-3">Support</h2>
          <p className="text-sm leading-relaxed">
            111 Bijoy sarani, Dhaka,
            <br /> DH 1515, Bangladesh.
          </p>
          <p className="text-sm my-2">exclusive@gmail.com</p>
          <p className="text-sm">+88015-88888-9999</p>
        </div>

        {/* Account */}
        <div className="flex-1 min-w-[200px]">
          <h2 className="text-xl font-bold mb-3">Account</h2>
          <ul className="text-sm space-y-2">
            <li className="hover:text-gray-400 cursor-pointer">My Account</li>
            <li className="hover:text-gray-400 cursor-pointer">
              Login / Register
            </li>
            <li className="hover:text-gray-400 cursor-pointer">Cart</li>
            <li className="hover:text-gray-400 cursor-pointer">Wishlist</li>
            <li className="hover:text-gray-400 cursor-pointer">Shop</li>
          </ul>
        </div>

        {/* Quick Link */}
        <div className="flex-1 min-w-[200px]">
          <h2 className="text-xl font-bold mb-3">Quick Link</h2>
          <ul className="text-sm space-y-2">
            <li className="hover:text-gray-400 cursor-pointer">
              Privacy Policy
            </li>
            <li className="hover:text-gray-400 cursor-pointer">Terms Of Use</li>
            <li className="hover:text-gray-400 cursor-pointer">FAQ</li>
            <li className="hover:text-gray-400 cursor-pointer">Contact</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-gray-700 mt-10 pt-5 text-center text-sm">
        © Copyright Rimel 2022. All rights reserved
      </div>
    </footer>
  );
};

export default Footer;
