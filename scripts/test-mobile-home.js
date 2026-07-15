const fs = require('fs');
const assert = require('assert');

const mobile = fs.readFileSync('MobileTabletV2.jsx', 'utf8');
const app = fs.readFileSync('HabitTrackerApp.jsx', 'utf8');
const css = fs.readFileSync('mobile-v2.css', 'utf8');

const between = (start, end) => mobile.slice(mobile.indexOf(start), mobile.indexOf(end));
const header = between('const MobileV2Header', 'const PRIMARY_NAV');
const home = between('const HomePage', 'const HabitsPage');
const capture = between('const SharedCapture', 'const QuickPomodoroCard');
const quickPomodoro = between('const QuickPomodoroCard', 'const HomePage');
const modal = between('const FunctionalModal', 'const ActionCenter');

assert(!header.includes('m2-brand'), 'El header móvil no debe incluir logo o marca HabitFlow');
assert(!header.includes('Notificaciones'), 'El header móvil no debe incluir campana');
assert(header.includes("toLocaleDateString('es-CO'"), 'La fecha debe usar locale español real');
assert(header.includes('aria-label="Abrir perfil"') && header.includes('<img'), 'El avatar debe mostrar imagen y abrir perfil');
assert(header.includes('generatedAvatar') && header.includes('onError'), 'El avatar necesita fallback generado y fallback final');
assert(home.includes('<ProgressRing value={pct} size={64}/>'), 'El indicador diario debe ser compacto y usar progreso real');
assert(capture.includes('habitflow-open-shared-capture'), 'Captura rápida debe abrir el intérprete compartido');
assert(capture.includes("event.key==='Enter'"), 'Captura rápida debe funcionar con Enter');
assert(capture.includes('inputRef') && capture.includes('onClose={close}'), 'Captura rápida debe conservar un nodo y callback de cierre estables');
assert(capture.includes('inputMode="text"') && capture.includes('enterKeyHint="send"'), 'Captura rápida debe declarar teclado móvil apropiado');
assert(modal.includes('onCloseRef') && modal.includes('}, []);'), 'El modal no debe repetir el autofocus al cambiar el borrador');
assert(app.includes("window.addEventListener('habitflow-open-shared-capture'"), 'VoiceAssistant debe recibir la captura compartida');
assert(app.includes('voiceParseCommand(clean, data)'), 'La captura debe reutilizar el parser real de desktop');
assert(capture.includes('Dictar captura rápida') && capture.includes('<Mic'), 'El micrófono de captura debe tener acción y nombre accesible');
assert(quickPomodoro.includes('quickPomodoro') && quickPomodoro.includes('endAt'), 'Pomodoro rápido debe persistir ejecución y recuperación');
assert(quickPomodoro.includes("running?'Pausar'"), 'Pomodoro rápido debe permitir pausar y reanudar');
assert(quickPomodoro.includes('Reiniciar Pomodoro'), 'Pomodoro rápido debe permitir reiniciar');
assert(quickPomodoro.includes('Configurar Pomodoro rápido') && quickPomodoro.includes('Guardar configuración'), 'Configuración Pomodoro debe abrir y guardar');
assert(!quickPomodoro.match(/onClick=\{\(\)=>navigate\('pomodoro'\)\}>[^<]*Iniciar/), 'Iniciar no debe navegar a Pomodoro');
const plan = home.slice(home.indexOf('Plan del día'), home.indexOf('Hábitos pendientes'));
assert(!plan.includes('Añadir tarea'), 'Plan del día no debe mostrar Añadir tarea');
assert(mobile.includes('handlers.HabitForm') && app.includes('HabitForm={HabitForm}'), 'Añadir hábito debe reutilizar el formulario desktop completo');
assert(home.includes('todaySpend') && home.includes('monthSpend') && home.includes('topCategory'), 'Finanzas rápidas debe derivar datos reales');
assert(!home.includes("width:'35%'"), 'Finanzas rápidas no debe usar porcentaje inventado');
assert(home.includes('xpPct') && home.includes('{xp} / {needed} XP'), 'XP debe mostrar progreso real y separado');
assert(home.includes('const agenda=allAgenda;') && !home.includes('allAgenda.slice('), 'Plan del día debe mostrar todas las tareas');
assert(home.includes('const pending=habits.filter') && !home.includes('.slice(0,3)'), 'Hábitos pendientes debe mostrar todos los registros');
assert(home.includes('m2-home-main-sections') && home.includes('m2-home-secondary'), 'Las cuatro cards principales deben estar separadas del bloque secundario');
assert(css.includes('@media(max-width:1180px)') && css.includes('@media(max-width:767px)'), 'Los cambios deben limitarse a Mobile/Tablet');
assert(css.includes('grid-template-columns:repeat(2,minmax(0,1fr))'), 'Los accesos rápidos deben usar dos columnas en teléfono');
assert(css.includes('.mobile-v2~.voice-assistant-launcher') && css.includes('background:linear-gradient(145deg,#ff263d'), 'El micrófono flotante debe tener fondo rojo');
assert(css.includes('.m2-home-main-sections{display:flex;flex-direction:column') && css.includes('max-height:none') && css.includes('overflow:visible'), 'Las cards principales deben ser de una columna y altura dinámica');

console.log('Inicio Mobile/Tablet profesional: 31 comprobaciones correctas.');
