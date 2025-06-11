import Link from 'next/link';
import type { NextPage } from 'next';
import type { NextPage } from 'next';
import { Search, Users, CheckCircle } from 'lucide-react';

const Home: NextPage = () => {
  return (
    <div className="bg-white text-gray-800">
      {/* Hero Section */}
      <section className="bg-blue-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900">Your Next Ride, Shared</h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600">Affordable, convenient, and eco-friendly travel. Find a ride with trusted drivers in minutes.</p>
          <div className="mt-8 max-w-xl mx-auto">
            <form className="flex flex-col sm:flex-row gap-4">
              <input type="text" placeholder="Leaving from..." className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" />
              <input type="text" placeholder="Going to..." className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" />
              <button type="submit" className="bg-blue-600 text-white font-bold px-6 py-3 rounded-lg hover:bg-blue-700 transition duration-300 flex items-center justify-center">
                <Search className="w-5 h-5 mr-2" />
                Find a Ride
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900">How It Works</h2>
            <p className="mt-4 text-lg text-gray-600">Travel in three simple steps.</p>
          </div>
          <div className="mt-12 grid gap-10 sm:grid-cols-1 md:grid-cols-3">
            <div className="text-center">
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 text-blue-600 mx-auto">
                <Search className="w-8 h-8" />
              </div>
              <h3 className="mt-6 text-xl font-bold">Find a Ride</h3>
              <p className="mt-2 text-gray-600">Enter your destination and find a ride that works for you.</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 text-blue-600 mx-auto">
                <Users className="w-8 h-8" />
              </div>
              <h3 className="mt-6 text-xl font-bold">Book & Pay</h3>
              <p className="mt-2 text-gray-600">Book your seat and pay securely through our platform.</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 text-blue-600 mx-auto">
                <CheckCircle className="w-8 h-8" />
              </div>
              <h3 className="mt-6 text-xl font-bold">Travel Together</h3>
              <p className="mt-2 text-gray-600">Meet your driver and enjoy the journey.</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-center text-gray-900">Frequently Asked Questions</h2>
          <div className="mt-8 space-y-4">
            <details className="p-4 border rounded-lg bg-white shadow-sm">
              <summary className="font-bold cursor-pointer">How do I book a ride?</summary>
              <p className="mt-2 text-gray-600">Simply use the search bar to find your destination, choose a ride that suits you, and click 'Book'. You'll be guided through a secure payment process.</p>
            </details>
            <details className="p-4 border rounded-lg bg-white shadow-sm">
              <summary className="font-bold cursor-pointer">Is ride-sharing safe?</summary>
              <p className="mt-2 text-gray-600">Safety is our priority. We verify all drivers and you can see ratings and reviews from other passengers before you book.</p>
            </details>
            <details className="p-4 border rounded-lg bg-white shadow-sm">
              <summary className="font-bold cursor-pointer">Can I cancel a booking?</summary>
              <p className="mt-2 text-gray-600">Yes, you can cancel your booking. Please check our cancellation policy for details on refunds, which may vary depending on how far in advance you cancel.</p>
            </details>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 text-center text-gray-500">
          <p>&copy; 2025 Dale. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
