import { renderer } from './scene.js'

const COINS = {
  mxn: { edgeColor: '#a0a0a0', denomination: '5', unit: 'PESOS',   label: 'BANCO DE MÉXICO',    country: 'ESTADOS UNIDOS MEXICANOS' },
  eur: { edgeColor: '#b8b8b8', denomination: '1', unit: 'EURO',    label: 'EUROPA',              country: 'EURO AREA' },
  usd: { edgeColor: '#c8c8c8', denomination: '25', unit: '¢',     label: 'QUARTER DOLLAR',      country: 'UNITED STATES OF AMERICA' },
}

// ── Canvas helpers ────────────────────────────────────────────────────────────

function arcText(ctx, text, cx, cy, r, startAngle, spanAngle, fontSize, fillStyle) {
  ctx.save()
  ctx.font = `${fontSize}px serif`
  ctx.fillStyle = fillStyle
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  const n = text.length
  for (let i = 0; i < n; i++) {
    const a = startAngle + (i + 0.5) * (spanAngle / n)
    ctx.save()
    ctx.translate(cx + r * Math.cos(a), cy + r * Math.sin(a))
    ctx.rotate(a + Math.PI / 2)
    ctx.fillText(text[i], 0, 0)
    ctx.restore()
  }
  ctx.restore()
}

function metalGradient(ctx, cx, cy, r, stops) {
  const g = ctx.createRadialGradient(cx - r * 0.4, cy - r * 0.4, r * 0.05, cx, cy, r)
  stops.forEach(([o, c]) => g.addColorStop(o, c))
  return g
}

function coinBase(ctx, cx, cy, r, gradient, rimColor) {
  ctx.beginPath()
  ctx.arc(cx, cy, r, 0, Math.PI * 2)
  ctx.fillStyle = gradient
  ctx.fill()
  ctx.beginPath()
  ctx.arc(cx, cy, r, 0, Math.PI * 2)
  ctx.strokeStyle = rimColor
  ctx.lineWidth = 5
  ctx.stroke()
  // relief inner ring
  ctx.beginPath()
  ctx.arc(cx, cy, r - 28, 0, Math.PI * 2)
  ctx.strokeStyle = rimColor
  ctx.lineWidth = 1.5
  ctx.globalAlpha = 0.4
  ctx.stroke()
  ctx.globalAlpha = 1
}

function sheen(ctx, cx, cy, r) {
  const g = ctx.createRadialGradient(cx - r * 0.5, cy - r * 0.55, 0, cx - r * 0.3, cy - r * 0.3, r * 1.1)
  g.addColorStop(0, 'rgba(255,255,255,0.22)')
  g.addColorStop(0.4, 'rgba(255,255,255,0.06)')
  g.addColorStop(1, 'rgba(255,255,255,0)')
  ctx.beginPath()
  ctx.arc(cx, cy, r, 0, Math.PI * 2)
  ctx.fillStyle = g
  ctx.fill()
}

// ── Per-coin face drawing ─────────────────────────────────────────────────────

function drawMXNHeads(ctx, cx, cy, r) {
  const tc = '#2a1400'

  // Eagle body
  ctx.fillStyle = tc
  ctx.beginPath()
  ctx.ellipse(cx, cy + 8, 30, 40, 0, 0, Math.PI * 2)
  ctx.fill()

  // Wings
  ctx.beginPath()
  ctx.moveTo(cx - 30, cy + 10)
  ctx.bezierCurveTo(cx - 85, cy - 18, cx - 120, cy + 12, cx - 108, cy + 40)
  ctx.bezierCurveTo(cx - 88, cy + 52, cx - 52, cy + 40, cx - 30, cy + 28)
  ctx.fill()
  ctx.beginPath()
  ctx.moveTo(cx - 30, cy)
  ctx.bezierCurveTo(cx - 72, cy - 28, cx - 110, cy - 12, cx - 106, cy + 18)
  ctx.bezierCurveTo(cx - 88, cy + 28, cx - 52, cy + 18, cx - 30, cy + 16)
  ctx.fill()
  ctx.beginPath()
  ctx.moveTo(cx + 30, cy + 10)
  ctx.bezierCurveTo(cx + 85, cy - 18, cx + 120, cy + 12, cx + 108, cy + 40)
  ctx.bezierCurveTo(cx + 88, cy + 52, cx + 52, cy + 40, cx + 30, cy + 28)
  ctx.fill()
  ctx.beginPath()
  ctx.moveTo(cx + 30, cy)
  ctx.bezierCurveTo(cx + 72, cy - 28, cx + 110, cy - 12, cx + 106, cy + 18)
  ctx.bezierCurveTo(cx + 88, cy + 28, cx + 52, cy + 18, cx + 30, cy + 16)
  ctx.fill()

  // Head (faces right)
  ctx.beginPath()
  ctx.ellipse(cx + 20, cy - 40, 20, 24, 0.15, 0, Math.PI * 2)
  ctx.fill()

  // Beak
  ctx.beginPath()
  ctx.moveTo(cx + 36, cy - 34)
  ctx.lineTo(cx + 60, cy - 26)
  ctx.lineTo(cx + 36, cy - 18)
  ctx.fillStyle = '#c89010'
  ctx.fill()

  // Snake in beak
  ctx.beginPath()
  ctx.moveTo(cx + 54, cy - 26)
  ctx.bezierCurveTo(cx + 75, cy - 42, cx + 98, cy - 22, cx + 88, cy - 4)
  ctx.strokeStyle = '#1a6a1a'
  ctx.lineWidth = 7
  ctx.lineCap = 'round'
  ctx.stroke()
  ctx.fillStyle = '#1a6a1a'
  ctx.beginPath()
  ctx.ellipse(cx + 88, cy - 4, 6, 5, 0.3, 0, Math.PI * 2)
  ctx.fill()

  // Eye
  ctx.fillStyle = '#f5c020'
  ctx.beginPath()
  ctx.arc(cx + 26, cy - 44, 5, 0, Math.PI * 2)
  ctx.fill()
  ctx.fillStyle = '#0a0a0a'
  ctx.beginPath()
  ctx.arc(cx + 26, cy - 44, 2.5, 0, Math.PI * 2)
  ctx.fill()

  // Nopal cactus
  ctx.fillStyle = '#186018'
  ctx.beginPath(); ctx.ellipse(cx, cy + 62, 20, 26, 0, 0, Math.PI * 2); ctx.fill()
  ctx.beginPath(); ctx.ellipse(cx - 24, cy + 55, 14, 18, -0.3, 0, Math.PI * 2); ctx.fill()
  ctx.beginPath(); ctx.ellipse(cx + 24, cy + 55, 14, 18, 0.3, 0, Math.PI * 2); ctx.fill()

  // Rock
  ctx.fillStyle = '#806030'
  ctx.beginPath()
  ctx.ellipse(cx, cy + 90, 42, 14, 0, 0, Math.PI * 2)
  ctx.fill()

  // Lake
  ctx.fillStyle = 'rgba(20,60,160,0.45)'
  ctx.beginPath()
  ctx.ellipse(cx, cy + 98, 62, 9, 0, 0, Math.PI * 2)
  ctx.fill()

  // Tail
  ctx.fillStyle = tc
  ctx.beginPath()
  ctx.moveTo(cx - 18, cy + 46)
  ctx.bezierCurveTo(cx - 28, cy + 65, cx, cy + 72, cx + 28, cy + 65)
  ctx.bezierCurveTo(cx + 38, cy + 54, cx + 18, cy + 46, cx, cy + 48)
  ctx.fill()

  // ESTADOS UNIDOS MEXICANOS arc (top)
  arcText(ctx, 'ESTADOS UNIDOS MEXICANOS', cx, cy, r - 20, -Math.PI / 2 - 1.42, 2.84, 18, tc)
}

function drawMXNTails(ctx, cx, cy, r) {
  const tc = '#2a1400'

  // Large denomination
  ctx.font = 'bold 190px serif'
  ctx.fillStyle = tc
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText('5', cx, cy - 8)

  ctx.font = 'bold 40px serif'
  ctx.fillText('PESOS', cx, cy + 108)

  ctx.font = '22px serif'
  ctx.fillText('2024', cx, cy + 150)

  // Mint mark
  ctx.font = 'italic 24px serif'
  ctx.fillText('Mo', cx, cy - 118)

  // BANCO DE MÉXICO arc
  arcText(ctx, 'BANCO DE MÉXICO', cx, cy, r - 20, -Math.PI / 2 - 1.2, 2.4, 20, tc)

  // Dot ring
  for (let i = 0; i < 16; i++) {
    const a = (i / 16) * Math.PI * 2
    const dr = r - 46
    ctx.beginPath()
    ctx.arc(cx + dr * Math.cos(a), cy + dr * Math.sin(a), 3.5, 0, Math.PI * 2)
    ctx.fillStyle = tc
    ctx.fill()
  }
}

function drawUSDHeads(ctx, cx, cy, r) {
  const tc = '#1e1e1e'

  // LIBERTY arc
  arcText(ctx, 'LIBERTY', cx, cy, r - 20, -Math.PI / 2 - 0.95, 1.9, 26, tc)

  // IN GOD WE TRUST (left of profile)
  ctx.font = '19px serif'
  ctx.fillStyle = tc
  ctx.textAlign = 'left'
  ctx.textBaseline = 'middle'
  ctx.fillText('IN GOD', cx - r + 36, cy - 22)
  ctx.fillText('WE TRUST', cx - r + 28, cy + 4)

  // Year
  ctx.font = '22px serif'
  ctx.textAlign = 'right'
  ctx.fillText('2024', cx + r - 28, cy + 128)

  // Washington bust
  ctx.fillStyle = tc

  // Hair (queue/colonial)
  ctx.beginPath()
  ctx.moveTo(cx - 8, cy - 42)
  ctx.bezierCurveTo(cx - 45, cy - 32, cx - 55, cy + 2, cx - 44, cy + 32)
  ctx.bezierCurveTo(cx - 38, cy + 48, cx - 22, cy + 52, cx - 2, cy + 44)
  ctx.fill()

  // Head
  ctx.beginPath()
  ctx.moveTo(cx + 28, cy - 78)
  ctx.bezierCurveTo(cx + 62, cy - 72, cx + 76, cy - 44, ctx.canvas.width, cy)
  ctx.bezierCurveTo(cx + 76, cy + 14, cx + 66, cy + 40, cx + 52, cy + 54)
  ctx.bezierCurveTo(cx + 36, cy + 70, cx + 14, cy + 74, cx - 2, cy + 62)
  ctx.bezierCurveTo(cx - 12, cy + 52, cx - 8, cy + 32, cx - 2, cy + 22)
  ctx.bezierCurveTo(cx - 14, cy + 2, cx - 14, cy - 18, cx - 4, cy - 42)
  ctx.bezierCurveTo(cx + 8, cy - 66, cx + 20, cy - 80, cx + 28, cy - 78)
  ctx.fill()

  // Nose bump
  ctx.beginPath()
  ctx.moveTo(cx + 72, cy - 14)
  ctx.bezierCurveTo(cx + 86, cy - 4, cx + 84, cy + 16, cx + 74, cy + 22)
  ctx.strokeStyle = 'rgba(0,0,0,0.35)'
  ctx.lineWidth = 3
  ctx.stroke()

  // Ear
  ctx.fillStyle = '#2c2c2c'
  ctx.beginPath()
  ctx.ellipse(cx - 6, cy + 2, 6, 9, 0.2, 0, Math.PI * 2)
  ctx.fill()

  // Coat/collar base
  ctx.fillStyle = tc
  ctx.beginPath()
  ctx.moveTo(cx - 28, cy + 68)
  ctx.bezierCurveTo(cx - 18, cy + 90, cx + 12, cy + 102, cx + 36, cy + 86)
  ctx.bezierCurveTo(cx + 54, cy + 70, cx + 58, cy + 54, cx + 52, cy + 54)
  ctx.bezierCurveTo(cx + 22, cy + 72, cx - 2, cy + 72, cx - 28, cy + 68)
  ctx.fill()

  // UNITED STATES bottom arc
  arcText(ctx, 'UNITED STATES OF AMERICA', cx, cy, r - 20, Math.PI / 2 - 1.45, 2.9, 17, tc)
}

function drawUSDTails(ctx, cx, cy, r) {
  const tc = '#1e1e1e'

  // Eagle body
  ctx.fillStyle = tc
  ctx.beginPath()
  ctx.ellipse(cx, cy + 22, 28, 36, 0, 0, Math.PI * 2)
  ctx.fill()

  // Shield on chest
  ctx.fillStyle = '#3a3a3a'
  ctx.beginPath()
  ctx.moveTo(cx - 16, cy + 10)
  ctx.lineTo(cx + 16, cy + 10)
  ctx.lineTo(cx + 13, cy + 50)
  ctx.lineTo(cx, cy + 56)
  ctx.lineTo(cx - 13, cy + 50)
  ctx.closePath()
  ctx.fill()
  // Shield stripes
  for (let i = 0; i < 5; i++) {
    ctx.fillStyle = `rgba(255,255,255,${0.1 + i * 0.04})`
    ctx.fillRect(cx - 14 + i * 6.5, cy + 10, 4, 43)
  }

  // Wings spread — two layers for depth
  ctx.fillStyle = tc
  const wingR = [[cx - 28, cy + 16, cx - 82, cy - 4, cx - 118, cy + 18, cx - 106, cy + 44],
                  [cx - 28, cy + 6,  cx - 70, cy - 22, cx - 108, cy - 8,  cx - 104, cy + 20],
                  [cx + 28, cy + 16, cx + 82, cy - 4,  cx + 118, cy + 18, cx + 106, cy + 44],
                  [cx + 28, cy + 6,  cx + 70, cy - 22, cx + 108, cy - 8,  cx + 104, cy + 20]]
  wingR.forEach(([x1,y1,bx1,by1,bx2,by2,ex,ey]) => {
    ctx.beginPath()
    ctx.moveTo(x1, y1)
    ctx.bezierCurveTo(bx1, by1, bx2, by2, ex, ey)
    ctx.bezierCurveTo(bx2, by2 + 20, bx1 + (ex - bx2) * 0.6, by1 + 24, x1, y1 + 18)
    ctx.fill()
  })

  // Bald head (white)
  ctx.fillStyle = '#dcdcdc'
  ctx.beginPath()
  ctx.ellipse(cx, cy - 16, 20, 24, 0, 0, Math.PI * 2)
  ctx.fill()

  // Beak
  ctx.fillStyle = '#b88808'
  ctx.beginPath()
  ctx.moveTo(cx + 14, cy - 12)
  ctx.lineTo(cx + 34, cy - 5)
  ctx.lineTo(cx + 14, cy + 2)
  ctx.fill()

  // Eye
  ctx.fillStyle = '#111'
  ctx.beginPath(); ctx.arc(cx + 4, cy - 19, 4, 0, Math.PI * 2); ctx.fill()
  ctx.fillStyle = 'white'
  ctx.beginPath(); ctx.arc(cx + 5, cy - 20, 1.5, 0, Math.PI * 2); ctx.fill()

  // 13 stars row above eagle
  ctx.fillStyle = tc
  ctx.font = 'bold 15px sans-serif'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  for (let i = 0; i < 13; i++) {
    const a = -Math.PI / 2 + (i / 13) * Math.PI
    ctx.fillText('★', cx + 96 * Math.cos(a), cy - 56 + 22 * Math.sin(a))
  }

  // E PLURIBUS UNUM
  ctx.font = '17px serif'
  ctx.fillText('E PLURIBUS UNUM', cx, cy - 52)

  // Arrows left talon
  ctx.strokeStyle = tc; ctx.lineWidth = 5; ctx.lineCap = 'round'
  ;[[-20, 0], [-14, -6], [-8, -10]].forEach(([dx, dy]) => {
    ctx.beginPath()
    ctx.moveTo(cx - 32 + dx, cy + 60 + dy)
    ctx.lineTo(cx - 52 + dx, cy + 46 + dy)
    ctx.stroke()
  })

  // Olive branch right talon
  ctx.strokeStyle = '#2a6a2a'; ctx.lineWidth = 4
  ctx.beginPath()
  ctx.moveTo(cx + 32, cy + 58)
  ctx.bezierCurveTo(cx + 52, cy + 44, cx + 68, cy + 36, cx + 80, cy + 28)
  ctx.stroke()
  ctx.fillStyle = '#2a6a2a'
  ;[[cx + 45, cy + 50], [cx + 58, cy + 42], [cx + 70, cy + 34]].forEach(([lx, ly]) => {
    ctx.beginPath(); ctx.ellipse(lx, ly, 7, 4, -0.4, 0, Math.PI * 2); ctx.fill()
  })

  // Top arc
  arcText(ctx, 'UNITED STATES OF AMERICA', cx, cy, r - 20, -Math.PI / 2 - 1.45, 2.9, 17, tc)
  // Bottom arc
  arcText(ctx, 'QUARTER DOLLAR', cx, cy, r - 20, Math.PI / 2 - 1.0, 2.0, 20, tc)
}

function drawEURHeads(ctx, cx, cy, r) {
  const tc = '#2a1800'

  // 12 EU stars (outer ring)
  ctx.font = 'bold 20px sans-serif'
  ctx.fillStyle = tc
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  const starR = r - 26
  for (let i = 0; i < 12; i++) {
    const a = -Math.PI / 2 + (i / 12) * Math.PI * 2
    ctx.fillText('★', cx + starR * Math.cos(a), cy + starR * Math.sin(a))
  }

  // Inner dividing ring
  ctx.beginPath()
  ctx.arc(cx, cy, starR - 20, 0, Math.PI * 2)
  ctx.strokeStyle = tc
  ctx.lineWidth = 1.5
  ctx.globalAlpha = 0.3
  ctx.stroke()
  ctx.globalAlpha = 1

  // Europe silhouette (simplified continental outline)
  ctx.fillStyle = 'rgba(40,60,180,0.14)'
  ctx.strokeStyle = tc
  ctx.lineWidth = 2.2

  ctx.beginPath()
  // Rough European land mass
  ctx.moveTo(cx - 42, cy - 58)
  ctx.lineTo(cx - 18, cy - 78)
  ctx.lineTo(cx + 22, cy - 74)
  ctx.lineTo(cx + 52, cy - 52)
  ctx.lineTo(cx + 62, cy - 18)
  ctx.lineTo(cx + 46, cy + 22)
  ctx.lineTo(cx + 18, cy + 58)
  ctx.lineTo(cx - 8, cy + 68)
  ctx.lineTo(cx - 38, cy + 48)
  ctx.lineTo(cx - 52, cy + 12)
  ctx.lineTo(cx - 58, cy - 30)
  ctx.closePath()
  ctx.fill()
  ctx.stroke()

  // Iberian peninsula
  ctx.beginPath()
  ctx.moveTo(cx - 52, cy + 12)
  ctx.lineTo(cx - 72, cy + 22)
  ctx.lineTo(cx - 70, cy + 52)
  ctx.lineTo(cx - 50, cy + 40)
  ctx.fillStyle = 'rgba(40,60,180,0.14)'
  ctx.fill(); ctx.stroke()

  // Scandinavia
  ctx.beginPath()
  ctx.moveTo(cx - 18, cy - 78)
  ctx.lineTo(cx - 22, cy - 108)
  ctx.lineTo(cx + 12, cy - 96)
  ctx.lineTo(cx + 22, cy - 74)
  ctx.fillStyle = 'rgba(40,60,180,0.14)'
  ctx.fill(); ctx.stroke()

  // British isles (small island)
  ctx.beginPath()
  ctx.ellipse(cx - 66, cy - 38, 10, 18, 0.2, 0, Math.PI * 2)
  ctx.fillStyle = 'rgba(40,60,180,0.14)'
  ctx.fill(); ctx.stroke()

  // Country label
  ctx.font = '19px serif'
  ctx.fillStyle = tc
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText('EUROPA', cx, cy + 92)
}

function drawEURTails(ctx, cx, cy, r) {
  const tc = '#2a1800'

  // 12 stars
  ctx.font = 'bold 20px sans-serif'
  ctx.fillStyle = tc
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  const starR = r - 26
  for (let i = 0; i < 12; i++) {
    const a = -Math.PI / 2 + (i / 12) * Math.PI * 2
    ctx.fillText('★', cx + starR * Math.cos(a), cy + starR * Math.sin(a))
  }

  // Radial line pattern (design element)
  ctx.save()
  ctx.globalAlpha = 0.12
  ctx.strokeStyle = tc
  ctx.lineWidth = 1
  for (let i = 0; i < 12; i++) {
    const a = (i / 12) * Math.PI * 2
    ctx.beginPath()
    ctx.moveTo(cx + 28 * Math.cos(a), cy + 28 * Math.sin(a))
    ctx.lineTo(cx + (starR - 22) * Math.cos(a), cy + (starR - 22) * Math.sin(a))
    ctx.stroke()
  }
  ctx.restore()

  // Inner circle accent
  ctx.beginPath()
  ctx.arc(cx, cy, starR - 22, 0, Math.PI * 2)
  ctx.strokeStyle = tc
  ctx.lineWidth = 1.5
  ctx.globalAlpha = 0.25
  ctx.stroke()
  ctx.globalAlpha = 1

  // Large "1"
  ctx.font = 'bold 205px serif'
  ctx.fillStyle = tc
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText('1', cx, cy + 8)

  // EURO
  ctx.font = 'bold 36px serif'
  ctx.fillText('EURO', cx, cy + 122)

  // Year
  ctx.font = '20px serif'
  ctx.fillText('2024', cx, cy - 122)
}

// ── Procedural face texture ───────────────────────────────────────────────────

function buildProceduralFace(coinKey, side) {
  const size = 512
  const canvas = document.createElement('canvas')
  canvas.width = size; canvas.height = size
  const ctx = canvas.getContext('2d')
  const cx = size / 2, cy = size / 2, r = size / 2 - 8

  // Metal base gradient
  let stops
  if (coinKey === 'usd') {
    stops = [[0,'#f5f5f5'],[0.3,'#e2e2e2'],[0.65,'#c0c0c0'],[1,'#8a8a8a']]
  } else {
    stops = [[0,'#fff8c8'],[0.3,'#f0cc48'],[0.65,'#c8a020'],[1,'#806000']]
  }
  coinBase(ctx, cx, cy, r, metalGradient(ctx, cx, cy, r, stops),
           coinKey === 'usd' ? '#686868' : '#907000')

  if      (coinKey === 'mxn' && side === 'heads') drawMXNHeads(ctx, cx, cy, r)
  else if (coinKey === 'mxn' && side === 'tails') drawMXNTails(ctx, cx, cy, r)
  else if (coinKey === 'usd' && side === 'heads') drawUSDHeads(ctx, cx, cy, r)
  else if (coinKey === 'usd' && side === 'tails') drawUSDTails(ctx, cx, cy, r)
  else if (coinKey === 'eur' && side === 'heads') drawEURHeads(ctx, cx, cy, r)
  else if (coinKey === 'eur' && side === 'tails') drawEURTails(ctx, cx, cy, r)

  sheen(ctx, cx, cy, r)

  const tex = new THREE.CanvasTexture(canvas)
  tex.encoding = THREE.sRGBEncoding
  tex.center.set(0.5, 0.5)
  // CylinderGeometry cap UV maps cosθ→u, sinθ→v, which puts canvas-top at scene-right.
  // Rotate the texture to correct: heads cap needs -π/2, tails cap needs +π/2.
  tex.rotation = side === 'heads' ? Math.PI / 2 : -Math.PI / 2
  return tex
}

// ── Edge (knurling) texture ───────────────────────────────────────────────────

function buildEdgeTexture(hexColor) {
  const canvas = document.createElement('canvas')
  canvas.width = 512; canvas.height = 32
  const ctx = canvas.getContext('2d')

  const r = parseInt(hexColor.slice(1, 3), 16)
  const g = parseInt(hexColor.slice(3, 5), 16)
  const b = parseInt(hexColor.slice(5, 7), 16)
  const light = `rgb(${Math.min(r+45,255)},${Math.min(g+45,255)},${Math.min(b+45,255)})`
  const dark  = `rgb(${Math.max(r-35,0)},${Math.max(g-35,0)},${Math.max(b-35,0)})`

  const nStrips = 64
  const w = canvas.width / nStrips
  for (let i = 0; i < nStrips; i++) {
    ctx.fillStyle = i % 2 === 0 ? light : dark
    ctx.fillRect(i * w, 0, w, 32)
  }

  const tex = new THREE.CanvasTexture(canvas)
  tex.wrapS = THREE.RepeatWrapping
  tex.repeat.x = 8
  return tex
}

// ── Public API ────────────────────────────────────────────────────────────────

export function buildCoin(coinKey, scene) {
  const cfg = COINS[coinKey]
  const maxAnisotropy = renderer.capabilities.getMaxAnisotropy()

  const edgeTex   = buildEdgeTexture(cfg.edgeColor)
  const headsTex  = buildProceduralFace(coinKey, 'heads')
  const tailsTex  = buildProceduralFace(coinKey, 'tails')

  headsTex.anisotropy = maxAnisotropy
  tailsTex.anisotropy = maxAnisotropy

  const materials = [
    new THREE.MeshStandardMaterial({ map: edgeTex,  metalness: 0.9, roughness: 0.3 }),
    new THREE.MeshStandardMaterial({ map: headsTex, metalness: 0.5, roughness: 0.35 }),
    new THREE.MeshStandardMaterial({ map: tailsTex, metalness: 0.5, roughness: 0.35 }),
  ]

  const geometry = new THREE.CylinderGeometry(1.0, 1.0, 0.08, 128)
  const mesh = new THREE.Mesh(geometry, materials)
  mesh._coinDisposed = false
  scene.add(mesh)

  // Async: upgrade to real JPG textures if available; stay on procedural on 404
  const loader = new THREE.TextureLoader()
  ;[['heads', 1], ['tails', 2]].forEach(([side, idx]) => {
    loader.load(
      `/textures/${coinKey}-${side}.jpg`,
      (tex) => {
        if (mesh._coinDisposed) { tex.dispose(); return }
        tex.encoding = THREE.sRGBEncoding
        tex.anisotropy = maxAnisotropy
        tex.center.set(0.5, 0.5)
        tex.rotation = side === 'heads' ? Math.PI / 2 : -Math.PI / 2
        const old = materials[idx].map
        materials[idx].map = tex
        materials[idx].needsUpdate = true
        if (old) old.dispose()
      }
    )
  })

  return mesh
}

export function disposeCoin(mesh, scene) {
  if (!mesh) return
  mesh._coinDisposed = true
  scene.remove(mesh)
  mesh.geometry.dispose()
  mesh.material.forEach(mat => {
    if (mat.map) mat.map.dispose()
    mat.dispose()
  })
}
