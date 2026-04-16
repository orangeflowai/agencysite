'use client'
import { useEffect, useRef } from 'react'

export function useReveal(threshold = 0.12) {
  const ref = useRef<HTMLElement | null>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      (entries) => entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('is-visible'); observer.unobserve(e.target) } }),
      { threshold }
    )
    const targets = el.querySelectorAll('.reveal, .reveal-left, .reveal-right')
    if (targets.length > 0) targets.forEach(t => observer.observe(t))
    else observer.observe(el)
    return () => observer.disconnect()
  }, [threshold])
  return ref as React.RefObject<any>
}
