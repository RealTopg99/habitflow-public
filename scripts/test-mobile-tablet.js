const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');
const assert = (condition, message) => { if (!condition) throw new Error(message); };

const shell = read('MobileTabletV2.jsx');
const styles = read('mobile-v2.css');
const app = read('HabitTrackerApp.jsx');
const index = read('index.html');

assert(shell.includes('MobileTabletV2App'), 'Falta el shell Mobile/Tablet V2.');
assert(shell.includes("matchMedia('(max-width: 1180px)')"), 'Falta el corte compacto V2.');
assert(shell.includes('data-testid="mobile-tablet-v2-shell"'), 'Falta el contrato de prueba del shell V2.');
assert(shell.includes('MobileV2BottomNav'), 'Falta la navegación inferior V2.');
assert(shell.includes('MobileV2MoreSheet'), 'Falta la hoja Más de V2.');
assert(styles.includes('@media(max-width:1180px)'), 'Falta el breakpoint tablet.');
assert(styles.includes('@media(max-width:767px)'), 'Falta el breakpoint teléfono.');
assert(styles.includes('overflow-x:clip'), 'Falta la protección contra scroll horizontal.');
assert(app.includes('if (responsiveViewport.isMobileTablet)'), 'La app no separa el árbol compacto del desktop.');
assert(app.includes('<MobileTabletV2App'), 'La app no monta Mobile/Tablet V2.');
assert(app.includes('desktop-topbar'), 'La versión desktop no quedó preservada.');
assert(index.includes('mobile-v2.css?v='), 'La hoja V2 no tiene versión de caché.');
assert(index.includes('MobileTabletV2.jsx'), 'El módulo V2 no se carga al iniciar.');
assert(!fs.existsSync(path.join(root, 'MobileResponsive.jsx')), 'La implementación móvil V1 todavía existe.');
assert(!fs.existsSync(path.join(root, 'mobile-tablet.css')), 'La hoja móvil V1 todavía existe.');
assert(!app.includes('legacy-mobile-nav'), 'Queda navegación móvil legacy en el árbol principal.');

console.log('Mobile/Tablet V2: OK');
