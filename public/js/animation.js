let state = 'idle'
let idleTime = 0
let settleTime = 0
let flipData = null
// π/2 = heads cap points toward camera (+Z); 3π/2 = tails cap points toward camera
let faceBase = Math.PI / 2
let onCompleteFn = () => {}
let keyLightBase = 4.8  // matches dark/candlelight default in scene.js

export function setKeyLightBase(intensity) {
  keyLightBase = intensity
}

export function setOnComplete(fn) {
  onCompleteFn = fn
}

export function getState() {
  return state
}

export function resetIdle() {
  faceBase = Math.PI / 2
  idleTime = 0
}

export function startFlip(coin, keyLight) {
  if (state !== 'idle') return

  const result = Math.random() < 0.5 ? 'heads' : 'tails'
  const totalSpins = Math.floor(Math.random() * 4) + 6   // 6–9 full rotations
  const targetRotation = totalSpins * Math.PI * 2 + (result === 'tails' ? Math.PI : 0)

  flipData = { result, targetRotation, elapsed: 0, duration: 2.2 }
  state = 'flipping'
}

function easeInOutCubic(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
}

export function tick(coin, keyLight, dt) {
  if (!coin) return

  if (state === 'idle') {
    idleTime += dt
    coin.position.x  = Math.sin(idleTime * 0.38) * 0.12  // lateral sway
    coin.rotation.z  = Math.sin(idleTime * 0.38) * 0.06  // matching pendulum tilt
    coin.rotation.y  = Math.sin(idleTime * 0.27) * 0.04  // barely-there turn ±2°
    coin.rotation.x  = faceBase + Math.sin(idleTime * 0.24) * 0.025
    coin.position.y  = Math.sin(idleTime * 0.55) * 0.025 // subtle float
    keyLight.position.x = 3 + Math.sin(idleTime * 0.3) * 0.5

  } else if (state === 'flipping') {
    flipData.elapsed += dt
    const progress = Math.min(flipData.elapsed / flipData.duration, 1)
    const easedProgress = easeInOutCubic(progress)

    coin.rotation.x = faceBase + easedProgress * flipData.targetRotation
    coin.position.y = Math.sin(progress * Math.PI) * 1.4
    coin.position.z = Math.sin(progress * Math.PI) * 0.3
    coin.rotation.y += dt * (3 - easedProgress * 2.5)

    // Intensity spike in final 8%
    if (progress > 0.92) {
      const t = (progress - 0.92) / 0.08
      keyLight.intensity = keyLightBase + Math.sin(t * Math.PI) * 3.0
    }

    if (progress >= 1) {
      faceBase = flipData.result === 'tails' ? Math.PI * 3 / 2 : Math.PI / 2
      coin.rotation.x = faceBase
      // Leave y/z rotations for settling to decay smoothly — snapping them here
      // creates a visible jump from the accumulated spin to zero.
      coin.position.set(0, 0, 0)
      keyLight.intensity = keyLightBase

      settleTime = 0
      state = 'settling'
    }

  } else if (state === 'settling') {
    settleTime += dt
    const t = settleTime / 0.8

    if (t < 1) {
      coin.position.y = Math.sin(t * Math.PI * 5) * Math.exp(-t * 8) * 0.08
      coin.rotation.y *= Math.exp(-dt * 12)
      coin.rotation.z *= Math.exp(-dt * 12)
    } else {
      coin.position.y = 0
      coin.rotation.y = 0
      coin.rotation.z = 0
      idleTime = 0
      const result = flipData.result
      state = 'idle'
      flipData = null
      onCompleteFn(result)
    }
  }
}
