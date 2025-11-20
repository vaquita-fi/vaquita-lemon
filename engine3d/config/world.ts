import type { MapElement, MapElementType } from "../types/world";

export const WORLD_CONFIG = {
  GRID_SIZE: 1, // Cada cuadrado del grid es de 1x1 unidad
  INTERACTION_RANGE: 2,
  COLLISION_RADIUS: 0.5, // Mitad del tamaño del player (1x1) - esto está correcto

  // Configuración visual del terreno
  TERRAIN_SIZE: 15, // Tamaño visual del terreno
  GRID_LINES: 16, // Número de líneas de grid (TERRAIN_SIZE + 1)

  // Límites del mundo (sincronizados con el terreno)
  WORLD_BOUNDS: {
    min: [-7, 0, -7] as [number, number, number], // Un poco menor que TERRAIN_SIZE/2
    max: [7, 10, 7] as [number, number, number], // Para dejar margen en los bordes
  },
};

// Tipos de elementos disponibles
export const ELEMENT_TYPES = {
  TREE: "tree",
  ROCK: "rock",
  BUSH: "bush",
  ORE: "ore",
  WATER: "water",
  BUILDING: "building",
} as const;

// Tipos de recursos disponibles
export const RESOURCE_TYPES = {
  WOOD: "wood",
  STONE: "stone",
  BERRIES: "berries",
  IRON: "iron",
  WATER: "water",
  NONE: "none",
} as const;

// Configuración de elementos predefinidos - cada uno ocupa exactamente 1 cuadrado
export const DEFAULT_ELEMENTS: MapElement[] = [
  // Árbol en posición exacta del grid
  {
    id: "tree-1",
    type: "tree",
    position: [0, 0, 0], // Centro del mundo
    variant: 0, // pine
    scale: 1, // Exactamente 1 cuadrado
    properties: {
      harvestable: true,
      interactable: true,
      obstacle: true, // Bloquea movimiento
      resourceType: "wood",
      health: 100,
    },
  },
  // Roca en posición exacta del grid
  {
    id: "rock-1",
    type: "rock",
    position: [2, 0, 0], // 2 cuadrados a la derecha
    variant: 0, // granite
    scale: 1, // Exactamente 1 cuadrado
    properties: {
      harvestable: true,
      interactable: true,
      obstacle: true, // Bloquea movimiento
      resourceType: "stone",
      health: 150,
    },
  },
  // Arbusto (no obstáculo)
  {
    id: "bush-1",
    type: "bush",
    position: [-2, 0, 0], // 2 cuadrados a la izquierda
    variant: 0, // berry
    scale: 1, // Exactamente 1 cuadrado
    properties: {
      harvestable: true,
      interactable: true,
      obstacle: false, // No bloquea movimiento
      resourceType: "berries",
      health: 50,
    },
  },
  // Agua (no obstáculo)
  {
    id: "water-1",
    type: "water",
    position: [0, 0, 2], // 2 cuadrados hacia adelante
    variant: 0, // pond
    scale: 1, // Exactamente 1 cuadrado
    properties: {
      harvestable: false,
      interactable: true,
      obstacle: false, // No bloquea movimiento
      resourceType: "water",
      health: 0,
    },
  },
  // Edificio
  {
    id: "building-1",
    type: "building",
    position: [4, 0, 0], // 4 cuadrados a la derecha
    variant: 0, // house
    scale: 1, // Exactamente 1 cuadrado
    properties: {
      harvestable: false,
      interactable: true,
      obstacle: true, // Bloquea movimiento
      resourceType: "none",
      health: 200,
    },
  },
];

// Función para generar elementos aleatorios en posiciones exactas del grid
export function generateRandomElements(count: number): MapElement[] {
  const elements: MapElement[] = [];
  const types: MapElementType[] = [
    "tree",
    "rock",
    "bush",
    "ore",
    "water",
    "building",
  ];

  for (let i = 0; i < count; i++) {
    const type = types[Math.floor(Math.random() * types.length)];
    const variant = Math.floor(Math.random() * 3);

    // Posiciones aleatorias usando los límites del mundo
    const worldSize = WORLD_CONFIG.WORLD_BOUNDS.max[0] * 2; // 14 (de -7 a 7)
    const x =
      Math.floor(Math.random() * worldSize) - WORLD_CONFIG.WORLD_BOUNDS.max[0];
    const z =
      Math.floor(Math.random() * worldSize) - WORLD_CONFIG.WORLD_BOUNDS.max[2];

    const element: MapElement = {
      id: `${type}-random-${i}`,
      type,
      position: [x, 0, z],
      variant,
      scale: 1, // Exactamente 1 cuadrado
      properties: {
        harvestable:
          type === "tree" ||
          type === "rock" ||
          type === "bush" ||
          type === "ore",
        interactable: true,
        obstacle:
          type === "tree" ||
          type === "rock" ||
          type === "ore" ||
          type === "building",
        resourceType:
          type === "tree"
            ? "wood"
            : type === "rock"
              ? "stone"
              : type === "bush"
                ? "berries"
                : type === "ore"
                  ? "iron"
                  : type === "water"
                    ? "water"
                    : "none",
        health:
          type === "tree"
            ? 100
            : type === "rock"
              ? 150
              : type === "bush"
                ? 50
                : type === "ore"
                  ? 200
                  : type === "building"
                    ? 200
                    : 0,
      },
    };

    elements.push(element);
  }

  return elements;
}
