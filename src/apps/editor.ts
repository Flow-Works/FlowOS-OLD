import icon from '../assets/icons/editor.png'
import { App } from '../types.ts'

import { fullEditor } from 'prism-code-editor/setups'
import Prism from 'prism-code-editor/prism-core'

import 'prismjs/components/prism-clike.js'
import 'prismjs/components/prism-markup.js'
import 'prismjs/components/prism-javascript.js'
import 'prismjs/components/prism-typescript.js'
import 'prismjs/components/prism-css.js'
import { FlowWindow } from '../wm.ts'

interface EditorConfig {
  path: string
}

export default class EditorApp implements App {
  name = 'Editor'
  pkg = 'flow.editor'
  icon = icon
  version = '1.0.0'

  async open (data?: EditorConfig): Promise<FlowWindow> {
    const { default: fs } = await import('fs')

    const win = (window as any).wm.createWindow({
      title: this.name,
      icon,
      width: 500,
      height: 400
    })

    if (data != null) {
      win.setTitle('Editor - ' + data.path)

      const value = (await fs.promises.readFile(data.path)).toString()
      const editor = fullEditor(
        Prism,
        win.content,
        {
          language: data.path.split('.').at(-1),
          theme: 'github-dark',
          value
        }
      )
      const style = document.createElement('style')
      style.innerHTML = `
      .prism-editor {
        caret-color: var(--text);
        font-family: Consolas, Monaco, "Andale Mono", "Ubuntu Mono", monospace;
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
        --editor__bg-scrollbar: 210, 10%, 35%;
        --editor__bg-fold: #768390;
        --bg-guide-indent: var(--surface-0);
        color-scheme: dark;
        height: 100%;
      }
      .prism-search * {
        font-family: 'Satoshi', sans-serif;
      }
      `
      editor.scrollContainer.appendChild(style)
    }

    return win
  }
}
