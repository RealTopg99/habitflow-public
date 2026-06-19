const fs = require('fs');
const path = require('path');
const parser = require('@babel/parser');

const ROOT = path.resolve(__dirname, '..');
const FILES = ['HabitTrackerApp.jsx'];
const BAD_TEXT = /[ÃÂ�]|\uFFFD|â(?:€|€¦|„|ˆ)|\bt\?\.\b|\bs \? te\b|\bqued \? suscrito\b|[A-Za-zÁÉÍÓÚÜÑáéíóúüñ0-9)]\s+\?\s+[A-Za-zÁÉÍÓÚÜÑáéíóúüñ0-9(]/;
const ALLOWED_REPAIR_SAMPLES = new Set([
  't?.',
  ' t? ',
  's ? te',
  'qued ? suscrito',
  '  ? ',
  ' ? ',
]);

const issues = [];

function inspectText(file, loc, value) {
  if (typeof value !== 'string') return;
  if (loc?.start?.line >= 990 && loc?.start?.line <= 1005) return;
  const text = value.replace(/\s+/g, ' ').trim();
  if (!text || text === '\uFFFD' || text.startsWith('http') || ALLOWED_REPAIR_SAMPLES.has(value)) return;
  if (BAD_TEXT.test(text)) {
    issues.push(`${file}:${loc?.start?.line || '?'} texto sospechoso: ${JSON.stringify(text.slice(0, 140))}`);
  }
}

function walk(node, file) {
  if (!node || typeof node !== 'object') return;
  if (node.type === 'StringLiteral') inspectText(file, node.loc, node.value);
  if (node.type === 'TemplateElement') inspectText(file, node.loc, node.value?.cooked || node.value?.raw);
  if (node.type === 'JSXText') inspectText(file, node.loc, node.value);
  for (const key of Object.keys(node)) {
    if (key === 'loc' || key === 'start' || key === 'end') continue;
    const child = node[key];
    if (Array.isArray(child)) child.forEach(item => walk(item, file));
    else if (child && typeof child === 'object') walk(child, file);
  }
}

for (const file of FILES) {
  const fullPath = path.join(ROOT, file);
  const code = fs.readFileSync(fullPath, 'utf8');
  const ast = parser.parse(code, { sourceType: 'script', plugins: ['jsx'] });
  walk(ast, file);
}

if (issues.length) {
  console.error('Se encontraron posibles textos dañados:');
  issues.forEach(issue => console.error(`- ${issue}`));
  process.exit(1);
}

console.log('Text encoding check ok');
