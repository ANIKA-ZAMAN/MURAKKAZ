import Hero from "./components/Hero";

export default function Home() {
  return (
    <div className="w-full min-h-[calc(100vh-100px)] bg-transparent overflow-hidden flex flex-col justify-between" suppressHydrationWarning>
      {/* Instant static body background override to prevent flashing and texture in header */}
      <style dangerouslySetInnerHTML={{ __html: `
        body {
          background-color: #cbb796 !important;
          background-image: none !important;
        }
      `}} />
      <Hero />
    </div>
  );
}



