# Configuración del Mundo 3D

## WORLD_CONFIG

Este archivo centraliza toda la configuración relacionada con el mundo 3D, permitiendo un control centralizado y fácil mantenimiento.

### Propiedades Principales

```typescript
export const WORLD_CONFIG = {
  GRID_SIZE: 1, // Tamaño de cada cuadrado del grid (1x1 unidad)
  INTERACTION_RANGE: 2, // Rango de interacción del player
  COLLISION_RADIUS: 0.5, // Radio de colisión del player (mitad del tamaño)

  // Configuración visual del terreno
  TERRAIN_SIZE: 15, // Tamaño visual del terreno
  GRID_LINES: 16, // Número de líneas de grid (TERRAIN_SIZE + 1)

  // Límites lógicos del mundo (sincronizados con el terreno)
  WORLD_BOUNDS: {
    min: [-7, 0, -7], // Límite inferior del mundo (margen desde el borde del terreno)
    max: [7, 10, 7], // Límite superior del mundo
  },
};
```

### Diferencias entre WORLD_BOUNDS y TERRAIN_SIZE

- **WORLD_BOUNDS**: Define los límites lógicos donde el player puede moverse y donde se generan elementos
- **TERRAIN_SIZE**: Define el tamaño visual del terreno y la cuadrícula que se muestra

### Ejemplo de Uso

```typescript
// En el componente Map.tsx
<planeGeometry args={[WORLD_CONFIG.TERRAIN_SIZE, WORLD_CONFIG.TERRAIN_SIZE]} />

// En el worldStore para verificar límites
const { min, max } = worldData.worldBounds;
if (x < min[0] || x > max[0] || z < min[2] || z > max[2]) {
  return false; // Fuera de los límites del mundo
}
```

### Ventajas del Sistema

1. **Centralizado**: Todos los valores están en un solo lugar
2. **Flexible**: Puedes cambiar el tamaño visual sin afectar la lógica del juego
3. **Mantenible**: Fácil de modificar y debuggear
4. **Consistente**: Todos los componentes usan los mismos valores

### Cambios Comunes

- **Para hacer el mundo más grande**: Aumentar `WORLD_BOUNDS` y `TERRAIN_SIZE`
- **Para hacer el grid más denso**: Reducir `GRID_SIZE`
- **Para cambiar el rango de interacción**: Modificar `INTERACTION_RANGE`
