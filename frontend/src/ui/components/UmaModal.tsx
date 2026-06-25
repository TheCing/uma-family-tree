import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/ui/base/dialog'
import { Input } from '@/ui/base/input'
import { Checkbox } from '@/ui/base/checkbox'
import { Search, Heart, BookMarkedIcon, SquareDashed } from 'lucide-react'
import { Button } from '@/ui/base/button'
import { BLANK_UMA_ID } from '@/types/uma'
import { useMemo, useState } from 'react'

import { CharacterNameID } from '@/types/characterNameId'
import UMA_LIST_WITH_ID from '../../assets/home/chara-names-with-id.json'
import UmaImage from '../../ui/components/UmaImage'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/ui/base/tabs'
import { SavedUma, useSavedUmas } from '@/hooks/useSavedUmas'
import { getUmaNameById as getUmaNameById } from '../../utils/formatting'
import { useTreeData } from '../../hooks'
import {
  convertSavedUmaToUma,
  getChildByPosition,
  getGrandchildByPosition,
  getUmaBasicInfoById,
} from '../../utils/uma'
import {
  getGrandparentAffinityCombosByIds,
  getParentAffinityCombosById,
} from '../../utils/affinity'

const umaWithIdList: CharacterNameID[] = UMA_LIST_WITH_ID

interface UmaModalProps {
  isOpen: boolean
  onClose: () => void
  onSelectUma: (
    uma: string,
    baseUmaId: string,
    level: number,
    position: number
  ) => void
  level: number
  position: number
}

const UmaModal = ({
  isOpen,
  onClose,
  onSelectUma,
  level,
  position,
}: UmaModalProps) => {
  const { updateTreeData, treeData } = useTreeData()
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [activeTab, setActiveTab] = useState<'all' | 'saved'>('all')
  const [sortByAffinity, setSortByAffinity] = useState<boolean>(true)
  const { savedUmas } = useSavedUmas()

  const child = useMemo(
    () => getChildByPosition(treeData, { level, position }),
    [treeData, level, position]
  )
  const grandChild = useMemo(
    () => getGrandchildByPosition(treeData, { level, position }),
    [treeData, level, position]
  )

  const filteredUmas = useMemo(
    () =>
      umaWithIdList.filter(uma =>
        uma.chara_name.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [searchTerm]
  )

  // Compute the affinity-combo lookups once per child/grandchild, rather than
  // rebuilding the whole table for every rendered card.
  const parentAffinityCombos = useMemo(
    () => (child ? getParentAffinityCombosById(child.baseId) : {}),
    [child]
  )
  const grandparentAffinityCombos = useMemo(
    () =>
      child && grandChild
        ? getGrandparentAffinityCombosByIds(child.baseId, grandChild.baseId)
        : {},
    [child, grandChild]
  )

  const sortedFilteredParentUmas = useMemo(() => {
    if (!sortByAffinity || !child) return filteredUmas
    return [...filteredUmas].sort((a, b) => {
      const aValue = parentAffinityCombos[a.chara_id_base] ?? -Infinity
      const bValue = parentAffinityCombos[b.chara_id_base] ?? -Infinity
      // Higher value first, then fallback to name
      if (aValue !== bValue) return bValue - aValue
      return a.chara_name.localeCompare(b.chara_name)
    })
  }, [sortByAffinity, filteredUmas, child, parentAffinityCombos])

  const sortedFilteredGrandParentUmas = useMemo(() => {
    if (!sortByAffinity) return filteredUmas
    if (!child || !grandChild) return []
    return [...filteredUmas].sort((a, b) => {
      const aValue = grandparentAffinityCombos[a.chara_id_base] ?? -Infinity
      const bValue = grandparentAffinityCombos[b.chara_id_base] ?? -Infinity
      if (aValue !== bValue) return bValue - aValue
      return a.chara_name.localeCompare(b.chara_name)
    })
  }, [sortByAffinity, filteredUmas, child, grandChild, grandparentAffinityCombos])

  const savedUmasList = useMemo(() => {
    return savedUmas
      .filter(uma => {
        const name = getUmaNameById(uma.id, false)
        return name?.toLowerCase().includes(searchTerm.toLowerCase())
      })
      .sort((a, b) => {
        const nameA = getUmaNameById(a.id, false) ?? a.nickname
        const nameB = getUmaNameById(b.id, false) ?? b.nickname
        return nameA.localeCompare(nameB)
      })
  }, [searchTerm, savedUmas])

  const handleSelectUma = (uma: CharacterNameID): void => {
    if (level !== null && position !== null) {
      onSelectUma(uma.chara_id, uma.chara_id_base, level, position)
      setSearchTerm('')
      onClose()
    }
  }

  const handleSelectSavedUma = (savedUma: SavedUma): void => {
    if (level !== null && position !== null) {
      onSelectUma(savedUma.id, savedUma.baseId, level, position)
      const standardUma = convertSavedUmaToUma(savedUma)
      updateTreeData(level, position, { ...standardUma })
      setSearchTerm('')
      onClose()
    }
  }

  const handleSearchChange = (value: string): void => {
    setSearchTerm(value)
  }

  const handleTabChange = (tab: 'all' | 'saved'): void => {
    setActiveTab(tab)
  }

  const handleSortChange = (checked: boolean): void => {
    setSortByAffinity(checked)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0">
        <DialogHeader className="p-6 pb-4">
          <DialogTitle className="text-2xl font-bold text-center">
            Select Uma Musume
          </DialogTitle>
          <DialogDescription className="text-center">
            Choose a character for this position in the breeding tree.
          </DialogDescription>
        </DialogHeader>

        <div className="px-6 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search Uma Musume..."
              value={searchTerm}
              onChange={e => handleSearchChange(e.target.value)}
              className="pl-10"
              autoFocus
            />
          </div>

          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="sort-affinity"
                checked={sortByAffinity}
                onCheckedChange={handleSortChange}
              />
              <label
                htmlFor="sort-affinity"
                className="text-sm font-medium text-muted-foreground"
              >
                Sort by affinity
              </label>
            </div>
            <Button
              variant="soft"
              size="sm"
              className="gap-2"
              onClick={() => onSelectUma(BLANK_UMA_ID, '', level, position)}
              title="Fill this slot with a blank placeholder (no character, sparks editable)"
            >
              <SquareDashed className="w-4 h-4" />
              Use blank placeholder
            </Button>
          </div>

          <Tabs className="w-full">
            <TabsList className="w-full">
              <TabsTrigger
                isActive={activeTab === 'all'}
                onClick={() => handleTabChange('all')}
                className="flex-1"
              >
                All Uma ({filteredUmas.length})
              </TabsTrigger>
              <TabsTrigger
                isActive={activeTab === 'saved'}
                onClick={() => handleTabChange('saved')}
                className="flex-1"
              >
                <BookMarkedIcon className="w-4 h-4 mr-1" />
                Saved ({savedUmasList.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent isActive={activeTab === 'all'}>
              <div className="h-[400px] overflow-y-auto">
                {/** Parent-based affinity **/}
                <div className="mb-6">
                  {child && sortByAffinity ? (
                    <h3 className="font-semibold mb-2 text-lg leading-tight">
                      As Parent for
                      <span
                        className="font-bold"
                        style={{
                          color:
                            getUmaBasicInfoById(child.id)?.dress_color_main ||
                            '#000000',
                        }}
                      >
                        {' '}
                        {getUmaNameById(child?.id, false)}
                      </span>
                    </h3>
                  ) : null}
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2 mb-4">
                    {sortedFilteredParentUmas.map(uma => (
                      <button
                        key={uma.chara_id}
                        type="button"
                        className="group relative flex flex-col items-center rounded-lg border border-border bg-card p-1.5 cursor-pointer transition-colors hover:bg-accent"
                        onClick={() => handleSelectUma(uma)}
                      >
                        <div className="relative w-full">
                          <UmaImage
                            charaId={uma.chara_id}
                            alt={uma.chara_name}
                            className="w-full aspect-square object-cover rounded-lg border border-border"
                          />
                          {sortByAffinity && child ? (
                            <span className="absolute top-1 right-1 rounded-full bg-brand text-brand-foreground text-[10px] font-mono tabular-nums leading-none px-1.5 py-0.5">
                              {parentAffinityCombos[uma.chara_id_base] ?? 0}
                            </span>
                          ) : null}
                        </div>
                        <span className="mt-1 w-full text-[11px] leading-tight line-clamp-2 text-center text-foreground">
                          {uma.chara_name}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
                {/** Grandparent-based affinity **/}
                <div>
                  {child && grandChild && sortByAffinity ? (
                    <div className="bg-background sticky top-0 z-10 py-2 px-6 mb-2 border-b border-border">
                      <h3 className="font-semibold text-muted-foreground text-lg leading-tight">
                        As grandparent for
                        <span className="font-bold">
                          <span
                            style={{
                              color:
                                getUmaBasicInfoById(grandChild.id)
                                  ?.dress_color_main || '#000000',
                            }}
                          >{` ${getUmaNameById(grandChild?.id, false)} `}</span>
                        </span>
                        <span className="font-bold">
                          with
                          <span
                            style={{
                              color:
                                getUmaBasicInfoById(child.id)
                                  ?.dress_color_main || '#000000',
                            }}
                          >{` ${getUmaNameById(child?.id, false)} `}</span>
                          parent
                        </span>
                      </h3>
                    </div>
                  ) : null}
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2 mb-4">
                    {sortedFilteredGrandParentUmas.map(uma => (
                      <button
                        key={uma.chara_id}
                        type="button"
                        className="group relative flex flex-col items-center rounded-lg border border-border bg-card p-1.5 cursor-pointer transition-colors hover:bg-accent"
                        onClick={() => handleSelectUma(uma)}
                      >
                        <div className="relative w-full">
                          <UmaImage
                            charaId={uma.chara_id}
                            alt={uma.chara_name}
                            className="w-full aspect-square object-cover rounded-lg border border-border"
                          />
                          {sortByAffinity && child && grandChild ? (
                            <span className="absolute top-1 right-1 rounded-full bg-brand text-brand-foreground text-[10px] font-mono tabular-nums leading-none px-1.5 py-0.5">
                              {grandparentAffinityCombos[uma.chara_id_base] ?? 0}
                            </span>
                          ) : null}
                        </div>
                        <span className="mt-1 w-full text-[11px] leading-tight line-clamp-2 text-center text-foreground">
                          {uma.chara_name}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent isActive={activeTab === 'saved'}>
              <div className="h-[400px] overflow-y-auto">
                {savedUmasList.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                    <Heart className="w-12 h-12 mb-4 text-muted-foreground/50" />
                    <p className="text-lg font-medium">No saved Uma Musume</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                    {savedUmasList.map(uma => (
                      <button
                        key={uma.id}
                        type="button"
                        className="group relative flex flex-col items-center rounded-lg border border-border bg-card p-1.5 cursor-pointer transition-colors hover:bg-accent"
                        onClick={() => handleSelectSavedUma(uma)}
                      >
                        <UmaImage
                          charaId={uma.id}
                          alt={getUmaNameById(uma.id, false)}
                          className="w-full aspect-square object-cover rounded-lg border border-border"
                        />
                        <span className="mt-1 w-full text-[11px] leading-tight line-clamp-2 text-center text-foreground">
                          {uma.nickname}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  )
}
export default UmaModal
