import { animate, motion, useMotionValue, useReducedMotion, useTransform } from 'motion/react'
import { useEffect } from 'react'
import { formatPrimaryCount } from '../lib/format'

// Exponential ease-out: races through the early numbers, then ticks slowly
// into the final few so the landing is easy to watch.
const easeOutExpo = (t: number) => (t >= 1 ? 1 : 1 - 2 ** (-10 * t))

type CountUpProps = {
  value: number
  className: string
  delay?: number
}

/**
 * Counts up to `value` on mount and eases between values after that, such as
 * at midnight. Screen readers get the final value only.
 */
export function CountUp({ value, className, delay = 0 }: CountUpProps) {
  const reduce = useReducedMotion() === true
  const count = useMotionValue(reduce ? value : 0)
  const text = useTransform(count, (latest) => formatPrimaryCount(Math.round(latest)))

  useEffect(() => {
    if (reduce) {
      count.set(value)
      return
    }
    const controls = animate(count, value, { duration: 3.2, delay, ease: easeOutExpo })
    return () => controls.stop()
  }, [count, value, delay, reduce])

  return (
    <>
      <motion.span className={className} aria-hidden="true">
        {text}
      </motion.span>
      <span className="sr-only">{formatPrimaryCount(value)}</span>
    </>
  )
}
