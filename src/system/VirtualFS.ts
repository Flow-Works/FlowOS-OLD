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
              'Manager.lnk': {
                type: 'file',
                deleteable: true,
                permission: Permission.USER,
                content: Buffer.from('/home/Applications/Manager.app')
              },
              'Store.lnk': {
                type: 'file',
                deleteable: true,
                permission: Permission.USER,
                content: Buffer.from('/home/Applications/Store.app')
              },
              'TaskManager.lnk': {
                type: 'file',
                deleteable: true,
                permission: Permission.USER,
                content: Buffer.from('/home/Applications/TaskManager.app')
              },
              'Browser.lnk': {
                type: 'file',
                deleteable: true,
                permission: Permission.USER,
                content: Buffer.from('/home/Applications/Browser.app')
              },
              'ImageViewer.lnk': {
                type: 'file',
                deleteable: true,
                permission: Permission.USER,
                content: Buffer.from('/home/Applications/ImageViewer.app')
              },
              'Files.lnk': {
                type: 'file',
                deleteable: true,
                permission: Permission.USER,
                content: Buffer.from('/home/Applications/Files.app')
              },
              'Editor.lnk': {
                type: 'file',
                deleteable: true,
                permission: Permission.USER,
                content: Buffer.from('/home/Applications/Editor.app')
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
          flow: {
            type: 'file',
            deleteable: false,
            permission: Permission.ELEVATED,
            content: Buffer.from([
              'SERVER=https://server.flow-works.me',
              '24HOUR=FALSE'
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
  private fileSystem: { root: Directory } = defaultFS
  private db: IDBDatabase | null = null
  async init (dbName = 'virtualfs'): Promise<VirtualFS> {
    return await new Promise((resolve, reject) => {
      indexedDB.deleteDatabase(dbName)
      const request = indexedDB.open(dbName)
      request.onerror = () => {
        reject(new Error('Failed to open database'))
      }
      request.onsuccess = () => {
        this.db = request.result
        resolve(this)
      }
      request.onupgradeneeded = () => {
        const db = request.result
        db.createObjectStore('fs')
      }
    })
  }

  private setFileSystem (fileSystemObject: { root: Directory }): void {
    this.fileSystem = fileSystemObject
  }

  private readonly read = async (): Promise<any> => {
    const transaction = this.db?.transaction(['fs'], 'readonly')
    const store = transaction?.objectStore('fs')
    const getRequest = store?.get('fs')

    return await new Promise((resolve, reject) => {
      if (getRequest == null) return
      getRequest.onsuccess = () => {
        resolve(getRequest.result)
      }

      getRequest.onerror = () => {
        reject(getRequest.error)
      }
    })
  }

  private readonly write = async (fileSystemObject: { root: Directory }): Promise<void> => {
    this.fileSystem = fileSystemObject
    await this.save()
  }

  private readonly save = async (): Promise<void> => {
    const transaction = this.db?.transaction(['fs'], 'readwrite')
    const store = transaction?.objectStore('fs')
    const putRequest = store?.put(this.fileSystem, 'fs')

    return await new Promise((resolve, reject) => {
      if (putRequest == null) return
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

    if (!current.deleteable) throw new Error(Errors.EPERM)
    await this.handlePermissions(path)

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
