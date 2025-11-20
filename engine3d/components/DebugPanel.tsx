"use client";

import { useState } from "react";
import { useWorldStore } from "../stores/worldStore";

export function DebugPanel() {
  const [isOpen, setIsOpen] = useState(false);

  const addMapElement = useWorldStore((s) => s.addMapElement);
  const worldData = useWorldStore((s) => s.worldData);
  const playerPos = useWorldStore((s) => s.playerPos);

  const handleAddElement = (type: string) => {
    // Generar posición aleatoria usando los límites del mundo
    const { min, max } = useWorldStore.getState().worldData.worldBounds;
    const rangeX = max[0] - min[0]; // 14 (de -7 a 7)
    const rangeZ = max[2] - min[2]; // 14 (de -7 a 7)
    const posX = Math.floor(Math.random() * rangeX) + min[0]; // -7 a 7
    const posZ = Math.floor(Math.random() * rangeZ) + min[2]; // -7 a 7

    const element = {
      id: `${type}-${Date.now()}`,
      type: type,
      position: [posX, 0, posZ] as [number, number, number],
      variant: 0,
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

    addMapElement(element as any);
    console.log(`✅ ${type} agregado en posición [${posX}, 0, ${posZ}]`);
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed top-4 left-4 z-50 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-sm"
      >
        Debug
      </button>
    );
  }

  return (
    <div className="fixed top-4 left-4 z-50 bg-black/90 text-white rounded-lg p-4 min-w-[250px]">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold">Debug Panel</h3>
        <button
          onClick={() => setIsOpen(false)}
          className="text-gray-400 hover:text-white"
        >
          ✕
        </button>
      </div>

      {/* World Stats */}
      <div className="p-2 bg-white/10 rounded mb-4">
        <h4 className="font-semibold text-sm mb-2">World Stats</h4>
        <div className="text-xs space-y-1">
          <div>Total Elements: {worldData.elements.length}</div>
          <div>
            Player Pos: [{playerPos[0].toFixed(1)}, {playerPos[1].toFixed(1)},{" "}
            {playerPos[2].toFixed(1)}]
          </div>
        </div>
      </div>

      {/* Add Elements */}
      <div className="space-y-2">
        <h4 className="font-semibold text-sm">Add Elements</h4>

        <button
          onClick={() => handleAddElement("tree")}
          className="w-full bg-green-600 hover:bg-green-700 px-2 py-1 rounded text-xs"
        >
          🌳 Add Tree
        </button>

        <button
          onClick={() => handleAddElement("rock")}
          className="w-full bg-gray-600 hover:bg-gray-700 px-2 py-1 rounded text-xs"
        >
          🪨 Add Rock
        </button>

        <button
          onClick={() => handleAddElement("bush")}
          className="w-full bg-emerald-600 hover:bg-emerald-700 px-2 py-1 rounded text-xs"
        >
          🌿 Add Bush
        </button>

        <button
          onClick={() => handleAddElement("ore")}
          className="w-full bg-blue-600 hover:bg-blue-700 px-2 py-1 rounded text-xs"
        >
          ⛏️ Add Ore
        </button>

        <button
          onClick={() => handleAddElement("water")}
          className="w-full bg-cyan-600 hover:bg-cyan-700 px-2 py-1 rounded text-xs"
        >
          💧 Add Water
        </button>

        <button
          onClick={() => handleAddElement("building")}
          className="w-full bg-amber-600 hover:bg-amber-700 px-2 py-1 rounded text-xs"
        >
          🏠 Add Building
        </button>
      </div>
    </div>
  );
}
