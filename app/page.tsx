import { Header } from "@/components/landing/Header";
import { Hero } from "@/components/landing/Hero";
import { How } from "@/components/landing/How";
import { Footer } from "@/components/landing/Footer";

export default function Home() {
  return (
    <div className="relative z-1 flex flex-col min-h-screen bg-(--color-background) text-(--color-foreground) font-ui antialiased [text-rendering:optimizeLegibility]">
<Header />
      <main>
        <Hero />
        <How />
      </main>
      <Footer />
    </div>
  );
}
