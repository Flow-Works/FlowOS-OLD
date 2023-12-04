import icon from '../../assets/icons/files.png'
import { App } from '../../types'

import FlowWindow from '../../structures/FlowWindow'

import { Stats } from 'fs'

export default class FilesApp implements App {
  meta = {
    name: 'Files',
    description: 'A simple files app.',
    pkg: 'flow.files',
    version: '1.0.0',
    icon
  }

  async open (): Promise<FlowWindow> {
    const win = window.wm.createWindow({
      title: this.meta.name,
      icon: this.meta.icon,
      width: 500,
      height: 400
    })

    win.content.style.display = 'flex'
    win.content.style.flexDirection = 'column'

    async function setDir (dir: string): Promise<void> {
      await window.fs.readdir(dir, (e: NodeJS.ErrnoException, files: string[]) => {
        const back = dir === '/' ? '<span class="material-symbols-rounded">first_page</span>' : '<span class="back material-symbols-rounded">chevron_left</span>'

        win.content.innerHTML = `
          <div style="padding: 5px;display: flex;align-items: center;gap: 5px;">
            ${back}${dir}
            <div style="flex:1;"></div>
            <i class='folder material-symbols-rounded' style="font-size: 17.5px;">create_new_folder</i><i class='file material-symbols-rounded' style="font-size: 17.5px;">note_add</i>
          </div>
          <div class="files" style="background: var(--base);flex: 1;border-radius: 10px;display: flex;flex-direction: column;"></div>
        `

        if (back !== '<span class="material-symbols-rounded">first_page</span>') {
          (win.content.querySelector('.back') as HTMLElement).onclick = async () => {
            if (dir.split('/')[1] === dir.replace('/', '')) {
              await setDir(`/${dir.split('/')[0]}`)
            } else {
              await setDir(`/${dir.split('/')[1]}`)
            }
          }
        }

        (win.content.querySelector('.file') as HTMLElement).onclick = async () => {
          const title: string = prompt('Enter file name') ?? 'new-file.txt'
          await window.fs.promises.open(`${dir}/${title}`, 'w')
          await setDir(dir)
        }

        (win.content.querySelector('.folder') as HTMLElement).onclick = async () => {
          const title: string = prompt('Enter folder name') ?? 'new-folder'
          await window.fs.promises.mkdir(`${dir}/${title}`)
          await setDir(dir)
        }

        for (const file of files) {
          const separator = dir === '/' ? '' : '/'
          window.fs.stat(dir + separator + file, (e: NodeJS.ErrnoException, fileStat: Stats) => {
            const element = document.createElement('div')
            element.setAttribute('style', 'padding: 5px;border-bottom: 1px solid var(--text);display:flex;align-items:center;gap: 5px;')

            const genIcon = (): string => {
              switch (file.split('.').at(-1)) {
                case 'js':
                case 'mjs':
                case 'cjs': {
                  return '<span class="material-symbols-rounded">javascript</span>'
                }

                case 'html':
                case 'htm': {
                  return '<span class="material-symbols-rounded">html</span>'
                }

                case 'css': {
                  return '<span class="material-symbols-rounded">css</span>'
                }

                case 'json': {
                  return '<span class="material-symbols-rounded">code</span>'
                }

                case 'md': {
                  return '<span class="material-symbols-rounded">markdown</span>'
                }

                case 'txt':
                case 'text': {
                  return '<span class="material-symbols-rounded">description</span>'
                }

                case 'png':
                case 'apng':
                case 'jpg':
                case 'jpeg':
                case 'gif': {
                  return '<span class="material-symbols-rounded">image</span>'
                }

                default: {
                  return '<span class="material-symbols-rounded">draft</span>'
                }
              }
            }
            const icon = fileStat.isDirectory() ? '<span class="material-symbols-rounded">folder</span>' : genIcon()

            element.innerHTML += `${icon} ${file}`
            element.onclick = async () => {
              if (fileStat.isDirectory()) {
                await setDir(dir + separator + file)
              } else {
                await window.flow.openApp('flow.editor', { path: dir + separator + file })
              }
            }

            win.content.querySelector('.files')?.appendChild(element)
          })
        }
      })
    }

    await setDir('/')

    return win
  }
}
