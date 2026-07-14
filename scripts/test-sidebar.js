const fs = require('fs');
const path = require('path');

const source = fs.readFileSync(path.join(__dirname, '..', 'HabitTrackerApp.jsx'), 'utf8');
const failures = [];

const requiredContracts = [
  ['fixed collapsed width', 'const SIDEBAR_COLLAPSED_WIDTH = 72'],
  ['shared sidebar item', 'const SidebarItem ='],
  ['active page semantics', "aria-current={active ? 'page' : undefined}"],
  ['tooltip semantics', 'role="tooltip"'],
  ['keyboard tooltip support', 'onFocus={openTooltip}'],
  ['Escape handling', "event.key !== 'Escape'"],
  ['legacy storage cleanup', 'LEGACY_SIDEBAR_STORAGE_KEYS'],
  ['fixed content offset', 'marginLeft: SIDEBAR_COLLAPSED_WIDTH'],
  ['responsive navigation loaded', 'className="mobile-bottom-nav legacy-mobile-nav"'],
  ['new mobile navigation mounted', '<MobileBottomNav']
];

for (const [label, contract] of requiredContracts) {
  if (!source.includes(contract)) failures.push(`Missing ${label}: ${contract}`);
}

const forbiddenContracts = [
  ['expandable sidebar state', /const\s*\[\s*sidebarOpen\s*,\s*setSidebarOpen\s*\]/],
  ['desktop expansion button', /className=["']sidebar-toggle["']/],
  ['expanded desktop class', /className=[^\n]*sidebar-open/],
  ['variable desktop width', /const\s+sidebarWidth\s*=/]
];

for (const [label, pattern] of forbiddenContracts) {
  if (pattern.test(source)) failures.push(`Forbidden ${label}`);
}

if (failures.length) {
  console.error(failures.join('\n'));
  process.exit(1);
}

console.log('Collapsed sidebar tests ok');
