import { scene, camera, renderer, keyLight } from './scene.js'
import { buildCoin, disposeCoin } from './coin.js'
import { startFlip, tick, resetIdle } from './animation.js'
import { initUI } from './ui.js'

let currentCoin = buildCoin('mxn', scene)

initUI({
  onFlip: () => startFlip(currentCoin, keyLight),
  onCoinSwitch: (key) => {
    disposeCoin(currentCoin, scene)
    currentCoin = buildCoin(key, scene)
    resetIdle()
  },
})

const clock = new THREE.Clock()
function loop() {
  requestAnimationFrame(loop)
  tick(currentCoin, keyLight, clock.getDelta())
  renderer.render(scene, camera)
}
loop()
