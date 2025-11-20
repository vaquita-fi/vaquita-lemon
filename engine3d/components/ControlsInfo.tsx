"use client";

export function ControlsInfo() {
  return (
    <div className="absolute bottom-4 left-4 bg-black/50 text-white p-3 rounded-lg text-sm hidden md:block">
      <div className="font-semibold mb-2">Controles:</div>
      <div>WASD o Flechas - Mover player</div>
      <div>Mouse - Mirar alrededor</div>
    </div>
  );
}
