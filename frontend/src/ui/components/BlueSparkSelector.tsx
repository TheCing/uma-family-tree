import { Popover, PopoverContent, PopoverTrigger } from '@/ui/base/popover'
import { Separator } from '@/ui/base/separator'
import SparkCell, { SparkStars } from '@/ui/base/spark-cell'
import { Star } from 'lucide-react'
import React from 'react'
import type { BlueSparkData } from '../../types/uma'
import { LOCALE_EN } from '../../locale/en'
import { mergeTwClass } from '../../lib/utils'

interface BlueSparkSelectorProps {
  blueSpark?: BlueSparkData | null
  onBlueSparkChange?: (value: Partial<BlueSparkData>) => void
}

const stats = ['Speed', 'Stamina', 'Power', 'Guts', 'Wits']
const starLevels = [1, 2, 3]

const BlueSparkSelector = ({
  blueSpark,
  onBlueSparkChange,
}: BlueSparkSelectorProps) => {
  const handleBlueSparkChange = (value: Partial<BlueSparkData>) => {
    if (!onBlueSparkChange) return
    onBlueSparkChange(value)
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <SparkCell
          tint="blue"
          label={LOCALE_EN.STATS}
          empty={!(blueSpark && blueSpark.stat)}
          title="Set Blue Spark Stat & Level"
        >
          {blueSpark && blueSpark.stat ? (
            <>
              <span className="truncate">{blueSpark.stat}</span>
              {blueSpark.level ? <SparkStars level={blueSpark.level} /> : null}
            </>
          ) : (
            '—'
          )}
        </SparkCell>
      </PopoverTrigger>
      <PopoverContent align="start" className="p-3 w-64 max-w-none">
        <div className="text-[10px] uppercase tracking-wide font-semibold text-spark-blue mb-1">
          {LOCALE_EN.BLUE_SPARKS}
        </div>
        <div className="flex gap-2">
          <div className="flex flex-col gap-1 w-3/4">
            {stats.map(stat => {
              const active = blueSpark && blueSpark.stat === stat
              return (
                <button
                  key={stat}
                  onClick={() => handleBlueSparkChange({ stat: stat })}
                  className={mergeTwClass(
                    'text-xs rounded-full px-2 py-1 border transition-colors text-left truncate bg-spark-blue-bg text-spark-blue-fg border-spark-blue/30 hover:border-spark-blue',
                    {
                      'ring-2 ring-primary border-spark-blue font-medium':
                        active,
                    }
                  )}
                >
                  {stat}
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
              const active = blueSpark && blueSpark.level === level
              return (
                <button
                  key={level}
                  onClick={() => handleBlueSparkChange({ level: level })}
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
            Stat Spark: {blueSpark && blueSpark.stat ? blueSpark.stat : '?'}.
            Level: {blueSpark && blueSpark.level ? blueSpark.level : '?'}★
          </span>
        </div>
      </PopoverContent>
    </Popover>
  )
}

export default BlueSparkSelector
