# Paper.js Classes

Paper.js defines most of its public API through Straps.js constructors.
It uses `Base.extend()` and injection, not ES6 `class`.

## Scope

- Repo: [paperjs/paper.js][paperjs-repo]
- Branch: `develop`
- Commit: `92775f5279c05fb7f0a743e9e7fa02cd40ec1e70`
- Files: `src/**/*.js`
- Extraction rule: `var Name = Base.extend(...)` or `var Name = Parent.extend(...)`

## Inheritance Model

Paper.js inlines Straps.js before loading its own core types.
See `src/paper.js:35-43`.

Paper.js uses `Function#base` for override chains and super-calls.
`CanvasView#remove()` calls `remove.base.call(this)`.
See `src/view/CanvasView.js:63-66`.

## Mixins

`Emitter` is a plain object used as a mixin.
See `src/core/Emitter.js:18`.

`Emitter` overrides `inject()` to synthesize `on*` accessors from `_events`.
See `src/core/Emitter.js:132-171`.

## Class Registry

`Base.exports` maps `_class` strings to constructors.
`Base.extend()` uses it for deserialization and `PaperScope` injection.
`Base.extend()` only registers the first constructor per `_class` value.
See `src/core/Base.js:104-114`.

The build injects `Base.exports` into `PaperScope` and constructs `paper`.
See `src/export.js:19-31`.

The CommonJS export avoids checking `module.exports` after Straps loads.
See `src/export.js:47-51`.

## Tree

```
`Base`
├─ `Color`
├─ `Curve`
├─ `CurveLocation`
├─ `Event`
│  ├─ `KeyEvent`
│  ├─ `MouseEvent`
│  └─ `ToolEvent`
├─ `Formatter`
├─ `Gradient`
├─ `GradientStop`
├─ `HitResult`
├─ `Item` (`Emitter`)
│  ├─ `Group`
│  │  └─ `Layer`
│  ├─ `PathItem`
│  │  ├─ `CompoundPath`
│  │  └─ `Path`
│  ├─ `Raster`
│  ├─ `Shape`
│  ├─ `SymbolItem`
│  └─ `TextItem`
│     └─ `PointText`
├─ `Line`
├─ `Matrix`
├─ `PaperScope`
├─ `PaperScopeItem` (`Emitter`)
│  ├─ `Project`
│  └─ `Tool`
├─ `PathFitter`
├─ `PathFlattener`
├─ `Point`
│  ├─ `LinkedPoint`
│  └─ `SegmentPoint`
├─ `ProxyContext`
├─ `Rectangle`
│  └─ `LinkedRectangle`
├─ `Segment`
├─ `Size`
│  └─ `LinkedSize`
├─ `Style`
├─ `SymbolDefinition`
├─ `Tween` (`Emitter`)
└─ `View` (`Emitter`)
   └─ `CanvasView`
```

## Notes

- `Item.extend()` merges `_serializeFields` during subclassing.
  See `src/item/Item.js:31-36`.
- `PathItem.create()` chooses `Path` vs `CompoundPath` based on input shape.
  See `src/path/PathItem.js:34-89`.
- `beans: true` forces bean accessor generation for some types.
  See `src/path/PathItem.js:26-28`.
- `PaperScopeItem` docs list `View`, but `View` extends `Base`.
  See `src/core/PaperScopeItem.js:16-18` and `src/view/View.js:22`.
- `ProxyContext` returns `Base.extend(fields)` from an IIFE.
  See `src/canvas/ProxyContext.js:24` and `src/canvas/ProxyContext.js:101`.
- `LinkedPoint` and `SegmentPoint` override mutation to notify an owner.
  See `src/basic/Point.js:1026-1081` and `src/path/SegmentPoint.js:13-54`.
- Some injected globals are plain objects, not `Base` subclasses.
  `Http` is one example.
  See `src/net/Http.js:13`.

## Links

- [Paper.js][paperjs]
- [Paper.js repository][paperjs-repo]

[paperjs]: http://paperjs.org/
[paperjs-repo]: https://github.com/paperjs/paper.js
