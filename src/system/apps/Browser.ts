import icon from '../../assets/icons/web-browser.svg'
import { Process } from '../../types'

const BrowserApp: Process = {
  config: {
    name: 'Browser',
    type: 'process',
    icon,
    targetVer: '1.0.0-indev.0'
  },
  run: async (process) => {
    const win = await process.loadLibrary('lib/WindowManager').then(wm => {
      return wm.createWindow({
        title: 'Browser',
        icon,
        width: 500,
        height: 700
      }, process)
    })

    const xor = await process.loadLibrary('lib/XOR')

    win.content.style.height = '100%'
    win.content.style.display = 'flex'
    win.content.style.flexDirection = 'column'
    win.content.innerHTML = `
      <div style="display: flex;padding: 10px;gap: 10px;">
        <div id="tabs-container" style="display: flex;gap: 10px;"></div>
        <button class="add">+</button>
      </div>
      <div class="tools" style="display:flex;gap:10px;align-items:center;">
        <i class='back material-symbols-rounded'>arrow_back</i>
        <i class='forward material-symbols-rounded'>arrow_forward</i>
        <i class='refresh material-symbols-rounded'>refresh</i>
        <input class="inp" style="border-radius: 15px;flex: 1;background: var(--base);border:none;padding: 0px 16px;height: 30px;">
        <i class='toggle material-symbols-rounded'>toggle_on</i>
        <i class='fullscreen material-symbols-rounded'>fullscreen</i>
      </div>
      <div id="content-container"></div>
      <style>
        iframe {
          width: 100%;
          height: 100%;
          border: none;
        }

        #content-container {
          flex: 1;
          background: white;
        }
        .add {
          border: none;
          background: transparent;
        }
        #tabs-container > div {
          padding: 5px 10px;
        }
        .active {
          background: var(--surface-0);
          border-radius: 10px!important;
        }

        .tools {
          background: var(--surface-0);
          padding: 10px;
        }
      </style>
    `

    class Tab {
      active = false
      proxy = true

      header = document.createElement('div')
      iframe: HTMLIFrameElement = document.createElement('iframe')

      constructor (url: string) {
        this.iframe.src = `/service/${xor.encode(url)}`
        this.iframe.style.display = 'none'

        this.header.innerHTML = `
          <span class="title">Tab</span>
          <span class="close">&times;</sp>
        `
      }

      toggle (): void {
        this.proxy = !this.proxy
        if (!this.proxy) {
          if (this === tabManager.activeTab) {
            (win.content.querySelector('.toggle') as HTMLElement).innerHTML = 'toggle_off'
          }
          (this.header.querySelector('.title') as HTMLElement).innerText = 'Tab'
          this.iframe.src = (win.content.querySelector('input')?.value as string)
          return
        }
        if (this === tabManager.activeTab) {
          (win.content.querySelector('.toggle') as HTMLElement).innerHTML = 'toggle_on'
        }
        this.iframe.src = `/service/${xor.encode(win.content.querySelector('input')?.value ?? '')}`
      }
    }

    class TabManager {
      tabs: Tab[] = []
      tabHistory: Tab[] = []

      activeTab: Tab

      addTab (tab: Tab): void {
        this.tabs.push(tab)
        this.setActiveTab(tab);

        (tab.header.querySelector('.title') as HTMLElement).onclick = (): void => this.setActiveTab(tab);
        (tab.header.querySelector('.close') as HTMLElement).onclick = (): void => this.closeTab(tab)

        win.content.querySelector('#content-container')?.appendChild(tab.iframe)
        win.content.querySelector('#tabs-container')?.appendChild(tab.header)

        tab.iframe.onload = () => {
          (tab.header.querySelector('.title') as HTMLElement).textContent = tab.iframe.contentDocument?.title ?? 'Tab'
          if (tab.iframe.contentDocument?.title as string === '') (tab.header.querySelector('.title') as HTMLElement).textContent = 'Tab'
          if (tab === this.activeTab) (win.content.querySelector('.inp') as HTMLInputElement).value = xor.decode((tab.iframe.contentWindow as Window).location.href.split('/service/')[1])
        }
      }

      closeTab (tab: Tab): void {
        tab.header.remove()
        tab.iframe.remove()

        if (tab.active) {
          const lastTab = win.content.querySelector('#tabs-container')?.lastElementChild
          if (lastTab !== undefined) (lastTab?.querySelector('.title') as HTMLElement).click()
          else this.addTab(new Tab('https://google.com'))
        }
      }

      setActiveTab (tab: Tab): void {
        this.tabs.forEach((tab) => {
          if (!tab.active) {
            return
          }
          tab.active = false
          tab.iframe.style.display = 'none'
          tab.header.classList.remove('active')
        })

        if (tab.proxy) {
          try { (win.content.querySelector('.inp') as HTMLInputElement).value = xor.decode((tab.iframe.contentWindow as Window).location.href.split('/service/')[1]) } catch (e) { (win.content.querySelector('.inp') as HTMLInputElement).value = 'about:blank' }
          (win.content.querySelector('.toggle') as HTMLElement).innerHTML = 'toggle_on'
        } else {
          (tab.header.querySelector('.title') as HTMLElement).textContent = 'Tab'
          try { (win.content.querySelector('.inp') as HTMLInputElement).value = (tab.iframe.contentWindow as Window).location.href } catch (e) { (win.content.querySelector('.inp') as HTMLInputElement).value = 'about:blank' }
          (win.content.querySelector('.toggle') as HTMLElement).innerHTML = 'toggle_off'
        }

        tab.active = true
        tab.iframe.style.display = 'block'
        tab.header.classList.add('active')

        this.activeTab = tab
        this.tabHistory.push(tab)
      }
    }

    const tabManager = new TabManager()

    win.content.querySelector('.inp')?.addEventListener('keydown', (event: KeyboardEvent) => {
      if (event.key === 'Enter') {
        tabManager.activeTab.iframe.src = tabManager.activeTab.proxy ? `/service/${xor.encode((win.content.querySelector('.inp') as HTMLInputElement).value)}` : (win.content.querySelector('.inp') as HTMLInputElement).value
      }
    });

    (win.content.querySelector('button') as HTMLElement).onclick = () => {
      tabManager.addTab(new Tab('https://google.com'))
    }

    (win.content.querySelector('.refresh') as HTMLElement).onclick = () => {
      tabManager.activeTab.iframe.contentWindow?.location.reload()
    }

    (win.content.querySelector('.back') as HTMLElement).onclick = () => {
      tabManager.activeTab.iframe.contentWindow?.history.back()
    }

    (win.content.querySelector('.forward') as HTMLElement).onclick = () => {
      tabManager.activeTab.iframe.contentWindow?.history.forward()
    }

    (win.content.querySelector('.toggle') as HTMLElement).onclick = () => {
      tabManager.activeTab.toggle()
    }

    win.content.onfullscreenchange = () => {
      (win.content.querySelector('.fullscreen') as HTMLElement).innerHTML = document.fullscreenElement !== null ? 'fullscreen_exit' : 'fullscreen'
    }

    (win.content.querySelector('.fullscreen') as HTMLElement).onclick = async () => {
      if (document.fullscreenElement === null) {
        await win.content.requestFullscreen().catch((e: any) => console.error)
      } else {
        await document.exitFullscreen().catch(e => console.error)
      }
    }

    tabManager.addTab(new Tab('https://google.com'))
  }
}

export default BrowserApp
