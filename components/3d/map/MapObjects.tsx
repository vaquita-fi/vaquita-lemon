// MapObjects.tsx
import Bush from '@/components/3d/map/Bush';
import { MapTile } from '@/types/Map';
import Rock from './Rock';
import Tree from './Tree';

interface MapObjectsProps {
  tiles: MapTile[];
}

export const MapObjects = ({ tiles }: MapObjectsProps) => {
  return (
    <>
      {tiles.map(({ id, position, object, variant, beingWorked }) => {
        if (object === 'tree') {
          return <Tree key={id} position={position} variant={variant || 0} beingWorked={beingWorked ?? false} />;
        }

        if (object === 'rock') {
          return <Rock key={id} position={position} variant={variant || 0} beingWorked={beingWorked ?? false} />;
        }
        if (object === 'bush') {
          return <Bush key={id} position={position} />;
        }

        return null;
      })}
    </>
  );
};
