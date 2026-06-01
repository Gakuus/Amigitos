# Plan de Sprints — Amigitos

## Sprint 1 — Fundación y Tema Pastel ✅
- Backend: acciones (feed/play/bathe) requieren y consumen items del inventario
- Frontend: API para acciones con itemId, nuevo ItemSelector
- Botones de acción dentro de cada habitación (comer, jugar, bañar, dormir/despertar)
- Colores pastel en toda la UI (login, register, shop, games, couple, wardrobe, room SVG)
- Paleta pastel en tailwind.config.ts y globals.css
- Modo oscuro preservado con fallbacks `dark:`

## Sprint 2 — Sistema de Mascota Virtual + Perspectiva Isométrica 🎯

### 2.1 Perspectiva Isométrica
- Renderizar habitaciones en perspectiva 2.5D (ángulo diagonal superior)
- Transformaciones CSS/SVG isométricas (ancho = 2× alto)
- Grid system: habitación dividida en casillas donde se colocan objetos
- Coordenadas (x, y, z) para posicionamiento isométrico

### 2.2 Grid System
- Sistema de cuadrícula para colocación de muebles, comida, juguetes, camas
- Cada objeto ocupa N casillas en el grid
- Snap-to-grid para posicionamiento

### 2.3 Needs System (mejora)
- Estadísticas: hambre, higiene, energía, felicidad, diversión
- Barras visuales animadas con iconos
- Decaimiento en tiempo real visible

### 2.4 AI / State Machine
- La mascota decide qué animación hacer: caminar, comer, dormir, jugar
- Estados: IDLE, WALKING, EATING, SLEEPING, PLAYING, BATHING
- Transiciones automáticas según necesidades

### 2.5 Room Decoration System
- Colocación y funcionalidad de objetos en la habitación
- Muebles interactivos (cama para dormir, comedero para comer, etc.)

### 2.6 Fondos y Escenarios Mejorados ✅
- Fondos mucho mejores para cada habitación (living, eat, play, bath, sleep)
- Decoraciones detalladas alineadas con perspectiva isométrica
- Camas de mascotas más juntas y mejor diseñadas
- Muebles SVG reemplazan CSS divs (SofaSVG, DiningTableSVG, BathtubSVG, BedSVG, etc.)
- Atmósfera única por habitación: dormitorio nocturno con luna/estrellas, living con brillo cálido, baño con patrón azulejos, play con círculos coloridos

### 2.7 Rediseño de Mascotas ✅
- Representación SVG mucho mejor que emojis
- Sprites o ilustraciones de mascotas con más detalle
- Diferentes expresiones según estado de ánimo
- Animaciones entre estados
- **Movimiento natural**: mascotas deambulan por todas las salas (x + profundidad)
- **Frases y personalidad**: burbujas de diálogo con frases únicas por especie
- Frases al interactuar (comer, jugar, bañar, dormir, despertar, llamar)

## Sprint 3 — Tiempo Real y Multijugador
- Sincronización WebSocket de todas las interacciones
- Ver en tiempo real cuando la pareja interactúa
- Notificaciones de eventos de la pareja
- Estado compartido de la habitación y decoración

## Sprint 4 — Modelos 3D (Three.js)
- Integración de React Three Fiber
- Modelos GLTF/GLB para mascotas
- Animaciones 3D: idle, walk, eat, play, sleep, bath
- Vista previa 3D antes de adoptar
- Subida de modelos 3D propios
- Evolución visual al subir de nivel

## Sprint 5 — Gamificación y Social
- Logros y trofeos
- Racha de cuidado (streak)
- Tabla de clasificación entre parejas
- Tienda con más variedad de items
- Eventos especiales diarios/semanales

## Sprint 6 — Polaco y Producción
- Testing (unit + e2e)
- Optimización de rendimiento
- PWA completo (offline support)
- Accesibilidad WCAG 2.1 AA
- Documentación de usuario
- Despliegue a producción
