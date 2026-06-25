import { Button } from '@/ui/base/button'
import { Card, CardContent } from '@/ui/base/card'
import { getImagePath, getUmaNameById } from '@/utils/formatting'
import { Plus, Trash2 } from 'lucide-react'
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
import { getUmaBasicInfoById } from '../../utils/uma'


export interface UmaCardProps {
  uma?: Uma | null
  name?: string
  onSelectUma: (level: number, position: number) => void
  size: 'big' | 'small'
  level: number
  position: number
}

interface ExtendedUmaCardProps extends UmaCardProps {
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

const UmaCard: React.FC<ExtendedUmaCardProps> = ({
  uma,
  onSelectUma,
  level,
  size = 'big',
  position,
  onBlueSparkChange,
  onPinkSparkChange,
  onGreenSparkChange,
  onRacesWonChange,
  onWhiteSparkChange,
}) => {
  const { blueSpark, pinkSpark, greenSpark, whiteSpark, races = [] } = uma || {}

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
    onWhiteSparkChange?.(value, { level, position })
  }

  const handleRacesWonChange = (value: RacesData) => {
    onRacesWonChange?.(value, { level, position })
  }

  const { updateTreeData } = useTreeData()

  const handleClearData = () => {
    // Clear all data for this specific level/position
    updateTreeData(level, position, null, true)
  }

  // Dynamic sizing based on level
  // Filled cards size to their (now dense) content; only set a min width.
  const getCardSize = () => (size === 'big' ? 'min-w-[190px]' : 'min-w-[150px]')

  const basicInfo = uma ? getUmaBasicInfoById(uma.id) : null

  const isSmallSize = size === 'small'

  // Show placeholder when no Uma is selected
  if (!uma?.id) {
    return (
      <Card
        className={`h-full ${getCardSize()} ${isSmallSize ? 'min-h-[200px]' : 'min-h-[240px]'} flex p-0 overflow-hidden transition-colors group bg-card border-2 border-dashed border-border-strong hover:border-primary`}
      >
        <button
          type="button"
          onClick={() => onSelectUma(level, position)}
          aria-label={`Select an Uma for position ${level}-${position}`}
          className="flex-1 flex flex-col items-center justify-center gap-2 text-muted-foreground hover:bg-accent/40 transition-colors"
        >
          <div className="w-12 h-12 rounded-full border-2 border-dashed border-border-strong flex items-center justify-center">
            <Plus className="w-6 h-6" />
          </div>
          <div className="text-center">
            <div className="text-sm font-medium">Select Uma</div>
            <div className="text-xs text-muted-foreground">
              Click to choose character
            </div>
          </div>
        </button>
      </Card>
    )
  }

  return (
    <Card
      className={`h-full ${getCardSize()} transition-colors group bg-card border-2 ${uma.isBlank ? 'border-dashed border-border-strong' : ''}`}
      style={
        uma.isBlank
          ? undefined
          : { borderColor: basicInfo?.dress_color_main ?? '#000000' }
      }
    >
      <CardContent
        className={`${isSmallSize ? 'p-2 space-y-1.5' : 'p-2.5 space-y-2'}`}
      >
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
              <div
                className={`${isSmallSize ? 'w-7 h-7' : 'w-8 h-8'} rounded-full border-2 border-dashed border-border-strong flex items-center justify-center shrink-0 text-muted-foreground`}
              >
                <Plus className="w-4 h-4" />
              </div>
              <span
                className={`${isSmallSize ? 'text-xs' : 'text-sm'} font-medium italic text-muted-foreground truncate`}
              >
                Blank slot
              </span>
            </>
          ) : (
            <>
              <div
                className={`${isSmallSize ? 'w-7 h-7' : 'w-8 h-8'} bg-accent rounded-full flex items-center justify-center shrink-0 overflow-hidden`}
              >
                <img
                  src={getImagePath(uma.id)}
                  alt=""
                  className="w-full h-full object-cover"
                />
              </div>
              <span
                className={`${isSmallSize ? 'text-xs' : 'text-sm'} font-medium text-foreground truncate`}
              >
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
            onRacesWonChange={handleRacesWonChange}
          />
          <WhiteSparkSelector
            whiteSpark={whiteSpark}
            onWhiteSparkChange={handleWhiteSparkChange}
            isSmallSize={isSmallSize}
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
            onClick={handleClearData}
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

export default UmaCard
