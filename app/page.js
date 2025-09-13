import Link from "next/link";

export default function HomePage() {
  return (
    <>
      <section
        className="relative h-[70vh] flex flex-col justify-center items-center text-center"
        style={{
          backgroundImage:
            "url('https://lh3.googleusercontent.com/d/12OnwcCj1QP8t-bj-g_Ai-dPClm3w4ip8=w1600')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-70" />
        <div className="relative z-10 max-w-3xl mx-auto px-4">
          <span
            className="block text-lg tracking-widest text-red-400 font-semibold uppercase mb-4"
            style={{ letterSpacing: "0.15em" }}
          >
            Turn Your Wall into a Racetrack
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6 drop-shadow-lg">
            Premium Automotive Decor — <span className="text-red-400">Built for Enthusiasts.</span>
          </h1>
          <Link
            href="/checkout"
            className="inline-block bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-8 rounded text-lg transition-colors duration-300 border border-red-500 hover:border-red-600 shadow-md"
          >
            Shop Now
          </Link>
          <div className="mt-10">
            <span className="text-md md:text-lg text-red-300 font-semibold tracking-widest" style={{ letterSpacing: "0.2em" }}>
              Quality &nbsp; — &nbsp; Style &nbsp; — &nbsp; Speed
            </span>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl serif-font font-bold text-gray-900 mb-4">Featured Products</h2>
            <p className="text-xl text-gray-600 sans-font">Premium automotive decor for true enthusiasts</p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 max-w-4xl mx-auto">
            {/* Product 1 */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200" style={{ minHeight: 550 }}>
              <div className="relative">
                <Link href="/products/gt3rs">
                  <img
                    src="https://lh3.googleusercontent.com/d/1XUpdsY9C4uQ3vSzUD7S9icEkuKWfa4qP=w1600"
                    alt="991 GT3 RS Style Spoiler Shelf"
                    className="w-full h-80 object-cover hover:opacity-90 transition-opacity"
                  />
                </Link>
                <div className="absolute top-4 left-4">
                  <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold uppercase tracking-wide">Sale</span>
                </div>
              </div>
              <div className="p-8">
                <h3 className="text-xl serif-font font-bold text-gray-900 mb-6">
                  <Link href="/products/gt3rs" className="hover:text-red-600 transition-colors">
                    991 GT3 RS Style SPOILER SHELF - BLACK & WHITE
                  </Link>
                </h3>
                <div className="flex items-center space-x-3 mb-6">
                  <span className="text-gray-500 line-through text-lg">Rs.9,999.00 PKR</span>
                  <span className="text-red-600 font-bold text-2xl">Rs.4,999.00 PKR</span>
                </div>
                <Link
                  href="/products/gt3rs"
                  className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-4 px-6 rounded transition-colors duration-300 text-center block"
                >
                  View Details
                </Link>
              </div>
            </div>

            {/* Product 2 */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200" style={{ minHeight: 550 }}>
              <div className="relative">
                <Link href="/products/license-plates">
                  <img
                    src="https://lh3.googleusercontent.com/d/1_yr6vqjgU5MllWsCtgNsHkQKQn0CEJu-=w1600"
                    alt="License Plate Posters"
                    className="w-full h-80 object-cover hover:opacity-90 transition-opacity"
                  />
                </Link>
                <div className="absolute top-4 left-4">
                  <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold uppercase tracking-wide">Sale</span>
                </div>
              </div>
              <div className="p-8">
                <h3 className="text-xl serif-font font-bold text-gray-900 mb-6">
                  <Link href="/products/license-plates" className="hover:text-red-600 transition-colors">
                    License Plate Posters
                  </Link>
                </h3>
                <div className="flex items-center space-x-3 mb-6">
                  <span className="text-gray-500 line-through text-lg">Rs.1,999.00 PKR</span>
                  <span className="text-red-600 font-bold text-2xl">Rs.1,599.00 PKR</span>
                </div>
                <Link
                  href="/products/license-plates"
                  className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-4 px-6 rounded transition-colors duration-300 text-center block"
                >
                  View Details
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

