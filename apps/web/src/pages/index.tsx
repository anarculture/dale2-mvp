import Link from 'next/link';
import type { NextPage } from 'next';

const HomePage: NextPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center">
      <div className="text-center">
        <h1 className="text-5xl font-extrabold text-gray-900 mb-4">Welcome to Dale</h1>
        <p className="text-xl text-gray-600 mb-8">The future of ride-sharing is here.</p>
        <div className="flex justify-center space-x-4">
          <Link href="/login" className="px-8 py-3 text-lg font-semibold text-white bg-gray-700 rounded-lg hover:bg-gray-800 transition-colors">
            Login
          </Link>
          <Link href="/signup" className="px-8 py-3 text-lg font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors">
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HomePage;

