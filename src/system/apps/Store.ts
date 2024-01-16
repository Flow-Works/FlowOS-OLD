import { Process, RepoData } from '../../types'
import icon from '../../assets/icons/softwarecenter.svg'

import { sanitize } from '../../utils'
import nullIcon from '../../assets/icons/application-default-icon.svg'

const Store: Process = {
  config: {
    name: 'Store',
    type: 'process',
    icon,
    targetVer: '1.0.0-indev.0'
  },
  run: async (process) => {
    const win = await process.loadLibrary('lib/WindowManager').then((wm: any) => {
      return wm.createWindow({
        title: 'Store',
        icon,
        width: 500,
        height: 700
      }, process)
    })

    const fs = await process.loadLibrary('lib/VirtualFS')

    win.content.style.background = 'var(--base)'

    fetch(`${process.kernel.config.SERVER as string}/apps/list/`)
      .then(async (res) => await res.json())
      .then(handle)
      .catch(e => console.error(e))
    document.addEventListener('fs_update', () => {
      fetch(`${process.kernel.config.SERVER as string}/apps/list/`)
        .then(async (res) => await res.json())
        .then(handle)
        .catch(e => console.error(e))
    })

    function handle (repos: RepoData[]): void {
      win.content.innerHTML = `
        <div class="repos" style="display: flex;flex-direction: column;gap: 10px;"></div>
      `

      repos.forEach((repo) => {
        (win.content.querySelector('.repos') as HTMLElement).innerHTML += `
          <div data-repo-id="${sanitize(repo.id)}" style="display: flex;flex-direction: column;gap: 10px;background: var(--surface-0);padding: 20px;margin: 10px;border-radius: 10px;">
            <div style="flex: 1;">
              <h2 style="margin: 0;margin-bottom: 10px;">${sanitize(repo.name)}</h2>
              <code style="font-family: monospace;">${sanitize(repo.id)}</code>
            </div>
            <br/>
            <div class="apps"></div>
          </div>
        `

        repo.apps.forEach((app) => {
          (win.content.querySelector(`div[data-repo-id="${sanitize(repo.id)}"] > .apps`) as HTMLElement).innerHTML += `
            <div data-pkg="${sanitize(app.name)}" style="display: flex;gap: 20px;">
              <img src="${sanitize(app.icon ?? nullIcon)}" height="59.5px" style="border-radius: var(--app-radius);">
              <div>
                <h3 style="margin: 0;margin-bottom: 10px;">${sanitize(app.name)}</h3>
                <div style="display: flex;gap:5px;align-items: center;">
                  <code style="font-family: monospace;">${sanitize(app.targetVer)}</code>
                  <span class="material-symbols-rounded">download</span>
                </div>
              </div>
            </div>
          `

          fs.exists(`/opt/apps/${app.url.split('/').at(-1) as string}`).then((exists: boolean) => {
            fs.exists(`/home/Applications/${app.url.split('/').at(-1)?.replace('.js', '.app') as string}`).then((exists2: boolean) => {
              if (exists) {
                (win.content.querySelector(`div[data-pkg="${sanitize(app.name)}"] div > .material-symbols-rounded`) as HTMLElement).innerHTML = 'delete';

                (win.content.querySelector(`div[data-pkg="${sanitize(app.name)}"] div > .material-symbols-rounded`) as HTMLElement).onclick = async () => {
                  await fs.unlink(`/home/Applications/${app.url.split('/').at(-1)?.replace('.js', '.app') as string}`)
                  await fs.unlink(`/opt/apps/${app.url.split('/').at(-1) as string}`)
                }
              } else {
                (win.content.querySelector(`div[data-pkg="${sanitize(app.name)}"] div > .material-symbols-rounded`) as HTMLElement).onclick = () => {
                  install(app.url)
                }
              }
            })
          }).catch((e: any) => console.error(e))
        })
      })
    }

    function install (url: string): void {
      fetch(url).then(async (res) => await res.text())
        .then(async (data) => {
          await fs.writeFile(`/home/Applications/${url.split('/').at(-1)?.replace('.js', '.app') as string}`, `apps/${url.split('/').at(-1)?.split('.')[0] as string}`)
          await fs.writeFile(`/opt/apps/${url.split('/').at(-1) as string}`, data)
        }).catch(e => console.error(e))
    }
  }
}

export default Store
