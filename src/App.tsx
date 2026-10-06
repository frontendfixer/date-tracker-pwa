import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { useEffect } from 'react'
import { Passcode } from './components/Passcode'
import { Reveal } from './components/Reveal'
import { useStoredCode } from './hooks/useStoredCode'
import { useToday } from './hooks/useToday'
import { parseDateCode } from './lib/dateCode'

export function App() {
  const reduce = useReducedMotion() === true
  const today = useToday()
  const { code, save, clear } = useStoredCode()

  useEffect(() => {
    if (code && !parseDateCode(code, today)) clear()
  }, [code, today, clear])

  const from = code ? parseDateCode(code, today) : null
  const fade = reduce ? 0.2 : 0.28

  return (
    <main className="stage">
      <AnimatePresence initial={false}>
        {from ? (
          <motion.div
            key="unlocked"
            className="screen"
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: fade } }}
          >
            <Reveal from={from} today={today} onChangeDate={clear} />
          </motion.div>
        ) : (
          <motion.div
            key="locked"
            className="screen"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { duration: reduce ? 0.2 : 0.24 } }}
            exit={{
              opacity: 0,
              scale: reduce ? 1 : 0.94,
              transition: { duration: fade },
            }}
          >
            <Passcode today={today} onUnlock={save} />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  )
}
