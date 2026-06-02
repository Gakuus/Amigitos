# Plan de Sprints — Amigitos

## Sprint 1 — Fundación y Tema Pastel ✅
- Backend: acciones (feed/play/bathe) requieren y consumen items del inventario
- Frontend: API para acciones con itemId, nuevo ItemSelector
- Botones de acción dentro de cada habitación (comer, jugar, bañar, dormir/despertar)
- Colores pastel en toda la UI (login, register, shop, games, couple, wardrobe, room SVG)
- Paleta pastel en tailwind.config.ts y globals.css
- Modo oscuro preservado con fallbacks `dark:`

## Sprint 2 — Habitaciones, Mascotas y Movimiento ✅
### 2.1 Fondos y Escenarios Mejorados ✅
- Fondos únicos para cada habitación (living, eat, play, bath, sleep)
- Muebles SVG reemplazan CSS divs (SofaSVG, DiningTableSVG, BathtubSVG, BedSVG, etc.)
- Atmósfera única por habitación: dormitorio nocturno con luna/estrellas, living con brillo cálido, baño con patrón azulejos, play con círculos coloridos
- Camas de mascotas juntas y bien diseñadas en sleep

### 2.2 Sistema de Mascotas ✅
- Representación pixel-art de mascotas con canvas
- Diferentes especies (Gato, Perro, Conejo, Hámster, Zorro, Panda, Pingüino, Dragón, Unicornio, Mono, Cerdo)
- Imágenes personalizadas por especie (Monito, pinguino, cerdo)
- Expresiones según estado de ánimo

### 2.3 Movimiento Natural ✅
- Mascotas deambulan por todas las salas (eje X + profundidad)
- Transiciones suaves de 3500ms
- Flip de dirección horizontal
- Animación walk-bob
- Distribución adaptable a cantidad de mascotas
- Spread más amplio en mobile

### 2.4 Burbujas de Diálogo ✅
- Frases únicas por especie (getPhrase)
- Frases de acción al interactuar (getActionPhrase)
- Frases de amor para pareja (getLovingPhrase, 35% probabilidad)
- Duración 8s, intervalo 25-45s

### 2.5 Tabs de Habitaciones ✅
- 5 salas dentro del contenedor Room: Sala, Comer, Jugar, Baño, Dormir
- Posicionadas al fondo con opacidad 85%
- Estilo adaptativo mobile/desktop
- Botón de acción contextual por sala (ItemSelector)

### 2.6 Sidebar Expandible ✅
- Menú lateral derecho colapsable (tres puntos)
- Opciones: Tienda, Juegos, Pareja, Perfil, Vestir, Adoptar
- Sección "Llamar mascotas" para mascotas en otras salas
- En mobile se abre como bottom sheet con backdrop

### 2.7 Estadísticas por Habitación ✅
- Barra debajo de cada mascota según sala (felicidad, hambre, higiene, energía)
- Gradiente de color: verde > 60, amarillo 25-60, rojo < 25
- Transición suave de 1000ms

## Sprint 3 — Minijuegos 🎮 (parcial ✅)
### 3.1 Memorama ✅
- Tablero 4x4 con 8 pares de emojis animales
- Límite 20 movimientos
- Animación de cartas con gradiente pastel
- Puntuación según movimientos restantes

### 3.2 Atrapa Comida ✅
- Items buenos (+10 a +50 pts) y malos (-15 a -30 pts)
- 3 vidas, 30 segundos
- Sistema de combo
- Dificultad progresiva

### 3.3 Rompecabezas ✅
- Puzzle 3x3 deslizante
- 30 movimientos máx, 90 segundos
- Fichas con gradiente arcoíris
- Verificación de solucionabilidad

### 3.4 Flappy Pet ✅
- Mecánica tipo Flappy Bird
- Tubos verdes, nubes decorativas
- Puntaje en tiempo real

### 3.5 Mejoras pendientes
- Más variedad de minijuegos
- Tabla de puntuaciones altas
- Logros por juego completado

## Sprint 4 — Tiempo Real y Multijugador ⏳
- Sincronización WebSocket de interacciones
- Ver en tiempo real cuando la pareja interactúa
- Notificaciones de eventos de la pareja
- Estado compartido de habitación y decoración

## Sprint 5 — Sistema de Decoración 🏠
- Colocación de muebles en grid
- Snap-to-grid para posicionamiento
- Muebles interactivos (cama para dormir, comedero para comer)
- Tienda de decoración
- Personalización de habitaciones por sala

## Sprint 6 — AI y Máquina de Estados 🤖
- La mascota decide qué animación hacer: caminar, comer, dormir, jugar
- Estados: IDLE, WALKING, EATING, SLEEPING, PLAYING, BATHING
- Transiciones automáticas según necesidades
- Necesidades con decaimiento en tiempo real

## Sprint 7 — Modelos 3D (Three.js) 🎨
- Integración de React Three Fiber
- Modelos GLTF/GLB para mascotas
- Animaciones 3D: idle, walk, eat, play, sleep, bath
- Vista previa 3D antes de adoptar
- Evolución visual al subir de nivel

## Sprint 8 — Gamificación y Social 🏆
- Logros y trofeos
- Racha de cuidado (streak)
- Tabla de clasificación entre parejas
- Eventos especiales diarios/semanales
- Más items en tienda

## Sprint 9 — Polaco y Producción 🚀
- Testing (unit + e2e)
- Optimización de rendimiento
- PWA completo (offline support)
- Accesibilidad WCAG 2.1 AA
- Documentación de usuario
- Despliegue a producción
