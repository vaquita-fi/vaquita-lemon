"use client";

import { useWorldStore } from "../stores/worldStore";
import { WORLD_CONFIG } from "../config/world";

export function CollisionVisualizer() {
  const worldData = useWorldStore((s) => s.worldData);
  const playerPos = useWorldStore((s) => s.playerPos);

  // Solo mostrar en modo debug o cuando sea necesario
  const showCollisions = true; // Cambiar a true para ver las colisiones

  if (!showCollisions) return null;

  return (
    <group>
      {/* Visualizar áreas de colisión de elementos (cajas) */}
      {worldData.elements
        .filter((element) => element.properties.obstacle)
        .map((element) => {
          const elementSize = (element.scale || 1) * 0.5;

          return (
            <group key={`collision-${element.id}`}>
              {/* Caja de colisión en el suelo */}
              <mesh
                position={[element.position[0], 0.01, element.position[2]]}
                rotation={[-Math.PI / 2, 0, 0]}
              >
                <planeGeometry args={[elementSize * 2, elementSize * 2]} />
                <meshBasicMaterial color="red" transparent opacity={0.3} />
              </mesh>

              {/* Líneas de borde de la caja */}
              <group>
                {/* Líneas horizontales */}
                {[-elementSize, elementSize].map((offset) => (
                  <mesh
                    key={`h-${offset}`}
                    position={[
                      element.position[0],
                      0.02,
                      element.position[2] + offset,
                    ]}
                    rotation={[-Math.PI / 2, 0, 0]}
                  >
                    <planeGeometry args={[elementSize * 2, 0.02]} />
                    <meshBasicMaterial color="red" transparent opacity={0.8} />
                  </mesh>
                ))}

                {/* Líneas verticales */}
                {[-elementSize, elementSize].map((offset) => (
                  <mesh
                    key={`v-${offset}`}
                    position={[
                      element.position[0] + offset,
                      0.02,
                      element.position[2],
                    ]}
                    rotation={[-Math.PI / 2, 0, 0]}
                  >
                    <planeGeometry args={[0.02, elementSize * 2]} />
                    <meshBasicMaterial color="red" transparent opacity={0.8} />
                  </mesh>
                ))}
              </group>
            </group>
          );
        })}

      {/* Visualizar área de colisión del player (caja) */}
      <group>
        {/* Caja de colisión del player en el suelo */}
        <mesh
          position={[playerPos[0], 0.01, playerPos[2]]}
          rotation={[-Math.PI / 2, 0, 0]}
        >
          <planeGeometry
            args={[
              WORLD_CONFIG.COLLISION_RADIUS * 2,
              WORLD_CONFIG.COLLISION_RADIUS * 2,
            ]}
          />
          <meshBasicMaterial color="blue" transparent opacity={0.3} />
        </mesh>

        {/* Líneas de borde del player */}
        <group>
          {/* Líneas horizontales */}
          {[-WORLD_CONFIG.COLLISION_RADIUS, WORLD_CONFIG.COLLISION_RADIUS].map(
            (offset) => (
              <mesh
                key={`ph-${offset}`}
                position={[playerPos[0], 0.02, playerPos[2] + offset]}
                rotation={[-Math.PI / 2, 0, 0]}
              >
                <planeGeometry
                  args={[WORLD_CONFIG.COLLISION_RADIUS * 2, 0.02]}
                />
                <meshBasicMaterial color="blue" transparent opacity={0.8} />
              </mesh>
            ),
          )}

          {/* Líneas verticales */}
          {[-WORLD_CONFIG.COLLISION_RADIUS, WORLD_CONFIG.COLLISION_RADIUS].map(
            (offset) => (
              <mesh
                key={`pv-${offset}`}
                position={[playerPos[0] + offset, 0.02, playerPos[2]]}
                rotation={[-Math.PI / 2, 0, 0]}
              >
                <planeGeometry
                  args={[0.02, WORLD_CONFIG.COLLISION_RADIUS * 2]}
                />
                <meshBasicMaterial color="blue" transparent opacity={0.8} />
              </mesh>
            ),
          )}
        </group>
      </group>
    </group>
  );
}
