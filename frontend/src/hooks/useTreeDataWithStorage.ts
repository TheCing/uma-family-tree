import { useCallback } from 'react'
import { useTreeData } from './useTreeData'
import type { TreeData } from '../contexts/TreeDataContext'

/**
 * Validate that an arbitrary parsed value matches the TreeData shape:
 * a map of numeric level -> numeric position -> uma object with a string `id`.
 * Guards untrusted input from share URLs / localStorage before it enters
 * app state.
 */
function isValidTreeData(value: unknown): value is TreeData {
  if (typeof value !== 'object' || value === null) return false

  return Object.entries(value as Record<string, unknown>).every(
    ([levelKey, level]) => {
      if (!Number.isFinite(Number(levelKey))) return false
      if (typeof level !== 'object' || level === null) return false

      return Object.entries(level as Record<string, unknown>).every(
        ([positionKey, uma]) =>
          Number.isFinite(Number(positionKey)) &&
          typeof uma === 'object' &&
          uma !== null &&
          typeof (uma as { id?: unknown }).id === 'string'
      )
    }
  )
}

/**
 * Enhanced hook for TreeData operations with localStorage utilities
 */
export function useTreeDataWithStorage() {
  const {
    treeData,
    updateTreeData,
    clearTree,
    clearTreeData,
    getUmaAtPosition,
    setTree,
  } = useTreeData()

  /**
   * Export the current tree data as JSON
   */
  const exportTreeData = useCallback((): string => {
    return JSON.stringify(treeData, null, 2)
  }, [treeData])

  /**
   * Import tree data from JSON string
   */
  const importTreeData = useCallback(
    (jsonData: string): boolean => {
      try {
        const parsedData: unknown = JSON.parse(jsonData)
        if (!isValidTreeData(parsedData)) {
          throw new Error('Invalid tree data format')
        }

        clearTree()
        setTree(parsedData)

        return true
      } catch (error) {
        console.error('Error importing tree data:', error)
        return false
      }
    },
    [clearTree, setTree]
  )

  /**
   * Check if there's any data in the tree
   */
  const hasTreeData = useCallback((): boolean => {
    return Object.keys(treeData).length > 0
  }, [treeData])

  /**
   * Get tree data statistics
   */
  const getTreeStats = useCallback(() => {
    let totalUmas = 0
    let levelsCount = 0
    let maxLevel = -1
    let minLevel = Infinity

    Object.entries(treeData).forEach(([levelStr, levelData]) => {
      const level = parseInt(levelStr, 10)
      levelsCount++
      maxLevel = Math.max(maxLevel, level)
      minLevel = Math.min(minLevel, level)
      totalUmas += Object.keys(levelData).length
    })

    return {
      totalUmas,
      levelsCount,
      maxLevel: maxLevel === -1 ? 0 : maxLevel,
      minLevel: minLevel === Infinity ? 0 : minLevel,
      isEmpty: totalUmas === 0,
    }
  }, [treeData])

  return {
    // Original TreeData functionality
    treeData,
    updateTreeData,
    clearTree,
    clearTreeData,
    getUmaAtPosition,

    // Enhanced functionality
    exportTreeData,
    importTreeData,
    hasTreeData,
    getTreeStats,
  }
}
