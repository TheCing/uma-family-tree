import { Button } from '@/ui/base/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface MobileLevelNavigatorProps {
  currentLevel: number
  maxLevel: number
  onLevelChange: (level: number) => void
}

const MobileLevelNavigator = ({
  currentLevel,
  maxLevel,
  onLevelChange,
}: MobileLevelNavigatorProps) => {
  return (
    <div className="flex items-center justify-between mb-4 md:hidden bg-card rounded-xl p-3 shadow-sm border border-border">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onLevelChange(Math.max(currentLevel - 1, 0))}
        disabled={currentLevel <= 1}
        className="p-2"
      >
        <ChevronLeft className="w-4 h-4" />
      </Button>

      <div className="text-center">
        <div className="font-semibold text-lg text-foreground">
          Level {currentLevel}
        </div>
        <div className="text-xs text-muted-foreground">
          Swipe left/right to go to child/parent
        </div>
      </div>

      <Button
        variant="ghost"
        size="sm"
        onClick={() => onLevelChange(Math.min(currentLevel + 1, maxLevel))}
        disabled={currentLevel >= maxLevel}
        className="p-2"
      >
        <ChevronRight className="w-4 h-4" />
      </Button>
    </div>
  )
}

export default MobileLevelNavigator
