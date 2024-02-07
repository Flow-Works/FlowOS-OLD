import LibraryLib from '../../structures/LibraryLib'
import { Library } from '../../types'

let library: LibraryLib

const Components: Library = {
  config: {
    name: 'Components',
    type: 'library',
    targetVer: '0.0.1'
  },
  init: (l, k, p) => { library = l },
  data: {
    Input: {
      new: () => {
        const { HTML } = library
        const input = new HTML('input')
        input.style({
          'border-radius': '5px',
          padding: '2.5px',
          outline: 'none',
          background: 'transparent',
          border: '1px solid var(--surface-0)'
        })
        return input
      }
    },
    Button: {
      new: (type: 'normal' | 'primary' = 'normal') => {
        function shiftColor (col: string, amt: number): string {
          const num = parseInt(col, 16)
          const r = (num >> 16) + amt
          const b = ((num >> 8) & 0x00_FF) + amt
          const g = (num & 0x00_00_FF) + amt
          const newColor = g | (b << 8) | (r << 16)
          return newColor.toString(16)
        }

        const { HTML } = library
        const button = new HTML('button')
        button.style({
          'border-radius': '5px',
          padding: '2.5px 5px',
          background: 'var(--base)',
          border: '1px solid var(--surface-0)'
        })
        if (type === 'normal') {
          button.style({
            background: 'var(--base)'
          })
        } else if (type === 'primary') {
          button.style({
            background: 'var(--primary)',
            color: 'var(--base)',
            border: `1px solid #${shiftColor(document.documentElement.style.getPropertyValue('--primary').replace('#', ''), -40)}`
          })
        }
        return button
      }
    },
    Icon: {
      new: (icon: string, size = 'inherit') => {
        const { HTML } = library
        return new HTML('i')
          .class('material-symbols-rounded')
          .text(icon)
          .style({
            'font-size': size
          })
      }
    },
    Dropdown: {
      new: (options: string[]) => {
        const { HTML } = library
        const dropdown = new HTML('select')
        dropdown.style({
          'border-radius': '5px',
          padding: '2.5px',
          background: 'var(--base)',
          border: '1px solid var(--surface-1)'
        }).appendMany(
          ...options.map((option) => new HTML('option').text(option))
        )
        return dropdown
      }
    }
  }
}

export default Components
