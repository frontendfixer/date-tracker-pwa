import { RotateCcw } from 'lucide-react'
import { motion, useReducedMotion } from 'motion/react'
import { elapsed } from '../lib/elapsed'
import {
  breakdownLines,
  formatDateLine,
  formatPrimaryCount,
  formatWeekday,
  unitWord,
} from '../lib/format'

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
  const shift = reduce ? 0 : 10

  const list = {
    hidden: {},
    show: { transition: { staggerChildren: reduce ? 0 : 0.04 } },
  }
  const item = {
    hidden: { opacity: 0, y: shift },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: reduce ? 0.18 : 0.2, ease: 'easeOut' as const },
    },
  }

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
          <span className="elapsed__value">{formatPrimaryCount(result.days)}</span>
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
      </motion.div>
      <motion.button
        type="button"
        className="change"
        initial={{ opacity: 0, y: reduce ? 0 : 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: reduce ? 0.18 : 0.2, delay: reduce ? 0 : 0.12 }}
        onClick={onChangeDate}
      >
        <RotateCcw aria-hidden="true" size={22} strokeWidth={2.25} />
        Change date
      </motion.button>
    </div>
  )
}
