# GitTimeline

A data-driven **git-graph timeline** for React. Give it a flat list of items with
real `start` / `end` dates and it renders a vertical timeline (the "main" spine)
with commit nodes. Any item whose dates **overlap** another automatically forks
into its own parallel branch column and — if it ended — merges back, just like a
git graph. **Input order doesn't matter**: it sorts and lays out lanes itself.

- 🌳 Automatic lane assignment from date overlaps (1 column when sequential, N when overlapping)
- 🎯 Pixel-aligned fork/merge connectors that stay glued at any card height
- 📱 Collapses to a plain chronological list on mobile
- 🎨 Fully themeable palette; bring your own card via `renderCard`
- 🧩 Zero app coupling — no i18n, no global CSS variables required
- 🪶 One small dependency assumption: Tailwind utility classes are available

## Install

Copy the `GitTimeline/` folder into your project. It expects Tailwind CSS to be
set up (utility classes are used for layout/typography).

## Usage

```jsx
import { GitTimeline } from './components/GitTimeline';

const items = [
  {
    id: 'main-job',
    title: 'Software Engineer',
    subtitle: 'ACME Corp',
    meta: '2023 – Present',
    location: 'Remote',
    description: ['Shipped X', 'Owned Y'],
    badges: ['main'],
    current: true,          // pulsing HEAD marker
    start: '2023-09-01',
    end: null,              // ongoing
  },
  {
    id: 'sabbatical',
    title: 'Open-source sabbatical',
    subtitle: 'Self-directed',
    meta: '2024',
    description: 'Overlaps the main role → renders as a branch.',
    badges: ['branch'],
    mergedLabel: 'merged → main',
    start: '2024-03-01',
    end: '2024-09-01',      // ended → merges back
  },
];

<GitTimeline items={items} />
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `items` | `Item[]` | — | **Required.** See item shape below. |
| `laneColors` | `string[]` | 5-hue palette | Colors indexed by lane (`[0]` = main spine). |
| `surfaceColor` | `string` | `#05050a` | Page background, used to punch the node halos. |
| `order` | `'desc' \| 'asc'` | `'desc'` | Display order. `desc` = newest first. |
| `mobileBreakpoint` | `number` | `768` | Width (px) below which it becomes a plain list. |
| `showArrow` | `boolean` | `true` | Draw the up-arrow cap at the top of the spine. |
| `renderCard` | `(item, ctx) => ReactNode` | — | Custom card renderer. `ctx = { color, isBranch }`. |
| `className` | `string` | `''` | Extra classes on the root. |

### Item shape

| Field | Type | Notes |
|-------|------|-------|
| `id` | `string \| number` | Unique. |
| `start` | `string \| Date` | Required. ISO date or `Date`. |
| `end` | `string \| Date \| null` | `null`/omitted = ongoing (holds its lane open). |
| `title`, `subtitle`, `meta`, `location` | `string` | Optional card text. |
| `description` | `string \| string[]` | String, or bullet list. |
| `icon` | `ReactNode` | Optional leading icon. |
| `badges` | `string[]` | Small pills next to the title. |
| `current` | `boolean` | Shows a pulsing `HEAD` marker. |
| `mergedLabel` | `string` | Chip text when a branch merges back. |
| `color` | `string` | Override this item's lane color. |

Extra fields you add are passed straight through to `renderCard`.

## Custom cards

```jsx
<GitTimeline
  items={items}
  renderCard={(item, { color, isBranch }) => (
    <article style={{ borderColor: color }} className="border p-4 rounded-lg">
      <h3 style={{ color }}>{item.title}</h3>
      <p>{item.description}</p>
    </article>
  )}
/>
```

## Layout util

`computeLanes(items, { order })` is exported separately — a pure, framework-agnostic
function returning `{ rows, ordered, maxLane }` if you want to build your own renderer.

## License

MIT.
