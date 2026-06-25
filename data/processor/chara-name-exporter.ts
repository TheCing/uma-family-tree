import * as fs from 'fs'
import * as path from 'path'
import { CharacterNameID } from '../../frontend/src/types/characterNameId'
import { DressData } from '../../frontend/src/types/dressData'
import { TextData } from '../../frontend/src/types/textData'

const allTextsPath = path.resolve(__dirname, '../wild/all-texts.json')
const dressDataPath = path.resolve(__dirname, '../wild/dress-data.json')

const allTextsRaw = fs.readFileSync(allTextsPath, 'utf-8')
const allTexts: Array<TextData> = JSON.parse(allTextsRaw)

const dressDataRaw = fs.readFileSync(dressDataPath, 'utf-8')
const dressData: Array<DressData> = JSON.parse(dressDataRaw)

const exportCharacterNames = async () => {
  const formatCharacter = (item: TextData): CharacterNameID => {
    const id = item.index.toString()
    const base = id.slice(0, 4)
    // Prefer the costume's own border color; alt costumes have no dress_data
    // row of their own, so fall back to the character's base outfit color.
    const dress =
      dressData.find(d => d.id.toString() === id) ??
      dressData.find(d => d.id.toString().slice(0, 4) === base)
    return {
      chara_id: id,
      chara_name: item.text,
      chara_id_base: base,
      dress_color_main: `#${dress?.dress_color_main || '000000'}`,
    }
  }

  // Category 4 holds outfit/costume titles ("[Special Dreamer] Special Week").
  // Every playable costume (incl. alternates) has one; bases 9xxx are NPCs.
  const result = allTexts
    .filter(item => {
      if (item.category !== 4) return false
      const base = Number(item.index.toString().slice(0, 4))
      return base >= 1000 && base < 9000
    })
    .map(formatCharacter)

  return new Promise<void>((resolve, reject) => {
    fs.writeFile(
      path.resolve(__dirname, '../home/chara-names-with-id.json'),
      JSON.stringify(result, null, 2),
      'utf-8',
      err => {
        if (err) {
          reject(err)
        } else {
          console.log(
            `Parsed ${result.length} characters for id - name - dress color`
          )
          resolve()
        }
      }
    )
  })
}

// Run the function directly
exportCharacterNames().catch(error => {
  console.error('Error exporting character names:', error)
  process.exit(1)
})
