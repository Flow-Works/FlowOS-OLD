import Kernel from '../../kernel'
import ProcessLib from '../../structures/ProcessLib'
import { Directory, Errors, File, Library, Permission, Stats } from '../../types'

console.debug = (...args: any[]) => {
  console.log('[VirtualFS]', ...args)
}

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

export const setFileSystem = async (fileSystemObject: { root: Directory }): Promise<void> => {
  fileSystem = fileSystemObject
}

export let db: IDBDatabase
let fileSystem: { root: Directory }
let kernel: Kernel
let process: ProcessLib

export const initializeDatabase = async (dbName: string): Promise<boolean> => {
  return await new Promise((resolve, reject) => {
    const request = window.indexedDB.open(dbName)

    request.onupgradeneeded = (event: Event) => {
      const target = event.target as IDBRequest
      const db = target.result
      db.createObjectStore('fs')
    }

    request.onerror = (event: Event) => {
      reject(new Error('[VirtualFS] Error opening database.'))
    }

    request.onsuccess = () => {
      db = request.result
      resolve(true)
    }
  })
}

export const read = async (): Promise<any> => {
  const transaction = db.transaction(['fs'], 'readonly')
  const store = transaction.objectStore('fs')
  const getRequest = store.get('fs')

  return await new Promise((resolve, reject) => {
    getRequest.onsuccess = () => {
      resolve(getRequest.result)
    }

    getRequest.onerror = () => {
      reject(getRequest.error)
    }
  })
}

export const write = async (fileSystemObject: { root: Directory }): Promise<void> => {
  fileSystem = fileSystemObject
  await save()
}

const save = async (): Promise<void> => {
  const transaction = db.transaction(['fs'], 'readwrite')
  const store = transaction.objectStore('fs')
  const putRequest = store.put(fileSystem, 'fs')

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

const handlePermissions = async (path: string): Promise<void> => {
  let { current } = (await navigatePath(path))

  if (current === undefined) current = (await navigatePathParent(path)).current

  if (current.permission === Permission.USER && current.permission > process.permission) {
    const uac = await kernel.startExecutable('UserAccessControl', Permission.SYSTEM, { type: 'fs', process, path })
    if (uac.value === false) {
      throw new Error(Errors.EACCES)
    }
  }
  if (current.permission === Permission.ELEVATED && current.permission > process.permission) {
    const uac = await kernel.startExecutable('UserAccessControl', Permission.SYSTEM, { type: 'fs', process, path })
    if (uac.value === false) {
      throw new Error(Errors.EACCES)
    }
  }
  if (current.permission === Permission.SYSTEM && current.permission > process.permission) throw new Error(Errors.EPERM)
}

const navigatePath = async (path: string): Promise<{ current: Directory | File, parts: string[] }> => {
  const parts = path.split('/').filter(x => x !== '')
  let current = fileSystem.root
  for (const part of parts) {
    current = current.children[part] as Directory
  }
  return { current, parts }
}

const navigatePathParent = async (path: string): Promise<{ current: Directory, parts: string[], filename: string }> => {
  const parts = path.split('/').filter(x => x !== '')
  const filename = parts.pop() as string
  let current = fileSystem.root
  for (const part of parts) {
    current = current.children[part] as Directory
  }
  return { current, parts, filename }
}

const VirtualFS: Library = {
  config: {
    name: 'VirtualFS',
    type: 'library',
    targetVer: '1.0.0-indev.0'
  },
  init: (l, k, p) => {
    kernel = k
    process = p
  },
  data: {
    unlink: async (path: string): Promise<void> => {
      const { current, filename } = await navigatePathParent(path)

      if (!current.children[filename].deleteable) throw new Error(Errors.EPERM)
      await handlePermissions(path)

      Reflect.deleteProperty(current.children, filename)

      console.debug(`unlink ${path}`)
      await save()
    },
    readFile: async (path: string): Promise<Buffer> => {
      const { current } = await navigatePath(path)

      await handlePermissions(path)

      if (current.type !== 'file') throw new Error(Errors.EISDIR)

      console.debug(`read ${path}`)
      return current.content
    },
    writeFile: async (path: string, content: string | Buffer): Promise<void> => {
      const { current, filename } = await navigatePathParent(path)

      let permission

      if (typeof current.children[filename] === 'undefined') {
        permission = Permission.USER
      } else {
        await handlePermissions(path)
        permission = current.children[filename].permission
      }

      current.children[filename] = {
        type: 'file',
        deleteable: true,
        permission,
        content: Buffer.from(content)
      }

      console.debug(`write ${path}`)
      await save()
    },
    mkdir: async (path: string): Promise<void> => {
      const { current, filename } = await navigatePathParent(path)

      let permission

      if (typeof current.children[filename] === 'undefined') {
        permission = Permission.USER
      } else {
        await handlePermissions(path)
        permission = current.children[filename].permission
      }

      current.children[filename] = {
        type: 'directory',
        deleteable: true,
        permission,
        children: {}
      }

      console.debug(`mkdir ${path}`)
      await save()
    },
    rmdir: async (path: string): Promise<void> => {
      const { current, filename } = await navigatePathParent(path)

      if (!current.deleteable) throw new Error(Errors.EPERM)
      await handlePermissions(path)

      if (current.children[filename].type !== 'directory') throw new Error(Errors.ENOTDIR)

      Reflect.deleteProperty(current.children, filename)

      console.debug(`rmdir ${path}`)
      await save()
    },
    readdir: async (path: string): Promise<string[]> => {
      const { current } = await navigatePath(path)

      if (current.type === 'file') throw new Error(Errors.ENOTDIR)
      const result = await Promise.all(Object.keys(current.children ?? {}))

      console.debug(`readdir ${path}`)
      return result
    },
    stat: async (path: string): Promise<Stats> => {
      const { current } = await navigatePath(path)

      console.debug(`stat ${path}`)
      return {
        isDirectory: () => current.type === 'directory',
        isFile: () => current.type === 'file'
      }
    },
    rename: async (oldPath: string, newPath: string): Promise<void> => {
      const { current: oldCurrent, filename: oldFilename } = await navigatePathParent(oldPath)
      const { current: newCurrent, filename: newFilename } = await navigatePathParent(newPath)

      if (!oldCurrent.deleteable) throw new Error(Errors.EPERM)
      if (!newCurrent.deleteable) throw new Error(Errors.EPERM)

      await handlePermissions(oldPath)
      await handlePermissions(newPath)

      newCurrent.children[newFilename] = oldCurrent.children[oldFilename]
      Reflect.deleteProperty(oldCurrent.children, oldFilename)

      console.debug(`rename ${oldPath} -> ${newPath}`)
      await save()
    },
    exists: async (path: string): Promise<boolean> => {
      console.debug(`exists ${path}`)
      try {
        const { current } = await navigatePath(path)
        return current !== undefined
      } catch (e) {
        return false
      }
    }
  }
}

export default VirtualFS
