import { Header } from "@/components/landing/Header";
import { Hero } from "@/components/landing/Hero";
import { How } from "@/components/landing/How";
import { Footer } from "@/components/landing/Footer";

export default function Home() {
  return (
    <div className="[--home-beam:oklch(0.78_0.05_218)] relative z-1 flex flex-col min-h-screen bg-(--color-background) text-(--color-foreground) font-ui antialiased [text-rendering:optimizeLegibility]">
      <div
        className="fixed inset-0 pointer-events-none z-0"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(circle at 18% 8%, color-mix(in oklab, var(--color-background), white 6%), transparent 42%)," +
            "radial-gradient(circle at 88% 85%, color-mix(in oklab, var(--color-background), black 4%), transparent 55%)",
        }}
      />
      <Header />
      <main>
        <Hero />
        <How />
      </main>
      <Footer />
    </div>
  );
}
