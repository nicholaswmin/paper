# Overview

This folder is a PaperJS scratch experiment.  
Keep changes minimal and focused on the visual result.  

## standard usage

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

## advanced usage

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
