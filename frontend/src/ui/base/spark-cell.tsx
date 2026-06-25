import * as React from 'react'
import { Star } from 'lucide-react'
import { mergeTwClass } from '@/lib/utils'

export type SparkTint = 'blue' | 'pink' | 'green' | 'neutral'

const tintClasses: Record<SparkTint, string> = {
  blue: 'bg-spark-blue-bg text-spark-blue-fg',
  pink: 'bg-spark-pink-bg text-spark-pink-fg',
  green: 'bg-spark-green-bg text-spark-green-fg',
  neutral: 'bg-muted text-muted-foreground',
}

interface SparkCellProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  tint?: SparkTint
  label: string
  empty?: boolean
}

/**
 * Compact, soft-tinted stat cell used as a spark-selector trigger: a small
 * uppercase label on top with the current value below. Forwards its ref so it
 * can be the child of a Radix PopoverTrigger (asChild).
 */
const SparkCell = React.forwardRef<HTMLButtonElement, SparkCellProps>(
  ({ tint = 'neutral', label, empty, className, children, ...props }, ref) => (
    <button
      ref={ref}
      type="button"
      className={mergeTwClass(
        'flex w-full flex-col gap-0.5 rounded-lg px-2 py-1.5 text-left transition-[box-shadow,opacity] select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
        tintClasses[tint],
        empty && 'opacity-65',
        className
      )}
      {...props}
    >
      <span className="text-[9.5px] font-medium uppercase tracking-wide leading-none opacity-90">
        {label}
      </span>
      <span className="flex items-center gap-0.5 text-xs font-medium leading-tight truncate">
        {children}
      </span>
    </button>
  )
)
SparkCell.displayName = 'SparkCell'

/** Inline star rating used inside a SparkCell value. */
export function SparkStars({ level }: { level: number }) {
  return (
    <span className="flex">
      {Array.from({ length: level }).map((_, i) => (
        <Star key={i} className="w-2.5 h-2.5 fill-current" />
      ))}
    </span>
  )
}

export default SparkCell
