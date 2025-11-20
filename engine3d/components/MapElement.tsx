"use client";

import { useRef } from "react";
import * as THREE from "three";
import type { MapElement as MapElementType } from "../types/world";

interface MapElementProps {
  element: MapElementType;
  onInteract?: (element: MapElementType) => void;
}

export function MapElement({ element, onInteract }: MapElementProps) {
  const groupRef = useRef<THREE.Group>(null);

  const renderTree = () => (
    <>
      <mesh castShadow>
        <boxGeometry args={[0.2, 1, 0.2]} />
        <meshStandardMaterial color="brown" />
      </mesh>
      <mesh position={[0, 0, 0]} castShadow>
        <boxGeometry args={[0.6, 0.5, 0.6]} />
        <meshStandardMaterial color="#9FFD53" />
      </mesh>
      <mesh position={[0, 0.3, 0]} castShadow>
        <boxGeometry args={[0.4, 0.5, 0.4]} />
        <meshStandardMaterial color="#9FFD53" />
      </mesh>
      <mesh position={[0, 0.6, 0]} castShadow>
        <boxGeometry args={[0.2, 0.3, 0.2]} />
        <meshStandardMaterial color="#9FFD53" />
      </mesh>
    </>
  );

  const renderRock = () => (
    <mesh castShadow position={[0, 0.5, 0]} receiveShadow>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="#A4876A" />
    </mesh>
  );

  const renderBush = () => (
    <mesh castShadow position={[0, 0.25, 0]} receiveShadow>
      <boxGeometry args={[0.8, 0.5, 0.8]} />
      <meshStandardMaterial color="#228B22" />
    </mesh>
  );

  const renderOre = () => (
    <mesh castShadow position={[0, 0.5, 0]} receiveShadow>
      <boxGeometry args={[0.8, 1, 0.8]} />
      <meshStandardMaterial color="#696969" />
    </mesh>
  );

  const renderWater = () => (
    <mesh position={[0, 0.1, 0]} receiveShadow>
      <boxGeometry args={[2, 0.2, 2]} />
      <meshStandardMaterial color="#4169E1" transparent opacity={0.7} />
    </mesh>
  );

  const renderBuilding = () => (
    <mesh castShadow position={[0, 0.5, 0]} receiveShadow>
      <boxGeometry args={[1.5, 1, 1.5]} />
      <meshStandardMaterial color="#8B4513" />
    </mesh>
  );

  const renderElement = () => {
    switch (element.type) {
      case "tree":
        return (
          <group>
            {/* Tronco */}
            <mesh position={[0, 0.5, 0]}>
              <boxGeometry args={[0.3, 1, 0.3]} />
              <meshStandardMaterial color="#8B4513" />
            </mesh>
            {/* Copa */}
            <mesh position={[0, 1.5, 0]}>
              <boxGeometry args={[1, 1, 1]} />
              <meshStandardMaterial color="#228B22" />
            </mesh>
          </group>
        );
      case "rock":
        return (
          <mesh position={[0, 0.5, 0]}>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color="#696969" />
          </mesh>
        );
      case "bush":
        return (
          <mesh position={[0, 0.5, 0]}>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color="#32CD32" />
          </mesh>
        );
      case "ore":
        return (
          <mesh position={[0, 0.5, 0]}>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color="#4169E1" />
          </mesh>
        );
      case "water":
        return (
          <mesh position={[0, 0.1, 0]}>
            <boxGeometry args={[1, 0.2, 1]} />
            <meshStandardMaterial color="#1E90FF" transparent opacity={0.7} />
          </mesh>
        );
      case "building":
        return (
          <group>
            {/* Base */}
            <mesh position={[0, 0.5, 0]}>
              <boxGeometry args={[1, 1, 1]} />
              <meshStandardMaterial color="#8B4513" />
            </mesh>
            {/* Techo */}
            <mesh position={[0, 1.25, 0]}>
              <boxGeometry args={[1.2, 0.5, 1.2]} />
              <meshStandardMaterial color="#A0522D" />
            </mesh>
          </group>
        );
      default:
        return null;
    }
  };

  return (
    <group
      ref={groupRef}
      position={element.position}
      scale={element.scale || 1}
      onClick={() => onInteract?.(element)}
    >
      {renderElement()}

      {/* Indicador visual si es interactuable */}
      {element.properties.interactable && (
        <mesh position={[0, 2, 0]} visible={false}>
          <boxGeometry args={[0.1, 0.1, 0.1]} />
          <meshStandardMaterial color="yellow" />
        </mesh>
      )}
    </group>
  );
}
