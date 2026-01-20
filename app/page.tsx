import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4 text-gray-800 dark:text-gray-100">
          Welcome to Flow App
        </h1>
        <p className="text-lg mb-8 text-gray-600 dark:text-gray-300">
          Create, connect, and manage your flow diagrams
        </p>
        <Link
          href="/flow"
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors"
        >
          Go to Flow Editor
        </Link>
      </div>
    </div>
  );
}
