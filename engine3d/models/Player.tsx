'use client';
import { useInputStore } from '@engine3d/stores/inputStore';
import { useWorldStore } from '@engine3d/stores/worldStore';
import { useFrame } from '@react-three/fiber';
import { ComponentProps, useEffect, useRef, useState } from 'react';
import type * as THREE from 'three';
import { MathUtils } from 'three';

interface PlayerProps extends ComponentProps<'group'> {
  scale?: number;
}

export function Player({ scale = 0.5, ...restProps }: PlayerProps) {
  const groupRef = useRef<THREE.Group>(null);
  const leftLegRef = useRef<THREE.Group>(null);
  const rightLegRef = useRef<THREE.Group>(null);
  const leftArmRef = useRef<THREE.Group>(null);
  const rightArmRef = useRef<THREE.Group>(null);
  const [isMoving, setIsMoving] = useState(false);
  const walkCycle = useRef(0);
  const targetRotation = useRef(0);

  // Colores del diseño Vaquita
  const baseColor = '#fff3e1';
  const bodyColor = '#E4D9C9';
  const spotColor = '#6f4e37';
  const helmetColor = '#FBA71A';
  const noseColor = '#e88e29';
  const hoofColor = '#3a2b1b';

  // Obtener input del joystick y posición del mundo
  const keys = useInputStore((s) => s.keys);
  const position = useWorldStore((s) => s.playerPos);
  const setPlayerPos = useWorldStore((s) => s.setPlayerPos);
  const canMoveTo = useWorldStore((s) => s.canMoveTo);

  // Calcular dirección basada en las teclas del joystick
  const direction: [number, number] = [0, 0];
  if (keys.has('w')) direction[1] -= 1; // Adelante
  if (keys.has('s')) direction[1] += 1; // Atrás
  if (keys.has('a')) direction[0] -= 1; // Izquierda
  if (keys.has('d')) direction[0] += 1; // Derecha

  // Normalizar dirección diagonal
  if (direction[0] !== 0 && direction[1] !== 0) {
    direction[0] *= 0.707;
    direction[1] *= 0.707;
  }

  useEffect(() => {
    const moving = direction[0] !== 0 || direction[1] !== 0;
    setIsMoving(moving);
    if (moving) {
      targetRotation.current = Math.atan2(direction[0], direction[1]);
    }
  }, [direction]);

  useFrame((_, delta) => {
    if (!groupRef.current) return;

    // Forzar la actualización de la posición del groupRef desde el store
    if (
      groupRef.current.position.x !== position[0] ||
      groupRef.current.position.y !== position[1] ||
      groupRef.current.position.z !== position[2]
    ) {
      groupRef.current.position.set(position[0], position[1], position[2]);
    }

    // Mover la posición del personaje con validación de colisiones
    if (isMoving) {
      const speed = 5; // Velocidad de movimiento
      const newX = position[0] + direction[0] * speed * delta;
      const newZ = position[2] + direction[1] * speed * delta;
      const newPosition: [number, number, number] = [newX, position[1], newZ];

      // Debug: mostrar información del movimiento
      // console.log("🎮 Movement attempt:", {
      //   current: position,
      //   direction,
      //   newPosition,
      //   delta,
      //   speed,
      // });

      // Verificar si la nueva posición es válida antes de mover
      if (canMoveTo(newPosition)) {
        // console.log("✅ Movement allowed to:", newPosition);
        setPlayerPos(newPosition);
      } else {
        // console.log("❌ Movement blocked to:", newPosition);
        // Por ahora, solo bloquear el movimiento
        // TODO: Implementar movimiento parcial en X o Z
      }
    }

    // Smooth rotation
    groupRef.current.rotation.y = MathUtils.lerp(
      groupRef.current.rotation.y,
      targetRotation.current,
      delta * 10
    );

    // Animate limbs when moving
    if (leftLegRef.current && rightLegRef.current && leftArmRef.current && rightArmRef.current) {
      if (isMoving) {
        walkCycle.current += delta * 10;
        leftLegRef.current.rotation.x = Math.sin(walkCycle.current) * 0.3;
        rightLegRef.current.rotation.x = Math.sin(walkCycle.current + Math.PI) * 0.3;
        leftArmRef.current.rotation.x = Math.sin(walkCycle.current + Math.PI) * 0.2;
        rightArmRef.current.rotation.x = Math.sin(walkCycle.current) * 0.2;
      } else {
        leftLegRef.current.rotation.x = 0;
        rightLegRef.current.rotation.x = 0;
        leftArmRef.current.rotation.x = 0;
        rightArmRef.current.rotation.x = 0;
        walkCycle.current = 0;
      }
    }
  });

  return (
    <group
      ref={groupRef}
      position={[position[0], position[1], position[2]]}
      scale={scale}
      {...restProps}
    >
      {/* Head */}
      <group position={[0, 1.15, 0]}>
        {/* Head */}
        <mesh>
          <boxGeometry args={[0.5, 0.6, 0.5]} />
          <meshStandardMaterial color={baseColor} />
        </mesh>
        {/* Eyes */}
        <group position={[0, 0, 0]}>
          <mesh position={[-0.1, 0.06, 0.26]}>
            <boxGeometry args={[0.07, 0.15, 0]} />
            <meshStandardMaterial color="black" />
          </mesh>
          <mesh position={[0.1, 0.06, 0.26]}>
            <boxGeometry args={[0.07, 0.15, 0]} />
            <meshStandardMaterial color="black" />
          </mesh>
        </group>
        {/* Nose */}
        <group position={[0, -0.05, 0]}>
          <mesh position={[0, -0.1, 0.3]}>
            <boxGeometry args={[0.5, 0.22, 0.1]} />
            <meshStandardMaterial color={noseColor} />
          </mesh>

          <mesh position={[-0.12, -0.1, 0.35]}>
            <boxGeometry args={[0.05, 0.05, 0.01]} />
            <meshStandardMaterial color="black" />
          </mesh>

          <mesh position={[0.12, -0.1, 0.35]}>
            <boxGeometry args={[0.05, 0.05, 0.01]} />
            <meshStandardMaterial color="black" />
          </mesh>
        </group>
        {/* Ears */}
        <mesh position={[-0.3, 0.12, 0]}>
          <boxGeometry args={[0.2, 0.15, 0.1]} />
          <meshStandardMaterial color={spotColor} />
        </mesh>
        <mesh position={[0.3, 0.1, 0]}>
          <boxGeometry args={[0.2, 0.15, 0.1]} />
          <meshStandardMaterial color={spotColor} />
        </mesh>

        {/* Helmet */}
        <group position={[0, 0.15, 0]}>
          <mesh position={[0, 0.1, 0.07]}>
            <boxGeometry args={[0.55, 0.11, 0.65]} />
            <meshStandardMaterial color={helmetColor} />
          </mesh>

          <mesh position={[0, 0.2, 0.03]}>
            <boxGeometry args={[0.55, 0.25, 0.55]} />
            <meshStandardMaterial color={helmetColor} />
          </mesh>
        </group>
      </group>

      {/* Body */}
      <group position={[0, 0, 0]}>
        <mesh position={[0, 0.5, 0]}>
          <boxGeometry args={[0.7, 0.8, 0.4]} />
          <meshStandardMaterial color={bodyColor} />
        </mesh>
        <mesh position={[0.25, 0.5, 0.21]}>
          <boxGeometry args={[0.15, 0.4, 0.01]} />
          <meshStandardMaterial color={spotColor} />
        </mesh>
        <mesh position={[0.1, 0.5, 0.21]}>
          <boxGeometry args={[0.15, 0.2, 0.01]} />
          <meshStandardMaterial color={spotColor} />
        </mesh>
        <mesh position={[-0.2, 0.5, -0.21]}>
          <boxGeometry args={[0.15, 0.4, 0.01]} />
          <meshStandardMaterial color={spotColor} />
        </mesh>
        <mesh position={[-0.1, 0.5, -0.21]}>
          <boxGeometry args={[0.15, 0.2, 0.01]} />
          <meshStandardMaterial color={spotColor} />
        </mesh>
        <mesh position={[0.2, 0.5, -0.21]}>
          <boxGeometry args={[0.15, 0.2, 0.01]} />
          <meshStandardMaterial color={spotColor} />
        </mesh>
      </group>

      {/* Legs */}
      <group ref={leftLegRef} position={[-0.15, -0.1, 0]}>
        <mesh>
          <boxGeometry args={[0.2, 0.5, 0.2]} />
          <meshStandardMaterial color={baseColor} />
        </mesh>
        <mesh position={[0, -0.25, 0]}>
          <boxGeometry args={[0.22, 0.1, 0.22]} />
          <meshStandardMaterial color={hoofColor} />
        </mesh>
      </group>
      <group ref={rightLegRef} position={[0.15, -0.1, 0]}>
        <mesh>
          <boxGeometry args={[0.2, 0.5, 0.2]} />
          <meshStandardMaterial color={baseColor} />
        </mesh>
        <mesh position={[0, -0.25, 0]}>
          <boxGeometry args={[0.22, 0.1, 0.22]} />
          <meshStandardMaterial color={hoofColor} />
        </mesh>
      </group>

      {/* Arms */}
      <group ref={leftArmRef} position={[-0.4, 0.5, 0]}>
        <mesh>
          <boxGeometry args={[0.1, 0.5, 0.1]} />
          <meshStandardMaterial color={baseColor} />
        </mesh>
        <mesh position={[0, -0.25, 0]}>
          <boxGeometry args={[0.12, 0.1, 0.12]} />
          <meshStandardMaterial color={hoofColor} />
        </mesh>
      </group>
      <group ref={rightArmRef} position={[0.4, 0.5, 0]}>
        <mesh>
          <boxGeometry args={[0.1, 0.5, 0.1]} />
          <meshStandardMaterial color={baseColor} />
        </mesh>
        <mesh position={[0, -0.25, 0]}>
          <boxGeometry args={[0.12, 0.1, 0.12]} />
          <meshStandardMaterial color={hoofColor} />
        </mesh>
      </group>

      {/* Tail */}
      <group position={[0, 0.1, -0.15]}>
        <mesh position={[0, 0, -0.1]} rotation={[-0.5, 0, 0]}>
          <boxGeometry args={[0.05, 0.05, 0.1]} />
          <meshStandardMaterial color={spotColor} />
        </mesh>
        <mesh position={[0, -0.05, -0.15]} rotation={[-1, 0, 0]}>
          <boxGeometry args={[0.05, 0.05, 0.1]} />
          <meshStandardMaterial color={spotColor} />
        </mesh>
        <mesh position={[0, -0.1, -0.2]}>
          <boxGeometry args={[0.07, 0.07, 0.07]} />
          <meshStandardMaterial color={helmetColor} />
        </mesh>
      </group>
    </group>
  );
}
