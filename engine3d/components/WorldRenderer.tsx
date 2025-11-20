"use client";

import { useWorldStore } from "../stores/worldStore";
import { MapElement } from "./MapElement";

export function WorldRenderer() {
  const worldData = useWorldStore((s) => s.worldData);
  const playerInteraction = useWorldStore((s) => s.playerInteraction);
  const updatePlayerInteraction = useWorldStore(
    (s) => s.updatePlayerInteraction,
  );

  const handleElementInteraction = (element: any) => {
    console.log("Interacting with:", element);
    // Aquí puedes implementar la lógica de interacción
    // Por ejemplo, mostrar un menú, recolectar recursos, etc.
  };

  return (
    <>
      {worldData.elements.map((element) => (
        <MapElement
          key={element.id}
          element={element}
          onInteract={handleElementInteraction}
        />
      ))}
    </>
  );
}
