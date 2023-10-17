import icon from '../assets/icons/files.png'
import { App } from '../types.ts'

import flow from '../flow.ts'
import { FlowWindow } from '../wm.ts'

import { Stats } from 'fs'

export default class FilesApp implements App {
  name = 'Files'
  pkg = 'flow.files'
  icon = icon
  version = '1.0.0'

  async open (): Promise<FlowWindow> {
    const fs = new (window as any).Filer.FileSystem()

    const win = (window as any).wm.createWindow({
      title: this.name,
      icon,
      width: 500,
      height: 400
    })

    win.content.style.display = 'flex'
    win.content.style.flexDirection = 'column'

    async function setDir (dir: string): Promise<void> {
      await fs.readdir(dir, (e: NodeJS.ErrnoException, files: string[]) => {
        const back = dir === '/' ? '<i class=\'bx bx-arrow-to-left\'></i>' : '<i class=\'back bx bx-left-arrow-alt\'></i>'

        win.content.innerHTML = `
          <div style="padding: 5px;display: flex;align-items: center;gap: 5px;">
            ${back}${dir}
            <div style="flex:1;"></div>
            <i class='bx bxs-folder-plus' style="font-size: 20px;"></i><i class='bx bxs-file-plus' style="font-size: 20px;"></i>
          </div>
          <div class="files" style="background: var(--base);flex: 1;border-radius: 10px;display: flex;flex-direction: column;"></div>
        `

        if (back !== '<i class=\'bx bx-arrow-to-left\'></i>') {
          (win.content.querySelector('.back') as HTMLElement).onclick = async () => {
            if (dir.split('/')[1] === dir.replace('/', '')) {
              await setDir('/' + dir.split('/')[0])
            } else {
              await setDir('/' + dir.split('/')[1])
            }
          }
        }

        for (const file of files) {
          const separator = dir === '/' ? '' : '/'
          fs.stat(dir + separator + file, (e: NodeJS.ErrnoException, fileStat: Stats) => {
            const element = document.createElement('div')
            element.setAttribute('style', 'padding: 5px;border-bottom: 1px solid var(--text);display:flex;align-items:center;gap: 5px;')

            const genIcon = (): string => {
              switch (file.split('.').at(-1)) {
                case 'js':
                case 'mjs':
                case 'cjs': {
                  return '<i class=\'bx bxs-file-js\' ></i>'
                }

                case 'html':
                case 'htm': {
                  return '<i class=\'bx bxs-file-html\' ></i>'
                }

                case 'css': {
                  return '<i class=\'bx bxs-file-css\' ></i>'
                }

                case 'json': {
                  return '<i class=\'bx bxs-file-json\' ></i>'
                }

                case 'md': {
                  return '<i class=\'bx bxs-file-md\' ></i>'
                }

                case 'txt':
                case 'text': {
                  return '<i class=\'bx bxs-file-txt\' ></i>'
                }

                case 'png':
                case 'apng': {
                  return '<i class=\'bx bxs-file-png\' ></i>'
                }

                case 'jpg':
                case 'jpeg': {
                  return '<i class=\'bx bxs-file-jpg\' ></i>'
                }

                case 'gif': {
                  return '<i class=\'bx bxs-file-gif\' ></i>'
                }

                default: {
                  return '<i class=\'bx bxs-file-blank\' ></i>'
                }
              }
            }
            const icon = fileStat.isDirectory() ? '<i class=\'bx bx-folder\'></i>' : genIcon()

            element.innerHTML += `${icon} ${file}`
            element.onclick = async () => {
              if (fileStat.isDirectory()) {
                await setDir(dir + separator + file)
              } else {
                flow.openApp('flow.editor', { path: dir + separator + file })
              }
            }

            win.content.querySelector('.files').appendChild(element)
          })
        }
      })
    }

    await setDir('/')

    return win
  }
}
