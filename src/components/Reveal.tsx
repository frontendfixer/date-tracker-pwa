import { RotateCcw } from 'lucide-react'
import { motion, useReducedMotion, type Variants } from 'motion/react'
import { dueDate, untilDue } from '../lib/due'
import { elapsed } from '../lib/elapsed'
import {
  breakdownLines,
  formatDateLine,
  formatWeekday,
  unitWord,
  untilDueParts,
  untilDueWeeksLine,
} from '../lib/format'
import { EASE_OUT } from '../lib/motion'
import { CountUp } from './CountUp'

type RevealProps = {
  from: Date
  today: Date
  onChangeDate: () => void
}

export function Reveal({ from, today, onChangeDate }: RevealProps) {
  const reduce = useReducedMotion() === true
  const result = elapsed(from, today)
  const lines = breakdownLines(result)
  const { dayMonth, year } = formatDateLine(from)
  const due = dueDate(from)
  const dueLine = formatDateLine(due)
  const remaining = untilDue(due, today)
  const countdown = untilDueParts(remaining)
  const remainingWeeks = untilDueWeeksLine(remaining)

  const list: Variants = {
    hidden: {},
    show: {
      transition: reduce ? {} : { delayChildren: 0.12, staggerChildren: 0.08 },
    },
  }
  const enter = { duration: reduce ? 0.2 : 0.6, ease: EASE_OUT }
  const item: Variants = reduce
    ? { hidden: { opacity: 0 }, show: { opacity: 1, transition: enter } }
    : {
        hidden: { opacity: 0, y: 14, filter: 'blur(6px)' },
        show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: enter },
      }
  const card: Variants = reduce
    ? item
    : {
        hidden: { opacity: 0, y: 18, scale: 0.96 },
        show: { opacity: 1, y: 0, scale: 1, transition: { ...enter, duration: 0.7 } },
      }
  // Start each count as its row arrives.
  const countDelay = (row: number) => (reduce ? 0 : 0.12 + row * 0.08)

  return (
    <div className="reveal">
      <motion.div className="reveal__stage" variants={list} initial="hidden" animate="show">
        <motion.div className="context" variants={item}>
          <p className="weekday">{formatWeekday(from)}</p>
          <p className="date-line">
            <span className="date-line__main">{dayMonth}</span> <span className="date-line__year">{year}</span>
          </p>
        </motion.div>
        <motion.p className="elapsed" variants={item}>
          <CountUp className="elapsed__value" value={result.days} delay={countDelay(1)} />
          <span className="elapsed__unit">{unitWord(result.days, 'day')}</span>
        </motion.p>
        {lines.length > 0 ? (
          <motion.div className="breakdown" variants={item}>
            {lines.map((line) => (
              <p key={line} className="breakdown__line">
                {line}
              </p>
            ))}
          </motion.div>
        ) : null}
        <motion.div className="due" variants={card}>
          <p className="due__label">Due · {formatWeekday(due)}</p>
          <p className="due__date">
            <span className="date-line__main">{dueLine.dayMonth}</span>{' '}
            <span className="date-line__year">{dueLine.year}</span>
          </p>
          <p className="due__count">
            {countdown.value ? (
              <CountUp
                className="due__value"
                value={Math.abs(remaining.days)}
                delay={countDelay(lines.length > 0 ? 3 : 2)}
              />
            ) : null}
            <span className={countdown.value ? 'due__unit' : 'due__today'}>{countdown.label}</span>
          </p>
          {remainingWeeks ? <p className="due__weeks">{remainingWeeks}</p> : null}
        </motion.div>
      </motion.div>
      <motion.button
        type="button"
        className="change"
        initial={{ opacity: 0, y: reduce ? 0 : 8 }}
        animate={{
          opacity: 1,
          y: 0,
          transition: { duration: reduce ? 0.2 : 0.5, ease: EASE_OUT, delay: reduce ? 0 : 0.55 },
        }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        whileTap={reduce ? undefined : { scale: 0.95 }}
        onClick={onChangeDate}
      >
        <RotateCcw aria-hidden="true" size={22} strokeWidth={2.25} />
        Change date
      </motion.button>
    </div>
  )
}
