import { getBaseAffinity, getRaceAffinity } from '@/utils/affinity'
import { Heart } from 'lucide-react'
import { useContext, useMemo } from 'react'
import { TreeDataContext } from '../../contexts/TreeDataContext'
import Tooltip from '../base/tooltip'
import { LOCALE_EN } from '../../locale/en'
import type { Uma } from '../../types/uma'

interface AffinityDisplayProps {
  uma: Uma | null | undefined
  level: number
  position: number
}

export default function AffinityDisplay({
  uma,
  level,
  position,
}: AffinityDisplayProps) {
  const treeDataContext = useContext(TreeDataContext)
  const { treeData } = treeDataContext || {}

  const affinity = useMemo(() => {
    if (!uma || !treeData) {
      return { total: 0, base: 0, race: 0 }
    }
    const baseAffinity =
      getBaseAffinity(treeData, {
        level,
        position,
      })?.total ?? 0

    const raceAffinity = getRaceAffinity(treeData, {
      level,
      position,
    }).total

    return {
      total: baseAffinity + raceAffinity,
      base: baseAffinity,
      race: raceAffinity,
    }
  }, [uma, treeData, level, position])

  // A blank placeholder has no character, so affinity is indeterminate.
  if (uma?.isBlank) {
    return (
      <div
        className="flex items-center justify-between rounded-full px-3 py-1 bg-muted text-muted-foreground"
        role="img"
        aria-label="Affinity unavailable for a blank slot"
      >
        <span className="inline-flex items-center gap-1.5">
          <Heart className="w-3.5 h-3.5" />
          <span className="text-[10px] uppercase tracking-wide font-medium">
            {LOCALE_EN.AFFINITY}
          </span>
        </span>
        <span className="font-mono text-sm font-semibold">—</span>
      </div>
    )
  }

  const tierClass =
    affinity.total < 51
      ? 'bg-danger text-danger-foreground'
      : affinity.total < 151
        ? 'bg-warning text-warning-foreground'
        : 'bg-brand text-brand-foreground'

  const tierLabel =
    affinity.total < 51 ? 'low' : affinity.total < 151 ? 'medium' : 'high'

  return (
    <Tooltip
      content={`From parents: ${affinity.base} | From races: ${affinity.race}`}
    >
      <div
        className={`flex items-center justify-between rounded-full px-3 py-1 ${tierClass}`}
        role="img"
        aria-label={`${tierLabel} affinity, ${affinity.total}`}
      >
        <span className="inline-flex items-center gap-1.5">
          <Heart className="w-3.5 h-3.5 fill-current" />
          <span className="text-[10px] uppercase tracking-wide font-medium">
            {LOCALE_EN.AFFINITY}
          </span>
        </span>
        <span className="font-mono text-sm font-semibold tabular-nums">
          {affinity.total}
        </span>
      </div>
    </Tooltip>
  )
}
