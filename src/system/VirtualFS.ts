import { Directory, Errors, File, Permission, Stats } from '../types'

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
              'Mocha.theme': {
                type: 'file',
                deleteable: true,
                permission: Permission.USER,
                content: Buffer.from(JSON.stringify({
                  name: 'Catpuccin Mocha',
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
              }
            }
          },
          flow: {
            type: 'file',
            deleteable: false,
            permission: Permission.ELEVATED,
            content: Buffer.from([
              'SERVER=https://server.flow-works.me',
              '24HOUR=FALSE',
              'THEME=Mocha'
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
        const path = (await import('path')).join(directoryPath, key)
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
