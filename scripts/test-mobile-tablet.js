const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const assert = (condition, message) => { if (!condition) throw new Error(message); };

const responsive = read('MobileResponsive.jsx');
const styles = read('mobile-tablet.css');
const app = read('HabitTrackerApp.jsx');
const index = read('index.html');

assert(responsive.includes('MobileAppShell'), 'Falta el shell responsive compartido.');
assert(responsive.includes('MobileHeader'), 'Falta el encabezado responsive compartido.');
assert(responsive.includes('MobileBottomNav'), 'Falta la navegación inferior responsive.');
assert(responsive.includes('global.HabitFlowResponsive'), 'El módulo responsive no está registrado.');
assert(styles.includes('@media (max-width:1180px)'), 'Falta el breakpoint de tablet.');
assert(styles.includes('@media (max-width:767px)'), 'Falta el breakpoint de teléfono.');
assert(styles.includes('overflow:clip'), 'El shell no protege contra desbordamiento horizontal.');
assert(styles.includes('minmax(0,1fr)'), 'Las rejillas no permiten encoger su contenido.');
assert(app.includes('<MobileAppShell view={view}>'), 'La app no usa el shell responsive.');
assert(app.includes('desktop-topbar'), 'El encabezado desktop no quedó preservado.');
assert(app.includes('<MobileBottomNav'), 'La app no monta la navegación responsive.');
assert(index.includes('mobile-tablet.css?v='), 'La hoja responsive no tiene versión de caché.');
assert(index.includes('MobileResponsive.jsx'), 'El módulo responsive no se carga al iniciar.');

console.log('Responsive móvil/tablet: OK');
