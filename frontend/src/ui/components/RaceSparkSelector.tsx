import { Checkbox } from '@/ui/base/checkbox'
import { Popover, PopoverContent, PopoverTrigger } from '@/ui/base/popover'
import SparkCell from '@/ui/base/spark-cell'
import { RaceWithDate, WHITE_SPARK_RACES } from '../../assets/white-sparks'
import type { RacesData } from '../../types/uma'

interface RaceSparkSelectorProps {
  races?: string[]
  onRacesWonChange?: (value: RacesData) => void
  isSmallSize?: boolean
}

export default function RaceSparkSelector({
  races = [],
  onRacesWonChange,
}: RaceSparkSelectorProps) {
  const toggleRace = (race: string) => {
    const newSelection = races.includes(race)
      ? races.filter(r => r !== race)
      : [...races, race]

    if (onRacesWonChange) {
      onRacesWonChange({ races: newSelection })
    }
  }

  const clearAllRaces = () => {
    if (onRacesWonChange) {
      onRacesWonChange({ races: [] })
    }
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <SparkCell
          tint="neutral"
          label="G1 Wins"
          empty={!races?.length}
          title="Set White Spark Races"
        >
          {races?.length ? (
            <span className="font-mono tabular-nums">{races.length}</span>
          ) : (
            '—'
          )}
        </SparkCell>
      </PopoverTrigger>
      <PopoverContent align="start" className="p-3 w-full max-w-dvw">
        <div className="flex justify-between items-center">
          <div className="text-xs uppercase tracking-wide font-semibold text-spark-white mb-2">
            Races Won
          </div>
          <button
            className="cursor-pointer text-xs uppercase tracking-wide font-semibold text-destructive mb-2"
            onClick={clearAllRaces}
          >
            Clear All
          </button>
        </div>
        <div className="max-h-64 overflow-auto pr-2">
          <div className="grid grid-cols-1 gap-2">
            {Object.entries(WHITE_SPARK_RACES).map(([month, raceList]) => (
              <div key={month}>
                <span className="text-[10px] font-bold">{month}</span>
                {raceList.map((race: RaceWithDate) => {
                  const isSelected = races.includes(race.name)
                  return (
                    <label
                      key={race.name}
                      className="flex items-center space-x-2 cursor-pointer hover:bg-muted p-1 rounded-md text-xs"
                    >
                      <Checkbox
                        checked={isSelected}
                        onCheckedChange={() => toggleRace(race.name)}
                      />
                      <span className="text-xs leading-tight">{race.name}</span>
                    </label>
                  )
                })}
              </div>
            ))}
          </div>
        </div>
        <div className="mt-2 text-[10px] text-muted-foreground font-medium flex items-center gap-1">
          Selected: {races.length} race(s)
        </div>
      </PopoverContent>
    </Popover>
  )
}
