import { useState, useEffect, useRef } from 'react'

export const useCountUp = (endValue, duration = 2000, delay = 0) => {
  const [count, setCount] = useState(0)
  const startTime = useRef(null)
  const animationFrame = useRef(null)

  useEffect(() => {
    const timer = setTimeout(() => {
      startTime.current = Date.now()
      const animate = () => {
        const now = Date.now()
        const elapsed = now - startTime.current
        const progress = Math.min(elapsed / duration, 1)
        
        // Easing function for smooth animation
        const easeOutQuart = 1 - Math.pow(1 - progress, 4)
        const currentCount = Math.floor(easeOutQuart * endValue)
        
        setCount(currentCount)
        
        if (progress < 1) {
          animationFrame.current = requestAnimationFrame(animate)
        }
      }
      animate()
    }, delay)

    return () => {
      clearTimeout(timer)
      if (animationFrame.current) {
        cancelAnimationFrame(animationFrame)
      }
    }
  }, [endValue, duration, delay])

  return count
}
