"use client";
import { useState, useRef, useEffect } from "react";
import { useInputStore } from "../stores/inputStore";

export function VirtualJoystick() {
  const [isDragging, setIsDragging] = useState(false);
  const [joystickPos, setJoystickPos] = useState({ x: 0, y: 0 });
  const joystickRef = useRef<HTMLDivElement>(null);
  const set = useInputStore((s) => s.set);

  const handleTouchStart = (e: TouchEvent) => {
    e.preventDefault();
    setIsDragging(true);
    updateJoystickPosition(e.touches[0]);
  };

  const handleTouchMove = (e: TouchEvent) => {
    e.preventDefault();
    if (isDragging) {
      updateJoystickPosition(e.touches[0]);
    }
  };

  const handleTouchEnd = (e: TouchEvent) => {
    e.preventDefault();
    setIsDragging(false);
    setJoystickPos({ x: 0, y: 0 });
    // Limpiar input
    set(() => ({
      keys: new Set(),
    }));
  };

  useEffect(() => {
    const element = joystickRef.current;
    if (!element) return;

    element.addEventListener("touchstart", handleTouchStart, {
      passive: false,
    });
    element.addEventListener("touchmove", handleTouchMove, { passive: false });
    element.addEventListener("touchend", handleTouchEnd, { passive: false });

    return () => {
      element.removeEventListener("touchstart", handleTouchStart);
      element.removeEventListener("touchmove", handleTouchMove);
      element.removeEventListener("touchend", handleTouchEnd);
    };
  }, [isDragging]);

  const updateJoystickPosition = (touch: Touch) => {
    if (!joystickRef.current) return;

    const rect = joystickRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const deltaX = touch.clientX - centerX;
    const deltaY = touch.clientY - centerY;

    // Limitar el radio del joystick
    const maxRadius = rect.width / 2 - 20;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

    let normalizedX = deltaX / maxRadius;
    let normalizedY = deltaY / maxRadius;

    if (distance > maxRadius) {
      normalizedX = deltaX / distance;
      normalizedY = deltaY / distance;
    }

    setJoystickPos({ x: normalizedX, y: normalizedY });

    // Convertir a input de teclas
    const keys = new Set<string>();

    if (normalizedY < -0.2) keys.add("w");
    if (normalizedY > 0.2) keys.add("s");
    if (normalizedX < -0.2) keys.add("a");
    if (normalizedX > 0.2) keys.add("d");

    set(() => ({
      keys,
    }));
  };

  return (
    <div className="fixed bottom-4 left-4 z-[999999] bg-transparent">
      <div
        ref={joystickRef}
        className="relative w-28 h-28 sm:w-32 sm:h-32 bg-black/30 rounded-full border-2 border-white/50 flex items-center justify-center backdrop-blur-md shadow-2xl"
        style={{
          boxShadow:
            "0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
        }}
      >
        {/* Stick del joystick */}
        <div
          className="absolute w-10 h-10 sm:w-12 sm:h-12 bg-white/95 rounded-full shadow-lg transition-transform duration-75 border border-white/30"
          style={{
            transform: `translate(${joystickPos.x * 24}px, ${joystickPos.y * 24}px)`,
            boxShadow: isDragging
              ? "0 4px 16px rgba(255, 255, 255, 0.3), 0 0 0 2px rgba(255, 255, 255, 0.2)"
              : "0 2px 8px rgba(0, 0, 0, 0.2)",
          }}
        />

        {/* Indicador de dirección */}
        {isDragging && (
          <div className="absolute inset-0 flex items-center justify-center text-white/80 text-sm font-semibold">
            {joystickPos.y < -0.2 && "↑"}
            {joystickPos.y > 0.2 && "↓"}
            {joystickPos.x < -0.2 && "←"}
            {joystickPos.x > 0.2 && "→"}
          </div>
        )}

        {/* Indicador de estado activo */}
        {isDragging && (
          <div className="absolute -top-2 -right-2 w-5 h-5 bg-green-400 rounded-full animate-pulse shadow-lg" />
        )}
      </div>
    </div>
  );
}
