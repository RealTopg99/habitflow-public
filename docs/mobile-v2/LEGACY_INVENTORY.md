# Inventario legacy móvil/tablet

Auditoría previa al reemplazo V2. El objetivo es que por debajo de 1181 px no se monte ninguna página desktop ni ningún shell móvil anterior.

| Elemento | Ubicación | Problema | Decisión |
|---|---|---|---|
| Shell responsive V1 | `MobileResponsive.jsx` (`MobileAppShell`, `MobilePageContainer`) | Solo envuelve las páginas desktop; no separa el árbol de renderizado | Sustituir por `MobileTabletV2App` con páginas V2 propias |
| Header compacto V1 | `MobileResponsive.jsx` (`MobileHeader`) | Escala pequeña, avatar textual y composición distinta a las referencias | Sustituir por `MobileV2Header` |
| Bottom nav V1 | `MobileResponsive.jsx` (`MobileBottomNav`) | Navegación correcta en concepto, pero geometría, sheet y jerarquía no coinciden | Sustituir por `MobileV2BottomNav` |
| Menú Más V1 | `MobileResponsive.jsx` (`hf-mobile-more-sheet`) | Sheet pequeño, oscuro en exceso y sin handle | Sustituir por `MobileV2MoreSheet` |
| Navegación legacy inline | `HabitTrackerApp.jsx` (`legacy-mobile-nav`, `mobile-more-popover`) | Código muerto todavía presente en el shell principal | Eliminar |
| Dashboard desktop en compacto | `DashboardView` montado desde `renderView()` | Cards, tipografía y orden desktop reacomodados por CSS | Conservar lógica/datos; sustituir representación por `MobileV2HomePage` |
| Hábitos desktop en compacto | `HabitsView` | Selectores, widgets y empty states legacy | Conservar acciones/records; sustituir por `MobileV2HabitsPage` |
| Pomodoro desktop en compacto | `PomodoroView` | Página desktop escalada | Conservar timer y registros; sustituir por `MobileV2PomodoroPage` |
| Agenda desktop en compacto | `AgendaView` | Timeline y drawers desktop; ancho y estructura incorrectos | Conservar agenda/updaters; sustituir por vistas Semana/Mes/Lista/Próximos V2 |
| Entreno desktop en compacto | `WorkoutView` / `WorkoutFeature.jsx` | Tabs, cards, builder y biblioteca desktop reducidos | Conservar `workoutData` y catálogo; sustituir por vistas Hoy/Rutinas/Biblioteca/Progreso/Sesión V2 |
| Finanzas desktop en compacto | `FinanceView` | Resumen y modal de transacción antiguos | Conservar `financeData`/updater; sustituir por seis páginas Wallet V2 |
| Metas “control matemático” | `DreamGoalsView` | Presentación explícitamente descartada por la referencia | Conservar `dreamGoals`/updater; sustituir por Activas/Completadas/Sueños V2 |
| Salud desktop en compacto | `HealthView` | Hero Salud Pro y cards de medicación legacy | Conservar `healthData`/updater y widgets; sustituir por Salud V2 |
| Overrides responsive V1 | `mobile-tablet.css` | Cascada con `!important` encima de componentes desktop | Eliminar del bundle tras activar V2 |
| Media queries globales | `injectStyles()` en `HabitTrackerApp.jsx` | Muchas reglas `max-width` antiguas afectan páginas desktop | Conservar para desktop; aislarlas porque el DOM V2 usa solo prefijo `.mobile-v2` |
| Estados duplicados de navegación | `mobileMenu`, `showMoreNav` y popover inline | Dos mecanismos para la misma navegación | Conservar solo `showMoreNav` como estado del sheet V2; eliminar `mobileMenu` |
| Overlays globales | update notes, voz, nivel y confetti | Son funciones globales reales, no páginas legacy | Conservar y montar fuera del árbol desktop/V2 |
| Stores y sincronización | `data`, Supabase, widgets, agenda, workout y finance updaters | Fuente real de negocio | Conservar sin duplicar |
| Archivos muertos al finalizar | `MobileResponsive.jsx`, `mobile-tablet.css` | Implementación V1 completa | Eliminar después de verificar V2 |

## Criterio de salida

- `isMobileTablet === true`: solo `MobileTabletV2App` está en el DOM.
- `isMobileTablet === false`: solo el shell desktop actual está en el DOM.
- El V2 usa clases bajo `.mobile-v2`; no depende de ocultar páginas legacy con CSS.
