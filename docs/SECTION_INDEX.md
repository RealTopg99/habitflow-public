# HabitFlow - Índice de secciones

Las líneas son aproximadas. Para localizar una sección de forma estable, buscar el símbolo exacto o el comentario `SECTION`.

## Navegación activa

| Pantalla | ID | Símbolo principal | Ubicación aproximada | Datos | Escritura |
| --- | --- | --- | --- | --- | --- |
| Panel | `dashboard` | `DashboardView` | `HabitTrackerApp.jsx` ~8182 | `user`, `habits`, `records`, `workoutData` | `onCompleteHabit`, `onUpdateUser` |
| Hábitos | `habits` | `HabitsView` | ~8568 | `habits`, `records`, `customHabitCategories` | alta/edición/borrado/completado |
| Pomodoro | `pomodoro` | `PomodoroView` | ~13413 | `user.pomodoro`, `pomodoroRecords` | `onUpdateUser`, `onUpdatePomodoro` |
| Entreno | `workout` | `WorkoutView` | ~14267 | `workoutData` | `onUpdateWorkout`, XP |
| Agenda | `agenda` | `AgendaView` | ~15495 | `agenda`, todos, etiquetas y categorías | actualizadores por fecha |
| Metas | `dreams` | `DreamGoalsView` | ~11665 | `dreamGoals` | `onUpdateDreamGoals` |
| Finanzas | `finance` | `FinanceView` | ~9598 | `financeData` | `onUpdateFinance` |
| Salud | `health` | `HealthView` | ~9126 | `healthData` | `onUpdateHealth` |
| Creador | `creator` | `CreatorView` | ~12330 | API segura de clientes | Edge Function |
| Configuración | `settings` | `SettingsView` | ~12577 | `user`, nube y almacenamiento | perfil, preferencias, import/export |

El registro que conecta IDs con componentes está en `HabitFlowApp.renderView()` cerca del final del archivo. El menú está en `navItems`.

## Shell y navegación

| Elemento | Dónde buscar | Responsabilidad |
| --- | --- | --- |
| App raíz | `const App` | inyecta estilos y monta autenticación |
| Shell | `const HabitFlowApp` | estado raíz, timers, navegación y layout |
| Sidebar | `<aside className="sidebar">` dentro de `HabitFlowApp` | navegación desktop |
| Topbar | `<header` dentro de `HabitFlowApp` | usuario, fecha, racha y nivel |
| Menú móvil | `mobile-bottom-nav` | primeras cuatro secciones + “Más” |
| Selector de vista | `renderView()` | asocia `view` con cada componente |
| Navegación | `navigateTo()` | valida el ID, guarda `habitflow_active_view` y vuelve arriba |
| Autenticación | `AuthGate` | Clerk y bypass local |

## Panel

Símbolo: `DashboardView`.

Relacionados:

- tarjetas KPI: `KPICard`
- logros: `AchievementsSection`
- gráfica: Recharts y `CustomTooltip`
- métricas: `getTodayCount`, `getWeeklyRate`, rachas y fuerza
- último entreno: `workoutData.sessions`

Cambios de layout del panel deben comprobar el bloque `dashboard-*` dentro de `injectStyles()`.

## Hábitos

Símbolos:

- vista: `HabitsView`
- formulario: `HabitForm`
- iconos: `HABIT_ICONS`, `HabitIconGlyph`
- mapa de días: `WEEKDAY_KEYS`, `getWeekStart`, `isHabitScheduledForDate`
- métricas: `getCurrentStreak`, `getBestStreak`, `getCompletionRate`
- heatmaps: `CompletionHeatMap`, `HabitHeatMap30`

Datos principales:

- `data.habits`
- `data.records`
- `data.customHabitCategories`
- `data.xpAwards`

Actualizadores en `HabitFlowApp`:

- `onAddHabit`
- `onUpdateHabit`
- `onDeleteHabit`
- `onCompleteHabit`
- `onUpdateRecord`
- `onCreateHabitCategory`

Recordatorios relacionados:

- comprobación local dentro de `HabitFlowApp`
- `dueHabitNotificationsForUser` en el cron de Supabase

## Agenda

Símbolo: `AgendaView`.

Helpers inmediatamente anteriores:

- categorías: `normalizeAgendaTaskCategories`
- hora: `timeToMinutes`, `getTaskTimeRangeLabel`
- recurrencia: `generateRecurrenceDates`, `generateIntervalDates`
- calendario: `getWeekDays`, `getMonthGrid`
- orden: `compareTaskTime`

Datos:

- `data.agenda[YYYY-MM-DD]`
- `agendaTodos`
- `agendaTodoLabels`
- `agendaTaskCategories`

Actualizadores:

- `onUpdateAgenda`
- `onMoveTaskToDate`
- `onUpdateAgendaTodos`
- `onUpdateAgendaTodoLabels`
- `onUpdateAgendaTaskCategories`

Al cambiar recurrencias o alarmas, revisar también `dueTasksForUser` y `expandedAgendaForUser` en el cron.

## Finanzas

Símbolo: `FinanceView`.

Helpers próximos:

- `parseFinanceMoneyInput`
- `formatFinanceMoneyInput`
- `normalizeFinanceMoneyText`
- `FinanceMoneyInput`
- caché `FINANCE_RATE_CACHE_KEY`

Datos dentro de `financeData`:

- `currency`, `copRate`
- `accounts`, `accountTags`
- `transactions`
- `debts`
- `categories`
- `budgets`, `monthlyBudget`
- `recurring`
- campos heredados `subscriptions` y `goals`

La migración financiera está en `normalizeLoadedData()`. Allí se separan deudas de cuentas y se convierten pagos antiguos a `debt_payment`.

Al tocar:

- pagos de deuda: no contarlos como ingresos
- transferencias: no inferir deuda por nombre
- moneda: conservar la moneda propia de cada cuenta
- avisos: revisar `dueDebtNotificationsForUser` en el cron

## Salud

Símbolo: `HealthView`.

Helpers:

- `makeMedication`
- `normalizeHealthData`
- `isMedicationActiveOnDate`
- `getTodayMedicationDoses`
- `getNextMedicationDose`
- `getWeeklyHealthStats`
- `groupMedicationDosesByDaypart`

Datos:

- `healthData.medications`
- `healthData.takenLogs`

Alertas servidor: `dueMedicationNotificationsForUser`.

## Entreno

Símbolos:

- `WorkoutView`: tabs principales
- `WorkoutTrainTab`: rutinas
- `RoutineModal`: crear/editar rutina
- `WorkoutAdvisorModal`: asesor de rutina
- `ExerciseManager`: ejercicios personalizados
- `GymMode`: sesión activa
- `WorkoutExerciseAdder`: añadir ejercicio durante sesión
- `WorkoutCalTab`: calendario
- `WorkoutProgTab`: progreso

Datos:

- `workoutData.exercises`
- `workoutData.routines`
- `workoutData.sessions`

Catálogos: `WORKOUT_EXERCISES`, `SAMPLE_ROUTINES`, `MGS`.

## Pomodoro

Símbolos:

- `PomodoroView`
- `FocusMode`
- `playBeep`

Datos:

- `user.pomodoro`
- `pomodoroRecords`

La alarma de fin se gestiona con `notifyPomodoroDone()` y la API de notificaciones del navegador.

## Metas

Símbolo: `DreamGoalsView`.

Datos: `dreamGoals`.

Responsabilidades:

- crear/eliminar metas
- URL de imagen
- aporte y progreso
- impedir aportes después del 100 %

## Configuración

Símbolo: `SettingsView`.

Incluye:

- perfil
- `THEME_MODES`
- `THEME_VARIANTS`
- `ICON_COLOR_PALETTE`
- estado de nube
- notificaciones globales
- importación/exportación
- datos aleatorios y reinicio
- configuración de Clerk y YouTube

El tema se aplica realmente en un efecto de `HabitFlowApp`, no dentro de `SettingsView`.

## Creador

Símbolo cliente: `CreatorView`.

Acceso:

- `CREATOR_EMAIL`
- `hasCreatorAccess()`
- bypass local `creator-preview=1`

API:

- cliente: `callCreatorNotificationsApi()`
- servidor: `supabase/functions/habitflow-creator-notifications/index.ts`
- acciones: listar clientes y enviar a todos o usuarios concretos

## Componentes compartidos

| Símbolo | Uso |
| --- | --- |
| `Modal` | modal genérico |
| `ConfirmModal` | confirmaciones destructivas |
| `Toast` | feedback breve |
| `EmptyState` | estados vacíos |
| `Skeleton` | carga |
| `GlowCard` | tarjeta interactiva |
| `KPICard` | indicadores del Panel |
| `AnimatedCounter` | números animados |
| `BrandLogo` | marca |
| `ClerkUserButtonMount` | botón de usuario |
| `ErrorBoundary` | captura errores de renderizado |

## Vistas presentes pero no navegables

Estas existen en el archivo pero no aparecen en `renderView()`:

- `ReadingView`
- `StudyView`
- `StatisticsView`
- `ChallengesView` como vista independiente

Antes de eliminarlas, comprobar datos guardados y referencias internas. No asumir que son código muerto solo porque no tienen entrada de menú.

## Persistencia y servicios

| Necesidad | Símbolo/archivo |
| --- | --- |
| guardar local | `saveLocalData`, clave `habitTrackerData` |
| migrar local | `normalizeLoadedData` |
| guardar nube | `saveCloudDataNow`, `queueCloudSave` |
| cargar nube | `loadCloudData` |
| estado nube | evento `habitflow-cloud-sync` |
| push cliente | helpers cercanos a `GLOBAL_NOTIFICATIONS_STORAGE` |
| push recibido | `sw.js` |
| alarmas servidor | `supabase/functions/habitflow-push-cron/index.ts` |
| creador | `supabase/functions/habitflow-creator-notifications/index.ts` |
| esquema/RLS | `supabase-habitflow-cloud.sql` |

## Estilos y responsive

Buscar primero en:

- `injectStyles()`
- selector por clase de la vista, por ejemplo `.finance-*`, `.agenda-*`, `.health-*`
- media queries cercanas
- overrides `html[data-theme-mode="pinkLight"]`
- tokens de `getThemeVisualTokens()`

Muchos componentes también contienen estilos inline. Un estilo inline puede ganar a una regla global; comprobar ambos antes de añadir `!important`.

## Checklist de localización rápida

Para una petición como “cambia X en Finanzas”:

1. buscar `const FinanceView`
2. buscar el texto o clase concreta dentro del rango de esa vista
3. revisar `financeData` y `onUpdateFinance`
4. revisar migración si cambia datos
5. revisar cron si cambia deuda, fecha o alerta
6. revisar CSS `.finance-*` en `injectStyles()`
7. validar Dark Puro, Claro Rosa, desktop y móvil

El mismo patrón aplica a las demás secciones usando la tabla inicial.
