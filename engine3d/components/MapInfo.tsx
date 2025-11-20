"use client";

import { useWorldStore } from "../stores/worldStore";

export function MapInfo() {
  const worldData = useWorldStore((s) => s.worldData);
  const playerPos = useWorldStore((s) => s.playerPos);
  const getCollisionInfo = useWorldStore((s) => s.getCollisionInfo);

  const elementCounts = worldData.elements.reduce(
    (acc, element) => {
      acc[element.type] = (acc[element.type] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  const harvestableCount = worldData.elements.filter(
    (el) => el.properties.harvestable,
  ).length;

  const obstacleCount = worldData.elements.filter(
    (el) => el.properties.obstacle,
  ).length;

  // Obtener información de colisión actual
  const collisionInfo = getCollisionInfo(playerPos);
  const isColliding = collisionInfo.hasCollision;

  return (
    <div className="fixed top-20 right-4 z-50">
      <div className="bg-black/80 text-white rounded-lg p-4 min-w-[250px]">
        <h3 className="text-lg font-bold mb-3">Map Information</h3>

        {/* Posición del player */}
        <div className="mb-3 p-2 bg-white/10 rounded">
          <h4 className="font-semibold text-sm mb-1">Player Position</h4>
          <div className="text-xs space-y-1">
            <div>X: {playerPos[0].toFixed(1)}</div>
            <div>Y: {playerPos[1].toFixed(1)}</div>
            <div>Z: {playerPos[2].toFixed(1)}</div>
          </div>
        </div>

        {/* Estado de colisión */}
        <div
          className={`mb-3 p-2 rounded ${isColliding ? "bg-red-500/20" : "bg-green-500/20"}`}
        >
          <h4 className="font-semibold text-sm mb-1">Collision Status</h4>
          <div className="text-xs space-y-1">
            <div
              className={`font-bold ${isColliding ? "text-red-400" : "text-green-400"}`}
            >
              {isColliding ? "⚠️ COLLIDING" : "✅ SAFE"}
            </div>
            {isColliding && (
              <div className="text-red-300">
                Blocking:{" "}
                {collisionInfo.collidingElements
                  .map((el) => el.type)
                  .join(", ")}
              </div>
            )}
          </div>
        </div>

        {/* Estadísticas del mundo */}
        <div className="mb-3 p-2 bg-white/10 rounded">
          <h4 className="font-semibold text-sm mb-1">World Stats</h4>
          <div className="text-xs space-y-1">
            <div>Total Elements: {worldData.elements.length}</div>
            <div>Harvestable: {harvestableCount}</div>
            <div>Obstacles: {obstacleCount}</div>
            <div>Grid Size: {worldData.gridSize}</div>
          </div>
        </div>

        {/* Conteo por tipo */}
        <div className="p-2 bg-white/10 rounded">
          <h4 className="font-semibold text-sm mb-1">Elements by Type</h4>
          <div className="text-xs space-y-1">
            {Object.entries(elementCounts).map(([type, count]) => (
              <div key={type} className="flex justify-between">
                <span className="capitalize">{type}:</span>
                <span>{count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
