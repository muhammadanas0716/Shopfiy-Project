export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center space-x-2 mb-8">
          <img
            src="https://lh3.googleusercontent.com/d/13UEZWXc6yn04CXz_lkP_4EHhHAMVD6Gg=w1600"
            alt="Logo"
            className="h-8 w-8"
          />
          <span className="text-xl font-bold serif-font">SpoilerShelf</span>
        </div>
        <div className="text-center text-gray-400">
          <p>&copy; 2024 SpoilerShelf. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

