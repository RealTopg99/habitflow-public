const fs = require('fs');
const parser = require('@babel/parser');

const source = fs.readFileSync('MobileTabletV2.jsx', 'utf8');
const ast = parser.parse(source, { sourceType: 'script', plugins: ['jsx'] });
const failures = [];
let visibleButtons = 0;
let formControls = 0;
let forms = 0;

const visit = node => {
  if (!node || typeof node !== 'object') return;
  if (node.type === 'JSXElement' && node.openingElement.name?.name === 'button') {
    visibleButtons += 1;
    const attrs = node.openingElement.attributes || [];
    const has = name => attrs.some(attr => attr.type === 'JSXAttribute' && attr.name?.name === name);
    const delegatesProps = attrs.some(attr => attr.type === 'JSXSpreadAttribute');
    const type = attrs.find(attr => attr.type === 'JSXAttribute' && attr.name?.name === 'type')?.value?.value;
    if (!has('onClick') && !has('disabled') && type !== 'submit' && !delegatesProps) {
      failures.push(`Botón sin comportamiento en línea ${node.loc.start.line}`);
    }
  }
  if (node.type === 'JSXElement' && node.openingElement.name?.name === 'Button') {
    const attrs = node.openingElement.attributes || [];
    const has = name => attrs.some(attr => attr.type === 'JSXAttribute' && attr.name?.name === name);
    const type = attrs.find(attr => attr.type === 'JSXAttribute' && attr.name?.name === 'type')?.value?.value;
    if (!has('onClick') && !has('disabled') && type !== 'submit') failures.push(`Button sin comportamiento en línea ${node.loc.start.line}`);
  }
  if (node.type === 'JSXElement' && ['input', 'select', 'textarea'].includes(node.openingElement.name?.name)) {
    formControls += 1;
    const attrs = node.openingElement.attributes || [];
    const has = name => attrs.some(attr => attr.type === 'JSXAttribute' && attr.name?.name === name);
    if (node.openingElement.name.name !== 'input' && !has('name') && !has('value')) {
      failures.push(`Control de formulario sin vínculo en línea ${node.loc.start.line}`);
    }
  }
  if (node.type === 'JSXElement' && node.openingElement.name?.name === 'form') {
    forms += 1;
    const attrs = node.openingElement.attributes || [];
    if (!attrs.some(attr => attr.type === 'JSXAttribute' && attr.name?.name === 'onSubmit')) {
      failures.push(`Formulario sin onSubmit en línea ${node.loc.start.line}`);
    }
  }
  for (const key of Object.keys(node)) {
    if (['loc', 'start', 'end'].includes(key)) continue;
    const value = node[key];
    if (Array.isArray(value)) value.forEach(visit);
    else if (value && typeof value === 'object') visit(value);
  }
};

visit(ast);
if (/global\.(prompt|alert)\s*\(/.test(source)) failures.push('Quedan prompt/alert de prueba');
if (/onClick=\{\s*\(\)\s*=>\s*\{\s*\}\s*\}/.test(source)) failures.push('Queda un onClick vacío');
if (/href=["']#["']/.test(source)) failures.push('Queda un enlace decorativo');
if (!source.includes("useQuerySection('wallet'")) failures.push('Wallet no conserva subrutas en historial');
if (/view\s*!==\s*['"]finance['"]/.test(source)) failures.push('Wallet aún oculta la navegación global');
if (!source.includes('<MobileV2BottomNav')) failures.push('Falta la navegación global móvil');
for (const route of ['dashboard', 'habits', 'agenda', 'finance', 'workout', 'pomodoro', 'dreams', 'health', 'settings']) {
  if (!source.includes(`view==='${route}'`) && !source.includes(`id: '${route}'`) && !source.includes(`id:'${route}'`)) {
    failures.push(`Falta el flujo móvil ${route}`);
  }
}
for (const walletRoute of ['summary', 'add', 'accounts', 'movements', 'categories', 'export']) {
  if (!source.includes(`section==='${walletRoute}'`) && walletRoute !== 'summary') failures.push(`Falta la subruta Wallet ${walletRoute}`);
}
if (!source.includes("document.addEventListener('keydown', key)")) failures.push('Los diálogos no escuchan Escape');
if (!/history\[[^\]]*['"]pushState['"][^\]]*\]|history\.pushState/.test(source)) failures.push('Las subrutas no actualizan el historial');
if (!source.includes('loading="lazy"')) failures.push('Entreno no conserva carga diferida de medios');

if (failures.length) {
  console.error(failures.join('\n'));
  process.exit(1);
}
console.log(`Auditoría funcional estática correcta: ${visibleButtons} botones JSX, ${formControls} controles de formulario y ${forms} formularios con comportamiento explícito.`);
