'use client'
import { useEffect, useRef } from 'react'

export default function Particles({ count = 40 }: { count?: number }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = ref.current
    if (!container) return
    container.innerHTML = ''
    const shapes = ['■', '▲', '●', '◆', '+', '×']
    const colors = [
      'rgba(99,102,241,',
      'rgba(168,85,247,',
      'rgba(6,182,212,',
      'rgba(16,185,129,',
    ]

    for (let i = 0; i < count; i++) {
      const el = document.createElement('div')
      const size = Math.random() * 7 + 3
      const color = colors[Math.floor(Math.random() * colors.length)]
      const opacity = (Math.random() * 0.35 + 0.08).toFixed(2)
      const duration = (Math.random() * 8 + 5).toFixed(1)
      const delay = (Math.random() * 6).toFixed(1)
      const x = (Math.random() * 100).toFixed(1)
      const y = (Math.random() * 100).toFixed(1)
      const anim = Math.random() > 0.5 ? 'float' : 'float-reverse'

      el.style.cssText = `
        position:absolute;
        left:${x}%;top:${y}%;
        width:${size}px;height:${size}px;
        color:${color}${opacity});
        font-size:${size}px;line-height:1;
        pointer-events:none;
        animation:${anim} ${duration}s ease-in-out ${delay}s infinite;
      `
      el.textContent = shapes[Math.floor(Math.random() * shapes.length)]
      container.appendChild(el)
    }
  }, [count])

  return (
    <div
      ref={ref}
      className="fixed inset-0 overflow-hidden pointer-events-none"
      style={{ zIndex: 0 }}
      aria-hidden="true"
    />
  )
}
