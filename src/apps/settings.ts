import icon from '../assets/icons/settings.png'
import { App } from '../types.ts'
import { FlowWindow } from '../wm.ts'

export default class SettingsApp implements App {
  name = 'Settings'
  pkg = 'flow.settings'
  icon = icon
  version = '1.0.0'

  configFileLoc = '/.flow/config.json'
  configFolderLoc = '/.flow/'

  async open (): Promise<FlowWindow> {
    const fs = new (window as any).Filer.FileSystem()

    try {
      fs.exists(this.configFolderLoc, function (exists: any) {
        if (exists === false) {
          fs.mkdir(this.configFolderLoc, () => {})
        }
      })
    } catch (e) { alert(e.message) }
    try {
      fs.exists(this.configFileLoc, function (exists: any) {
        if (exists === false) {
          fs.writeFile(this.configFileLoc, '{"clock-Type":"0", "tab-title": "Flow OS", "favicon-icon": "to-be-replaced", "proxy-type": "uv", "search-engine": "google" }', () => {})
        }
      })
    } catch (e) {}

    const win = (window as any).wm.createWindow({
      title: this.name,
      icon,
      width: 700,
      height: 300,
      canResize: true
    })

    win.content.style.padding = '10px'
    win.content.innerHTML = `

      <div id=> 

      <h1>Appereance</h1>

      <p>Clock</p>
      <button class="btn"> 12 Hour Clock </button>
      <button class="btn"> 24 Hour Clock </button>

      <p>Tab Title</p>
      <input class="btn" placeholder="Enter Tab Title"> 
      <p>Tab Icon</p>
      <input class="btn" placeholder="Enter Icon URL"> 
      <p class="error-text"> </p>
      
      <h1>Browser Settings</h1>

      <p>Proxy Type</p>
      <select class="btn">
        <option value="uv">Ultraviolet</option>
        <option value="dy">Dynamic</option>
      </select>

      <p>Search Engine</p>
      <select class="btn">
        <option value="google">Google</option>
        <option value="bing">Bing</option>
        <option value="yahoo">Yahoo!</option>
        <option value="duck">DuckDuckGo</option>
      </select>

      <p>Server</p>
      <input class="btn" placeholder="Enter Server URL"> 
      <p class="error-text"> </p>


      <button disabled class="btn save"> Save </button>
      <style>
      
      .error-text {
        font-size:12px;
        color:red;
      }

      .btn {
        background-color:#45475a;
        border: none;
        border-radius: 5px;
        border: 2px solid #11111b;
        transition: 0.2s;
      }
      .btn:disabled {
        color:rgba(205, 214, 244, 0.4);
        transition: 0.2s;
      }

      .save {
        float: right;
        position: relative;
      }
      
      </style>
    `
    // Get current data
    const data = JSON.parse(await fs.promises.readFile(this.configFileLoc))
    let oldData = JSON.stringify(data)

    // Handle value changes

    win.content.getElementsByClassName('btn')[0].onclick = async () => {
      data['clock-Type'] = '0'
      win.content.getElementsByClassName('btn')[0].disabled = true
      win.content.getElementsByClassName('btn')[1].disabled = false
      settingsChange()
    }
    win.content.getElementsByClassName('btn')[1].onclick = async () => {
      data['clock-Type'] = '1'
      win.content.getElementsByClassName('btn')[0].disabled = false
      win.content.getElementsByClassName('btn')[1].disabled = true
      settingsChange()
    }

    win.content.getElementsByClassName('btn')[2].addEventListener('change', () => {
      data['tab-title'] = win.content.getElementsByClassName('btn')[2].value
      settingsChange()
    })

    win.content.getElementsByClassName('btn')[6].addEventListener('change', () => {
      if (isURL(win.content.getElementsByClassName('btn')[6].value) && win.content.getElementsByClassName('btn')[6].value !== '') {
        data['flow-server'] = win.content.getElementsByClassName('btn')[6].value
        win.content.getElementsByClassName('error-text')[1].textContent = ''
      } else {
        if (win.content.getElementsByClassName('btn')[6].value !== '') {
          win.content.getElementsByClassName('error-text')[1].textContent = 'Please input a vaild URL'
        } else {
          win.content.getElementsByClassName('error-text')[1].textContent = ''
        }
      }
      settingsChange()
    })

    win.content.getElementsByClassName('btn')[3].addEventListener('change', () => {
      if (isURL(win.content.getElementsByClassName('btn')[3].value) && win.content.getElementsByClassName('btn')[4].value !== '') {
        data['favicon-url'] = win.content.getElementsByClassName('btn')[3].value
        win.content.getElementsByClassName('error-text')[0].textContent = ''
      } else {
        if (win.content.getElementsByClassName('btn')[4].value !== '') {
          win.content.getElementsByClassName('error-text')[0].textContent = 'Please input a vaild URL'
        } else {
          win.content.getElementsByClassName('error-text')[0].textContent = ''
        }
      }
      settingsChange()
    })

    win.content.getElementsByClassName('btn')[4].value = data['proxy-type']
    win.content.getElementsByClassName('btn')[4].addEventListener('change', (event: any) => {
      data['proxy-type'] = event.target.value
      settingsChange()
    })

    win.content.getElementsByClassName('btn')[5].value = data['search-engine']
    win.content.getElementsByClassName('btn')[5].addEventListener('change', (event: any) => {
      data['search-engine'] = event.target.value
      settingsChange()
    })

    // Handle saving.

    win.content.getElementsByClassName('save')[0].onclick = async () => {
      await fs.promises.writeFile(this.configFileLoc, JSON.stringify(data))
      oldData = JSON.stringify(data)
      settingsChange()
    }

    // Display unsaved changes / prevent Save button from being clicked twice.

    function settingsChange (): void {
      if (oldData !== JSON.stringify(data)) {
        win.setTitle('Settings - Unsaved Changes')
        win.content.getElementsByClassName('save')[0].disabled = false
      } else {
        win.setTitle('Settings')
        win.content.getElementsByClassName('save')[0].disabled = true
      }
    }

    // URL checker

    function isURL (input: string): boolean {
      try {
        const url = new URL(input)
        return true
      } catch (error) {
        return false
      }
    }

    // Set values
    win.content.getElementsByClassName('btn')[0].disabled = true
    win.content.getElementsByClassName('btn')[1].disabled = false
    if (data['clock-Type'] === '0') {
      win.content.getElementsByClassName('btn')[0].disabled = false
      win.content.getElementsByClassName('btn')[1].disabled = true
    }

    return win
  }
}
