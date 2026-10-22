import Header from "./Header";

export function Layout({ children }) {
  return (
    <section>
      <Header />
      <main className="max-w-450 min-h-screen pt-38 pb-15 mx-auto">
        {children}
      </main>
    </section>
  );
}
