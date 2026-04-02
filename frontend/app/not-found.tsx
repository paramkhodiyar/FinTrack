import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 text-center px-4">
      <h1 className="text-6xl font-extrabold text-gray-900 tracking-tight">404</h1>
      <h2 className="mt-4 text-2xl font-bold text-gray-700">Page Not Found</h2>
      <p className="mt-2 text-gray-500 max-w-md">
        The page you are looking for doesn't exist or you don't have permission to access it.
      </p>
      <div className="mt-8">
        <Link 
          href="/"
          className="inline-flex items-center justify-center rounded-md bg-accent px-6 py-3 text-sm font-medium text-white shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
        >
          Return to Dashboard
        </Link>
      </div>
    </div>
  );
}
