import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { useEffect, useRef, useState, type ClipboardEvent, type FormEvent } from 'react'
import { parseDateCode } from '../lib/dateCode'

const REVEAL_MS = 450
const SHAKE_MS = 320

type PasscodeProps = {
  today: Date
  onUnlock: (code: string) => void
}

export function Passcode({ today, onUnlock }: PasscodeProps) {
  const reduce = useReducedMotion() === true
  const [value, setValue] = useState('')
  const [shown, setShown] = useState<number | null>(null)
  const [error, setError] = useState(false)
  const [announcement, setAnnouncement] = useState('')
  const inputRef = useRef<HTMLInputElement | null>(null)
  const busy = useRef(false)
  const revealTimer = useRef(0)
  const clearTimer = useRef(0)
  const liveTimer = useRef(0)
  const unlockFrame = useRef(0)

  useEffect(() => {
    return () => {
      window.clearTimeout(revealTimer.current)
      window.clearTimeout(clearTimer.current)
      window.clearTimeout(liveTimer.current)
      window.cancelAnimationFrame(unlockFrame.current)
    }
  }, [])

  const focusInput = (node: HTMLInputElement | null) => {
    inputRef.current = node
    node?.focus({ preventScroll: true })
  }

  const reject = () => {
    busy.current = true
    setError(true)
    setAnnouncement('')
    window.clearTimeout(liveTimer.current)
    liveTimer.current = window.setTimeout(() => setAnnouncement('Invalid code'), 40)
    if (typeof navigator.vibrate === 'function') navigator.vibrate(40)
    window.clearTimeout(clearTimer.current)
    clearTimer.current = window.setTimeout(() => {
      setValue('')
      setShown(null)
      setError(false)
      busy.current = false
      inputRef.current?.focus({ preventScroll: true })
    }, SHAKE_MS)
  }

  const applyDigits = (raw: string) => {
    if (busy.current) return
    const digits = raw.replace(/\D/g, '').slice(0, 6)
    const grew = digits.length > value.length
    setValue(digits)
    setShown(grew ? digits.length - 1 : null)
    if (digits.length > 0) setAnnouncement('')

    window.clearTimeout(revealTimer.current)
    if (grew) {
      revealTimer.current = window.setTimeout(() => setShown(null), REVEAL_MS)
    }

    const el = inputRef.current
    if (el) {
      el.value = digits
      el.setSelectionRange(digits.length, digits.length)
    }

    if (digits.length !== 6) return
    if (!parseDateCode(digits, today)) {
      reject()
      return
    }
    unlockFrame.current = window.requestAnimationFrame(() => onUnlock(digits))
  }

  const onChange = (event: FormEvent<HTMLInputElement>) => {
    if (busy.current) {
      event.currentTarget.value = value
      return
    }
    applyDigits(event.currentTarget.value)
  }

  const onPaste = (event: ClipboardEvent<HTMLInputElement>) => {
    event.preventDefault()
    applyDigits(event.clipboardData.getData('text'))
  }

  return (
    <div className="passcode">
      <div className="passcode__field">
        <motion.div
          className={error ? 'passcode__slots is-error' : 'passcode__slots'}
          animate={
            error
              ? reduce
                ? { opacity: [1, 0.35, 1], x: 0 }
                : { x: [0, -10, 10, -6, 6, 0], opacity: 1 }
              : { x: 0, opacity: 1 }
          }
          transition={{ duration: error ? 0.3 : 0 }}
        >
          {Array.from({ length: 6 }, (_, index) => {
            const filled = index < value.length
            const showDigit = shown === index && filled
            return (
              <span className="passcode__slot" key={index}>
                <AnimatePresence initial={false}>
                  {showDigit ? (
                    <motion.span
                      key="digit"
                      className="passcode__digit"
                      initial={{ opacity: 0, scale: reduce ? 1 : 0.82 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: reduce ? 1 : 0.7 }}
                      transition={{ duration: reduce ? 0.15 : 0.18 }}
                    >
                      {value[index]}
                    </motion.span>
                  ) : filled ? (
                    <motion.span
                      key="dot"
                      className="passcode__mark passcode__mark--filled"
                      initial={{ opacity: 0, scale: reduce ? 1 : 0.45 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: reduce ? 1 : 0.6 }}
                      transition={{ duration: reduce ? 0.15 : 0.18 }}
                    />
                  ) : (
                    <motion.span key="empty" className="passcode__mark" />
                  )}
                </AnimatePresence>
              </span>
            )
          })}
        </motion.div>
        <input
          ref={focusInput}
          className="passcode__input"
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={6}
          autoComplete="off"
          autoCorrect="off"
          spellCheck={false}
          enterKeyHint="done"
          aria-label="Passcode"
          autoFocus
          value={value}
          onChange={onChange}
          onPaste={onPaste}
        />
      </div>
      <div className="sr-only" aria-live="polite">
        {announcement}
      </div>
    </div>
  )
}
