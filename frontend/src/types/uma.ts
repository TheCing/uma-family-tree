export type SparkData = {
  stat: string
  level: number
  isRace?: boolean
}

export type EnhanceSparkData = {
  data: SparkData | SparkData[] | null
  affinity: number
  type: 'pinkSpark' | 'greenSpark' | 'whiteSpark' | 'raceSpark'
}

export type AncestorData = {
  id: string
  races: string[]
  blueSpark?: SparkData
  pinkSpark?: SparkData
  greenSpark?: SparkData
  whiteSpark?: SparkData[]
} | null

export type UmaParent = Record<string, AncestorData>
/** Sentinel id used for a blank placeholder slot (keeps the slot "filled"). */
export const BLANK_UMA_ID = 'blank'

export interface Uma {
  id: string
  baseId: string
  name?: string
  /** A placeholder slot: sparks/races are set but no character is chosen. */
  isBlank?: boolean
  affinity?: number
  blueSpark?: SparkData
  pinkSpark?: SparkData
  greenSpark?: SparkData
  whiteSpark?: SparkData[]
  raceSpark?: SparkData[]
  races: string[]
}

export type BlueSparkData = SparkData
export type PinkSparkData = SparkData
export type WhiteSparkData = SparkData
export type GreenSparkData = SparkData

export interface RacesData {
  races: string[]
}
