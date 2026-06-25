import { Popover, PopoverContent, PopoverTrigger } from '@/ui/base/popover'
import { Separator } from '@/ui/base/separator'
import SparkCell, { SparkStars } from '@/ui/base/spark-cell'
import { Star } from 'lucide-react'
import React from 'react'
import type { PinkSparkData } from '../../types/uma'
import { LOCALE_EN } from '../../locale/en'
import { mergeTwClass } from '../../lib/utils'

interface PinkSparkSelectorProps {
  pinkSpark?: PinkSparkData | null
  onPinkSparkChange?: (value: Partial<PinkSparkData>) => void
  isSmallSize?: boolean
}

const pinkCategories = [
  'Turf',
  'Dirt',
  'Sprint',
  'Mile',
  'Medium',
  'Long',
  'Front Runner',
  'Pace Chaser',
  'Late Surger',
  'End Closer',
]
const starLevels = [1, 2, 3]

const PinkSparkSelector = ({
  pinkSpark,
  onPinkSparkChange,
}: PinkSparkSelectorProps) => {
  const handlePinkSparkChange = (value: Partial<PinkSparkData>) => {
    if (!onPinkSparkChange) return
    onPinkSparkChange(value)
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <SparkCell
          tint="pink"
          label={LOCALE_EN.APTITUDES}
          empty={!(pinkSpark && pinkSpark.stat)}
          title="Set Pink Spark Category & Level"
        >
          {pinkSpark && pinkSpark.stat ? (
            <>
              <span className="truncate">{pinkSpark.stat}</span>
              {pinkSpark.level ? <SparkStars level={pinkSpark.level} /> : null}
            </>
          ) : (
            '—'
          )}
        </SparkCell>
      </PopoverTrigger>
      <PopoverContent align="start" className="p-3 min-w-96 max-w-none">
        <div className="text-[10px] uppercase tracking-wide font-semibold text-spark-pink mb-1">
          {LOCALE_EN.PINK_SPARKS}
        </div>
        <div className="flex gap-2">
          {/* Categories Column (two-column grid) */}
          <div className="w-3/4 max-h-56 overflow-auto pr-1 grid grid-cols-2 gap-1 content-start">
            {pinkCategories.map(cat => {
              const active = pinkSpark && pinkSpark.stat === cat
              return (
                <button
                  key={cat}
                  onClick={() => handlePinkSparkChange({ stat: cat })}
                  className={mergeTwClass(
                    'min-w-0 text-xs rounded-full px-2 py-1 border transition-colors text-left bg-spark-pink-bg text-spark-pink-fg border-spark-pink/30 hover:border-spark-pink',
                    {
                      'ring-2 ring-primary border-spark-pink font-medium':
                        active,
                    }
                  )}
                >
                  {cat}
                </button>
              )
            })}
          </div>
          <Separator
            orientation="vertical"
            className="mx-1 h-auto self-stretch"
          />
          {/* Levels Column */}
          <div className="flex flex-col gap-1 w-1/4 items-stretch">
            {starLevels.map(level => {
              const active = pinkSpark && pinkSpark.level === level
              return (
                <button
                  key={level}
                  onClick={() => handlePinkSparkChange({ level })}
                  className={mergeTwClass(
                    'text-xs rounded-full px-2 py-1 border flex items-center justify-center gap-0.5 transition-colors bg-spark-amber-bg text-spark-amber-fg border-spark-amber/30 hover:border-spark-amber',
                    {
                      'ring-2 ring-primary border-spark-amber': active,
                    }
                  )}
                >
                  {Array.from({ length: level }).map((_, i) => (
                    <Star
                      key={i}
                      className="w-3 h-3 fill-spark-amber text-spark-amber"
                    />
                  ))}
                </button>
              )
            })}
          </div>
        </div>
        <div className="mt-1 text-[10px] text-muted-foreground font-medium flex items-center gap-1">
          <span>
            Stat Spark: {pinkSpark && pinkSpark.stat ? pinkSpark.stat : '?'}.
            Level: {pinkSpark && pinkSpark.level ? pinkSpark.level : '?'}★
          </span>
        </div>
      </PopoverContent>
    </Popover>
  )
}

export default PinkSparkSelector
