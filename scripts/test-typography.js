const fs = require('fs');
const path = require('path');

const sourcePath = path.join(__dirname, '..', 'HabitTrackerApp.jsx');
const source = fs.readFileSync(sourcePath, 'utf8');
const failures = [];

const requiredTokens = [
  '--font-size-2xs',
  '--font-size-xs',
  '--font-size-sm',
  '--font-size-base',
  '--font-size-md',
  '--font-size-lg',
  '--font-size-xl',
  '--font-size-2xl',
  '--font-size-3xl',
  '--font-size-4xl',
  '--page-title-size',
  '--section-title-size',
  '--metric-size',
  '--control-height',
  '--control-height-mobile'
];

for (const token of requiredTokens) {
  if (!source.includes(token)) failures.push(`Missing typography token: ${token}`);
}

const forbiddenPatterns = [
  { label: 'inline fontSize below 11px', regex: /fontSize\s*:\s*(?:['"])?(?:[0-9](?:\.\d+)?|10(?:\.\d+)?)(?:px)?(?:['"])?\b/g },
  { label: 'CSS font-size below 11px', regex: /font-size\s*:\s*(?:[0-9](?:\.\d+)?|10(?:\.\d+)?)px\b/g },
  { label: 'CSS font shorthand below 11px', regex: /font\s*:\s*[^;{}]*(?:^|\s)(?:[0-9](?:\.\d+)?|10(?:\.\d+)?)px(?:\/[^\s;]+)?\b/gm },
  { label: 'legacy small font selector', regex: /\[style\*=['"]font-size:\s*(?:[0-9]|10)['"]\]/g }
];

for (const { label, regex } of forbiddenPatterns) {
  const matches = [...source.matchAll(regex)];
  if (matches.length) {
    const snippets = matches.slice(0, 5).map(match => match[0]).join(', ');
    failures.push(`${label}: ${snippets}`);
  }
}

if (!source.includes("font-size: 1rem !important")) {
  failures.push('Mobile form controls must remain at least 16px to prevent browser zoom.');
}

if (failures.length) {
  console.error(failures.join('\n'));
  process.exit(1);
}

console.log('Typography scale tests ok');
