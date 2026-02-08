import { test } from 'node:test'
import { Canvas } from 'skia-canvas'
import paper from 'paper'

test('headless paper + skia-canvas', async t => {
  t.beforeEach(t => {
    paper.setup(new Canvas(200, 200))
    t.paper = paper
  })

  await t.test('creates a circle', t => {
    const circle = new t.paper.Path.Circle({
      center: [100, 100],
      radius: 40,
      fillColor: 'fuchsia',
    })

    t.assert.ok(circle, 'circle exists')
    t.assert.strictEqual(circle.className, 'Path')
  })

  await t.test('renders pixels', t => {
    new t.paper.Path.Circle({
      center: [100, 100],
      radius: 40,
      fillColor: 'red',
    })

    t.paper.view.update()

    const ctx = t.paper.view._context
    const pixel = ctx.getImageData(100, 100, 1, 1).data
    t.assert.ok(pixel[0] > 200, 'red channel present')
    t.assert.ok(pixel[1] < 50, 'green channel low')
    t.assert.ok(pixel[2] < 50, 'blue channel low')
  })

  await t.test('exports PNG', t => {
    new t.paper.Path.Circle({
      center: [100, 100],
      radius: 40,
      fillColor: 'fuchsia',
      strokeColor: 'white',
      strokeWidth: 2,
    })

    t.paper.view.update()

    const buf = t.paper.view._context.canvas
      .toBuffer('image/png')
    t.assert.ok(buf.length > 100, 'PNG has content')
    t.assert.ok(
      buf[0] === 0x89 && buf[1] === 0x50,
      'valid PNG header'
    )
  })
})
