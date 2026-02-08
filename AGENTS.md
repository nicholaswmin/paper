# Overview

This folder is a PaperJS scratch experiment.
Keep changes minimal and focused on the visual result.

> [!IMPORTANT]
> - Read `docs/CLASSES.md` before extending the class hierarchy.
> - If extending `lib/paper-core.js`:
>   - Create a copy as `lib/paper-ext.js`.
>   - Maintain a list of library changes as concise bullets
>     in `lib/CHANGELOG.md`.
>   - Match PaperJS idioms, architecture, and code style
>     **exactly** — even if it violates guidelines below.
>   - Keep every change uniform with the surrounding code
>     in naming, structure, and placement.

## Workflow

1. Analyze existing idioms, patterns, and conventions.
2. Plan changes carefully; identify affected areas.
3. Think hard — double-check the plan, ensure seamless integration.
4. Perform changes; write tests if relevant.
5. Audit all changes comprehensively; clean up aggressively.

Maintain `docs/PROGRESS.md` throughout:
log the current task and your steps.
Tick off steps as you proceed.
Write down any key findings you think are valuable.

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

Use PaperJS’ native extension system (`extend`) for stateful entities.  
Use `inject` for surgical engine patching only with explicit need.  

> [!IMPORTANT]
> Only use inject/extend when explicitly requested or absolutely required.  
> Propose to user and obtain approval if needed.  

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

## Library-fork usage

Follow the instructions in the callout at the top of this file.
