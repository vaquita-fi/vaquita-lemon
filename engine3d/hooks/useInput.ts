"use client";
import { useEffect } from "react";
import { useInputStore } from "../stores/inputStore";

export function useInput() {
  const set = useInputStore((s) => s.set);

  useEffect(() => {
    const root = document.body; // pantalla completa

    let lastX = 0,
      lastY = 0;
    const onPointerMove = (e: PointerEvent) => {
      const w = window.innerWidth,
        h = window.innerHeight;
      const x = e.clientX / w,
        y = e.clientY / h;
      set({
        pointer: { x, y, dx: x - lastX, dy: y - lastY, down: e.buttons > 0 },
      });
      lastX = x;
      lastY = y;
    };
    const onPointerDown = (e: PointerEvent) => {
      const w = window.innerWidth,
        h = window.innerHeight;
      const x = e.clientX / w,
        y = e.clientY / h;
      lastX = x;
      lastY = y;
      set((s) => ({ pointer: { ...s.pointer, down: true } }));
    };
    const onPointerUp = () =>
      set((s) => ({ pointer: { ...s.pointer, down: false } }));
    const onKey = (e: KeyboardEvent) =>
      set((s) => {
        const keys = new Set(s.keys);
        const k = e.key.toLowerCase();
        e.type === "keydown" ? keys.add(k) : keys.delete(k);
        return { keys };
      });

    root.addEventListener("pointermove", onPointerMove);
    root.addEventListener("pointerdown", onPointerDown);
    root.addEventListener("pointerup", onPointerUp);
    window.addEventListener("keydown", onKey);
    window.addEventListener("keyup", onKey);

    return () => {
      root.removeEventListener("pointermove", onPointerMove);
      root.removeEventListener("pointerdown", onPointerDown);
      root.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("keyup", onKey);
    };
  }, [set]);
}
