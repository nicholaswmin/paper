import { strict as assert } from 'node:assert'
import { assert as testAssert } from 'node:test'
import { time } from './performance.js'

const heap = () => {
  global.gc?.()
  return process.memoryUsage().heapUsed
}

const mb = bytes => (bytes / 1024 / 1024).toFixed(2)

testAssert.register('fasterThan', (t, slow, fast, { by = 2 } = {}) => {
  const slowMs = time(slow)
  const fastMs = time(fast)
  const ratio = slowMs / fastMs

  ;['', '--- benchmarks ---', '']
    .forEach(s => t.diagnostic(s))

  t.diagnostic(`full:  ${slowMs.toFixed(2)}ms`)
  t.diagnostic(`dirty: ${fastMs.toFixed(2)}ms (${ratio.toFixed(1)}x faster)`)
  t.diagnostic('')

  assert.ok(
    ratio >= by,
    `expected >= ${by}x speedup, got ${ratio.toFixed(1)}x` +
    ` (full: ${slowMs.toFixed(2)}ms, dirty: ${fastMs.toFixed(2)}ms)`
  )
})

testAssert.register('memory', (t, fn, { max } = {}) => {
  const before = heap()
  fn()
  const delta = process.memoryUsage().heapUsed - before
  const deltaMb = mb(delta)

  t.diagnostic(`heap: +${deltaMb}MB`)

  if (max != null)
    assert.ok(
      delta / 1024 / 1024 <= max,
      `heap grew ${deltaMb}MB (max: ${max}MB)`
    )
})
