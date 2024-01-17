import { Library } from '../../types'

const XOR: Library = {
  config: {
    name: 'XOR',
    type: 'library',
    targetVer: '1.0.0-indev.0'
  },
  init: (l, k, p) => {},
  data: {
    encode: (str: string): string => {
      return encodeURIComponent(
        str
          .toString()
          .split('')
          .map((char, ind): string => {
            let indCheck
            if (ind % 2 === 0) { indCheck = false } else { indCheck = true }

            return indCheck ? String.fromCharCode(char.charCodeAt(0) ^ 2) : char
          })
          .join('')
      )
    },
    decode: (str: string): string => {
      const [input, ...search] = str.split('?')

      return (
        decodeURIComponent(input)
          .split('')
          .map((char, ind): string => {
            let indCheck
            if (ind % 2 === 0) { indCheck = false } else { indCheck = true }

            return indCheck ? String.fromCharCode(char.charCodeAt(0) ^ 2) : char
          })
          .join('') + ((search.length > 0) ? `?${search.join('?')}` : '')
      )
    }
  }
}

export default XOR
