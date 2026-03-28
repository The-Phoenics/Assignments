import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#1a1a1a]">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4 text-gray-100">
          Welcome to Flow App
        </h1>
        <p className="text-lg mb-8 text-gray-400">
          Create, connect, and manage your workflow diagrams
        </p>
        <Link
          href="/flow"
          className="inline-block bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-3 px-8 rounded-lg transition-colors"
        >
          Go to Flow Editor
        </Link>
      </div>
    </div>
  );
}
