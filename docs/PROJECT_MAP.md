# HabitFlow - Mapa del proyecto

Este documento describe la arquitectura que existe hoy. No presupone una estructura que el proyecto todavía no tiene.

## Resumen ejecutivo

HabitFlow es una SPA de React contenida principalmente en `HabitTrackerApp.jsx`. La ejecución actual no usa el flujo normal de Vite: `index.html` carga React, ReactDOM, Babel, Recharts, Lucide y Supabase desde CDN; luego descarga y transpila `HabitTrackerApp.jsx` en el navegador.

La aplicación no tiene rutas URL independientes. La navegación se controla con el estado `view` de `HabitFlowApp` y se conserva en `localStorage` bajo `habitflow_active_view`.

Fuentes principales:

- `HabitTrackerApp.jsx`: interfaz, lógica de dominio, estado, estilos y navegación.
- `index.html`: arranque, dependencias CDN, configuración pública y montaje de React.
- `server.js`: servidor local en `http://127.0.0.1:8080` con recarga automática.

No editar como fuente principal:

- `public-site/` y `public-site-simple/`: copias históricas o de publicación.
- `HabitFlow_Portable.html`: versión portable antigua; ya no se sincroniza.
- `.deploy/habitflow-public/`: repositorio de publicación que recibe una copia de los archivos terminados antes del push.

## Stack real

| Área | Implementación actual |
| --- | --- |
| UI | React 18 UMD |
| JSX | Babel Standalone en el navegador |
| Gráficas | Recharts UMD |
| Iconos | Lucide React ESM |
| Auth | Clerk cargado dinámicamente |
| Datos remotos | Supabase JS |
| Persistencia local | `localStorage` |
| Push | Service Worker + Web Push |
| Backend programado | Supabase Edge Functions; existe una alternativa Netlify |
| Estilos | CSS global inyectado desde `injectStyles()` + estilos inline |
| Pruebas UI | Playwright |
| Servidor local | Node `server.js`, puerto 8080 |

`components/ui/spotlight-card.tsx` no forma parte del flujo activo de `index.html`; es un archivo aislado de una integración previa.

## Flujo de arranque

1. `server.js` sirve los archivos y añade recarga en vivo al HTML local.
2. `index.html` registra `sw.js` cuando el contexto lo permite.
3. `index.html` carga React, Babel, Lucide, Supabase y Recharts.
4. Descarga `HabitTrackerApp.jsx`, reemplaza los imports por objetos globales y lo transpila.
5. `App` ejecuta `injectStyles()` y monta `AuthGate`.
6. `AuthGate` abre Clerk o permite el modo local `?dev-preview=1`.
7. `HabitFlowApp` carga datos locales, intenta recuperar la nube y renderiza la vista activa.

## Capas actuales

### Catálogos y tokens

Al inicio de `HabitTrackerApp.jsx`:

- `BASE_COLORS`, `COLORS`
- `THEME_VARIANTS`, `THEME_MODES`, `ICON_COLOR_PALETTE`
- catálogos de hábitos, ejercicios, finanzas, salud y suscripciones
- factories como `getWorkoutData()`, `getFinanceData()` y `getHealthData()`

### Utilidades de dominio

Antes de las vistas:

- fechas y semanas: `toYYYYMMDD`, `getWeekStart`, `getDayKey`
- hábitos: `isHabitScheduledForDate`, rachas, fuerza y estadísticas
- salud: dosis, tratamientos y adherencia
- finanzas: conversión USD/COP y normalización de importes
- agenda: recurrencias, rangos horarios y calendario

### Datos y persistencia

- `getDefaultData()`: contrato raíz y datos iniciales.
- `normalizeLoadedData()`: migraciones y compatibilidad con datos antiguos.
- `loadData()`: lee `habitTrackerData`.
- `saveData()`: guarda localmente y programa guardado remoto.
- `loadCloudData()` / `saveCloudDataNow()`: tabla `habitflow_user_data`.
- `queueCloudSave()`: debounce para evitar un guardado remoto por pulsación.

### Componentes compartidos

Bloque que comienza en `Confetti`:

- `Toast`, `EmptyState`, `Skeleton`, `AnimatedCounter`
- `GlowCard`, `KPICard`, `Modal`
- `BrandLogo`
- pantallas y montaje de Clerk
- helpers de métricas reutilizados por Panel, Hábitos y Estadísticas

### Vistas de producto

Cada sección es un componente grande dentro de `HabitTrackerApp.jsx`. Ver `SECTION_INDEX.md` para el índice preciso.

### Shell de aplicación

`HabitFlowApp` contiene:

- estado raíz `data`
- vista activa y navegación
- sincronización con nube
- timers de notificaciones locales
- todos los actualizadores por dominio
- sidebar, topbar, navegación móvil y selector de vista

`App` solo inyecta CSS y envuelve el shell con `AuthGate`.

## Modelo de datos raíz

El objeto de `getDefaultData()` tiene estas ramas:

| Campo | Propósito | Vista principal |
| --- | --- | --- |
| `user` | perfil, XP, nivel, temas, preferencias y Pomodoro | todas / Configuración |
| `habits` | definición de hábitos y recordatorios | Hábitos / Panel |
| `records` | cumplimiento diario de hábitos | Hábitos / Panel |
| `dailyNotes` | notas diarias heredadas | compatibilidad |
| `challenges` | retos | Panel / retos |
| `workoutData` | ejercicios, rutinas y sesiones | Entreno |
| `financeData` | cuentas, movimientos, deudas, presupuestos y recurrentes | Finanzas |
| `healthData` | medicamentos y tomas | Salud |
| `studyData` | materias y sesiones heredadas | vista no navegable |
| `readingData` | libros heredados | vista no navegable |
| `dreamGoals` | metas visuales | Metas |
| `pomodoroRecords` | sesiones de foco | Pomodoro |
| `agenda` | tareas agrupadas por fecha | Agenda |
| `agendaNotes` | notas heredadas por fecha | compatibilidad |
| `agendaTodos` | to-do por fecha | Agenda |
| `agendaTodoLabels` | etiquetas de to-do | Agenda |
| `agendaTaskCategories` | categorías personalizadas | Agenda |
| `customHabitCategories` | categorías personalizadas | Hábitos |
| `xpAwards` | deduplicación de premios XP | Hábitos / nivel |

Regla: cualquier campo nuevo persistente debe tener valor por defecto en `getDefaultData()` y migración defensiva en `normalizeLoadedData()`.

## Navegación

No hay React Router. `HabitFlowApp` define `navItems`, `navigateTo()` y `renderView()`.

IDs activos:

- `dashboard`
- `habits`
- `pomodoro`
- `workout`
- `agenda`
- `dreams`
- `finance`
- `health`
- `creator`, solo para el creador autorizado
- `settings`

Sidebar, topbar y navegación móvil están al final de `HabitFlowApp`. Desktop y móvil consumen el mismo arreglo `navItems`.

## Temas y estilos

El sistema tiene dos dimensiones:

- modo visual: `THEME_MODES`, guardado en `data.user.themeMode`
- color de acento: `THEME_VARIANTS` e `ICON_COLOR_PALETTE`

Modos prioritarios:

- Dark Puro: ID `pureDark`
- Claro Rosa: ID `pinkLight`

`getThemeVisualTokens()` produce variables `--hf-*`. Un efecto de `HabitFlowApp`:

1. copia los colores del modo a `COLORS`
2. aplica variables CSS al elemento `<html>`
3. establece `data-theme-mode`

`injectStyles()` contiene el CSS global, responsive y específico de tema. Hay además muchos estilos inline que consumen `COLORS` o las variables globales.

Al corregir temas:

1. preferir tokens de `getThemeVisualTokens()`
2. revisar selectores `html[data-theme-mode="pinkLight"]` y `pureDark`
3. evitar colores nuevos hardcodeados si ya existe token
4. comprobar desktop y móvil en ambos modos

## Autenticación, nube y notificaciones

### Clerk

- `AuthGate` controla el acceso.
- `getClerkIdentity()` normaliza el usuario.
- el modo local usa `?dev-preview=1`.
- creador local: `?dev-preview=1&creator-preview=1`.

### Supabase

- datos de usuario: `habitflow_user_data`
- suscripciones push: `habitflow_push_subscriptions`
- entregas deduplicadas: `habitflow_push_deliveries`
- SQL base: `supabase-habitflow-cloud.sql`

### Push

- cliente: helpers próximos a la persistencia en `HabitTrackerApp.jsx`
- recepción: `sw.js`
- cron principal: `supabase/functions/habitflow-push-cron/index.ts`
- consola de creador: `supabase/functions/habitflow-creator-notifications/index.ts`
- alternativa heredada: `netlify/functions/habitflow-push-cron.mjs`

Cuando se cambia el modelo de tareas, hábitos, salud o deudas, hay que revisar también el cron porque vuelve a interpretar esos datos en el servidor.

## Archivos importantes

| Archivo | Responsabilidad | Riesgo |
| --- | --- | --- |
| `HabitTrackerApp.jsx` | aplicación completa | muy alto |
| `index.html` | bootstrap y configuración pública | alto |
| `server.js` | vista local y recarga en vivo | bajo |
| `sw.js` | recepción y click de push | alto |
| `supabase-habitflow-cloud.sql` | tablas y RLS | alto |
| `supabase/functions/habitflow-push-cron/index.ts` | alarmas en segundo plano | muy alto |
| `supabase/functions/habitflow-creator-notifications/index.ts` | clientes y mensajes del creador | alto |
| `scripts/check-text-encoding.js` | guardia de UTF-8/textos | bajo |
| `tests/ui-audit.spec.ts` | auditoría visual y funcional | medio |
| `scripts/run-ui-audit.js` | levanta servidor y Playwright | bajo |

## Zonas frágiles

1. `HabitTrackerApp.jsx` mezcla unas 18.000 líneas de CSS, UI y lógica.
   Babel avisa en desarrollo que desoptimiza la generación de código al superar 500 KB; la app sigue cargando, pero el coste de arranque y diagnóstico aumenta.
2. `COLORS` es un objeto global mutable; un error de tema puede afectar todas las vistas.
3. `normalizeLoadedData()` es una migración acumulativa y toca todos los dominios.
4. `HabitFlowApp` concentra timers, estado, navegación y escritura.
5. Agenda, Finanzas y Entreno son vistas especialmente grandes.
6. Los recordatorios tienen lógica duplicada entre navegador y cron de Supabase.
7. Existen varias copias publicables que pueden quedar desincronizadas.

## Estructura ideal futura (no aplicada)

Una separación conservadora podría ser:

```text
src/
  app/
    App.jsx
    AppShell.jsx
    navigation.js
  features/
    habits/
    agenda/
    finance/
    health/
    workout/
    pomodoro/
    goals/
    creator/
    settings/
  components/
    ui/
    layout/
  services/
    storage.js
    cloud.js
    notifications.js
  domain/
    dates.js
    migrations.js
  styles/
    tokens.css
    themes.css
    responsive.css
```

Orden recomendado si algún día se ejecuta:

1. extraer utilidades puras con pruebas
2. extraer servicios de persistencia
3. extraer componentes compartidos
4. mover una vista por vez
5. adoptar Vite al final, no al principio

## Workflow para futuras modificaciones

1. Buscar primero el nombre de la sección en `docs/SECTION_INDEX.md`.
2. Abrir el símbolo principal indicado, no buscar visualmente en todo el archivo.
3. Identificar qué rama de `data` consume y qué actualizador recibe.
4. Si cambia el modelo persistido, actualizar `getDefaultData()` y `normalizeLoadedData()`.
5. Si afecta alertas, revisar `sw.js` y `supabase/functions/habitflow-push-cron/index.ts`.
6. Si afecta colores, usar tokens y comprobar `pureDark` + `pinkLight`.
7. Mantener el cambio dentro de la sección; evitar refactors vecinos.
8. Ejecutar:

```powershell
npm run check:text
npm run test:ui
```

9. Abrir `http://127.0.0.1:8080/index.html?dev-preview=1`.
10. Sincronizar solo los archivos terminados con `.deploy/habitflow-public`, confirmar el diff y subir a GitHub.

Actualmente no existe script `npm run build`; la validación equivalente es parseo JSX, control de texto y Playwright. Si se incorpora Vite, añadir entonces un build real.
