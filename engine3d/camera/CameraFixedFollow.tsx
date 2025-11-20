"use client";
import { useFrame } from "@react-three/fiber";
import { useWorldStore } from "../stores/worldStore";
import * as THREE from "three";

type Props = {
  target: [number, number, number];
  offset: [number, number, number];
};

export function CameraFixedFollow({ target, offset }: Props) {
  const playerPos = useWorldStore((s) => s.playerPos);
  const off = new THREE.Vector3(...offset);

  useFrame((state) => {
    // La cámara sigue al player que se mueve con teclas
    const targetVec = new THREE.Vector3(
      playerPos[0],
      playerPos[1] + target[1],
      playerPos[2],
    );
    const desired = targetVec.clone().add(off);
    state.camera.position.copy(desired);
    state.camera.lookAt(targetVec);
  });

  return null;
}
