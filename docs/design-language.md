# Paddock — design language

A warm, turf-sport visual system: credible and focused, like a sports-stats
instrument rather than a marketing page. Two coherent themes (warm light + warm
dark). All tokens live in `frontend/src/index.css` and are wired into the
Tailwind v4 theme, so components should use **semantic utilities**, never raw
palette colors (`bg-gray-100`, `text-blue-600`, …).

## Color roles

The single rule that keeps the UI coherent:

| Role | Meaning | Token / utilities |
| --- | --- | --- |
| **Green** | Identity / surfaces / emphasis — the "turf". Top bar, logo, headings emphasis, active rails, the affinity total. | `brand`, `brand-emphasis`, `brand-subtle`, `brand-foreground` → `bg-brand`, `text-brand`, `bg-brand-subtle`, `border-brand` |
| **Brass** | Interaction. Primary buttons, links, focus rings, selected state. If it's a primary action, it's brass. | `primary`, `primary-emphasis`, `ring` → `bg-primary`, `text-primary`, `ring-ring` |
| **Spark colors** | Data only. Factor chips/badges, never chrome. Game-faithful. | `spark-{blue,pink,green,amber,white}` + `-bg` / `-fg` |
| **Neutrals** | Page, surfaces, text, borders. Warm-tinted, not pure gray. | `background`, `card`, `secondary`, `muted`, `accent`, `border`, `border-strong` |
| **States** | Status feedback + affinity tiers. | `success` (green), `warning` (amber), `danger`/`destructive` (red) |

Brand green and spark-green are deliberately different shades (forest
`#1e6b43` vs. limey `#639922`) so chrome and data never read as the same thing.

## Migration mapping (raw utility → token)

When refactoring a component, translate hardcoded colors like this:

| Old (raw) | New (token) |
| --- | --- |
| `bg-white`, `bg-gray-50/100` (surfaces) | `bg-card` / `bg-secondary` |
| page backgrounds `bg-gray-50/100` | `bg-background` |
| `bg-gray-100/200` (subtle fills, hover) | `bg-muted` / `bg-accent` |
| `text-gray-800/900`, `text-black` | `text-foreground` |
| `text-gray-500/600` | `text-muted-foreground` |
| `border-gray-200/300` | `border-border` (or `border-border-strong` for emphasis) |
| `dark:*` color variants | **delete** — tokens already invert |
| primary action buttons (any color) | `bg-primary text-primary-foreground` |
| links / interactive accents | `text-primary` |
| focus rings | `ring-ring` |
| brand emphasis / logo / active | `text-brand` / `bg-brand` |
| `bg-blue-*` / `text-blue-*` (stat spark) | `bg-spark-blue-bg text-spark-blue-fg` (chip) / `text-spark-blue` |
| `bg-pink-*` (aptitude spark) | `spark-pink` family |
| `bg-green-*` (skill spark) | `spark-green` family |
| `bg-amber-*` / `text-amber-*` (stars, levels) | `spark-amber` family |
| destructive / delete | `text-destructive` / `bg-destructive` |
| affinity low / mid / high icons | `text-danger` / `text-warning` / `text-success` |

Delete every `dark:` color utility — the `.dark` token values handle both modes.
Keep `dark:` only for the rare non-color exception (none expected).

## Form & density

- **Radius**: 4 steps only. `rounded-md` (8px) chips/inputs · `rounded-lg`
  (10px) buttons · `rounded-xl` (14px) cards & dialogs · `rounded-full` pills &
  avatars. No other rounding utilities.
- **Borders**: 1px hairline everywhere (`border border-border`). The 2px
  **brass** ring (`ring-2 ring-primary`) is the only exception, reserved for the
  "selected" state.
- **Elevation**: flat. Cards carry a border, not a shadow. Only overlays
  (dialog, popover) get one soft shadow (shadcn default).
- **Density**: comfortable. 36px controls, 12–16px (`p-3`/`p-4`) card padding,
  on Tailwind's 4px spacing scale used consistently.

## Typography

- **Display** (`font-display`, Archivo Variable): all headings (`h1`–`h6` get it
  automatically), the affinity total, avatar initials, primary section titles.
  Sizes ~28 / 22 / 18px, weight 500–600.
- **Body** (`font-sans`, Inter Variable): everything else, 14px base / 13px
  secondary / 12px micro.
- **Numbers**: add `tabular-nums` to stat readouts and columns.
- **Scoreboard labels**: the `.scoreboard-label` utility (uppercase, tracked,
  11px, muted) for stat/section labels like AFFINITY, SPARK PROCS.

## Signature touches

- Breeding-tree canvas uses a faint turf hairline grid
  (`.grid-pattern-light` / `.grid-pattern-dark`), restyled from the old blue grid.
- Primary actions are solid brass with dark text; secondary actions are
  outline (`border-border`) on transparent.
