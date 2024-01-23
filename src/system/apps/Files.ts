import icon from '../../assets/icons/file-manager.svg'
import { Process } from '../../types'

const Files: Process = {
  config: {
    name: 'Files',
    type: 'process',
    icon,
    targetVer: '1.0.0-indev.0'
  },
  run: async (process) => {
    const win = await process.loadLibrary('lib/WindowManager').then((wm: any) => {
      return wm.createWindow({
        title: 'Files',
        icon,
        width: 500,
        height: 400
      }, process)
    })

    const fs = process.fs
    const MIMETypes = await process.loadLibrary('lib/MIMETypes')

    win.content.style.display = 'flex'
    win.content.style.flexDirection = 'column'

    let currentDir = '/home'

    async function setDir (dir: string): Promise<void> {
      currentDir = dir
      const files: string[] = await fs.readdir(dir)
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
          await setDir(dir.split('/').slice(0, -1).join('/'))
        }
      }

      (win.content.querySelector('.file') as HTMLElement).onclick = async () => {
        const title = prompt('Enter file name')
        if (title != null) {
          await fs.writeFile(`${dir}/${title}`, '')
        }
      }

      (win.content.querySelector('.folder') as HTMLElement).onclick = async () => {
        const title = prompt('Enter folder name')
        if (title != null) {
          await fs.mkdir(`${dir}/${title}`)
        }
      }

      for (const file of files) {
        const seperator = dir === '/' ? '' : '/'
        const fileStat = await fs.stat(dir + seperator + file)
        const element = document.createElement('div')
        element.setAttribute('style', 'display: flex;gap: 5px;align-items:center;padding: 5px;border-bottom: 1px solid var(--text);display:flex;align-items:center;gap: 5px;')

        const genIcon = (): string => {
          return `<span class="material-symbols-rounded">${(MIMETypes[file.split('.')[1]] === undefined ? 'draft' : MIMETypes[file.split('.')[1]].icon) as string}</span>`
        }
        const icon = fileStat.isDirectory() ? '<span class="material-symbols-rounded">folder</span>' : genIcon()

        element.innerHTML += `${icon} <span style="flex:1;">${file}</span><span class="material-symbols-rounded delete">delete_forever</span><span class="material-symbols-rounded rename">edit</span>`;
        (element.querySelector('.rename') as HTMLElement).onclick = async () => {
          const value = prompt('Rename')
          console.log(value)
          if (value != null) {
            await fs.rename(dir + seperator + file, dir + seperator + value)
          }
        }
        (element.querySelector('.delete') as HTMLElement).onclick = async () => {
          if (fileStat.isDirectory()) {
            await fs.rmdir(dir + seperator + file)
          } else {
            await fs.unlink(dir + seperator + file)
          }
        }

        const run = async (file: string): Promise<void> => {
          if (file.split('.').at(-1) === 'lnk') {
            await fs.readFile(file).then(async (data: Uint8Array) => {
              await run(Buffer.from(data).toString())
            })
          } else if (file.split('.').at(-1) === 'app') {
            await fs.readFile(file).then(async (data: Uint8Array) => {
              await process.launch(Buffer.from(data).toString())
            })
          } else {
            await process.launch(MIMETypes[file.split('.').at(-1) as string] === undefined ? 'apps/Editor' : MIMETypes[file.split('.')[1]].opensWith[0], { path: file })
          }
        }

        element.ondblclick = async () => {
          if (fileStat.isDirectory()) {
            await setDir(dir + seperator + file)
          } else {
            await run(dir + seperator + file)
          }
        }
        win.content.querySelector('.files')?.appendChild(element)
      }
    }

    await setDir(currentDir)
    document.addEventListener('fs_update', () => {
      setDir(currentDir).catch(e => console.error(e))
    })
  }
}

export default Files
