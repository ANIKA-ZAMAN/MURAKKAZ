"use client";

import { ReactNode } from "react";

interface ScrollRevealProps {
  children: ReactNode;
  delay?: number;
  variant?: string;
  className?: string;
}

export default function ScrollReveal({
  children,
  className = "",
}: ScrollRevealProps) {
  return (
    <div className={`w-full ${className}`} suppressHydrationWarning>
      {children}
    </div>
  );
}
