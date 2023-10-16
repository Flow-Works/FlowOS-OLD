import icon from '../assets/icons/files.png';
import { App } from "../types.ts";

import flow from '../flow.ts';

export default class FilesApp implements App {
  name     = 'Files';
  pkg      = 'flow.files';
  icon     = icon;
  version  = '1.0.0';

  constructor() {}

  async open() {
    const { default: fs } = await import('fs');

    const win = window.wm.createWindow({
      title: this.name,
      icon: icon,
      width: 500,
      height: 400
    });

    try {
      await fs.mkdir('/home', () => {});
      await fs.mkdir('/home/meow', () => {});
    } catch (e) {}
    try {
      await fs.writeFile('/home/owo1.txt', 'sussy', () => {});
      await fs.writeFile('/home/owo2.html', '<body></body>', () => {});
      await fs.writeFile('/home/owo.js', 'alert(`hi`)', () => {});
    } catch (e) {}


    win.content.style.display = 'flex';
    win.content.style.flexDirection = 'column';

    async function setDir(dir: string) {
      await fs.readdir(dir, (e, files) => {
        const back = dir === '/' ? `<i class='bx bx-arrow-to-left'></i>` : `<i class='back bx bx-left-arrow-alt'></i>`;
  
        win.content.innerHTML = `
          <div style="padding: 5px;display: flex;align-items: center;">${back}${dir}</div>
          <div class="files" style="background: var(--base);flex: 1;border-radius: 10px;display: flex;flex-direction: column;"></div>
        `;
  
        if (back !== `<i class='bx bx-arrow-to-left'></i>`) {
          (win.content.querySelector('.back') as HTMLElement).onclick = () => {
            if (dir.split('/')[1] === dir.replace('/', '')) {
              setDir('/' + dir.split('/')[0])
            } else {
              setDir('/' + dir.split('/')[1])
            }
          }
        }
  
        for (const file in files) {
          const separator = dir === '/' ? '' : '/';
          fs.stat(dir + separator + files[file], (e, fileStat) => {
            const element = document.createElement('div');
            element.setAttribute('style', 'padding: 5px;border-bottom: 1px solid var(--text);display:flex;align-items:center;gap: 5px;');
            
            const genIcon = () => {
              switch (files[file].split('.').at(-1)) {
                case 'js':
                case 'mjs':
                case 'cjs': {
                  return `<i class='bx bxs-file-js' ></i>`
                }

                case 'html':
                case 'htm': {
                  return `<i class='bx bxs-file-html' ></i>`
                }

                case 'css': {
                  return `<i class='bx bxs-file-css' ></i>`
                }

                case 'json': {
                  return `<i class='bx bxs-file-json' ></i>`
                }

                case 'md': {
                  return `<i class='bx bxs-file-md' ></i>`
                }

                case 'txt':
                case 'text': {
                  return `<i class='bx bxs-file-txt' ></i>`
                }

                case 'png': 
                case 'apng': {
                  return `<i class='bx bxs-file-png' ></i>`
                }

                case 'jpg': 
                case 'jpeg': {
                  return `<i class='bx bxs-file-jpg' ></i>`
                }

                case 'gif': {
                  return `<i class='bx bxs-file-gif' ></i>`
                }

                default: {
                  return `<i class='bx bxs-file-blank' ></i>`
                }
              }
            }
            const icon = fileStat.isDirectory() ? `<i class='bx bx-folder'></i>` : genIcon()

            element.innerHTML += `${icon} ${files[file]}`;
            element.onclick = () => {
              if (fileStat.isDirectory() === true) {
                setDir(dir + separator + files[file]);
              } else {
                flow.openApp('flow.editor', { path: dir + separator + files[file] })
              }
            };
    
            win.content.querySelector('.files').appendChild(element);
          });
        }
      });
    }

    setDir('/')

    return win;
  }
}