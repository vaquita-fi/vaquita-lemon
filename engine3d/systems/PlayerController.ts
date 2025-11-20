"use client";
import { useFrame } from "@react-three/fiber";
import { useInputStore } from "../stores/inputStore";
import { useWorldStore } from "../stores/worldStore";
import { MathUtils } from "three";

export function PlayerController() {
  const keys = useInputStore((s) => s.keys);
  const position = useWorldStore((s) => s.playerPos);
  const setPosition = useWorldStore((s) => s.setPlayerPos);

  useFrame((_, delta) => {
    // Calcular dirección basada en las teclas del joystick
    const direction: [number, number] = [0, 0];
    if (keys.has("w")) direction[1] -= 1; // Adelante
    if (keys.has("s")) direction[1] += 1; // Atrás
    if (keys.has("a")) direction[0] -= 1; // Izquierda
    if (keys.has("d")) direction[0] += 1; // Derecha

    // Normalizar dirección diagonal
    if (direction[0] !== 0 && direction[1] !== 0) {
      direction[0] *= 0.707;
      direction[1] *= 0.707;
    }

    // Mover la posición del personaje
    if (direction[0] !== 0 || direction[1] !== 0) {
      const speed = 5; // Velocidad de movimiento
      const newX = position[0] + direction[0] * speed * delta;
      const newZ = position[2] + direction[1] * speed * delta;
      setPosition([newX, position[1], newZ]);
    }
  });

  return null;
}
