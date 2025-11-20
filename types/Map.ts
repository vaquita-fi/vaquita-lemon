export type TerrainType = 'grass' | 'water';
export type ObjectType = 'tree' | 'rock' | 'goal' | 'bush' | null;

export type MapTile = {
  id: string;
  position: [number, number, number];
  terrain: TerrainType;
  object: ObjectType;
  variant?: number;
  beingWorked?: boolean;
  occupied?: boolean;
};
