"use client";

import { useWorldStore } from "./stores/worldStore";
import { WORLD_CONFIG } from "./config/world";

export function Map() {
  const worldData = useWorldStore((s) => s.worldData);

  return (
    <group>
      {/* Terreno base */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry
          args={[WORLD_CONFIG.TERRAIN_SIZE, WORLD_CONFIG.TERRAIN_SIZE]}
        />
        <meshStandardMaterial color="#e8e8e8" />
      </mesh>

      {/* Cuadrícula del mapa */}
      <group>
        {Array.from({ length: WORLD_CONFIG.GRID_LINES }, (_, i) => {
          const pos = i - WORLD_CONFIG.TERRAIN_SIZE / 2;
          return (
            <group key={i}>
              {/* Líneas horizontales */}
              <mesh position={[0, 0.01, pos]} rotation={[-Math.PI / 2, 0, 0]}>
                <planeGeometry args={[WORLD_CONFIG.TERRAIN_SIZE, 0.02]} />
                <meshStandardMaterial color="#d0d0d0" />
              </mesh>
              {/* Líneas verticales */}
              <mesh position={[pos, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                <planeGeometry args={[0.02, WORLD_CONFIG.TERRAIN_SIZE]} />
                <meshStandardMaterial color="#d0d0d0" />
              </mesh>
            </group>
          );
        })}
      </group>

      {/* Indicadores de grid importantes */}
      <group>
        {/* Centro del mundo */}
        <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[1, 1]} />
          <meshBasicMaterial color="yellow" transparent opacity={0.5} />
        </mesh>

        {/* Posiciones de elementos importantes */}
        {worldData.elements.map((element) => (
          <mesh
            key={`grid-${element.id}`}
            position={[element.position[0], 0.02, element.position[2]]}
            rotation={[-Math.PI / 2, 0, 0]}
          >
            <planeGeometry args={[1, 1]} />
            <meshBasicMaterial
              color={element.properties.obstacle ? "#ff6b6b" : "#51cf66"}
              transparent
              opacity={0.3}
            />
          </mesh>
        ))}
      </group>
    </group>
  );
}
