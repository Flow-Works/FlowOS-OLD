import { Process, RepoData } from '../../types'
import icon from '../../assets/icons/softwarecenter.svg'
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
    const HTML = await process.loadLibrary('lib/HTML')
    const { Button, Icon } = await process.loadLibrary('lib/Components')

    fetch(`${process.kernel.config.SERVER as string}/apps/list/`)
      .then(async (res) => await res.json())
      .then(handle)
      .catch(e => console.error(e))

    async function updateList (): Promise<void> {
      const res = fetch(`${process.kernel.config.SERVER as string}/apps/list/`)
      const repos = await (await res).json()
      const div = new HTML(win.content).qs('div')

      repos.forEach(async (repo: string, index: number) => {
        const repoDiv = div.qsa('div')[index]
        repoDiv?.html('')
        fetch(`${process.kernel.config.SERVER as string}/cors/?url=${repo}`)
          .then(async res => await res.json())
          .then((repo: RepoData) => {
            repo.apps.forEach((app) => {
              fs.exists(`/home/Applications/${app.url.split('/').at(-1)?.replace('.js', '.app') as string}`)
                .then((exists: boolean) => {
                  const button = Button.new().style({
                    display: 'flex',
                    gap: '5px',
                    'align-items': 'center'
                  }).text('Uninstall')
                    .prepend(Icon.new('delete'))
                    .on('click', () => uninstall(app.url))

                  if (exists) {
                    fetch(`${process.kernel.config.SERVER as string}/cors?url=${app.url}`)
                      .then(async (res) => await res.text())
                      .then(async (data) => {
                        const local = Buffer.from(await fs.readFile(`/opt/apps/${app.url.split('/').at(-1) as string}`)).toString()
                        if (local !== data) {
                          button.text('Update')
                            .prepend(Icon.new('update'))
                            .on('click', () => install(app.url))
                        }
                      }).catch(e => console.error(e))
                  } else {
                    button.text('Install')
                      .prepend(Icon.new('download'))
                      .on('click', () => install(app.url))
                  }

                  new HTML('div')
                    .style({
                      display: 'flex',
                      'flex-direction': 'row',
                      gap: '10px',
                      padding: '10px',
                      background: 'var(--base)',
                      'border-radius': '10px'
                    })
                    .appendMany(
                      new HTML('img').attr({
                        src: app.icon ?? nullIcon
                      }).style({
                        'aspect-ratio': '1 / 1',
                        width: '60px',
                        height: '60px'
                      }),
                      new HTML('div').appendMany(
                        new HTML('h3').style({
                          margin: '0'
                        }).text(app.name),
                        button
                      )
                    )
                    .appendTo(repoDiv)
                })
            })
          })
          .catch(e => console.error(e))
      })
    }

    function handle (repos: string[]): void {
      win.content.innerHTML = ''
      const div = new HTML('div').appendTo(win.content)
      repos.forEach((repo) => {
        fetch(`${process.kernel.config.SERVER as string}/cors/?url=${repo}`)
          .then(async res => await res.json())
          .then((repo: RepoData) => {
            const icon = Icon.new('arrow_drop_up')
            new HTML('h2').text(repo.name).style({
              margin: '0',
              padding: '10px',
              display: 'flex',
              gap: '5px',
              'align-items': 'center'
            })
              .prepend(icon)
              .appendTo(div)
              .on('click', () => {
                repoDiv.style({
                  height: repoDiv.elm.style.height === '0px' ? 'max-content' : '0'
                })
                icon.text(`arrow_drop_${repoDiv.elm.style.height === '0px' ? 'up' : 'down'}`)
              })
            const repoDiv = new HTML('div').appendTo(div).style({
              height: '0',
              display: 'flex',
              'flex-direction': 'column',
              gap: '10px',
              overflow: 'hidden',
              padding: '0 10px'
            })
            repo.apps.forEach((app) => {
              fs.exists(`/home/Applications/${app.url.split('/').at(-1)?.replace('.js', '.app') as string}`)
                .then((exists: boolean) => {
                  const button = Button.new().style({
                    display: 'flex',
                    gap: '5px',
                    'align-items': 'center'
                  }).text('Uninstall')
                    .prepend(Icon.new('delete'))
                    .on('click', () => uninstall(app.url))

                  if (exists) {
                    fetch(`${process.kernel.config.SERVER as string}/cors?url=${app.url}`)
                      .then(async (res) => await res.text())
                      .then(async (data) => {
                        const local = Buffer.from(await fs.readFile(`/opt/apps/${app.url.split('/').at(-1) as string}`)).toString()
                        if (local !== data) {
                          button.text('Update')
                            .prepend(Icon.new('update'))
                            .un('click', () => uninstall(app.url))
                            .on('click', () => install(app.url))
                        }
                      }).catch(e => console.error(e))
                  } else {
                    button.text('Install')
                      .prepend(Icon.new('download'))
                      .un('click', () => uninstall(app.url))
                      .on('click', () => install(app.url))
                  }

                  new HTML('div')
                    .style({
                      display: 'flex',
                      'flex-direction': 'row',
                      gap: '10px',
                      padding: '10px',
                      background: 'var(--base)',
                      'border-radius': '10px'
                    })
                    .appendMany(
                      new HTML('img').attr({
                        src: app.icon ?? nullIcon
                      }).style({
                        'aspect-ratio': '1 / 1',
                        width: '60px',
                        height: '60px'
                      }),
                      new HTML('div').appendMany(
                        new HTML('h3').style({
                          margin: '0'
                        }).text(app.name),
                        button
                      )
                    )
                    .appendTo(repoDiv)
                })
            })
          })
          .catch(e => console.error(e))
      })
    }

    function install (url: string): void {
      fetch(url).then(async (res) => await res.text())
        .then(async (data) => {
          await fs.writeFile(`/home/Applications/${url.split('/').at(-1)?.replace('.js', '.app') as string}`, `apps/${url.split('/').at(-1)?.split('.')[0] as string}`)
          await fs.writeFile(`/opt/apps/${url.split('/').at(-1) as string}`, data)
          await updateList()
        }).catch(e => console.error(e))
    }

    function uninstall (url: string): void {
      fs.unlink(`/home/Applications/${url.split('/').at(-1)?.replace('.js', '.app') as string}`)
        .then(async () => {
          await fs.unlink(`/opt/apps/${url.split('/').at(-1) as string}`)
          await updateList()
        })
        .catch(e => console.error(e))
    }
  }
}

export default Store
