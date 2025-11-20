import { TILE_HEIGHT } from '@/components/3d/vaquita/constants';
// import { Transaction } from '@/types/Transaction';
// import { VaquitaData } from '@/types/Vaquita';

export const positionKey = (x: number, z: number) => `${x},${z}`;
export const getTileTopY = (): number => TILE_HEIGHT / 2;
