# Overview

This folder is a PaperJS scratch experiment.
Keep changes minimal and focused on the visual result.

Start by searching `docs/task.md` for the current task.
Maintain `docs/PROGRESS.md` with subtasks and a running log as you work.

> [!IMPORTANT]
> - Read `docs/CLASSES.md` before extending the class hierarchy.
> - If you need to change PaperJS core code:
>   - Copy `lib/paper-core.js` to `lib/paper-ext.js` and edit the copy.
>   - Record changes as concise bullets in `lib/CHANGELOG.md`.
>   - Match PaperJS idioms, architecture, and style exactly,
>     even if it conflicts with other local guidelines.
>   - Keep changes uniform with surrounding code
>     (naming, structure, placement).

## Workflow

1. Analyze existing idioms, patterns, and conventions.
2. Search `docs/task.md`, then restate the current task in `docs/PROGRESS.md`.
3. Plan changes carefully; double-check assumptions and affected areas.
4. Write tests that verify the change.
5. Implement; iterate until tests pass.
6. Audit all changes; clean up aggressively.

Treat tests as production code.
Keep them tidy and eliminate low-signal tests.

- One test, one assertion, one failure reason
- Attach fixtures to `t` via `beforeEach`
- Assert the minimum required; avoid full-object comparisons
- Test for keywords, not sentences (`/insufficient/`, not full message)
- Keep tests DAMP, not DRY
- Keep logic visible even if duplicated; do not pass `t.*` outside the test
- If you declutter into `test/utils/`, keep helpers generic;
  never hide domain logic in utilities

Maintain `docs/PROGRESS.md` throughout:
capture subtasks, keep a running log, and record key findings.

## Standard usage

Run a local server:

```bash
npm run dev
```

Update `lib/paper-core.js` (pinned URL):

```bash
curl -fsSL https://unpkg.com/paper@0.12.18/dist/paper-core.js -o lib/paper-core.js
```

Add a shape (expression-first):

```js
new paper.Path.Circle({
  center: paper.view.center,
  radius: 40,
  strokeColor: 'fuchsia',
  strokeWidth: 2,
})
```

## Advanced usage

Prefer PaperJS' native extension system (`extend`) for stateful entities.
Use `inject` only for surgical engine patching.

> [!IMPORTANT]
> Only use `extend`/`inject` when explicitly requested or absolutely required.
> Propose it first and get approval if needed.

### `extend` (custom class)

```js
paper.NeonPath = paper.Path.extend({
  _class: 'NeonPath',
  initialize: function NeonPath(...args) {
    paper.Path.apply(this, args)
  },
})
```

Key pointers:
- Set `_class` for JSON rehydration
- Use `method.base.call(this, ...)` in overrides

### `inject` (wrap and forward)

```js
paper.View.inject({
  _handleMouseEvent: function _handleMouseEvent(type, event, point) {
    return _handleMouseEvent.base.call(this, type, event, point)
  },
})
```

Key pointers:
- Keep wrappers tiny and predictable
- Default to forwarding; swallow only when required

## Testing

Tests run headless via `node:test` with skia-canvas.

```bash
npm test
```

### Headless stack

| Package | Role |
|---------|------|
| `paper` | rendering library |
| `canvas` | Paper's internal Node.js dependency |
| `jsdom` | DOM detection → `CanvasView` creation |
| `skia-canvas` | Skia-backed canvas (Chrome's renderer) |

> [!WARNING]
> Removing `jsdom` silently breaks rendering.
> Paper falls back to a non-rendering `View`.

### Paper access patterns

Paper wraps the skia `Canvas` in an `HTMLCanvasElement`.
Access rendering through Paper's internal context:

```js
const ctx = paper.view._context
const pixel = ctx.getImageData(x, y, 1, 1).data
const buf = ctx.canvas.toBuffer('image/png')
```

### Structure

```
test/
├── utils/
│   ├── assert.js        # custom assertions
│   └── performance.js   # FPS class, time utility
├── main.test.js         # correctness
└── bench.test.js        # performance
```

Import `./utils/assert.js` in tests that use custom assertions.

### Custom assertions

Define in `test/utils/assert.js` via `assert.register()`.
Import for side effects:

```js
import './utils/assert.js'

t.assert.fasterThan(t, fullRepaint, dirtyRepaint, { by: 2 })
t.assert.memory(t, fn, { max: 5 })
```

### Performance utilities

`FPS` tracks frame rate with delta between measurements:

```js
t.fps = new FPS(paper)

const baseline = t.fps.measure()
t.diagnostic(`baseline: ${baseline}`)

const after = t.fps.measure()
t.diagnostic(`after: ${after}`)  // "7200.1 fps (-18%)"
```

### Guidelines

- **Relative over absolute thresholds.**
  Absolute times test the machine; relative tests the optimization.
- **Keep actions visible in tests.**
  Fixtures generate data on `t`; test body shows what's measured.
- **Use `t.diagnostic()` for benchmark output.**
- **Use `t.scatter(n, fn)` for bulk creation.**
  Scatter generates random data; the callback shows shape creation:

```js
t.scatter(1000, ({ center, radius, color }) =>
  new t.paper.Path.Circle({
    center, radius, fillColor: color,
  })
)
```

## Library-fork usage

Follow the instructions in the callout at the top of this file.
