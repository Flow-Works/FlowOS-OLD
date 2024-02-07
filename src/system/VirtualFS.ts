import { parse, stringify } from 'js-ini'
import { Directory, Errors, File, Permission, Stats } from '../types'
import path from 'path'
const p = path

export const defaultFS: { root: Directory } = {
  root: {
    type: 'directory',
    deleteable: false,
    permission: Permission.SYSTEM,
    children: {
      home: {
        type: 'directory',
        deleteable: false,
        permission: Permission.SYSTEM,
        children: {
          Downloads: {
            type: 'directory',
            deleteable: false,
            permission: Permission.USER,
            children: {}
          },
          Applications: {
            type: 'directory',
            deleteable: false,
            permission: Permission.USER,
            children: {
              'Info.app': {
                type: 'file',
                deleteable: true,
                permission: Permission.USER,
                content: Buffer.from('apps/Info')
              },
              'Manager.app': {
                type: 'file',
                deleteable: true,
                permission: Permission.USER,
                content: Buffer.from('apps/Manager')
              },
              'Store.app': {
                type: 'file',
                deleteable: true,
                permission: Permission.USER,
                content: Buffer.from('apps/Store')
              },
              'TaskManager.app': {
                type: 'file',
                deleteable: true,
                permission: Permission.USER,
                content: Buffer.from('apps/TaskManager')
              },
              'Browser.app': {
                type: 'file',
                deleteable: true,
                permission: Permission.USER,
                content: Buffer.from('apps/Browser')
              },
              'ImageViewer.app': {
                type: 'file',
                deleteable: true,
                permission: Permission.USER,
                content: Buffer.from('apps/ImageViewer')
              },
              'Files.app': {
                type: 'file',
                deleteable: true,
                permission: Permission.USER,
                content: Buffer.from('apps/Files')
              },
              'Editor.app': {
                type: 'file',
                deleteable: true,
                permission: Permission.USER,
                content: Buffer.from('apps/Editor')
              },
              'Settings.app': {
                type: 'file',
                deleteable: true,
                permission: Permission.USER,
                content: Buffer.from('apps/Settings')
              },
              'ThemeMaker.app': {
                type: 'file',
                deleteable: true,
                permission: Permission.USER,
                content: Buffer.from('apps/ThemeMaker')
              }
            }
          },
          Desktop: {
            type: 'directory',
            deleteable: false,
            permission: Permission.USER,
            children: {
              'README.md': {
                type: 'file',
                deleteable: true,
                permission: Permission.USER,
                content: Buffer.from('# Welcome to FlowOS!')
              },
              'Info.lnk': {
                type: 'file',
                deleteable: true,
                permission: Permission.USER,
                content: Buffer.from('/home/Applications/Info.app')
              },
              'Browser.lnk': {
                type: 'file',
                deleteable: true,
                permission: Permission.USER,
                content: Buffer.from('/home/Applications/Browser.app')
              },
              'Files.lnk': {
                type: 'file',
                deleteable: true,
                permission: Permission.USER,
                content: Buffer.from('/home/Applications/Files.app')
              }
            }
          },
          Pictures: {
            type: 'directory',
            deleteable: false,
            permission: Permission.USER,
            children: {}
          },
          Videos: {
            type: 'directory',
            deleteable: false,
            permission: Permission.USER,
            children: {}
          },
          Documents: {
            type: 'directory',
            deleteable: false,
            permission: Permission.USER,
            children: {}
          },
          Music: {
            type: 'directory',
            deleteable: false,
            permission: Permission.USER,
            children: {}
          }
        }
      },
      var: {
        type: 'directory',
        deleteable: false,
        permission: Permission.SYSTEM,
        children: {}
      },
      etc: {
        type: 'directory',
        deleteable: false,
        permission: Permission.SYSTEM,
        children: {
          themes: {
            type: 'directory',
            deleteable: false,
            permission: Permission.SYSTEM,
            children: {
              'Latte.theme': {
                type: 'file',
                deleteable: true,
                permission: Permission.USER,
                content: Buffer.from(JSON.stringify({
                  name: 'Catppuccin Latté',
                  extras: {
                    rosewater: '#dc8a78',
                    flamingo: '#dd7878',
                    pink: '#ea76cb',
                    mauve: '#8839ef',
                    red: '#d20f39',
                    maroon: '#e64553',
                    peach: '#fe640b',
                    yellow: '#df8e1d',
                    green: '#40a02b',
                    teal: '#179299',
                    sky: '#04a5e5',
                    sapphire: '#209fb5',
                    blue: '#1e66f5',
                    lavender: '#7287fd'
                  },
                  colors: {
                    text: '#4c4f69',
                    'surface-2': '#acb0be',
                    'surface-1': '#bcc0cc',
                    'surface-0': '#ccd0da',
                    base: '#eff1f5',
                    mantle: '#e6e9ef',
                    crust: '#dce0e8'
                  }
                }))
              },
              'Frappe.theme': {
                type: 'file',
                deleteable: true,
                permission: Permission.USER,
                content: Buffer.from(JSON.stringify({
                  name: 'Catppuccin Frappé',
                  extras: {
                    rosewater: '#f2d5cf',
                    flamingo: '#eebebe',
                    pink: '#f4b8e4',
                    mauve: '#ca9ee6',
                    red: '#e78284',
                    maroon: '#ea999c',
                    peach: '#ef9f76',
                    yellow: '#e5c890',
                    green: '#a6d189',
                    teal: '#81c8be',
                    sky: '#99d1db',
                    sapphire: '#85c1dc',
                    blue: '#8caaee',
                    lavender: '#babbf1'
                  },
                  colors: {
                    text: '#c6d0f5',
                    'surface-2': '#626880',
                    'surface-1': '#51576d',
                    'surface-0': '#414559',
                    base: '#303446',
                    mantle: '#292c3c',
                    crust: '#232634'
                  }
                }))
              },
              'Macchiato.theme': {
                type: 'file',
                deleteable: true,
                permission: Permission.USER,
                content: Buffer.from(JSON.stringify({
                  name: 'Catppuccin Macchiato',
                  extras: {
                    rosewater: '#f4dbd6',
                    flamingo: '#f0c6c6',
                    pink: '#f5bde6',
                    mauve: '#c6a0f6',
                    red: '#ed8796',
                    maroon: '#ee99a0',
                    peach: '#f5a97f',
                    yellow: '#eed49f',
                    green: '#a6da95',
                    teal: '#8bd5ca',
                    sky: '#91d7e3',
                    sapphire: '#7dc4e4',
                    blue: '#8aadf4',
                    lavender: '#b7bdf8'
                  },
                  colors: {
                    text: '#cad3f5',
                    'surface-2': '#5b6078',
                    'surface-1': '#494d64',
                    'surface-0': '#363a4f',
                    base: '#24273a',
                    mantle: '#1e2030',
                    crust: '#181926'
                  }
                }))
              },
              'Mocha.theme': {
                type: 'file',
                deleteable: true,
                permission: Permission.USER,
                content: Buffer.from(JSON.stringify({
                  name: 'Catpuccin Mocha',
                  extras: {
                    rosewater: '#f5e0dc',
                    flamingo: '#f2cdcd',
                    pink: '#f5c2e7',
                    mauve: '#cba6f7',
                    red: '#f38ba8',
                    maroon: '#eba0ac',
                    peach: '#fab387',
                    yellow: '#f9e2af',
                    green: '#a6e3a1',
                    teal: '#94e2d5',
                    sky: '#89dceb',
                    sapphire: '#74c7ec',
                    blue: '#89b4fa',
                    lavender: '#b4befe'
                  },
                  colors: {
                    text: '#cdd6f4',
                    'surface-2': '#585b70',
                    'surface-1': '#45475a',
                    'surface-0': '#313244',
                    base: '#1e1e2e',
                    mantle: '#181825',
                    crust: '#11111b'
                  }
                }))
              },
              'RosePine.theme': {
                type: 'file',
                deleteable: true,
                permission: Permission.USER,
                content: Buffer.from(JSON.stringify({
                  name: 'Rosé Pine',
                  extras: {
                    love: '#eb6f92',
                    gold: '#f6c177',
                    rose: '#ebbcba',
                    pine: '#31748f',
                    foam: '#9ccfd8',
                    iris: '#c4a7e7'
                  },
                  colors: {
                    text: '#e0def4',
                    'surface-2': '#524f67',
                    'surface-1': '#403d52',
                    'surface-0': '#21202e',
                    base: '#26233a',
                    mantle: '#1f1d2e',
                    crust: '#191724'
                  }
                }))
              },
              'RosePineMoon.theme': {
                type: 'file',
                deleteable: true,
                permission: Permission.USER,
                content: Buffer.from(JSON.stringify({
                  name: 'Rosé Pine Moon',
                  extras: {
                    love: '#eb6f92',
                    gold: '#f6c177',
                    rose: '#ebbcba',
                    pine: '#31748f',
                    foam: '#9ccfd8',
                    iris: '#c4a7e7'
                  },
                  colors: {
                    text: '#e0def4',
                    'surface-2': '#2a283e',
                    'surface-1': '#44415a',
                    'surface-0': '#56526e',
                    base: '#393552',
                    mantle: '#2a273f',
                    crust: '#232136'
                  }
                }))
              },
              'RosePineDawn.theme': {
                type: 'file',
                deleteable: true,
                permission: Permission.USER,
                content: Buffer.from(JSON.stringify({
                  name: 'Rosé Pine Dawn',
                  extras: {
                    love: '#b4637a',
                    gold: '#ea9d34',
                    rose: '#d7827e',
                    pine: '#286983',
                    foam: '#56949f',
                    iris: '#907aa9'
                  },
                  colors: {
                    text: '#575279',
                    'surface-2': '#cecacd',
                    'surface-1': '#dfdad9',
                    'surface-0': '#f4ede8',
                    base: '#f2e9e1',
                    mantle: '#fffaf3',
                    crust: '#faf4ed'
                  }
                }))
              }
            }
          },
          flow: {
            type: 'file',
            deleteable: false,
            permission: Permission.ELEVATED,
            content: Buffer.from([
              'SERVER=https://server.flow-works.me',
              '24_HOUR=false',
              'THEME=Mocha',
              'THEME_PRIMARY=blue'
            ].join('\n'))
          },
          hostname: {
            type: 'file',
            deleteable: false,
            permission: Permission.ELEVATED,
            content: Buffer.from('flow')
          }
        }
      },
      opt: {
        type: 'directory',
        deleteable: false,
        permission: Permission.SYSTEM,
        children: {
          apps: {
            type: 'directory',
            deleteable: false,
            permission: Permission.SYSTEM,
            children: {}
          }
        }
      }
    }
  }
}

class VirtualFS {
  private fileSystem: { root: Directory }
  private db: IDBDatabase | null = null

  private async addMissingFiles (): Promise<void> {
    const addDirectoryRecursive = async (directory: Directory, directoryPath: string): Promise<void> => {
      for (const [key, value] of Object.entries(directory.children)) {
        const path = p.join(directoryPath, key)
        if (value.type === 'file' && path.startsWith('/etc/themes/')) {
          await this.writeFile(path, Buffer.from(value.content).toString())
          return
        }
        if (value.type === 'directory') {
          if (!await this.exists(path)) {
            await this.mkdir(path)
          }
          await addDirectoryRecursive(value, path)
        } else if (value.type === 'file' && !await this.exists(path)) {
          await this.writeFile(path, Buffer.from(value.content).toString())
        }
      }
    }
    await addDirectoryRecursive(defaultFS.root, '/')

    await this.readFile('/etc/flow').then(async (data: Uint8Array) => {
      const dataString = Buffer.from(data).toString()
      const config = parse(dataString)

      if (config.SERVER == null) {
        config.SERVER = 'https://server.flow-works.me'
        await this.writeFile('/etc/flow', stringify(config))
      }
      if (config['24_HOUR'] == null) {
        config['24_HOUR'] = 'FALSE'
        await this.writeFile('/etc/flow', stringify(config))
      }
      if (config.THEME == null) {
        config.THEME = 'Mocha'
        await this.writeFile('/etc/flow', stringify(config))
      }
      if (config.THEME_PRIMARY == null) {
        config.THEME_PRIMARY = 'blue'
        await this.writeFile('/etc/flow', stringify(config))
      }
    })
  }

  async init (dbName = 'virtualfs'): Promise<VirtualFS> {
    return await new Promise((resolve, reject) => {
      const request = indexedDB.open(dbName)
      request.onupgradeneeded = (event) => {
        const target = event.target as IDBRequest
        const db = target.result
        db.createObjectStore('fs')
      }
      request.onerror = () => {
        reject(new Error('Failed to open database'))
      }
      request.onsuccess = async (event) => {
        const target = event.target as IDBRequest
        this.db = target.result
        await navigator.storage.persist()
        this.fileSystem = await this.read()
        if (this.fileSystem == null) await this.write(defaultFS)
        else await this.addMissingFiles()
        resolve(this)
      }
    })
  }

  private readonly read = async (): Promise<{ root: Directory }> => {
    if (this.db == null) throw new Error('Database is null')
    const transaction = this.db.transaction(['fs'], 'readonly')
    const store = transaction.objectStore('fs')
    const getRequest = store.get('fs')

    return await new Promise((resolve, reject) => {
      getRequest.onsuccess = (event) => {
        const target = event.target as IDBRequest
        resolve(target.result)
      }

      getRequest.onerror = (event) => {
        reject(getRequest.error)
      }
    })
  }

  private readonly write = async (fileSystemObject: { root: Directory }): Promise<void> => {
    this.fileSystem = fileSystemObject
    await this.save()
  }

  private readonly save = async (): Promise<void> => {
    if (this.db == null) throw new Error('Database is null')
    const transaction = this.db.transaction(['fs'], 'readwrite')
    const store = transaction.objectStore('fs')
    const putRequest = store.put(this.fileSystem, 'fs')

    return await new Promise((resolve, reject) => {
      putRequest.onsuccess = () => {
        document.dispatchEvent(new CustomEvent('fs_update', {}))
        resolve()
      }

      putRequest.onerror = () => {
        reject(putRequest.error)
      }
    })
  }

  private readonly navigatePath = async (path: string): Promise<{ current: Directory | File, parts: string[] }> => {
    const parts = path.split('/').filter(x => x !== '')
    let current = this.fileSystem.root
    for (const part of parts) {
      current = current.children[part] as Directory
    }
    return { current, parts }
  }

  private readonly navigatePathParent = async (path: string): Promise<{ current: Directory, parts: string[], filename: string }> => {
    const parts = path.split('/').filter(x => x !== '')
    const filename = parts.pop() as string
    let current = this.fileSystem.root
    for (const part of parts) {
      current = current.children[part] as Directory
    }
    return { current, parts, filename }
  }

  private readonly handlePermissions = async (path: string): Promise<void> => {
    const { current } = await this.navigatePath(path)
    if (current.permission === Permission.SYSTEM) throw new Error(Errors.EPERM)
  }

  unlink = async (path: string): Promise<void> => {
    const { current, filename } = await this.navigatePathParent(path)

    if (!current.children[filename].deleteable) throw new Error(Errors.EPERM)
    await this.handlePermissions(path)

    Reflect.deleteProperty(current.children, filename)

    console.debug(`unlink ${path}`)
    await this.save()
  }

  readFile = async (path: string): Promise<Buffer> => {
    const { current } = await this.navigatePath(path)

    await this.handlePermissions(path)

    if (current.type !== 'file') throw new Error(Errors.EISDIR)

    console.debug(`read ${path}`)
    return current.content
  }

  writeFile = async (path: string, content: string | Buffer): Promise<void> => {
    const { current, filename } = await this.navigatePathParent(path)

    let permission

    if (typeof current.children[filename] === 'undefined') {
      permission = Permission.USER
    } else {
      await this.handlePermissions(path)
      permission = current.children[filename].permission
    }

    current.children[filename] = {
      type: 'file',
      deleteable: true,
      permission,
      content: Buffer.from(content)
    }

    console.debug(`write ${path}`)
    await this.save()
  }

  mkdir = async (path: string): Promise<void> => {
    const { current, filename } = await this.navigatePathParent(path)

    let permission

    if (typeof current.children[filename] === 'undefined') {
      permission = Permission.USER
    } else {
      await this.handlePermissions(path)
      permission = current.children[filename].permission
    }

    current.children[filename] = {
      type: 'directory',
      deleteable: true,
      permission: path === '/tmp' ? Permission.USER : permission,
      children: {}
    }

    console.debug(`mkdir ${path}`)
    await this.save()
  }

  rmdir = async (path: string): Promise<void> => {
    const { current, filename } = await this.navigatePathParent(path)

    if (!current.deleteable && path !== '/tmp') throw new Error(Errors.EPERM)
    if (path !== '/tmp') await this.handlePermissions(path)

    if (current.children[filename].type !== 'directory') throw new Error(Errors.ENOTDIR)

    Reflect.deleteProperty(current.children, filename)

    console.debug(`rmdir ${path}`)
    await this.save()
  }

  readdir = async (path: string): Promise<string[]> => {
    const { current } = await this.navigatePath(path)

    if (current.type === 'file') throw new Error(Errors.ENOTDIR)
    const result = await Promise.all(Object.keys(current.children ?? {}))

    console.debug(`readdir ${path}`)
    return result
  }

  stat = async (path: string): Promise<Stats> => {
    const { current } = await this.navigatePath(path)

    console.debug(`stat ${path}`)
    return {
      isDirectory: () => current.type === 'directory',
      isFile: () => current.type === 'file'
    }
  }

  rename = async (oldPath: string, newPath: string): Promise<void> => {
    const { current: oldCurrent, filename: oldFilename } = await this.navigatePathParent(oldPath)
    const { current: newCurrent, filename: newFilename } = await this.navigatePathParent(newPath)

    if (!oldCurrent.deleteable) throw new Error(Errors.EPERM)
    if (!newCurrent.deleteable) throw new Error(Errors.EPERM)

    await this.handlePermissions(oldPath)
    await this.handlePermissions(newPath)

    newCurrent.children[newFilename] = oldCurrent.children[oldFilename]
    Reflect.deleteProperty(oldCurrent.children, oldFilename)

    console.debug(`rename ${oldPath} -> ${newPath}`)
    await this.save()
  }

  exists = async (path: string): Promise<boolean> => {
    console.debug(`exists ${path}`)
    try {
      const { current } = await this.navigatePath(path)
      return current !== undefined
    } catch (e) {
      return false
    }
  }
}

export default VirtualFS
