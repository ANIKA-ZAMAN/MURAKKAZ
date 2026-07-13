import Hero from "./components/Hero";

export default function Home() {
  return (
    <div className="w-full min-h-[calc(100vh-120px)] bg-transparent overflow-hidden flex flex-col justify-between" suppressHydrationWarning>
      {/* Instant static body background override to prevent flashing and texture in header */}
      <style dangerouslySetInnerHTML={{ __html: `
        html, body {
          background-color: #CBB9A1 !important;
          background-image: none !important;
          overflow: hidden !important;
          height: 100% !important;
        }
      `}} />
      <Hero />
    </div>
  );
}



