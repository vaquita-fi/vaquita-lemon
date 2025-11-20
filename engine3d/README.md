# Sistema de Mapa Interactivo 3D

## Descripción General

Este sistema implementa un mundo 3D interactivo donde el player puede moverse, detectar elementos cercanos, y interactuar con diferentes tipos de objetos del mapa. **Ahora incluye un sistema robusto de colisiones que previene que el player se mueva a posiciones ocupadas.**

## Arquitectura del Sistema

### 1. **Tipos y Interfaces** (`types/world.ts`)

- `MapElement`: Define la estructura de cualquier elemento del mundo
- `WorldData`: Contiene toda la información del mundo
- `PlayerInteraction`: Maneja las interacciones del player

### 2. **Store del Mundo** (`stores/worldStore.ts`)

- Gestiona el estado global del mundo
- Maneja la posición del player
- **Sistema de colisiones preventivo**: Verifica colisiones ANTES de mover al player
- Actualiza elementos cercanos en tiempo real
- Funciones `canMoveTo()` y `getCollisionInfo()` para validación de movimiento

### 3. **Configuración** (`config/world.ts`)

- Define tipos de elementos predefinidos
- Configuración del mundo (tamaño, límites, etc.)
- Funciones para generar elementos aleatorios

### 4. **Componentes Principales**

- `MapElement`: Renderiza elementos del mundo basado en su tipo
- `WorldRenderer`: Renderiza todos los elementos del mundo
- `Map`: Terreno con cuadrícula visual
- `InteractionUI`: Muestra elementos cercanos e interacciones
- `MapInfo`: Información general del mapa + **estado de colisiones**
- `DebugPanel`: Herramientas de desarrollo y testing
- `CollisionVisualizer`: Visualiza áreas de colisión (modo debug)
- `MiniMap`: Vista general del mundo con elementos y player

## Sistema de Colisiones

### **Prevención de Colisiones**

- **Antes de mover**: El sistema verifica si la nueva posición es válida
- **Función `canMoveTo()`**: Retorna `false` si hay colisión
- **Función `getCollisionInfo()`**: Proporciona información detallada de colisiones

### **Radios de Colisión**

- **Player**: Radio base configurable (`WORLD_CONFIG.COLLISION_RADIUS`)
- **Elementos**: Radio base + factor de escala
- **Cálculo**: `collisionRadius = baseRadius + (scale * 0.3)`

### **Validación de Movimiento**

```typescript
// En setPlayerPos()
if (get().canMoveTo(newPosition)) {
  set({ playerPos: newPosition });
  get().checkCollisions();
} else {
  console.log("Movement blocked - collision detected");
}
```

## Tipos de Elementos

### **Tree** (Árbol)

- **Propiedades**: Harvestable, Obstacle, Interactable
- **Recurso**: Wood
- **Colisión**: Sí (obstáculo) - **Bloquea movimiento**

### **Rock** (Roca)

- **Propiedades**: Harvestable, Obstacle, Interactable
- **Recurso**: Stone
- **Colisión**: Sí (obstáculo) - **Bloquea movimiento**

### **Bush** (Arbusto)

- **Propiedades**: Harvestable, Interactable
- **Recurso**: Berries
- **Colisión**: No (puede atravesarse) - **Permite movimiento**

### **Ore** (Mena)

- **Propiedades**: Harvestable, Obstacle, Interactable
- **Recurso**: Iron
- **Colisión**: Sí (obstáculo) - **Bloquea movimiento**

### **Water** (Agua)

- **Propiedades**: Interactable
- **Recurso**: Water
- **Colisión**: No - **Permite movimiento**

### **Building** (Edificio)

- **Propiedades**: Interactable, Obstacle
- **Recurso**: Ninguno
- **Colisión**: Sí (obstáculo) - **Bloquea movimiento**

## Funcionalidades

### **Detección de Colisiones**

- ✅ **Preventiva**: Bloquea movimiento antes de que ocurra
- ✅ **En tiempo real**: Se ejecuta en cada intento de movimiento
- ✅ **Configurable**: Radios de colisión ajustables por elemento
- ✅ **Límites del mundo**: Previene salir de los límites del mapa

### **Elementos Cercanos**

- Detecta elementos dentro del rango de interacción (configurable)
- Muestra información en tiempo real
- Permite interacciones con botones

### **Sistema de Recursos**

- Cada elemento puede tener un tipo de recurso
- Propiedades configurables (harvestable, interactable, obstacle)
- Sistema de salud para elementos destructibles

### **Generación Dinámica**

- Función para agregar elementos en tiempo real
- Generación aleatoria de mundos
- Sistema de debug para testing

### **Visualización de Colisiones**

- **CollisionVisualizer**: Muestra áreas de colisión en 3D (modo debug)
- **MiniMap**: Vista 2D del mundo con elementos y player
- **MapInfo**: Estado de colisiones en tiempo real

## Uso del Sistema

### **Agregar Nuevos Elementos**

```typescript
import { useWorldStore } from "../stores/worldStore";

const addMapElement = useWorldStore((s) => s.addMapElement);

const newElement = {
  id: "unique-id",
  type: "tree",
  position: [x, y, z],
  variant: 0,
  properties: {
    harvestable: true,
    interactable: true,
    obstacle: true, // ← Esto determina si bloquea movimiento
    resourceType: "wood",
    health: 100,
    maxHealth: 100,
  },
};

addMapElement(newElement);
```

### **Testing de Colisiones**

```typescript
const canMove = useWorldStore((s) => s.canMoveTo);
const getCollisionInfo = useWorldStore((s) => s.getCollisionInfo);

// Verificar si una posición es válida
const isValidPosition = canMove([x, y, z]);

// Obtener información de colisiones
const collisionInfo = getCollisionInfo([x, y, z]);
console.log("Has collision:", collisionInfo.hasCollision);
console.log("Colliding elements:", collisionInfo.collidingElements);
```

### **Configurar Nuevos Tipos**

1. Agregar el tipo en `ELEMENT_TYPES` en `config/world.ts`
2. Implementar la función de renderizado en `MapElement.tsx`
3. Definir las propiedades por defecto en `DEFAULT_ELEMENTS`
4. **Importante**: Configurar `obstacle: true/false` según si debe bloquear movimiento

### **Personalizar Interacciones**

- Modificar `handleElementInteraction` en `WorldRenderer.tsx`
- Implementar lógica específica para cada tipo de elemento
- Agregar efectos visuales o de sonido

## Ventajas del Sistema

1. **Modular**: Fácil agregar nuevos tipos de elementos
2. **Eficiente**: Solo renderiza elementos visibles
3. **Interactivo**: Sistema de colisiones y proximidad en tiempo real
4. **Configurable**: Parámetros ajustables para diferentes escenarios
5. **Debug**: Herramientas integradas para testing
6. **Escalable**: Puede manejar cientos de elementos sin problemas de rendimiento
7. **Robusto**: **Sistema de colisiones preventivo que funciona correctamente**
8. **Visual**: **Mini-mapa y visualización de colisiones para mejor UX**

## Próximas Mejoras

- Sistema de inventario para recursos recolectados
- Efectos visuales para interacciones
- Sistema de misiones basado en elementos del mundo
- Persistencia de datos del mundo
- Multiplayer y sincronización
- Sistema de clima y tiempo
- Procedural generation de terrenos
- **Sistema de pathfinding para evitar obstáculos**
- **Física más avanzada (empujar objetos, gravedad)**
