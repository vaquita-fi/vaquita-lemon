"use client";

import { useWorldStore } from "../stores/worldStore";
import { WORLD_CONFIG } from "../config/world";

export function MiniMap() {
  const worldData = useWorldStore((s) => s.worldData);
  const playerPos = useWorldStore((s) => s.playerPos);

  const mapSize = 150; // Tamaño del mini-mapa en píxeles
  const worldSize = WORLD_CONFIG.WORLD_BOUNDS.max[0] * 2; // Tamaño dinámico basado en límites del mundo
  const scale = mapSize / worldSize;

  // Convertir posición 3D a posición 2D en el mini-mapa
  const worldToMapPos = (worldPos: [number, number, number]) => {
    const x = (worldPos[0] + worldSize / 2) * scale;
    const z = (worldPos[2] + worldSize / 2) * scale;
    return [x, z];
  };

  const playerMapPos = worldToMapPos(playerPos);

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="bg-black/80 rounded-lg p-3">
        <h4 className="text-white text-sm font-bold mb-2">Mini Map</h4>

        <div
          className="relative bg-gray-800 border border-gray-600 rounded"
          style={{ width: mapSize, height: mapSize }}
        >
          {/* Cuadrícula del mini-mapa */}
          <div className="absolute inset-0">
            {Array.from({ length: 6 }, (_, i) => {
              const pos = (i * mapSize) / 5;
              return (
                <div key={`grid-${i}`}>
                  {/* Líneas horizontales */}
                  <div
                    className="absolute w-full h-px bg-gray-600"
                    style={{ top: pos }}
                  />
                  {/* Líneas verticales */}
                  <div
                    className="absolute h-full w-px bg-gray-600"
                    style={{ left: pos }}
                  />
                </div>
              );
            })}
          </div>

          {/* Elementos del mundo */}
          {worldData.elements.map((element) => {
            const [mapX, mapZ] = worldToMapPos(element.position);
            const color =
              element.type === "tree"
                ? "#22c55e"
                : element.type === "rock"
                  ? "#78716c"
                  : element.type === "bush"
                    ? "#16a34a"
                    : element.type === "ore"
                      ? "#3b82f6"
                      : element.type === "water"
                        ? "#0ea5e9"
                        : element.type === "building"
                          ? "#a16207"
                          : "#6b7280";

            return (
              <div
                key={element.id}
                className="absolute w-2 h-2 rounded-full border border-white"
                style={{
                  left: mapX - 4,
                  top: mapZ - 4,
                  backgroundColor: color,
                }}
                title={`${element.type} (${element.properties.obstacle ? "obstacle" : "passable"})`}
              />
            );
          })}

          {/* Player */}
          <div
            className="absolute w-3 h-3 bg-blue-500 rounded-full border-2 border-white shadow-lg"
            style={{
              left: playerMapPos[0] - 6,
              top: playerMapPos[1] - 6,
            }}
            title={`Player: [${playerPos[0].toFixed(1)}, ${playerPos[2].toFixed(1)}]`}
          />

          {/* Límites del mundo */}
          <div className="absolute inset-0 border-2 border-red-500 rounded pointer-events-none" />
        </div>

        {/* Leyenda */}
        <div className="mt-2 text-xs text-gray-300">
          <div className="flex items-center space-x-2 mb-1">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span>Player</span>
          </div>
          <div className="flex items-center space-x-2 mb-1">
            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
            <span>World Bounds</span>
          </div>
        </div>
      </div>
    </div>
  );
}
