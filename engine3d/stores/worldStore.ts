import { create } from 'zustand';
import { PLAYER_CONFIG } from '../config/player';
import { DEFAULT_ELEMENTS, WORLD_CONFIG } from '../config/world';
import type { MapElement, PlayerInteraction, Vec3, WorldData } from '../types/world';

type WorldState = {
  playerPos: Vec3;
  playerVel: Vec3;
  worldData: WorldData;
  playerInteraction: PlayerInteraction;
  setPlayerPos: (p: Vec3) => void;
  setPlayerVel: (v: Vec3) => void;
  addMapElement: (element: MapElement) => void;
  removeMapElement: (id: string) => void;
  updatePlayerInteraction: (interaction: Partial<PlayerInteraction>) => void;
  checkCollisions: () => void;
  generateRandomWorld: (count: number) => void;
  canMoveTo: (newPosition: Vec3) => boolean;
  getCollisionInfo: (position: Vec3) => {
    hasCollision: boolean;
    collidingElements: MapElement[];
  };
};

// Datos iniciales del mundo usando la configuración
const initialWorldData: WorldData = {
  elements: DEFAULT_ELEMENTS,
  gridSize: WORLD_CONFIG.GRID_SIZE,
  worldBounds: WORLD_CONFIG.WORLD_BOUNDS,
};

export const useWorldStore = create<WorldState>((set, get) => ({
  playerPos: PLAYER_CONFIG.INITIAL_POSITION,
  playerVel: [0, 0, 0],
  worldData: initialWorldData,
  playerInteraction: {
    nearbyElements: [],
    selectedElement: null,
    interactionRange: WORLD_CONFIG.INTERACTION_RANGE,
  },

  setPlayerPos: (newPosition) => {
    // Verificar si la nueva posición es válida antes de mover
    if (get().canMoveTo(newPosition)) {
      set({ playerPos: newPosition });
      get().checkCollisions();
    } else {
      // console.log("Movement blocked - collision detected");
      // Opcional: mantener la posición anterior o buscar una posición válida cercana
    }
  },

  setPlayerVel: (playerVel) => set({ playerVel }),

  addMapElement: (element) =>
    set((state) => ({
      worldData: {
        ...state.worldData,
        elements: [...state.worldData.elements, element],
      },
    })),

  removeMapElement: (id) =>
    set((state) => ({
      worldData: {
        ...state.worldData,
        elements: state.worldData.elements.filter((el) => el.id !== id),
      },
    })),

  updatePlayerInteraction: (interaction) =>
    set((state) => ({
      playerInteraction: { ...state.playerInteraction, ...interaction },
    })),

  generateRandomWorld: (count) => {
    // Importar dinámicamente para evitar dependencias circulares
    import('../config/world').then(({ generateRandomElements }) => {
      const randomElements = generateRandomElements(count);
      set((state) => ({
        worldData: {
          ...state.worldData,
          elements: [...state.worldData.elements, ...randomElements],
        },
      }));
    });
  },

  // Verificar si una posición es válida para moverse
  canMoveTo: (newPosition) => {
    const state = get();
    const { worldData } = state;

    // console.log("🔍 Checking if can move to:", newPosition);

    // Verificar límites del mundo
    const [x, y, z] = newPosition;
    const { min, max } = worldData.worldBounds;

    if (x < min[0] || x > max[0] || z < min[2] || z > max[2]) {
      // console.log("❌ Position outside world bounds");
      return false;
    }

    // Verificar colisiones con elementos del mundo
    const collisionInfo = get().getCollisionInfo(newPosition);
    // console.log("📊 Collision info:", collisionInfo);

    const canMove = !collisionInfo.hasCollision;
    // console.log(
    //   canMove ? "✅ Movement allowed" : "❌ Movement blocked by collision",
    // );

    return canMove;
  },

  // Obtener información de colisiones para una posición específica
  getCollisionInfo: (position) => {
    const state = get();
    const { worldData } = state;

    const collidingElements = worldData.elements.filter((element) => {
      if (!element.properties.obstacle) return false;

      // Colisión cuadrada en lugar de circular
      const elementSize = (element.scale || 1) * 0.5; // Tamaño del elemento
      const playerSize = WORLD_CONFIG.COLLISION_RADIUS; // Tamaño del player

      // Calcular los límites del elemento
      const elementMinX = element.position[0] - elementSize;
      const elementMaxX = element.position[0] + elementSize;
      const elementMinZ = element.position[2] - elementSize;
      const elementMaxZ = element.position[2] + elementSize;

      // Calcular los límites del player en la nueva posición
      const playerMinX = position[0] - playerSize;
      const playerMaxX = position[0] + playerSize;
      const playerMinZ = position[2] - playerSize;
      const playerMaxZ = position[2] + playerSize;

      // Verificar si hay superposición de cajas (AABB - Axis-Aligned Bounding Box)
      const collisionX = playerMaxX >= elementMinX && playerMinX <= elementMaxX;
      const collisionZ = playerMaxZ >= elementMinZ && playerMinZ <= elementMaxZ;

      return collisionX && collisionZ;
    });

    return {
      hasCollision: collidingElements.length > 0,
      collidingElements,
    };
  },

  checkCollisions: () => {
    const state = get();
    const { playerPos, worldData, playerInteraction } = state;

    // Encontrar elementos cercanos
    const nearbyElements = worldData.elements.filter((element) => {
      const distance = Math.sqrt(
        Math.pow(element.position[0] - playerPos[0], 2) +
          Math.pow(element.position[2] - playerPos[2], 2)
      );
      return distance <= playerInteraction.interactionRange;
    });

    // Verificar colisiones actuales (por si acaso)
    const collisionInfo = state.getCollisionInfo(playerPos);
    if (collisionInfo.hasCollision) {
      // console.log(
      //   "Player is currently colliding with:",
      //   collisionInfo.collidingElements,
      // );
      // Aquí podrías implementar lógica para empujar al player fuera de la colisión
    }

    // Actualizar elementos cercanos
    state.updatePlayerInteraction({ nearbyElements });
  },
}));
