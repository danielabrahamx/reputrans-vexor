import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-5">
      <p className="text-sm font-medium text-indigo-600 mb-3">404</p>
      <h1 className="text-2xl font-semibold tracking-tight text-gray-900 mb-2">
        Page not found
      </h1>
      <p className="text-sm text-gray-500 mb-8 max-w-sm">
        The page you are looking for does not exist or has been moved.
      </p>
      <Link
        href="/"
        className="text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 px-5 py-2.5 rounded-xl transition-colors duration-150"
      >
        Back to home
      </Link>
    </div>
  );
}
