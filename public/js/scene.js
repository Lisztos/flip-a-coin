const container = document.getElementById('canvas-container')

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.01, 100)
camera.position.z = 4.5
camera.lookAt(0, -0.25, 0)  // tilt slightly down so coin sits in upper ~60% of viewport

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.outputEncoding = THREE.sRGBEncoding
renderer.toneMapping = THREE.ACESFilmicToneMapping
renderer.toneMappingExposure = 1.2
renderer.setClearColor(0x000000, 0)

container.insertBefore(renderer.domElement, container.firstChild)

// Key light — candlelight amber (overridden by applyTheme on load)
const keyLight = new THREE.PointLight(0xff8820, 4.8, 20)
keyLight.position.set(3, 3, 3)
scene.add(keyLight)

// Fill light — near-dark (candlelight is strongly directional)
const fillLight = new THREE.PointLight(0x120800, 0.12, 20)
fillLight.position.set(-3, -1, 2)
scene.add(fillLight)

// Rim light — warm amber from below-back
const rimLight = new THREE.PointLight(0xff5010, 2.0, 15)
rimLight.position.set(0, -4, -2)
scene.add(rimLight)

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
})

export { scene, camera, renderer, keyLight, fillLight, rimLight }
