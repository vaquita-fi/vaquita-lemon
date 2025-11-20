"use client";
import { useEffect, useState } from "react";
import { useWorldStore } from "../stores/worldStore";

export function useKeyboardControls() {
  const [keys, setKeys] = useState<Set<string>>(new Set());
  const { setPlayerPos } = useWorldStore();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      setKeys((prev) => new Set(prev).add(event.key.toLowerCase()));
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      setKeys((prev) => {
        const newKeys = new Set(prev);
        newKeys.delete(event.key.toLowerCase());
        return newKeys;
      });
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  // Mover el player solo cuando se presionan teclas
  useEffect(() => {
    if (keys.size === 0) return;

    const moveSpeed = 0.1;

    // Obtener la posición actual directamente del store
    const currentState = useWorldStore.getState();
    const [currentX, currentY, currentZ] = currentState.playerPos;

    let newX = currentX;
    let newZ = currentZ;

    if (keys.has("w") || keys.has("arrowup")) {
      newZ -= moveSpeed;
    }
    if (keys.has("s") || keys.has("arrowdown")) {
      newZ += moveSpeed;
    }
    if (keys.has("a") || keys.has("arrowleft")) {
      newX -= moveSpeed;
    }
    if (keys.has("d") || keys.has("arrowright")) {
      newX += moveSpeed;
    }

    if (newX !== currentX || newZ !== currentZ) {
      setPlayerPos([newX, currentY, newZ]);
    }
  }, [keys, setPlayerPos]);

  return { keys };
}
