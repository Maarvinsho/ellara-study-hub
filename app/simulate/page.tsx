import Link from "next/link";

export default function SimulatePage() {
  const circuits = [
    {
      href: "/simulate/rc",
      title: "RC Circuit",
      description: "First-order charging and discharging of a capacitor through a resistor",
      status: "ready",
    },
    {
      href: "/simulate/rl",
      title: "RL Circuit",
      description: "First-order current rise and decay through an inductor",
      status: "coming",
    },
    {
      href: "/simulate/rlc",
      title: "RLC Circuit",
      description: "Second-order response: overdamped, critically damped, underdamped",
      status: "coming",
    },
  ];

  return (
    <main className="min-h-screen p-8 max-w-4xl mx-auto">
      <header className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Simulate</h1>
        <p className="text-gray-600">
          Interactive transient response visualizations. Adjust component values and see
          the math behave.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {circuits.map((c) => {
          const disabled = c.status === "coming";
          const content = (
            <div
              className={`border rounded-lg p-6 h-full ${
                disabled
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:border-blue-500 hover:shadow-md transition"
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <h2 className="text-xl font-semibold">{c.title}</h2>
                {disabled && (
                  <span className="text-xs bg-gray-200 rounded px-2 py-1">
                    soon
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-600">{c.description}</p>
            </div>
          );
          return disabled ? (
            <div key={c.href}>{content}</div>
          ) : (
            <Link key={c.href} href={c.href}>
              {content}
            </Link>
          );
        })}
      </div>

      <a href="/" className="block mt-8 text-sm text-gray-500 hover:underline">
        ← Back to home
      </a>
    </main>
  );
}