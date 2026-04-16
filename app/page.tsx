import Link from "next/link";

export default function Home() {
  const modules = [
    { href: "/review", title: "Review", description: "Spaced-repetition flashcards for formulas and concepts" },
    { href: "/simulate", title: "Simulate", description: "RC, RL, and RLC transient and frequency response" },
    { href: "/solve", title: "Solve", description: "Nodal and mesh analysis for DC and AC circuits" },
    { href: "/practice", title: "Practice", description: "Auto-generated exam-style problems" },
  ];

  return (
    <main className="min-h-screen p-8 max-w-4xl mx-auto">
      <header className="mb-12">
        <h1 className="text-4xl font-bold mb-2">Ellära Study Hub</h1>
        <p className="text-gray-600">KTH IF1330 — Electrical Principles</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {modules.map((m) => (
          <Link
            key={m.href}
            href={m.href}
            className="border rounded-lg p-6 hover:border-blue-500 hover:shadow-md transition"
          >
            <h2 className="text-xl font-semibold mb-2">{m.title}</h2>
            <p className="text-gray-600 text-sm">{m.description}</p>
          </Link>
        ))}
      </div>
    </main>
  );
}