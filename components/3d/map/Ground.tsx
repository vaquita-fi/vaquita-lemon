import { TILE_HEIGHT, TILE_SIZE } from '@/components/3d/vaquita/constants';
import { MapTile } from '@/types/Map';
import { useMemo } from 'react';
import * as THREE from 'three';

export const Ground = ({ tiles }: { tiles: MapTile[] }) => {
  const grid = useMemo(() => {
    const group = new THREE.Group();

    for (const tile of tiles) {
      const { position, terrain, object } = tile;
      const [x, , z] = position;

      const isWater = terrain === 'water';
      const isGoal = object === 'goal';
      const isTree = object === 'tree';
      const isRock = object === 'rock';
      const isBush = object === 'bush';

      const color = isGoal
        ? '#FF9B00'
        : isTree
          ? '#C1583A'
          : isRock
            ? '#A4876A'
            : isWater
              ? '#6FF2F1'
              : isBush
                ? // ? "#FFB24A"
                  '#C6E646'
                : // TODO: DESERT
                  // "#FFE49A";
                  '#A1CD5A';

      const height = isWater ? TILE_HEIGHT * 0.8 : TILE_HEIGHT;
      const y = isWater ? -TILE_HEIGHT / 2 - 0.1 : -TILE_HEIGHT / 2;

      const tileMesh = new THREE.Mesh(
        new THREE.BoxGeometry(TILE_SIZE, height, TILE_SIZE),
        new THREE.MeshLambertMaterial({ color })
      );

      tileMesh.receiveShadow = !isWater;
      tileMesh.position.set(x, y, z);
      group.add(tileMesh);
    }

    return group;
  }, [tiles]);

  return <primitive object={grid} />;
};
