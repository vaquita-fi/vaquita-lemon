"use client";

import { useRef } from "react";
// import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface TreeProps {
  position: [number, number, number];
  beingWorked?: boolean;
  variant: number;
  scale?: number;
}

type Debris = {
  id: string;
  position: [number, number, number];
  velocity: [number, number, number];
};

export function Tree({ position, variant, scale = 1 }: TreeProps) {
  const trunkRef = useRef<THREE.Mesh>(null);
  const leavesRef = useRef<THREE.Mesh>(null);
  const debrisRef = useRef<Debris[]>([]);
  // const spawnTimer = useRef(0);
  // const gravity = 9.8;
  // const mainTreeHeight = 1;

  // useFrame((_, delta) => {
  //   if (beingWorked) {
  //     spawnTimer.current += delta;
  //     if (spawnTimer.current >= 1) {
  //       spawnTimer.current = 0;
  //       const angle = Math.random() * Math.PI * 2;
  //       const speed = 1 + Math.random() * 0.3;
  //       const vx = Math.cos(angle) * speed;
  //       const vz = Math.sin(angle) * speed;
  //       const vy = 2.5 + Math.random() * 2;

  //       const id =
  //         crypto?.randomUUID?.() ?? Math.random().toString(36).substring(2, 10);
  //       debrisRef.current.push({
  //         id,
  //         position: [0, mainTreeHeight, 0],
  //         velocity: [vx, vy, vz],
  //       });
  //     }
  //   } else {
  //     spawnTimer.current = 0;
  //   }

  //   debrisRef.current = debrisRef.current
  //     .map((d): Debris => {
  //       const [x, y, z] = d.position;
  //       const [vx, vy, vz] = d.velocity;
  //       const newVy = vy - gravity * delta;

  //       return {
  //         ...d,
  //         position: [x + vx * delta, y + newVy * delta, z + vz * delta],
  //         velocity: [vx, newVy, vz],
  //       };
  //     })
  //     .filter((d): d is Debris => d.position[1] > 0);
  // });

  const renderDebris = () =>
    debrisRef.current.map((d) => (
      <mesh key={d.id} position={d.position} scale={scale} castShadow>
        <boxGeometry args={[0.3, 0.3, 0.3]} />
        <meshStandardMaterial color="#9FFD53" />
      </mesh>
    ));

  const renderVariant0 = () => (
    <>
      <mesh ref={trunkRef} castShadow>
        <boxGeometry args={[0.2, 1, 0.2]} />
        <meshStandardMaterial color="brown" />
      </mesh>
      <mesh ref={leavesRef} position={[0, 0, 0]} castShadow>
        <boxGeometry args={[0.6, 0.5, 0.6]} />
        <meshStandardMaterial color="#9FFD53" />
      </mesh>
      <mesh ref={leavesRef} position={[0, 0.3, 0]} castShadow>
        <boxGeometry args={[0.4, 0.5, 0.4]} />
        <meshStandardMaterial color="#9FFD53" />
      </mesh>
      <mesh ref={leavesRef} position={[0, 0.6, 0]} castShadow>
        <boxGeometry args={[0.2, 0.3, 0.2]} />
        <meshStandardMaterial color="#9FFD53" />
      </mesh>
    </>
  );

  const renderVariant1 = () => (
    <>
      <mesh ref={trunkRef} castShadow>
        <boxGeometry args={[0.2, 1, 0.2]} />
        <meshStandardMaterial color="brown" />
      </mesh>
      <mesh ref={leavesRef} position={[0, 0.2, 0]} castShadow>
        <boxGeometry args={[0.6, 0.7, 0.6]} />
        <meshStandardMaterial color="#9FFD53" />
      </mesh>
    </>
  );

  const renderVariant2 = () => (
    <>
      <mesh ref={trunkRef} castShadow>
        <boxGeometry args={[0.2, 1, 0.2]} />
        <meshStandardMaterial color="brown" />
      </mesh>
      <mesh ref={leavesRef} position={[0, 0.2, 0]} castShadow>
        <boxGeometry args={[0.6, 0.7, 0.6]} />
        <meshStandardMaterial color="#9FFD53" />
      </mesh>
      <mesh ref={leavesRef} position={[0.2, 0.4, 0.2]} castShadow>
        <boxGeometry args={[0.4, 0.7, 0.5]} />
        <meshStandardMaterial color="#9FFD53" />
      </mesh>
    </>
  );
  // const renderVariant3 = () => (
  //   <>
  //     {/* Tronco central */}
  //     <mesh position={[0, baseY, 0]} castShadow>
  //       <boxGeometry args={[0.2, 1, 0.2]} />
  //       <meshStandardMaterial color="#4CAF50" />
  //     </mesh>
  //     {/* Brazo derecho */}
  //     <mesh position={[0.2, baseY + 0.2, 0]} castShadow>
  //       <boxGeometry args={[0.1, 0.5, 0.1]} />
  //       <meshStandardMaterial color="#4CAF50" />
  //     </mesh>
  //     {/* Brazo izquierdo */}
  //     <mesh position={[-0.2, baseY + 0.15, 0]} castShadow>
  //       <boxGeometry args={[0.1, 0.4, 0.1]} />
  //       <meshStandardMaterial color="#4CAF50" />
  //     </mesh>
  //     <mesh position={[0, baseY, 0]} castShadow>
  //       <boxGeometry args={[0.4, 0.1, 0.1]} />
  //       <meshStandardMaterial color="#4CAF50" />
  //     </mesh>
  //   </>
  // );
  // const renderVariant4 = () => (
  //   <>
  //     {/* Tronco */}
  //     <mesh position={[0, baseY, 0]} castShadow>
  //       <boxGeometry args={[0.15, 1, 0.15]} />
  //       <meshStandardMaterial color="#A4876A" />
  //     </mesh>
  //     {/* Hojas - estilo voxel tipo cruz */}
  //     <mesh position={[0, baseY + 0.5, 0.25]} castShadow>
  //       <boxGeometry args={[0.2, 0.05, 0.5]} />
  //       <boxGeometry args={[0.2, 0.05, 0.5]} />
  //       <meshStandardMaterial color="#5CA904" />
  //     </mesh>
  //     <mesh position={[0, baseY + 0.5, -0.25]} castShadow>
  //       <boxGeometry args={[0.2, 0.05, 0.5]} />
  //       <meshStandardMaterial color="#5CA904" />
  //     </mesh>
  //     <mesh position={[0.25, baseY + 0.5, 0]} castShadow>
  //       <boxGeometry args={[0.5, 0.05, 0.2]} />
  //       <meshStandardMaterial color="#5CA904" />
  //     </mesh>
  //     <mesh position={[-0.25, baseY + 0.5, 0]} castShadow>
  //       <boxGeometry args={[0.5, 0.05, 0.2]} />
  //       <meshStandardMaterial color="#5CA904" />
  //     </mesh>
  //   </>
  // );
  // const renderVariant5 = () => (
  //   <>
  //     {/* Tronco central */}
  //     <mesh position={[0, baseY, 0]} castShadow>
  //       <boxGeometry args={[0.2, 1, 0.2]} />
  //       <meshStandardMaterial color="#4CAF50" />
  //     </mesh>

  //     {/* Brazo derecho superior */}
  //     <mesh position={[0.2, baseY + 0.2, 0]} castShadow>
  //       <boxGeometry args={[0.1, 0.5, 0.1]} />
  //       <meshStandardMaterial color="#4CAF50" />
  //     </mesh>

  //     {/* Brazo izquierdo inferior */}
  //     <mesh position={[-0.3, baseY - 0.1, 0]} castShadow>
  //       <boxGeometry args={[0.1, 0.2, 0.1]} />
  //       <meshStandardMaterial color="#4CAF50" />
  //     </mesh>

  //     <mesh position={[0, baseY - 0, 0]} castShadow>
  //       <boxGeometry args={[0.7, 0.1, 0.1]} />
  //       <meshStandardMaterial color="#4CAF50" />
  //     </mesh>

  //     {/* Base ancha en forma de cruz */}
  //     <mesh position={[0, baseY - 0.5, 0]} castShadow>
  //       <boxGeometry args={[0.4, 0.1, 0.1]} />
  //       <meshStandardMaterial color="#4CAF50" />
  //     </mesh>
  //     <mesh position={[0, baseY - 0.5, 0]} castShadow>
  //       <boxGeometry args={[0.1, 0.1, 0.4]} />
  //       <meshStandardMaterial color="#4CAF50" />
  //     </mesh>
  //   </>
  // );

  return (
    <group position={position} rotation={[0, 1, 0]} scale={scale}>
      {/* // TODO: DESERT */}
      {/* {variant === 0 && renderVariant5()}
      {variant === 1 && renderVariant3()}
      {variant === 2 && renderVariant4()} */}
      {variant === 0 && renderVariant0()}
      {variant === 1 && renderVariant1()}
      {variant === 2 && renderVariant2()}
      {renderDebris()}
    </group>
  );
}
