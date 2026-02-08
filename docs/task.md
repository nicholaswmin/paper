## task

> implement *tile-based* dirty-rectangles
> redraw optimisation directly in the library.


Problem: Any localised mutation redraws the entire
canvas.
Solution: Divide the canvas into tile canvases.
On mutation, redraw only the affected tiles.
Rules:

Grid of CSS-positioned tile <canvas> elements,
original canvas hidden.
Dynamic tile size.
On mutation: mark tiles intersecting old + new
bounds as dirty.
On frame: redraw only dirty tiles. Clean tiles
cost nothing.
Pan/zoom/resize: full redraw. No special handling.
Instrument with performance.now().
No spatial index for now

---

- analyze paperjs internals extensively before you begin
- match the current archicteture in a seamless manner
  match paperjs idioms, code style etc
- take advantage of the testing setup to measure progress
