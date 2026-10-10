import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { useEffect } from 'react'
import { Passcode } from './components/Passcode'
import { Reveal } from './components/Reveal'
import { useStoredCode } from './hooks/useStoredCode'
import { useToday } from './hooks/useToday'
import { parseDateCode } from './lib/dateCode'
import { EASE_OUT } from './lib/motion'

export function App() {
  const reduce = useReducedMotion() === true
  const today = useToday()
  const { code, save, clear } = useStoredCode()

  useEffect(() => {
    if (code && !parseDateCode(code, today)) clear()
  }, [code, today, clear])

  const from = code ? parseDateCode(code, today) : null

  return (
    <main className="stage">
      <AnimatePresence initial={false}>
        {from ? (
          <motion.div
            key="unlocked"
            className="screen"
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={
              reduce
                ? { opacity: 0, transition: { duration: 0.2 } }
                : {
                    opacity: 0,
                    y: -12,
                    filter: 'blur(4px)',
                    transition: { duration: 0.28, ease: EASE_OUT },
                  }
            }
          >
            <Reveal from={from} today={today} onChangeDate={clear} />
          </motion.div>
        ) : (
          <motion.div
            key="locked"
            className="screen"
            initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.97 }}
            animate={{
              opacity: 1,
              scale: 1,
              transition: { duration: reduce ? 0.2 : 0.45, ease: EASE_OUT, delay: reduce ? 0 : 0.1 },
            }}
            exit={
              reduce
                ? { opacity: 0, transition: { duration: 0.2 } }
                : {
                    opacity: 0,
                    scale: 1.08,
                    filter: 'blur(8px)',
                    transition: { duration: 0.36, ease: EASE_OUT },
                  }
            }
          >
            <Passcode today={today} onUnlock={save} />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  )
}
