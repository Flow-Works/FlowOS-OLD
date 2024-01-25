import icon from '../../assets/icons/text-editor.svg'
import { fullEditor } from 'prism-code-editor/setups'
// this will also import markup, clike, javascript, typescript and jsx
import 'prism-code-editor/grammars/tsx'
import 'prism-code-editor/grammars/css-extras'
import 'prism-code-editor/grammars/markdown'
import 'prism-code-editor/grammars/python'

import { Process } from '../../types'

interface EditorConfig {
  path: string
}

const Editor: Process = {
  config: {
    name: 'Editor',
    type: 'process',
    icon,
    targetVer: '1.0.0-indev.0'
  },
  run: async (process) => {
    const MIMETypes = await process.loadLibrary('lib/MIMETypes')

    if (Object.keys(process.data).length > 0) {
      const win = await process.loadLibrary('lib/WindowManager').then((wm: any) => {
        return wm.createWindow({
          title: 'Editor',
          icon,
          width: 350,
          height: 500,
          canResize: false
        }, process)
      })

      const fs = process.fs

      const data = process.data as EditorConfig

      win.setTitle(`Editor - ${data.path.split('/').at(-1) as string}`)
      win.content.style.display = 'flex'
      win.content.style.flexDirection = 'column'

      if (data == null) {
        await process.launch('lib/FileManager')
        setTimeout(() => {
          win.close()
        }, 10)
      } else {
        const render = async (): Promise<void> => {
          win.content.innerHTML = `
        <div style="padding: 5px;display: flex;align-items: center;gap: 5px;">
          <div id="file-open">File</div>
          <div id="edit-open">Edit</div>

          <div class="dropdown" id="file">
            <a id="save">
              <i class='material-symbols-rounded' style="font-size: 1.1rem;">save</i>
              Save
            </a>
          </div>
          <div class="dropdown" id="edit">
            <a id="find">
              <i class='material-symbols-rounded' style="font-size: 1.1rem;">search</i>
              Find
            </a>
          </div>
        </div>
        <div class="editor" style="flex:1;display:grid;overflow:scroll;"></div>
        <style>
        .dropdown {
          position: absolute;
          z-index: 100;
          width: 150px;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
          border-radius: 5px;
          padding: 5px;
          margin-top: 80px;
          background: var(--surface-0);
          transition: all 0.1s cubic-bezier(0.16, 1, 0.5, 1);
            
          transform: translateY(0.5rem);
          visibility: hidden;
          opacity: 0;
        }
        
        .show {
          transform: translateY(0rem);
          visibility: visible;
          opacity: 1;
        }

        .dropdown a {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 5px 10px;
          text-decoration: none;
          color: var(--text);
        }
        
        .dropdown a:hover {
          background-color: var(--base);
          color: white;
        }
        </style>
      `

          const fileBtn = win.content.querySelector('#file-open')
          const editBtn = win.content.querySelector('#edit-open')

          const toggleDropdown = (id: string): void => {
            const el = win.content.querySelector(`#${id}`)
            el?.classList.toggle('show')
          }

          fileBtn?.addEventListener('click', (e: Event) => {
            e.stopPropagation()
            toggleDropdown('file')
          })

          editBtn?.addEventListener('click', (e: Event) => {
            e.stopPropagation()
            toggleDropdown('edit')
          })

          win.content.addEventListener('click', () => {
            const file = (win.content.querySelector('#file') as HTMLElement)
            const edit = (win.content.querySelector('#edit') as HTMLElement)
            if (file.classList.contains('show')) {
              toggleDropdown('file')
            }
            if (edit.classList.contains('show')) {
              toggleDropdown('edit')
            }
          })

          const fileExtension = (data.path.split('.').pop() as string).toLowerCase()
          console.log('owo ' + fileExtension, MIMETypes)
          const mime = fileExtension in MIMETypes ? MIMETypes[fileExtension].type : 'text/plain'
          let language = 'text'

          switch (mime) {
            case 'text/markdown':
              language = 'markdown'
              break
            case 'text/css':
              language = 'css'
              break
            case 'text/html':
              language = 'html'
              break
            case 'text/javascript':
              language = 'javascript'
              break
            case 'text/jsx':
              language = 'jsx'
              break
            case 'application/x-flow-theme':
            case 'application/json':
              language = 'clike'
              break
            case 'text/typescript':
              language = 'typescript'
              break
            case 'text/tsx':
              language = 'tsx'
              break
            case 'application/python':
              language = 'python'
              break
            default:
              language = 'text'
              break
          }

          const value = Buffer.from(await fs.readFile(data.path)).toString()
          const editor = fullEditor(
            win.content.querySelector('.editor') as HTMLElement,
            {
              language,
              theme: 'github-dark',
              value
            }
          )

          const style = document.createElement('style')
          style.textContent = `
      .prism-code-editor {
        color: var(--text);
        border-radius: 10px 10px 0 0;
        caret-color: var(--text);
        font-weight: 400;
        --editor__bg: var(--base);
        --widget__border: var(--mantle);
        --widget__bg: var(--crust);
        --widget__color: var(--text);
        --widget__color-active: var(--text);
        --widget__color-options: #8a99a8;
        --widget__bg-input: var(--mantle);
        --widget__bg-hover: #5a5d5e4f;
        --widget__bg-active: var(--base);
        --widget__focus-ring: var(--text);
        --search__bg-find: var(--surface-1)80;
        --widget__bg-error: #5a1d1d;
        --widget__error-ring: #be1100;
        --editor__bg-highlight: #636e7b1a;
        --editor__bg-selection-match: var(--surface-1)40;
        --editor__line-number: #636e7b;
        --editor__line-number-active: #adbac7;
        --bg-guide-indent: var(--surface-0);
        overflow: visible;
      }
      .prism-search * {
        font-family: 'Satoshi', sans-serif;
      }
      `
          editor.scrollContainer.appendChild(style);
          (win.content.querySelector('#find') as HTMLElement).onclick = () => {
            editor.extensions.searchWidget?.open()
          }
          (win.content.querySelector('#save') as HTMLElement).onclick = async () => {
            await fs.writeFile(data.path, editor.value)
          }
        }
        await render()
        document.addEventListener('fs_update', () => {
          render().catch(e => console.error(e))
        })
        document.addEventListener('theme_update', () => {
          render().catch(e => console.error(e))
        })
      }
      return
    }
    await process.kill()
    await process.launch('apps/Files')
  }
}

export default Editor
