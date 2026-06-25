import { Button } from '@/ui/base/button'
import { Card, CardContent } from '@/ui/base/card'
import { Plus, Trash2, User } from 'lucide-react'
import React from 'react'
import { useTreeData } from '../../hooks/useTreeData'
import type {
  BlueSparkData,
  GreenSparkData,
  PinkSparkData,
  RacesData,
  Uma,
  WhiteSparkData,
} from '../../types/uma'
import BlueSparkSelector from '../components/BlueSparkSelector'
import PinkSparkSelector from '../components/PinkSparkSelector'
import GreenSparkSelector from '../components/GreenSparkSelector'
import WhiteSparkSelector from '../components/WhiteSparkSelector'
import RaceSparkSelector from '../components/RaceSparkSelector'
import AffinityDisplay from '../components/AffinityDisplay'
import SparkProcDisplay from '../components/SparkProcDisplay'
import SaveUmaButton from '../components/SaveUmaButton'
import UmaImage from '../components/UmaImage'
import { getUmaNameById } from '../../utils/formatting'

interface CompactUmaCardProps {
  uma?: Uma | null
  onSelectUma: (level: number, position: number) => void
  level: number
  position: number
  onBlueSparkChange?: (
    value: BlueSparkData,
    meta: { level: number; position: number }
  ) => void
  onPinkSparkChange?: (
    value: PinkSparkData,
    meta: { level: number; position: number }
  ) => void
  onGreenSparkChange?: (
    value: GreenSparkData,
    meta: { level: number; position: number }
  ) => void
  onRacesWonChange?: (
    value: RacesData,
    meta: { level: number; position: number }
  ) => void
  onWhiteSparkChange?: (
    value: WhiteSparkData[],
    meta: { level: number; position: number }
  ) => void
}

const CompactUmaCard: React.FC<CompactUmaCardProps> = ({
  uma,
  onSelectUma,
  level,
  position,
  onBlueSparkChange,
  onPinkSparkChange,
  onGreenSparkChange,
  onRacesWonChange,
  onWhiteSparkChange,
}) => {
  const { updateTreeData } = useTreeData()
  const { blueSpark, pinkSpark, greenSpark, whiteSpark, races = [] } = uma || {}

  const handleClearUma = () => {
    updateTreeData(level, position, null)
  }

  const handleBlueSparkChange = (value: Partial<BlueSparkData>) => {
    if (!onBlueSparkChange) return
    onBlueSparkChange(
      {
        ...blueSpark,
        stat: value.stat ?? blueSpark?.stat ?? '',
        level: value.level ?? blueSpark?.level ?? 0,
      },
      { level, position }
    )
  }

  const handlePinkSparkChange = (value: Partial<PinkSparkData>) => {
    if (!onPinkSparkChange) return
    onPinkSparkChange(
      {
        ...pinkSpark,
        stat: value.stat ?? pinkSpark?.stat ?? '',
        level: value.level ?? pinkSpark?.level ?? 0,
      },
      { level, position }
    )
  }

  const handleGreenSparkChange = (value: Partial<GreenSparkData>) => {
    if (!onGreenSparkChange) return
    onGreenSparkChange(
      {
        ...greenSpark,
        stat: value.stat ?? greenSpark?.stat ?? '',
        level: value.level ?? greenSpark?.level ?? 0,
      },
      { level, position }
    )
  }

  const handleWhiteSparkChange = (value: WhiteSparkData[]) => {
    if (!onWhiteSparkChange) return
    onWhiteSparkChange(value, { level, position })
  }

  if (!uma?.id) {
    return (
      <Card className="p-2 border-dashed border-2 border-border-strong relative">
        {/* Position Label */}
        <div className="absolute top-0 right-0 bg-accent text-muted-foreground text-xs px-1.5 py-0.5 rounded-tr-xl rounded-bl-md font-medium z-10">
          {level}-{position}
        </div>

        <CardContent className="p-2">
          <Button
            variant="ghost"
            className="w-full h-16 flex flex-col items-center justify-center gap-1 text-muted-foreground"
            onClick={() => onSelectUma(level, position)}
          >
            <User className="w-6 h-6" />
            <span className="text-xs">Select Uma</span>
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="p-2 relative">
      {/* Position Label */}
      <div className="absolute top-0 right-0 bg-accent text-muted-foreground text-xs px-1.5 py-0.5 rounded-tr-xl rounded-bl-md font-medium z-10">
        {level}-{position}
      </div>

      <CardContent className="p-2 space-y-2">
        {/* Header — click to choose / change the character */}
        <button
          type="button"
          onClick={() => onSelectUma(level, position)}
          aria-label={
            uma.isBlank
              ? `Assign a character to position ${level}-${position}`
              : `Change Uma at position ${level}-${position}`
          }
          className="flex items-center gap-2 w-full text-left rounded-md p-1 -m-1 hover:bg-accent/40 transition-colors"
        >
          {uma.isBlank ? (
            <>
              <div className="w-8 h-8 shrink-0 rounded-full border-2 border-dashed border-border-strong flex items-center justify-center text-muted-foreground">
                <Plus className="w-4 h-4" />
              </div>
              <span className="text-sm font-medium italic text-muted-foreground truncate">
                Blank slot
              </span>
            </>
          ) : (
            <>
              <div className="w-8 h-8 shrink-0">
                <UmaImage charaId={uma.id} alt={uma.name || 'Uma'} />
              </div>
              <span className="text-sm font-medium text-foreground truncate">
                {getUmaNameById(uma.id, false)}
              </span>
            </>
          )}
        </button>

        {/* Spark cells */}
        <div className="grid grid-cols-3 gap-1.5">
          <BlueSparkSelector
            blueSpark={blueSpark}
            onBlueSparkChange={handleBlueSparkChange}
          />
          <PinkSparkSelector
            pinkSpark={pinkSpark}
            onPinkSparkChange={handlePinkSparkChange}
          />
          <GreenSparkSelector
            greenSpark={greenSpark}
            onGreenSparkChange={handleGreenSparkChange}
            uma={uma}
          />
        </div>
        <div className="grid grid-cols-2 gap-1.5">
          <RaceSparkSelector
            races={races}
            onRacesWonChange={value =>
              onRacesWonChange?.(value, { level, position })
            }
          />
          <WhiteSparkSelector
            whiteSpark={whiteSpark}
            onWhiteSparkChange={handleWhiteSparkChange}
          />
        </div>

        {/* Affinity pill */}
        <AffinityDisplay uma={uma} level={level} position={position} />

        {/* Inspiration chance */}
        <SparkProcDisplay level={level} position={position} />

        {/* Save / clear */}
        <div className="flex gap-1.5 pt-0.5">
          <SaveUmaButton className="flex-1" uma={uma} />
          <Button
            onClick={handleClearUma}
            variant="outline"
            size="sm"
            className="flex-1 text-destructive hover:text-destructive hover:bg-destructive/10 border-destructive/30 hover:border-destructive/50"
            title="Clear all data for this position"
          >
            <Trash2 className="w-4 h-4" />
            <span>Clear</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default CompactUmaCard
