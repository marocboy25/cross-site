import { useEffect, useState, type RefObject } from 'react'

/** True while the element intersects the viewport (with a small margin). */
export function useInView(ref: RefObject<Element | null>, rootMargin = '80px'): boolean {
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el || typeof IntersectionObserver === 'undefined') {
      setInView(true)
      return
    }
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { rootMargin })
    io.observe(el)
    return () => io.disconnect()
  }, [ref, rootMargin])
  return inView
}
