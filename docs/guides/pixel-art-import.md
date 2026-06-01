# Importar Pixel Art de Mascotas

## Cómo agregar sprites personalizados

### 1. Preparar el PNG

- Formato: **PNG**
- Tamaño: **32×32 píxeles**
- Colores sólidos (sin transparencia, fondo blanco o transparente)
- Pixel art nítido (sin anti-aliasing)

### 2. Colocar el archivo

```
packages/frontend/public/pets/mi-mascota.png
```

### 3. Conectarlo en el juego

Editar `packages/shared/src/types.ts` y agregar la especie al enum `PetSpecies`:

```typescript
MASCOTA_PERSONALIZADA = 'MASCOTA_PERSONALIZADA',
```

Luego en `packages/shared/src/constants.ts`, agregar el label:

```typescript
MASCOTA_PERSONALIZADA: 'Mi Mascota ✨',
```

Finalmente, en el componente donde se usa `<PetSprite>`, pasar la prop:

```tsx
<PetSprite
  species="MASCOTA_PERSONALIZADA"
  mood={mood}
  isSleeping={isSleeping}
  customImageUrl="/pets/mi-mascota.png"
/>
```

### 4. Cómo funciona

El sistema (`lib/petImageLoader.ts`) carga el PNG en un canvas oculto,
lee los píxeles uno por uno, y los renderiza escalados manteniendo
el estilo pixel art (`image-rendering: pixelated`).

Los sprites se cachean en memoria para no recargarlos en cada render.

### 5. Notas

- Si el PNG tiene transparencia (alpha < 128), ese píxel se omite
- Si querés múltiples frames (dormido, feliz, triste), creá un PNG por variante
- Cualquier tamaño funciona, pero 32×32 da el mejor resultado con el escalado actual
