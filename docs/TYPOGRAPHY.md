# HabitFlow typography system

## Audit

- HabitFlow is a single-file React application. Global styles, themes and most shared UI patterns live in `HabitTrackerApp.jsx`; there is no Tailwind configuration or separate global stylesheet.
- The audit found more than 700 hardcoded declarations between 7 px and 12 px, plus small `font` shorthands that bypassed the original `font-size` search.
- The most affected surfaces were the sidebar, Agenda, finance tables, compact controls, badges, metadata and the hydration/brushing widgets.
- Several controls were between 20 px and 34 px high. Shared form controls now use 42 px, compact actions 36 px and mobile controls 44 px, with narrow exceptions for calendar/event controls and intentionally compact icon actions.

## Tokens

| Token | Default | Purpose |
| --- | ---: | --- |
| `--font-size-2xs` | 11 px | Tertiary metadata only |
| `--font-size-xs` | 12 px | Captions, tooltips and secondary metadata |
| `--font-size-sm` | 13 px | Labels, buttons and compact UI text |
| `--font-size-base` | 14 px | Body copy and standard controls |
| `--font-size-md` | 15 px | Emphasized UI copy |
| `--font-size-lg` | 16 px | Card titles |
| `--font-size-xl` | 18 px | Large card titles |
| `--font-size-2xl` | 20 px | Compact section headings |
| `--font-size-3xl` | 24 px | Section headings |
| `--font-size-4xl` | 30 px | Large headings |
| `--page-title-size` | 32–42 px | Responsive page titles |
| `--section-title-size` | 22–28 px | Responsive section titles |
| `--metric-size` | 24–32 px | Responsive primary metrics |

At 1600 px and wider, body text rises to 15 px. Mobile retains 14 px body copy, uses 16 px form controls to avoid browser zoom and applies a 44 px minimum touch height to standard buttons.

## Shared semantics

The reusable classes `text-page-title`, `text-section-title`, `text-card-title`, `text-body`, `text-secondary`, `text-metadata` and `text-metric` provide a consistent hierarchy. Shared rules also cover buttons, labels, inputs, selects, textareas, cards, rows, tables, dialogs, tooltips, badges and daily widgets.

Both Dark Puro and Claro Rosa use the same scale. Colors remain theme-owned; typography tokens do not alter HabitFlow's visual identity.

## Regression checks

Run `npm run test:typography` to verify required tokens, block font sizes below 11 px and preserve 16 px mobile form controls. Responsive screenshots live in `test-results/typography-redesign/`.
