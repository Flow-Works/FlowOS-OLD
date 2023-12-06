import icon from '../../assets/icons/softwarecenter.svg'
import { App, RepoData } from '../../types'
import FlowWindow from '../../structures/FlowWindow'
import { sanitize } from '../../utils'
import nullIcon from '../../assets/icons/application-default-icon.svg'

export default class MusicApp implements App {
  meta = {
    name: 'Store',
    description: 'A simple store app.',
    pkg: 'flow.store',
    version: '1.0.0',
    icon
  }

  async open (): Promise<FlowWindow> {
    const win = window.wm.createWindow({
      title: this.meta.name,
      icon: this.meta.icon,
      width: 500,
      height: 700
    })

    win.content.style.background = 'var(--base)'

    const config = await window.config()

    fetch(config.SERVER_URL + '/apps/list/')
      .then(async (res) => await res.json())
      .then(handle)
      .catch(e => console.error(e))

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
            <div data-pkg="${sanitize(app.pkg)}" style="display: flex;gap: 20px;">
              <img src="${sanitize(app.icon ?? nullIcon)}" height="59.5px" style="border-radius: var(--app-radius);">
              <div>
                <h3 style="margin: 0;margin-bottom: 10px;">${sanitize(app.name)}</h3>
                <div style="display: flex;gap:5px;align-items: center;">
                  <code style="font-family: monospace;">${sanitize(app.pkg)}</code>
                  <span class="material-symbols-rounded">download</span>
                </div>
              </div>
            </div>
          `

          window.fs.exists(`/Applications/${app.url.split('/').at(-1) as string}`, (exists) => {
            if (exists) {
              (win.content.querySelector(`div[data-pkg="${sanitize(app.pkg)}"] div > .material-symbols-rounded`) as HTMLElement).innerHTML = 'delete';

              (win.content.querySelector(`div[data-pkg="${sanitize(app.pkg)}"] div > .material-symbols-rounded`) as HTMLElement).onclick = () => {
                window.fs.unlink(`/Applications/${app.url.split('/').at(-1) as string}`, () => {
                  window.location.reload()
                })
              }
            } else {
              (win.content.querySelector(`div[data-pkg="${sanitize(app.pkg)}"] div > .material-symbols-rounded`) as HTMLElement).onclick = () => {
                install(app.url)
              }
            }
          });

          (win.content.querySelector(`div[data-pkg="${sanitize(app.pkg)}"] div > .material-symbols-rounded`) as HTMLElement).onclick = () => {
            install(app.url)
          }
        })
      })
    }

    function install (url: string): void {
      fetch(url).then(async (res) => await res.text())
        .then((data) => {
          window.fs.exists('/Applications', (exists) => {
            if (!exists) window.fs.promises.mkdir('/Applications').catch(console.error)

            window.fs.promises.writeFile(`/Applications/${url.split('/').at(-1) as string}`, data).then(() => window.location.reload()).catch(console.error)
          })
        }).catch(console.error)
    }

    return win
  }
}
