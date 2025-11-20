'use client';

import * as THREE from 'three';
import { useMemo } from 'react';

interface BushProps {
  position: [number, number, number];
}

export default function Bush({ position }: BushProps) {
  const group = useMemo(() => {
    const bushGroup = new THREE.Group();
    // TODO: DESERT: #A4876A
    const material = new THREE.MeshLambertMaterial({ color: '#72924C' });

    const bushData: { pos: [number, number]; height: number }[] = [
      { pos: [-0.22, -0.18], height: 0.45 },
      { pos: [0.03, -0.2], height: 0.5 },
      { pos: [0.18, 0.1], height: 0.6 },
      { pos: [-0.15, 0.2], height: 0.55 },
      { pos: [0.3, 0.3], height: 0.5 },
      { pos: [0.4, 0.1], height: 0.6 },
    ];

    for (const { pos, height } of bushData) {
      const box = new THREE.Mesh(new THREE.BoxGeometry(0.1, height, 0.1), material);
      box.position.set(pos[0], height / 2, pos[1]);
      bushGroup.add(box);
    }

    return bushGroup;
  }, []);

  return <primitive object={group} position={position} />;
}
