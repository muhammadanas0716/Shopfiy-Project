"use client";
import Link from "next/link";
import { useCart } from "./CartContext";

export default function Navbar() {
  const { items } = useCart();
  const count = items.reduce((n, i) => n + i.qty, 0);
  return (
    <nav className="bg-white shadow-lg border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <Link
              href="/"
              className="text-gray-700 hover:text-red-600 transition-colors serif-font font-medium"
            >
              Home
            </Link>
            {/* <Link href="/checkout" className="text-gray-700 hover:text-red-600 transition-colors serif-font font-medium">
              Place Order
            </Link> */}
            <a
              href="https://wa.me/923006481758"
              target="_blank"
              rel="noreferrer"
              className="text-gray-700 hover:text-red-600 transition-colors serif-font font-medium"
            >
              Contact
            </a>
          </div>

          <div className="flex items-center space-x-2">
            <img
              src="https://lh3.googleusercontent.com/d/13UEZWXc6yn04CXz_lkP_4EHhHAMVD6Gg=w1600"
              alt="Logo"
              className="h-8 w-8"
            />
            <span className="text-xl font-bold text-gray-900 serif-font">
              SpoilerShelf
            </span>
          </div>

          <div className="flex items-center space-x-6">
            <Link
              href="/checkout"
              className="text-gray-700 hover:text-red-600 transition-colors relative"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m6 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01"
                ></path>
              </svg>
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {count}
              </span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
