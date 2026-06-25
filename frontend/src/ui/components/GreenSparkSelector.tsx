import { Popover, PopoverContent, PopoverTrigger } from '@/ui/base/popover'
import SparkCell, { SparkStars } from '@/ui/base/spark-cell'
import { Star } from 'lucide-react'
import React from 'react'
import type { GreenSparkData, Uma } from '../../types/uma'
import { mergeTwClass } from '../../lib/utils'

interface GreenSparkSelectorProps {
  greenSpark?: GreenSparkData | null
  onGreenSparkChange?: (value: Partial<GreenSparkData>) => void
  uma?: Uma | null
}

const starLevels = [1, 2, 3]

const GreenSparkSelector = ({
  greenSpark,
  onGreenSparkChange,
  uma,
}: GreenSparkSelectorProps) => {
  const handleGreenSparkChange = (value: Partial<GreenSparkData>) => {
    if (!onGreenSparkChange) return
    onGreenSparkChange(value)
  }
  return (
    <Popover>
      <PopoverTrigger asChild>
        <SparkCell
          tint="green"
          label="Skill"
          empty={!greenSpark}
          title="Set Green Spark Level"
        >
          {greenSpark?.level ? <SparkStars level={greenSpark.level} /> : '—'}
        </SparkCell>
      </PopoverTrigger>
      <PopoverContent align="start" className="p-3 w-48 max-w-none">
        <div className="text-[10px] uppercase tracking-wide font-semibold text-spark-green mb-1">
          Green Spark
        </div>
        <div className="flex flex-col gap-1 items-stretch">
          {starLevels.map(lvl => {
            const active = greenSpark && greenSpark.level === lvl
            const disabled = !uma || !uma.baseId
            return (
              <button
                key={lvl}
                onClick={() =>
                  uma
                    ? handleGreenSparkChange({ stat: uma.id, level: lvl })
                    : undefined
                }
                className={mergeTwClass(
                  `text-xs rounded-full px-2 py-1 border flex items-center justify-center gap-0.5 transition-colors bg-spark-amber-bg text-spark-amber-fg border-spark-amber/30 hover:border-spark-amber`,
                  active ? 'ring-2 ring-primary border-spark-amber' : '',
                  disabled
                    ? 'bg-muted text-muted-foreground border-border cursor-not-allowed hover:bg-muted hover:text-muted-foreground'
                    : ''
                )}
                disabled={disabled}
              >
                {Array.from({ length: lvl }).map((_, i) => (
                  <Star
                    key={i}
                    className="w-3 h-3 fill-spark-amber text-spark-amber"
                  />
                ))}
              </button>
            )
          })}
          {!uma || !uma.id ? (
            <div className="text-[10px] text-destructive font-medium flex items-center gap-1">
              Select a character first
            </div>
          ) : null}
        </div>
        {greenSpark && greenSpark.level ? (
          <div className="mt-1 text-[10px] text-muted-foreground font-medium flex items-center gap-1">
            Set: Unique Skill
          </div>
        ) : null}
      </PopoverContent>
    </Popover>
  )
}

export default GreenSparkSelector
