import { Button } from '@/ui/base/button'
import { Badge } from '@/ui/base/badge'
import { Popover, PopoverContent, PopoverTrigger } from '@/ui/base/popover'
import {
  Folder,
  FolderOpen,
  Trash2,
  ChevronDown,
  SlidersHorizontal,
} from 'lucide-react'
import { useState } from 'react'
import { useSavedUmas } from '../../hooks/useSavedUmas'
import { useSavedTrees } from '../../hooks/useSavedTrees'
import { TreeData } from '../../contexts/TreeDataContext'

interface BreedingTreeHeaderProps {
  isMobile: boolean
  onClearTree: () => void
  onLoadTree: (treeData: TreeData) => void
  onOpenTreeManagerModal: () => void
  onOpenSavedUmasModal: () => void
}

const BreedingTreeHeader: React.FC<BreedingTreeHeaderProps> = ({
  isMobile,
  onClearTree,
  onOpenTreeManagerModal,
  onOpenSavedUmasModal,
}) => {
  const { getSavedUmasStats } = useSavedUmas()
  const { getSavedTreesStats } = useSavedTrees()
  const { total } = getSavedTreesStats()
  const savedUmasStats = getSavedUmasStats()

  const [menuOpen, setMenuOpen] = useState(false)

  const run = (fn: () => void) => () => {
    setMenuOpen(false)
    fn()
  }

  if (isMobile) return null

  return (
    <Popover open={menuOpen} onOpenChange={setMenuOpen}>
      <PopoverTrigger asChild>
        <Button variant="soft" size="sm" className="gap-2">
          <SlidersHorizontal className="w-4 h-4" />
          Manage
          <ChevronDown className="w-3.5 h-3.5 opacity-70" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="center" className="w-56 p-1" role="menu">
          <button
            type="button"
            role="menuitem"
            onClick={run(onOpenSavedUmasModal)}
            className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm text-left hover:bg-accent transition-colors"
          >
            <Folder className="w-4 h-4 text-muted-foreground" />
            <span className="flex-1">Manage Umas</span>
            {savedUmasStats.hasAny && (
              <Badge variant="secondary">{savedUmasStats.total}</Badge>
            )}
          </button>
          <button
            type="button"
            role="menuitem"
            onClick={run(onOpenTreeManagerModal)}
            className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm text-left hover:bg-accent transition-colors"
          >
            <FolderOpen className="w-4 h-4 text-muted-foreground" />
            <span className="flex-1">Manage Trees</span>
            {total > 0 && <Badge variant="secondary">{total}</Badge>}
          </button>
          <div className="my-1 h-px bg-border" />
          <button
            type="button"
            role="menuitem"
            onClick={run(onClearTree)}
            className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm text-left text-destructive hover:bg-destructive/10 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            <span className="flex-1">Clear Tree</span>
          </button>
        </PopoverContent>
      </Popover>
  )
}

export default BreedingTreeHeader
