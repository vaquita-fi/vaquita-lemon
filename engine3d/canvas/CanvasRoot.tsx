"use client";
import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import { useInput } from "../hooks/useInput";

export function CanvasRoot({ children }: { children: React.ReactNode }) {
  useInput(); // activa teclado + touch global
  return (
    <Canvas dpr={[1, 2]} shadows camera={{ position: [0, 5, 10], fov: 50 }}>
      <Suspense fallback={null}>{children}</Suspense>
    </Canvas>
  );
}
