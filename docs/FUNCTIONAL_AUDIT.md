# Auditoría funcional Mobile/Tablet V2

Fecha: 2026-07-14

Alcance: shell Mobile/Tablet V2 (`<=1180px`) y regresión del shell desktop.

Resultado: 89 plantillas interactivas auditadas (55 botones y 34 controles de formulario); 146 controles renderizados recorridos en las pantallas principales. No quedan botones habilitados sin handler, `href="#"`, `alert`, `prompt`, `console.log` como acción final ni `onClick` vacíos en `MobileTabletV2.jsx`.

## Arquitectura verificada

- Entrada V2: `MobileTabletV2.jsx`, montada desde `HabitFlowApp` cuando `useMobileV2Viewport()` detecta un ancho de hasta 1180 px.
- Navegación global: estado `view` de `HabitFlowApp`, reflejado en `?view=` con `pushState` y restaurado mediante `popstate`.
- Subrutas: `useQuerySection`; Agenda usa `agenda=`, Entreno usa `workout=` y Wallet usa `wallet=`.
- Estado real: V2 recibe los mismos actualizadores del shell desktop (`onUpdateAgenda`, `onAddHabit`, `onCompleteHabit`, `onUpdatePomodoro`, `onUpdateWorkout`, `onUpdateDreamGoals`, `onUpdateFinance`, `onUpdateHealth` y perfil).
- Persistencia: `saveData` mantiene caché local y programa guardado remoto en `habitflow_user_data` de Supabase para el `userId` autenticado de Clerk. Las suscripciones push usan `habitflow_push_subscriptions`.
- PWA: `sw.js` usa red primero para el shell V2 y sus estilos, evitando que una versión anterior quede retenida.
- Modales: estado controlado, scrim, botón cerrar, Cancelar, Escape, foco inicial y restauración de foco.

## Hallazgos y correcciones

| ID | Módulo/pantalla | Elemento visible | Tipo | Acción esperada | Handler/ruta/store | Estado inicial | Causa | Corrección aplicada | Prueba | Resultado |
|---|---|---|---|---|---|---|---|---|---|---|
| G-01 | Global | Inicio | navegación | Abrir Panel | `navigate('dashboard')` | Parcial | Vista sin URL estable | `navigateTo` escribe `view` y escucha `popstate` | recorrido navegador | Correcto |
| G-02 | Global | Hábitos | navegación | Abrir Hábitos | `navigate('habits')` | Parcial | Igual a G-01 | Ruta consultable y `aria-current` | navegador | Correcto |
| G-03 | Global | Agenda | navegación | Abrir Agenda | `navigate('agenda')` | Parcial | Igual a G-01 | Ruta consultable | navegador | Correcto |
| G-04 | Global | Finanzas | navegación | Abrir Wallet | `navigate('finance')` | Roto | Wallet sustituía la navegación global | Bottom nav permanece montada | flujo Wallet | Correcto |
| G-05 | Global | Más | menú/sheet | Abrir/cerrar secciones | `moreOpen` | Parcial | Estado y semántica incompletos | `aria-expanded`, scrim, X y cierre tras navegar | navegador | Correcto |
| G-06 | Más | Entreno/Pomodoro/Metas/Salud/Configuración | botones | Abrir módulo real | `navigateSafely` | Parcial | Botones de maqueta | Conectados al `view` raíz | recorrido 5 módulos | Correcto |
| G-07 | Header | Notificaciones | icon button | Registrar permisos/dispositivo | `requestHabitFlowNotifications` | Parcial | Acción V2 no conectada | Reutiliza el servicio push global | auditoría estática | Correcto |
| G-08 | Global | Asistente de voz | botón flotante | Abrir asistente existente | `VoiceAssistant` compartido | Funciona | — | Conservado fuera de overlays V2 | navegador | Correcto |
| M-01 | Modales | Scrim/X/Cancelar/Escape | botones/teclado | Cerrar sin guardar | `FunctionalModal.onClose` | Parcial | Modales aislados y sin teclado | Componente único controlado | cierre manual + test estático | Correcto |
| M-02 | Modales | Guardar | submit | Validar y persistir | `ActionCenter.submit` | Roto | Formularios cerraban o no escribían | Tres formularios con `onSubmit`; validación HTML | crear cuenta/tarea/hábito | Correcto |
| P-01 | Panel | Captura rápida/Nueva tarea | botones | Crear tarea | `openAction('task')` → `onUpdateAgenda` | Roto | Decorativos | Formulario real con fecha/hora/categoría | tarea creada | Correcto |
| P-02 | Panel | Pomodoro/25/15/50/Iniciar | botones | Abrir temporizador | `navigate('pomodoro')` | Parcial | Acciones no navegaban | Ruta real | navegador | Correcto |
| P-03 | Panel | Nuevo hábito/Añadir hábito | botones | Crear hábito | `onAddHabit` | Roto | Sin formulario conectado | ActionCenter reutiliza store raíz | formulario | Correcto |
| P-04 | Panel | Nuevo gasto | botón | Registrar gasto | `onUpdateFinance` | Roto | Decorativo | Formulario contra cuentas/categorías reales | test estático | Correcto |
| P-05 | Panel | Tareas del día | cards clicables | Completar/desmarcar | `onUpdateAgenda` | Roto | Card sin propósito | Botón semántico actualiza fila | navegador | Correcto |
| P-06 | Panel | Hábitos pendientes | cards clicables | Completar/desmarcar | `onCompleteHabit` | Roto | Card sin propósito | Conectado al registro diario | navegador | Correcto |
| P-07 | Panel | Ver todo (Agenda/Hábitos/Finanzas/Logros) | botones | Navegar | `navigate` | Parcial | Navegación local inconsistente | Unificada | navegador | Correcto |
| P-08 | Panel | Jerarquía y tarjetas | layout | Escala compacta sin overflow | CSS solo `<=767px` | Excesivo | Una columna en 393 px y alturas heredadas | Dos columnas, gaps/padding/tipografía compactos | 393 y 768 | Correcto |
| H-01 | Hábitos | Semanal/Mensual | tabs | Cambiar período y datos | `period`, `offset` | Decorativo | Solo estado visual | Días y rango se recalculan | navegador | Correcto |
| H-02 | Hábitos | Anterior/Siguiente | icon buttons | Navegar fechas | `setOffset` | Roto | Sin cursor temporal | Cursor real; futuro deshabilitado | test estático | Correcto |
| H-03 | Hábitos | Checks diarios | botones | Marcar fecha | `onCompleteHabit(id,date)` | Parcial | Solo hoy | Fecha explícita; días futuros disabled | navegador | Correcto |
| H-04 | Hábitos | Nuevo hábito | formulario | Crear con categoría/color | `onAddHabit` | Roto | Sin persistencia | Formulario real | manual | Correcto |
| H-05 | Hábitos | Widget hidratación | switch | Mostrar/ocultar | `setHydrationWidgetEnabled` | Parcial | Switch local a la vista | Store sincronizado compartido | navegador/estático | Correcto |
| T-01 | Pomodoro | Enfoque/Descanso/Largo | tabs | Cambiar sesión | `selectMode` | Decorativo | Tabs sin contenido | Duración/etiqueta/estado cambian | navegador | Correcto |
| T-02 | Pomodoro | Play/Pause/Reset | icon buttons | Controlar un solo intervalo | `running`, `seconds` | Roto | Temporizador estático | Intervalo con cleanup y reset | conteo/pausa manual | Correcto |
| T-03 | Pomodoro | 25/15/50 min | botones | Cambiar tiempo | `selectDuration` | Roto | Decorativos | Reinicia duración elegida | navegador | Correcto |
| T-04 | Pomodoro | Sonido/alerta/aviso | botones/switch | Persistir preferencia | `onUpdateUser` | Parcial | Estado efímero | Guardado automático en usuario | estático | Correcto |
| T-05 | Pomodoro | Notas | textarea | Guardado automático | `onUpdateUser` | Roto | Input sin consumidor | Persistencia en `user.pomodoro` | estático | Correcto |
| T-06 | Pomodoro | Tareas/check/Añadir rápida | checkbox/botón | Completar o crear tarea | `onUpdateAgenda` | Roto | Lista aislada | Store Agenda real | manual | Correcto |
| A-01 | Agenda | Día/Semana/Mes/Agenda | tabs | Cambiar subvista | `useQuerySection('agenda')` | Decorativo | Sin subruta | URL e historial; Día usa el calendario semanal existente | navegador | Correcto |
| A-02 | Agenda | Anterior/Siguiente | icon buttons | Mover período | `cursor` | Roto | Sin acción | Cursor real | estático | Correcto |
| A-03 | Agenda | Nueva tarea | formulario | Crear evento/tarea | `onUpdateAgenda` | Roto | Botón de maqueta | ActionCenter | manual | Correcto |
| A-04 | Agenda | Filtros/chips/Limpiar/Aplicar | modal/botones | Filtrar lista | `filter`, `filters` | Parcial | Chips decorativos | Contenido filtrado y cierre controlado | navegador | Correcto |
| A-05 | Agenda | Filas de evento | cards clicables | Completar lo completable | `activate`/`onUpdateAgenda` | Roto | Sin handler | Activación conectada | estático | Correcto |
| A-06 | Agenda | Próximos eventos/Volver | botones/ruta | Abrir y salir | `agenda=upcoming/list` | Roto | Pantalla sin salida | Back lógico y URL | estático | Correcto |
| E-01 | Entreno | Hoy/Rutinas/Biblioteca/Progreso | tabs | Cambiar contenido | `useQuerySection('workout')` | Parcial | Estado solo visual | Subrutas y contenido real | navegador | Correcto |
| E-02 | Entreno | Filtros/buscador | chips/input | Filtrar dataset | `search`, `muscle` | Parcial | Dataset no consumido por V2 | Catálogo real filtrado | estático | Correcto |
| E-03 | Entreno | Cards de ejercicio/detalle/favorito | card/modal/botón | Abrir detalle y guardar favorito | `setDetail`, `onUpdateWorkout` | Roto | Cards decorativas | Modal real y favorito persistido | estático | Correcto |
| E-04 | Entreno | Nueva/eliminar rutina | formulario/botón | Crear o borrar con confirmación | `onUpdateWorkout` | Roto | Sin store | Rama `workoutData.routines` | estático | Correcto |
| E-05 | Entreno | Iniciar/Anterior/Siguiente/Finalizar | botones | Gestionar sesión | `activeSession` | Roto | Flujo simulado | Sesión e historial del store | estático | Correcto |
| E-06 | Entreno | Peso/reps/completar set | icon buttons | Actualizar serie | `adjustSet`, `toggleSet` | Roto | Inputs sin persistencia | Actualización inmediata en `workoutData` | estático | Correcto |
| E-07 | Entreno | Imágenes/GIF | medios | Carga diferida | dataset service + `loading="lazy"` | Parcial | Riesgo de carga masiva | Solo listas paginadas y lazy | test funcional | Correcto |
| W-01 | Wallet | Agregar/Cuentas/Movimientos/Categorías/Exportar | botones | Abrir subruta | `useQuerySection('wallet')` | Roto | Vistas internas secuestraban shell | URL por subruta y nav global permanente | recorrido Wallet | Correcto |
| W-02 | Wallet | Volver al resumen | icon button | Regreso lógico | `change('summary')` | Roto | No existía salida | Botón en cada subpantalla | recorrido Wallet | Correcto |
| W-03 | Wallet | Ingreso/Gasto/Transferencia | tabs/form | Guardar movimiento y balances | `addTx` → `onUpdateFinance` | Roto | Formulario de maqueta | IDs únicos; transferencia no cuenta como gasto | estático | Correcto |
| W-04 | Wallet | Nueva cuenta | formulario | Crear cuenta | ActionCenter → `onUpdateFinance` | Roto | Botón no guardaba | Cuenta real reflejada en la lista | prueba manual | Correcto |
| W-05 | Wallet | Movimientos: búsqueda/tipo | input/chips | Filtrar | `search`, `movementType` | Roto | Decorativo | Lista derivada del store | estático | Correcto |
| W-06 | Wallet | Categorías/Nueva categoría | tabs/form | Filtrar y crear | `categoryType`, `onUpdateFinance` | Roto | Sin persistencia | Store financiero compartido | estático | Correcto |
| W-07 | Wallet | COP/USD/EUR | botones | Cambiar presentación | `currency`, tasa existente | Decorativo | No mutaba valores | Conversión de presentación | navegador | Correcto |
| W-08 | Wallet | Exportar ahora | botón | Descargar CSV | `exportData` | Roto | Opciones decorativas no soportadas | Se eliminó Excel/PDF ficticio; CSV real | estático | Correcto |
| W-09 | Wallet | Navegador atrás/recarga/deep link | ruta | Restaurar subvista y permitir salida | `pushState/popstate` | Roto | Estado interno sin URL | Parámetro `wallet`, lista permitida y fallback | estático + navegador | Correcto |
| GOL-01 | Metas | Activas/Completadas/Sueños | tabs | Filtrar datos | `section` | Decorativo | Mismo contenido | Filtrado por estado | navegador | Correcto |
| GOL-02 | Metas | Nueva meta/Aportar | formularios | Crear y actualizar progreso | `onUpdateDreamGoals` | Roto | Botones sin guardado | IDs únicos y `updatedAt` al aportar | estático | Correcto |
| S-01 | Salud | +250/+500 ml | botones | Registrar agua | `addHydration` | Parcial | Vista aislada | Store/widget compartido | estático | Correcto |
| S-02 | Salud | Registrar cepillado | botón | Registrar cepillado | `addBrushing` | Parcial | Vista aislada | Store/widget compartido | estático | Correcto |
| S-03 | Salud | Marcar medicación | botón | Guardar toma | `onUpdateHealth` | Roto | Decorativo | `takenLogs` con ID único | estático | Correcto |
| C-01 | Configuración | Guardar nombre | formulario | Actualizar perfil | `onUpdateUser` | Roto | Campo no conectado | Submit real y feedback | estático | Correcto |
| C-02 | Configuración | Dark Puro/Claro Rosa | botones | Cambiar tema | `onUpdateUser(themeMode)` | Parcial | Control no conectado en V2 | Reutiliza tema global | estático | Correcto |
| C-03 | Configuración | Notificaciones | botón | Registrar push | servicio global | Parcial | Acción local | Función compartida segura | estático | Correcto |
| C-04 | Configuración | Cerrar sesión | botón | Salir de Clerk | `Clerk.signOut` | Roto | Decorativo | Sesión real | estático | Correcto |

## Pruebas automatizadas

- `scripts/test-mobile-functional.js`: parsea el JSX y falla ante botones sin acción, formularios sin `onSubmit`, `href="#"`, acciones vacías, `prompt/alert`, ausencia de rutas, ausencia de Escape, Wallet sin historial o navegación global, y Entreno sin lazy loading.
- `scripts/test-mobile-tablet.js`: protege shell, breakpoints, temas y ausencia de scroll horizontal.
- `scripts/test-pwa-update.js`: comprueba actualización automática y estrategia de red primero para archivos críticos.
- Suite existente: widgets/sincronización, Entreno, tipografía, sidebar y codificación.

## Evidencia manual en navegador real

| Flujo | Resultado |
|---|---|
| Panel → Hábitos → Agenda → Wallet | URLs válidas, bottom nav presente, overflow horizontal 0 |
| Wallet → Cuentas → Volver → Movimientos → Volver → Categorías | Todas las subrutas abren y ofrecen salida |
| Wallet → Hábitos | Sale del módulo y abre `view=habits` |
| Crear cuenta | `Cuenta auditada` aparece en la lista y se muestra feedback |
| Crear tarea | Aparece en el Panel y Agenda |
| Modal X/Cancelar | Cierra sin overlay residual |
| Pomodoro iniciar/pausar | Cambia de 25:00 a 24:59 y queda estable al pausar |
| Panel 393 px | Dos columnas, shell 1070 px, overflow horizontal 0 |
| Tablet 768 px | Dos columnas, overflow horizontal 0, navegación global presente |
| Desktop 1366 px | Shell V2 no montado; `.app-main` y sidebar desktop presentes; overflow horizontal 0 |
| Accesibilidad básica | Cero botones sin nombre accesible en las nueve pantallas recorridas |

Capturas:

- `test-results/mobile-tablet-functional-audit/panel-phone-393.png`
- `test-results/mobile-tablet-functional-audit/panel-tablet-768.png`

## Validación final

- Build: correcto (`pnpm run build`).
- Lint: no existe script `lint`; la validación equivalente es parser JSX + chequeo de codificación.
- Suite completa: correcta (`pnpm test`).
- Controles rotos encontrados: 49 familias parciales/rotas/decorativas.
- Controles corregidos: 49 familias.
- Eliminados: selector Excel/PDF y rango de fecha ficticio de Exportar; se mantuvo únicamente CSV porque es el formato realmente implementado.
- Desktop: no se cambió la estructura desktop; CSS funcional y compactación están protegidos por breakpoints V2.

No se añadió un segundo store ni datos mock para ocultar estados vacíos. Las operaciones mutan el mismo estado raíz usado por desktop; `saveData` conserva la política de caché local + sincronización Supabase ya existente.

## Corrección profesional de Inicio Mobile/Tablet — 2026-07-14

- Header: retirados logo y campana solo en V2; fecha española completa, racha y avatar real de Clerk/perfil con fallback gráfico.
- Progreso: combina tareas y hábitos del día y usa un indicador de 62–70 px.
- Captura rápida: abre el mismo `VoiceAssistant` y `voiceParseCommand` que desktop; admite texto, Enter, dictado, revisión y confirmación.
- Hábitos: `ActionCenter` monta el `HabitForm` desktop completo y conserva categorías personalizadas, icono, color, frecuencia, racha y recordatorios.
- Pomodoro rápido: inicia, pausa, reanuda y reinicia dentro del Panel; persiste `endAt`/tiempo restante en `user.quickPomodoro`, registra la sesión y comparte `user.pomodoro` con la vista completa.
- Finanzas rápidas: gasto diario, gasto/presupuesto mensual, porcentaje, gráfica de siete días y categoría principal se derivan de `financeData`; la categoría abre Movimientos filtrados.
- XP: nivel, XP total, XP del nivel, requisito y barra se calculan con la misma progresión de desktop.
- Plan del día: eliminado “Añadir tarea”; checks y navegación a Agenda permanecen.
- Capas: un modal abierto oculta temporalmente bottom nav y micrófono flotante para impedir intercepciones.
- Pruebas: `scripts/test-mobile-home.js` (24 comprobaciones) y recorrido visual `scripts/capture-mobile-home.cjs` en 360, 390, 430, 768, 820 y desktop 1440.
- Evidencias: `test-results/mobile-home-fixes/`.

## Corrección específica Inicio full-width — 2026-07-14

- Causa del teclado: `FunctionalModal` dependía de una función `onClose` recreada por `SharedCapture`; cada carácter limpiaba y repetía el efecto de foco, devolviéndolo al botón de cierre y sacándolo del `textarea`.
- Foco estable: el modal conserva `onClose` en una referencia, instala su ciclo de foco una sola vez y la captura usa borrador local, `textarea`/ref estable, `inputMode="text"`, `enterKeyHint="send"` y foco único al abrir.
- Panel: Plan del día, Hábitos pendientes, Pomodoro rápido y Finanzas rápidas viven en `m2-home-main-sections`, una columna flex de ancho completo entre 320 y 1180 px.
- Altura dinámica: se retiraron los recortes `.slice(0,3)` y las alturas mínimas heredadas; tareas y hábitos se muestran completos, hasta dos líneas por nombre, sin scroll interno.
- Contenido secundario: XP y Logros quedan en `m2-home-secondary`, fuera del contenedor principal solicitado.
- Prueba funcional/visual: `scripts/capture-home-full-width.cjs` comprueba foco carácter por carácter, borrado, tildes, números, rotación, Enter, cancelar/reabrir, 15 tareas, 15 hábitos, Pomodoro, configuración, Finanzas y desktop.
- Resoluciones verificadas: 320×568, 360×800, 390×844, 430×932, 768×1024, 820×1180, 1024×1366 y desktop 1440×900.
- Evidencias: `test-results/home-full-width-fixes/`.

## Pulido específico de Inicio Mobile/Tablet — 2026-07-14

- Progreso superior: anillo de 68 px en teléfono y 72 px en tablet, porcentaje de 21–23 px y etiqueta “Completado / hoy” separada en dos líneas dentro del círculo.
- Captura rápida: retirado únicamente el micrófono lateral; la barra ocupa ahora todo el ancho y conserva el intérprete textual y el asistente de voz flotante global.
- Intérprete: los campos Fecha/Hora tienen ancho flexible, `min-width: 0`, `max-width: 100%` y una columna en teléfono; se verificaron dentro del viewport a 320 px.
- Finanzas rápidas: eliminados categoría principal, monto y separador asociados; permanecen gasto diario, gráfica, presupuesto, porcentaje, barra y “Ver todo” con datos reales.
- Logros recientes: retirada la tarjeta solo del Inicio V2; el sistema global y desktop permanecen intactos.
- Racha: animación `m2-streak-flame` de 2.3 segundos, leve traslación/rotación/escala y alternativa sin movimiento mediante `prefers-reduced-motion`.
- Accesos rápidos: una sola fila compacta; Nueva tarea y Nuevo hábito abren formularios reales, Pomodoro navega a su sección y Nuevo gasto abre Wallet/Agregar con Gasto seleccionado.
- Evidencias y recorridos: `scripts/capture-home-polish.cjs` y `test-results/home-polish-fixes/` en 320, 360, 390, 430, 768, 820 y desktop 1440.
- Corrección V5: el desbordamiento de Fecha/Hora provenía de aplicar `width: 100%` con `box-sizing: content-box` a `voice-assistant-body`, `voice-draft-card` y los hijos del grid. Todos los contenedores relevantes usan ahora `border-box`; cada campo usa ancho automático dentro de su track y los inputs permanecen dentro de los límites del grid y la tarjeta en 320–820 px.
- Corrección V6: la regla definitiva vive en el CSS global de `VoiceAssistant`, no en el shell Mobile V2. Todo el árbol del diálogo usa `border-box`; los inputs `date/time` tienen límites físicos e inline explícitos y valor WebKit alineado. El recorrido automatizado valida por separado la barra “Captura algo rápido” y el micrófono flotante en 320, 360, 390, 430, 768 y 820 px. Evidencias: `quick-capture-date-time.png` y `quick-capture-date-time-audio.png`.
