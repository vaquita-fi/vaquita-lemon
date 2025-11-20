import { create } from "zustand";

type Pointer = { x: number; y: number; dx: number; dy: number; down: boolean };

type InputState = {
  pointer: Pointer;
  keys: Set<string>;
  set: (
    patch: Partial<InputState> | ((s: InputState) => Partial<InputState>),
  ) => void;
};

export const useInputStore = create<InputState>((set) => ({
  pointer: { x: 0.5, y: 0.5, dx: 0, dy: 0, down: false },
  keys: new Set(),
  set: (patch) => set(typeof patch === "function" ? patch : () => patch),
}));
