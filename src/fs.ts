export enum Errors {
  ENOENT = 'ENOENT',
  EISDIR = 'EISDIR',
  EEXIST = 'EEXIST',
  EPERM = 'EPERM',
  ENOTDIR = 'ENOTDIR',
  EACCES = 'EACCES'
}

export enum Permission {
  ROOT,
  ADMIN,
  USER
}

export interface Directory {
  type: 'directory'
  permission: Permission
  children: {
    [key: string]: Directory | File
  }
}

export interface File {
  type: 'file'
  permission: Permission
  content: Buffer
}

const defaultFS: { root: Directory } = {
  root: {
    type: 'directory',
    permission: Permission.ROOT,
    children: {
      home: {
        type: 'directory',
        permission: Permission.ROOT,
        children: {
          Downloads: {
            type: 'directory',
            permission: Permission.ADMIN,
            children: {}
          },
          Applications: {
            type: 'directory',
            permission: Permission.ADMIN,
            children: {}
          },
          Desktop: {
            type: 'directory',
            permission: Permission.ADMIN,
            children: {
              'README.md': {
                type: 'file',
                permission: Permission.USER,
                content: Buffer.from('# Welcome to FlowOS!')
              }
            }
          },
          Pictures: {
            type: 'directory',
            permission: Permission.ADMIN,
            children: {}
          },
          Videos: {
            type: 'directory',
            permission: Permission.ADMIN,
            children: {}
          },
          Documents: {
            type: 'directory',
            permission: Permission.ADMIN,
            children: {}
          },
          Music: {
            type: 'directory',
            permission: Permission.ADMIN,
            children: {}
          }
        }
      },
      var: {
        type: 'directory',
        permission: Permission.ROOT,
        children: {}
      },
      etc: {
        type: 'directory',
        permission: Permission.ROOT,
        children: {}
      },
      boot: {
        type: 'directory',
        permission: Permission.ROOT,
        children: {}
      }
    }
  }
}

export class VirtualFS {
  private db: IDBDatabase
  private fileSystem: { root: Directory }

  constructor (dbName = 'virtualfs') {
    this.initializeDatabase(dbName)
      .then(async () => {
        this.db.onerror = (event: Event) => {
          const target = event.target as IDBRequest
          const errorMessage = target.error !== null ? target.error.message : 'Unknown error'
          throw new Error(`[VirtualFS] ${target.error?.name ?? 'Unknown Error'}: ${errorMessage}`)
        }
        navigator.storage.persist().catch(e => console.error(e))
        const fs = await this.read()
        fs === undefined ? await this.write(defaultFS) : this.fileSystem = fs
        console.log('[VirtualFS] Database initialized')
      })
      .catch(e => console.error(e))
  }

  /**
   * The function initializes a database using IndexedDB in TypeScript.
   * @param {string} dbName - The `dbName` parameter is a string that represents the name of the
   * database that you want to initialize.
   * @returns a Promise<boolean>.
   */
  private async initializeDatabase (dbName: string): Promise<boolean> {
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
        this.db = request.result
        resolve(true)
      }
    })
  }

  /**
   * The function reads data from an object store in a transaction and returns a promise that resolves
   * with the result.
   * @returns a Promise that resolves to the result of the `getRequest` operation.
   */
  private async read (): Promise<any> {
    const transaction = this.db.transaction(['fs'], 'readonly')
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

  /**
   * The `write` function is a private asynchronous method that takes a `fileSystem` object as a
   * parameter, sets it as the current file system, and then saves it.
   * @param fileSystem - The `fileSystem` parameter is an object that represents the file system. It
   * has a property `root` which is a `Directory` object representing the root directory of the file
   * system.
   */
  private async write (fileSystem: { root: Directory }): Promise<void> {
    this.fileSystem = fileSystem
    await this.save()
  }

  private async save (): Promise<void> {
    const transaction = this.db.transaction(['fs'], 'readwrite')
    const store = transaction.objectStore('fs')
    const putRequest = store.put(this.fileSystem, 'fs')

    return await new Promise((resolve, reject) => {
      putRequest.onsuccess = () => {
        resolve()
      }

      putRequest.onerror = () => {
        reject(putRequest.error)
      }
    })
  }

  /**
   * The function handles permissions for a given path and permission level, throwing an error if the
   * current permission level is higher than the requested permission level.
   * @param {string} path - A string representing the path to a resource or file.
   * @param {Permission} permission - The `permission` parameter is of type `Permission`, which is an
   * enum representing different levels of permissions. It is used to determine if the current user has
   * sufficient permissions to access a certain path.
   */
  private async handlePermissions (path: string, permission: Permission): Promise<void> {
    const { current } = await this.navigatePath(path)

    if (current.permission === Permission.ADMIN && current.permission <= permission) throw new Error(Errors.EACCES)
    if (current.permission === Permission.ROOT && current.permission <= permission) throw new Error(Errors.EPERM)
  }

  /**
   * The function `navigatePath` takes a path as input and returns the current directory or file object
   * and the individual parts of the path.
   * @param {string} path - A string representing the path to navigate in the file system.
   * @returns an object with two properties: "current" and "parts". The "current" property represents
   * the current directory or file that was navigated to based on the given path. The "parts" property
   * is an array of strings representing the individual parts of the path.
   */
  private async navigatePath (path: string): Promise<{ current: Directory | File, parts: string[] }> {
    const parts = path.split('/').filter(x => x !== '')
    let current = this.fileSystem.root
    for (const part of parts) {
      current = current.children[part] as Directory
    }
    return { current, parts }
  }

  /**
   * The function `navigatePathParent` takes a path as input and returns the current directory, the
   * parts of the path, and the filename.
   * @param {string} path - The `path` parameter is a string that represents the file path. It is used
   * to navigate through the file system and locate a specific file or directory.
   * @returns an object with three properties: "current", "parts", and "filename".
   */
  private async navigatePathParent (path: string): Promise<{ current: Directory, parts: string[], filename: string }> {
    const parts = path.split('/').filter(x => x !== '')
    const filename = parts.pop() as string
    let current = this.fileSystem.root
    for (const part of parts) {
      current = current.children[part] as Directory
    }
    return { current, parts, filename }
  }

  /**
   * The `unlink` function deletes a file from a given path and saves the changes.
   * @param {string} path - The `path` parameter is a string that represents the file or directory path
   * that you want to unlink (delete).
   * @param permission - The `permission` parameter is an optional parameter that specifies the level
   * of permission required to perform the unlink operation. It has a default value of
   * `Permission.USER`, which means that the operation can be performed by the user.
   */
  async unlink (path: string, permission = Permission.USER): Promise<void> {
    const { current, filename } = await this.navigatePathParent(path)

    await this.handlePermissions(path, permission)

    Reflect.deleteProperty(current.children, filename)
    await this.save()
  }

  /**
   * The function reads a file from a given path and returns its content as a Buffer.
   * @param {string} path - The `path` parameter is a string that represents the file path of the file
   * to be read. It specifies the location of the file in the file system.
   * @param permission - The `permission` parameter is an optional parameter that specifies the
   * permission level required to read the file. It has a default value of `Permission.USER`, which
   * means that the file can be read by the current user.
   * @returns a Promise that resolves to a Buffer.
   */
  async readFile (path: string, permission = Permission.USER): Promise<Buffer> {
    const { current } = await this.navigatePath(path)

    await this.handlePermissions(path, permission)

    if (current.type !== 'file') throw new Error(Errors.EISDIR)
    return current.content
  }

  /**
   * The `writeFile` function writes content to a file at a specified path, with an optional permission
   * parameter.
   * @param {string} path - The `path` parameter is a string that represents the file path where the
   * file will be written to.
   * @param {string | Buffer} content - The `content` parameter is the data that you want to write to
   * the file. It can be either a string or a Buffer object.
   * @param permission - The `permission` parameter is an optional parameter that specifies the
   * permission level for the file being written. It has a default value of `Permission.USER`, which
   * indicates that the file can be accessed and modified only by the user who wrote it.
   */
  async writeFile (path: string, content: string | Buffer, permission = Permission.USER): Promise<void> {
    const { current, filename } = await this.navigatePathParent(path)

    await this.handlePermissions(path, permission)

    current.children[filename] = {
      type: 'file',
      permission: Permission.USER,
      content: Buffer.from(content)
    }
    await this.save()
  }

  /**
   * The `mkdir` function creates a new directory at the specified path with the given permission.
   * @param {string} path - The `path` parameter is a string that represents the directory path where
   * the new directory will be created. It specifies the location where the new directory will be
   * created.
   * @param permission - The `permission` parameter is an optional parameter that specifies the
   * permission level for the newly created directory. It has a default value of `Permission.USER`,
   * which indicates that only the user has permission to access the directory.
   */
  async mkdir (path: string, permission = Permission.USER): Promise<void> {
    const { current, filename } = await this.navigatePathParent(path)

    await this.handlePermissions(path, permission)

    current.children[filename] = {
      type: 'directory',
      permission: Permission.USER,
      children: {}
    }
    await this.save()
  }

  /**
   * The `rmdir` function removes a directory at the specified path, after checking permissions and
   * ensuring that the path is a directory.
   * @param {string} path - The `path` parameter is a string that represents the path of the directory
   * to be removed.
   * @param permission - The `permission` parameter is an optional parameter that specifies the level
   * of permission required to remove a directory. It has a default value of `Permission.USER`, which
   * means that the user must have permission to remove the directory.
   */
  async rmdir (path: string, permission = Permission.USER): Promise<void> {
    const { current, filename } = await this.navigatePathParent(path)

    await this.handlePermissions(path, permission)

    if (current.children[filename].type !== 'directory') throw new Error(Errors.ENOTDIR)
    Reflect.deleteProperty(current.children, filename)
    await this.save()
  }

  /**
   * The `readdir` function reads the contents of a directory and returns an array of file names.
   * @param {string} path - The `path` parameter is a string that represents the directory path from
   * which you want to read the files.
   * @param permission - The `permission` parameter is an optional parameter that specifies the
   * permission level for accessing the directory. It has a default value of `Permission.USER`.
   * @returns The function `readdir` returns a Promise that resolves to an array of strings.
   */
  async readdir (path: string, permission = Permission.USER): Promise<string[]> {
    console.log(this.fileSystem)
    const { current } = await this.navigatePath(path)

    if (current.type === 'file') throw new Error(Errors.ENOTDIR)
    const result = await Promise.all(Object.keys(current.children ?? {}))
    return result
  }

  /**
   * The `stat` function in TypeScript returns an object with two methods, `isDirectory` and `isFile`,
   * which determine if a given path is a directory or a file, respectively.
   * @param {string} path - A string representing the path to a file or directory.
   * @param permission - The `permission` parameter is an optional parameter that specifies the
   * permission level for accessing the file or directory. It has a default value of `Permission.USER`,
   * which means that the function will check the permission level for the current user.
   * @returns an object with two methods: `isDirectory` and `isFile`.
   */
  async stat (path: string, permission = Permission.USER): Promise<{ isDirectory: () => boolean, isFile: () => boolean }> {
    const { current } = await this.navigatePath(path)
    return {
      isDirectory: () => current.type === 'directory',
      isFile: () => current.type === 'file'
    }
  }

  /**
   * The `rename` function renames a file or directory by moving it from the old path to the new path,
   * while also handling permissions and updating the file system structure.
   * @param {string} oldPath - The old path of the file or directory that needs to be renamed.
   * @param {string} newPath - The `newPath` parameter is a string that represents the new path or
   * location where the file or directory will be renamed to.
   * @param permission - The `permission` parameter is an optional parameter that specifies the
   * permission level for the file or directory being renamed. It has a default value of
   * `Permission.USER`, which indicates that the user has permission to perform the rename operation.
   */
  async rename (oldPath: string, newPath: string, permission = Permission.USER): Promise<void> {
    const { current: oldCurrent, filename: oldFilename } = await this.navigatePathParent(oldPath)
    const { current: newCurrent, filename: newFilename } = await this.navigatePathParent(newPath)

    await this.handlePermissions(oldPath, permission)
    await this.handlePermissions(newPath, permission)

    newCurrent.children[newFilename] = oldCurrent.children[oldFilename]
    Reflect.deleteProperty(oldCurrent.children, oldFilename)
    await this.save()
  }

  /**
   * The function checks if a file or directory exists at a given path.
   * @param {string} path - A string representing the path to check for existence.
   * @param permission - The `permission` parameter is an optional parameter that specifies the
   * permission level for checking the existence of the path. It has a default value of
   * `Permission.USER`.
   * @returns a Promise that resolves to a boolean value.
   */
  async exists (path: string, permission = Permission.USER): Promise<boolean> {
    const { current } = await this.navigatePath(path)
    return current !== undefined
  }
}
