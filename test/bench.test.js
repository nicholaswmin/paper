import { test } from 'node:test'
import { Canvas } from 'skia-canvas'
import paper from 'paper'
import { FPS } from './utils/performance.js'
import './utils/assert.js'

test('performance', async t => {
  t.beforeEach(t => {
    paper.setup(new Canvas(200, 200))
    t.paper = paper
    t.fps = new FPS(paper)

    t.scatter = (n, fn) =>
      Array.from({ length: n }, () => fn({
        center: [Math.random() * 200, Math.random() * 200],
        radius: 5 + Math.random() * 20,
        color: `hsl(${Math.random() * 360}, 80%, 60%)`,
      }))
  })

  await t.test('fps baseline', t => {
    t.scatter(1000, ({ center, radius, color }) =>
      new t.paper.Path.Circle({
        center, radius, fillColor: color,
      })
    )

    ;['', '--- fps ---', '']
      .forEach(s => t.diagnostic(s))

    const baseline = t.fps.measure()
    t.diagnostic(`baseline: ${baseline}`)

    t.scatter(500, ({ center, radius, color }) =>
      new t.paper.Path.Circle({
        center, radius, fillColor: color,
      })
    )

    const after = t.fps.measure()
    t.diagnostic(`+500 items: ${after}`)

    t.diagnostic('')
  })
})
