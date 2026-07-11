import Hero from "./components/Hero";

export default function Home() {
  return (
    <div className="w-full bg-transparent overflow-x-hidden" suppressHydrationWarning>
      <Hero />
    </div>
  );
}
