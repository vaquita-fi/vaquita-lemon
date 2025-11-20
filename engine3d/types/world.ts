export type Vec3 = [number, number, number];

export type MapElementType =
  | "tree"
  | "rock"
  | "bush"
  | "ore"
  | "water"
  | "building";

export interface MapElement {
  id: string;
  type: MapElementType;
  position: Vec3;
  variant: number;
  scale?: number;
  properties: {
    harvestable?: boolean;
    interactable?: boolean;
    obstacle?: boolean;
    resourceType?: string;
    health?: number;
    maxHealth?: number;
  };
}

export interface WorldData {
  elements: MapElement[];
  gridSize: number;
  worldBounds: {
    min: Vec3;
    max: Vec3;
  };
}

export interface PlayerInteraction {
  nearbyElements: MapElement[];
  selectedElement: MapElement | null;
  interactionRange: number;
}
