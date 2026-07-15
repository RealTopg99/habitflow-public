const fs = require('fs');
const assert = require('assert');

const mobile = fs.readFileSync('MobileTabletV2.jsx', 'utf8');
const css = fs.readFileSync('mobile-v2.css', 'utf8');
const habits = mobile.slice(mobile.indexOf('const HabitMatrix'), mobile.indexOf('const PomodoroPage'));

assert(habits.includes('m2-habits-hero') && habits.includes('Buenos días,'), 'Hábitos necesita el nuevo header dedicado');
assert(habits.includes('m2-premium-habit') && habits.includes('m2-habit-matrix'), 'Cada hábito debe usar tarjeta y matriz visual');
assert(!habits.includes('m2-habit-table') && !habits.includes('m2-metrics-3'), 'El dashboard y tabla semanal antiguos no deben existir en Hábitos V2');
assert(habits.includes('m2-habits-fab') && habits.includes("openAction('habit')"), 'El FAB debe abrir el formulario real de hábito');
assert(habits.includes('onCompleteHabit(habit.id)') && habits.includes('m2-habit-xp'), 'Completar debe conservar la mutación real y feedback XP');
assert(habits.includes('onToggleHydrationWidget') && habits.includes('role="switch"'), 'El widget compacto debe conservar su interruptor real');
assert(habits.includes("period==='month'") && habits.includes('m2-habit-month-note'), 'La vista mensual debe usar matriz visual sin calendario');
assert(habits.includes('data.user?.xp') && habits.includes('m2-habits-summary'), 'El resumen final debe usar XP y datos reales');
assert(css.includes('.m2-premium-habit') && css.includes('.m2-habit-matrix') && css.includes('@keyframes m2-habit-complete'), 'El estilo y las animaciones deben existir solo para Mobile/Tablet');
assert(css.includes('@media(max-width:1180px)') && css.includes('@media(prefers-reduced-motion:reduce)'), 'El rediseño debe limitarse a Mobile/Tablet y respetar movimiento reducido');

console.log('Rediseño de Hábitos Mobile/Tablet: 10 comprobaciones correctas.');
