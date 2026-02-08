import { performance } from 'node:perf_hooks'

export const time = fn => {
  const start = performance.now()
  fn()
  return performance.now() - start
}

const sign = n => n > 0 ? '+' : ''

export class FPS {
  #view
  #frames
  #previous = null

  constructor(paper, { frames = 100 } = {}) {
    this.#view = paper.view
    this.#frames = frames
  }

  measure() {
    const ms = time(() => {
      for (let i = 0; i < this.#frames; i++)
        this.#view.update()
    })

    const fps = this.#frames / (ms / 1000)
    const delta = this.#previous
      ? ((fps - this.#previous) / this.#previous) * 100
      : null

    this.#previous = fps

    return {
      fps,
      delta,
      ms,
      toString: () => delta == null
        ? `${fps.toFixed(1)} fps`
        : `${fps.toFixed(1)} fps (${sign(delta)}${delta.toFixed(0)}%)`,
    }
  }

  reset() {
    this.#previous = null
  }
}
