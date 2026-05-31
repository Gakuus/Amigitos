# Análisis de Requisitos — Amigitos

## 1. Visión General

Aplicación web que permite a parejas (o amigos) adoptar y cuidar mascotas virtuales de forma colaborativa en tiempo real. Inspirado en Widgetable Pets, pero 100% web, con modelos 3D originales y una experiencia compartida.

## 2. Requisitos Funcionales

### 2.1 Gestión de Usuarios
- **RF-01**: Registro e inicio de sesión (email, Google, Apple).
- **RF-02**: Perfil de usuario con avatar y nombre.
- **RF-03**: Vincular dos usuarios como "pareja" o "amigos" para cuidar una mascota compartida.

### 2.2 Mascotas
- **RF-04**: Adoptar una nueva mascota (selección entre especies disponibles).
- **RF-05**: La mascota tiene atributos: hambre, felicidad, energía, higiene.
- **RF-06**: La mascota evoluciona visualmente según su nivel y cuidado.
- **RF-07**: Importación de modelos 3D originales (formato GLTF/GLB).
- **RF-08**: Personalización de la mascota (color, accesorios).

### 2.3 Interacciones
- **RF-09**: Alimentar a la mascota (reduce hambre, sube energía).
- **RF-10**: Jugar con la mascota (sube felicidad, baja energía).
- **RF-11**: Bañar a la mascota (sube higiene).
- **RF-12**: Las interacciones tienen cooldown para evitar spam.
- **RF-13**: Tiempo real: ambos miembros ven los cambios instantáneamente.

### 2.4 Estados y Evolución
- **RF-14**: La mascota tiene ciclos de sueño/vigilia.
- **RF-15**: Si no recibe cuidado, los atributos decaen con el tiempo.
- **RF-16**: La mascota sube de nivel con experiencia acumulada.
- **RF-17**: Al subir de nivel, la mascota puede cambiar de forma/evolucionar.

### 2.5 Vinculación en Pareja
- **RF-18**: Un usuario envía invitación a otro para ser "co-cuidador".
- **RF-19**: Ambos aceptan la vinculación para comenzar.
- **RF-20**: Ambos pueden interactuar con la misma mascota.
- **RF-21**: Notificaciones cuando la pareja interactúa con la mascota.

### 2.6 Modelos 3D
- **RF-22**: Subida de modelos 3D propios (GLTF/GLB).
- **RF-23**: Visualización previa del modelo antes de adoptar.
- **RF-24**: Animaciones: idle, walk, eat, play, sleep, bath.

## 3. Requisitos No Funcionales

| ID    | Requisito                                    | Detalle                                               |
|-------|----------------------------------------------|-------------------------------------------------------|
| RNF-1 | Tiempo real < 200ms                          | Sincronización vía WebSockets                          |
| RNF-2 | Disponibilidad 99.9%                         | Despliegue con balanceo y health checks                |
| RNF-3 | Seguridad                                    | JWT, HTTPS, rate limiting, validación de datos         |
| RNF-4 | Escalabilidad                                | Arquitectura hexagonal, stateless, DB horizontal       |
| RNF-5 | Portabilidad de modelos 3D                   | Formato estándar GLTF, texturas separadas              |
| RNF-6 | Tests                                        | Unitarios > 80% cobertura, e2e en flujos críticos     |
| RNF-7 | Accesibilidad                                | WCAG 2.1 AA                                           |
| RNF-8 | Responsive                                   | Desktop y mobile web                                   |

## 4. Flujos Principales

### 4.1 Adopción
```
Usuario → Selecciona especie → Previsualiza modelo 3D →
Confirma adopción → La mascota aparece en su widget/inicio →
Invita a su pareja → Ambos son co-cuidadores
```

### 4.2 Cuidado Diario
```
Usuario abre app → Ve estado de la mascota (hambre, felicidad, etc.) →
Selecciona "Alimentar" → Animación 3D → Atributos se actualizan →
WebSocket notifica a la pareja → Ambos ven el cambio
```

### 4.3 Evolución
```
Mascota acumula XP por interacciones → Al alcanzar un umbral →
Sube de nivel → Cambia su modelo 3D (evolución) →
Notificación a ambos cuidadores
```

## 5. Reglas de Negocio

| Regla | Descripción                                                    |
|-------|----------------------------------------------------------------|
| RN-1  | Una mascota tiene exactamente 2 cuidadores (la pareja)          |
| RN-2  | El cooldown entre interacciones del mismo tipo es de 10 minutos |
| RN-3  | Los atributos decaen un 5% cada hora sin interacción            |
| RN-4  | Si hambre = 0 o felicidad = 0, la mascota se pone triste        |
| RN-5  | Si energía = 0, la mascota duerme y no puede interactuar        |
| RN-6  | La evolución ocurre en niveles: 5, 10, 20, 35, 50               |
| RN-7  | Ambos cuidadores deben aceptar la vinculación inicial            |

## 6. Historias de Usuario

```
HU-01: Como usuario, quiero registrarme para poder adoptar una mascota.
HU-02: Como usuario, quiero invitar a mi pareja para cuidar juntos.
HU-03: Como pareja, queremos alimentar a nuestra mascota y ver los cambios.
HU-04: Como pareja, queremos ver a nuestra mascota evolucionar.
HU-05: Como usuario, quiero importar mi propio modelo 3D para usarlo como mascota.
HU-06: Como pareja, queremos recibir notificaciones cuando el otro interactúa.
HU-07: Como usuario, quiero que la mascota se duerma si no la cuidamos.
HU-08: Como usuario, quiero ver el historial de cuidado de mi mascota.
```
