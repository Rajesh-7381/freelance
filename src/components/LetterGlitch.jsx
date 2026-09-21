import { useEffect, useRef } from 'react'

const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$&*()-_+=/[]{};:<>,0123456789'.split('')

export default function LetterGlitch({
  glitchColors = ['#5e4491', '#A476FF', '#241a38'],
  glitchSpeed = 33,
  outerVignette = true,
  smooth = true,
}) {
  const canvasRef = useRef(null)
  const letters = useRef([])
  const grid = useRef({ columns: 0, rows: 0 })
  const context = useRef(null)
  const animationRef = useRef(null)
  const lastGlitchTime = useRef(Date.now())

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    context.current = canvas.getContext('2d')

    const fontSize = 16
    const charWidth = 10
    const charHeight = 20

    const randomChar = () => LETTERS[Math.floor(Math.random() * LETTERS.length)]
    const randomColor = () => glitchColors[Math.floor(Math.random() * glitchColors.length)]

    const hexToRgb = (hex) => {
      const normalized = hex.replace(/^#?([a-f\d])([a-f\d])([a-f\d])$/i, (_, r, g, b) => r + r + g + g + b + b)
      const match = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(normalized)
      return match
        ? { r: parseInt(match[1], 16), g: parseInt(match[2], 16), b: parseInt(match[3], 16) }
        : null
    }

    const interpolate = (start, end, factor) => {
      const r = Math.round(start.r + (end.r - start.r) * factor)
      const g = Math.round(start.g + (end.g - start.g) * factor)
      const b = Math.round(start.b + (end.b - start.b) * factor)
      return `rgb(${r}, ${g}, ${b})`
    }

    const drawLetters = () => {
      const ctx = context.current
      if (!ctx || !canvas) return
      const { width, height } = canvas.getBoundingClientRect()
      ctx.clearRect(0, 0, width, height)
      ctx.font = `${fontSize}px monospace`
      ctx.textBaseline = 'top'
      letters.current.forEach((letter, index) => {
        const x = (index % grid.current.columns) * charWidth
        const y = Math.floor(index / grid.current.columns) * charHeight
        ctx.fillStyle = letter.color
        ctx.fillText(letter.char, x, y)
      })
    }

    const initialize = (columns, rows) => {
      grid.current = { columns, rows }
      letters.current = Array.from({ length: columns * rows }, () => ({
        char: randomChar(),
        color: randomColor(),
        targetColor: randomColor(),
        colorProgress: 1,
      }))
    }

    const resizeCanvas = () => {
      const parent = canvas.parentElement
      if (!parent) return
      const dpr = window.devicePixelRatio || 1
      const rect = parent.getBoundingClientRect()
      canvas.width = rect.width * dpr
      canvas.height = rect.height * dpr
      canvas.style.width = `${rect.width}px`
      canvas.style.height = `${rect.height}px`
      context.current?.setTransform(dpr, 0, 0, dpr, 0, 0)
      initialize(Math.ceil(rect.width / charWidth), Math.ceil(rect.height / charHeight))
      drawLetters()
    }

    const updateLetters = () => {
      const count = Math.max(1, Math.floor(letters.current.length * 0.05))
      for (let i = 0; i < count; i += 1) {
        const index = Math.floor(Math.random() * letters.current.length)
        const letter = letters.current[index]
        if (!letter) continue
        letter.char = randomChar()
        letter.targetColor = randomColor()
        if (!smooth) {
          letter.color = letter.targetColor
          letter.colorProgress = 1
        } else {
          letter.colorProgress = 0
        }
      }
    }

    const handleSmooth = () => {
      let needsRedraw = false
      letters.current.forEach((letter) => {
        if (letter.colorProgress < 1) {
          letter.colorProgress = Math.min(1, letter.colorProgress + 0.05)
          const start = hexToRgb(letter.color)
          const end = hexToRgb(letter.targetColor)
          if (start && end) {
            letter.color = interpolate(start, end, letter.colorProgress)
            needsRedraw = true
          }
        }
      })
      if (needsRedraw) drawLetters()
    }

    const animate = () => {
      const now = Date.now()
      if (now - lastGlitchTime.current >= glitchSpeed) {
        updateLetters()
        drawLetters()
        lastGlitchTime.current = now
      }
      if (smooth) handleSmooth()
      animationRef.current = requestAnimationFrame(animate)
    }

    resizeCanvas()
    animate()

    let resizeTimeout
    const onResize = () => {
      clearTimeout(resizeTimeout)
      resizeTimeout = setTimeout(() => {
        cancelAnimationFrame(animationRef.current)
        resizeCanvas()
        animate()
      }, 100)
    }

    window.addEventListener('resize', onResize)
    return () => {
      cancelAnimationFrame(animationRef.current)
      window.removeEventListener('resize', onResize)
    }
  }, [glitchColors, glitchSpeed, smooth])

  return (
    <div className="glitch">
      <canvas ref={canvasRef} />
      {outerVignette ? <div className="glitch-vignette" /> : null}
    </div>
  )
}
