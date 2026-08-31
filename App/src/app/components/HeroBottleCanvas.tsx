"use client";

import { useEffect, useRef, useState } from "react";

const TOTAL_FRAMES = 96;
const FPS = 24;

export default function HeroBottleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const currentFrameRef = useRef(0);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    let isCancelled = false;
    const images: HTMLImageElement[] = [];
    let loadedCount = 0;

    // Load first frame immediately for instant first-paint
    const firstImg = new Image();
    firstImg.src = `/images/hero-frames/frame_001.webp`;
    firstImg.onload = () => {
      if (!isCancelled && canvasRef.current) {
        const ctx = canvasRef.current.getContext("2d");
        if (ctx) {
          ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
          ctx.drawImage(firstImg, 0, 0, canvasRef.current.width, canvasRef.current.height);
        }
      }
    };

    // Preload all 96 frames in parallel
    for (let i = 1; i <= TOTAL_FRAMES; i++) {
      const pad = String(i).padStart(3, "0");
      const img = new Image();
      img.src = `/images/hero-frames/frame_${pad}.webp`;
      img.onload = () => {
        loadedCount++;
        if (loadedCount >= Math.min(10, TOTAL_FRAMES) && !isCancelled) {
          setIsLoaded(true);
        }
      };
      images.push(img);
    }
    imagesRef.current = images;

    let animId: number;
    let lastTime = performance.now();
    const frameInterval = 1000 / FPS;

    const render = (time: number) => {
      const delta = time - lastTime;

      if (delta >= frameInterval) {
        lastTime = time - (delta % frameInterval);

        const canvas = canvasRef.current;
        if (canvas) {
          const ctx = canvas.getContext("2d");
          if (ctx) {
            const nextFrame = (currentFrameRef.current + 1) % TOTAL_FRAMES;
            const img = imagesRef.current[nextFrame];

            if (img && img.complete && img.naturalWidth > 0) {
              // 100% CLEAR CANVAS TO ELIMINATE ANY GHOSTING / TRAILING
              ctx.clearRect(0, 0, canvas.width, canvas.height);
              ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
              currentFrameRef.current = nextFrame;
            }
          }
        }
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      isCancelled = true;
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <div className="relative w-full h-full flex items-center justify-center pointer-events-none">
      <canvas
        ref={canvasRef}
        width={540}
        height={960}
        className="w-full h-full object-contain relative z-10 select-none drop-shadow-[0_15px_30px_rgba(0,0,0,0.22)]"
      />
      {/* Instant fallback while frames load */}
      {!isLoaded && (
        <img
          src="/images/murakkaz-hero-bottle.png"
          alt="Murakkaz Luxury Fragrance"
          className="absolute inset-0 w-full h-full object-contain z-0 select-none opacity-100"
        />
      )}
    </div>
  );
}
