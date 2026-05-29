import { setOnComplete, getState, setKeyLightBase } from './animation.js'
import { keyLight, fillLight, rimLight } from './scene.js'

// Theme toggle
const themeToggle = document.getElementById('theme-toggle')

function applyTheme(theme) {
  if (theme === 'light') {
    document.documentElement.setAttribute('data-theme', 'light')
    // Warm daylight — even, slightly elevated, parchment reflects warmth
    keyLight.color.set(0xfffae0)
    keyLight.intensity = 3.5
    fillLight.color.set(0xd4c4a0)
    fillLight.intensity = 0.6
    rimLight.color.set(0xffe8a0)
    rimLight.intensity = 0.9
    setKeyLightBase(3.5)
  } else {
    document.documentElement.removeAttribute('data-theme')
    // Candlelight — harsh amber key, near-black fill, deep rim
    keyLight.color.set(0xff8820)
    keyLight.intensity = 4.8
    fillLight.color.set(0x120800)
    fillLight.intensity = 0.12
    rimLight.color.set(0xff5010)
    rimLight.intensity = 2.0
    setKeyLightBase(4.8)
  }
}

{
  const saved = localStorage.getItem('coin-theme')
  const systemLight = window.matchMedia('(prefers-color-scheme: light)').matches
  applyTheme(saved || (systemLight ? 'light' : 'dark'))
}

themeToggle.addEventListener('click', () => {
  const next = document.documentElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light'
  applyTheme(next)
  localStorage.setItem('coin-theme', next)
})

const COIN_COLORS = {
  mxn: '#c9a030',
  eur: '#b0b0b0',
  usd: '#c8c8c8',
}

let headsCount = 0
let tailsCount = 0

export function initUI({ onFlip, onCoinSwitch }) {
  const flipBtn     = document.getElementById('flip-btn')
  const resultEl    = document.getElementById('result')
  const statHeads   = document.getElementById('stat-heads')
  const statTails   = document.getElementById('stat-tails')
  const coinBtns    = document.querySelectorAll('.coin-btn')

  // Wire animation completion: show result, update stats, re-enable button
  setOnComplete((result) => {
    resultEl.textContent = result === 'heads' ? 'Heads' : 'Tails'
    resultEl.classList.add('show')

    if (result === 'heads') { headsCount++; statHeads.textContent = headsCount }
    else                    { tailsCount++; statTails.textContent = tailsCount }

    flipBtn.disabled = false
  })

  // Flip button
  flipBtn.addEventListener('click', () => {
    if (getState() !== 'idle') return
    resultEl.classList.remove('show')
    flipBtn.disabled = true
    onFlip()
  })

  // Coin selector
  coinBtns.forEach(btn => {
    const coin = btn.dataset.coin
    // Set active border color on load
    if (btn.classList.contains('active')) {
      btn.style.borderColor = COIN_COLORS[coin]
    }

    btn.addEventListener('click', () => {
      if (getState() !== 'idle') return

      coinBtns.forEach(b => {
        b.classList.remove('active')
        b.style.borderColor = ''
      })
      btn.classList.add('active')
      btn.style.borderColor = COIN_COLORS[coin]

      resultEl.classList.remove('show')
      onCoinSwitch(coin)
    })
  })
}
