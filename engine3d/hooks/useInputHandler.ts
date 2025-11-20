"use client";
import { useEffect } from "react";
import { useInputStore } from "../stores/inputStore";

export function useInputHandler() {
  const set = useInputStore((s) => s.set);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Solo manejar teclas físicas, no las del joystick virtual
      if (
        event.key.toLowerCase() === "w" ||
        event.key.toLowerCase() === "a" ||
        event.key.toLowerCase() === "s" ||
        event.key.toLowerCase() === "d"
      ) {
        set((state) => ({
          keys: new Set([...state.keys, event.key.toLowerCase()]),
        }));
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      // Solo manejar teclas físicas, no las del joystick virtual
      if (
        event.key.toLowerCase() === "w" ||
        event.key.toLowerCase() === "a" ||
        event.key.toLowerCase() === "s" ||
        event.key.toLowerCase() === "d"
      ) {
        set((state) => {
          const newKeys = new Set(state.keys);
          newKeys.delete(event.key.toLowerCase());
          return { keys: newKeys };
        });
      }
    };

    const handlePointerDown = (event: PointerEvent) => {
      set({
        pointer: {
          x: event.clientX / window.innerWidth,
          y: event.clientY / window.innerHeight,
          dx: 0,
          dy: 0,
          down: true,
        },
      });
    };

    const handlePointerMove = (event: PointerEvent) => {
      set((state) => ({
        pointer: {
          x: event.clientX / window.innerWidth,
          y: event.clientY / window.innerHeight,
          dx: event.movementX / window.innerWidth,
          dy: event.movementY / window.innerHeight,
          down: state.pointer.down,
        },
      }));
    };

    const handlePointerUp = () => {
      set((state) => ({
        pointer: {
          ...state.pointer,
          down: false,
        },
      }));
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    window.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      window.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    };
  }, [set]);

  return null;
}
