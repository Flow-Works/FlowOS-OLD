import * as fs from 'fs'
import { PlatformPath } from 'path'

export interface Path extends PlatformPath {
  basename: (path: string, suffix?: string | undefined) => string
  normalize: (path: string) => string
  isNull: (path: string) => boolean
  addTrailing: (path: string) => string
  removeTrailing: (path: string) => string
}

interface FilerError extends Error {
  code: string
  errno: number
  path?: string
}

export interface Errors {
  EACCES: FilerError
  EBADF: FilerError
  EBUSY: FilerError
  EINVAL: FilerError
  ENOTDIR: FilerError
  EISDIR: FilerError
  ENOENT: FilerError
  EEXIST: FilerError
  EPERM: FilerError
  ELOOP: FilerError
  ENOTEMPTY: FilerError
  EIO: FilerError
  ENOTMOUNTED: FilerError
  EFILESYSTEMERROR: FilerError
  ENOATTR: FilerError
}

export type FileSystemOptionsFlags = 'FORMAT' | 'NOCTIME' | 'NOMTIME'

export interface FileSystemOptions {
  name: string
  flags: FileSystemOptionsFlags[]
  /* TO-DO */
  provider: any
}

export type FileSystemCallback = (err: FilerError | null, fs: FileSystem) => {}

export interface FileSystem {
  appendFile: typeof fs.appendFile
  access: typeof fs.access
  chown: typeof fs.chown
  chmod: typeof fs.chmod
  close: typeof fs.close
  exists: typeof fs.exists
  fchown: typeof fs.fchown
  fchmod: typeof fs.fchmod
  fstat: typeof fs.fstat
  fsync: typeof fs.fsync
  ftruncate: typeof fs.ftruncate
  futimes: typeof fs.futimes
  link: typeof fs.link
  lstat: typeof fs.lstat
  mkdir: typeof fs.mkdir
  mkdtemp: typeof fs.mkdtemp
  open: typeof fs.open
  readdir: typeof fs.readdir
  read: typeof fs.read
  readFile: typeof fs.readFile
  readlink: typeof fs.readlink
  rename: typeof fs.rename
  rmdir: typeof fs.rmdir
  stat: typeof fs.stat
  symlink: typeof fs.symlink
  truncate: typeof fs.truncate
  unlink: typeof fs.unlink
  utimes: typeof fs.utimes
  writeFile: typeof fs.writeFile
  write: typeof fs.write

  promises: FileSystemPromises
}

export interface FileSystemPromises {
  appendFile: typeof fs.promises.appendFile
  access: typeof fs.promises.access
  chown: typeof fs.promises.chown
  chmod: typeof fs.promises.chmod
  link: typeof fs.promises.link
  lstat: typeof fs.promises.lstat
  mkdir: typeof fs.promises.mkdir
  mkdtemp: typeof fs.promises.mkdtemp
  open: typeof fs.promises.open
  readdir: typeof fs.promises.readdir
  readFile: typeof fs.promises.readFile
  readlink: typeof fs.promises.readlink
  rename: typeof fs.promises.rename
  rmdir: typeof fs.promises.rmdir
  stat: typeof fs.promises.stat
  symlink: typeof fs.promises.symlink
  truncate: typeof fs.promises.truncate
  unlink: typeof fs.promises.unlink
  utimes: typeof fs.promises.utimes
  writeFile: typeof fs.promises.writeFile
}

export interface FileSystemShell {
  cd: (path: string, callback: (err: FilerError | null) => void) => void
  pwd: () => string
  find: (
    dir: string,
    options: {
      exec?: (path: string, next: () => void) => void
      regex?: RegExp
      name?: string
    } | ((err: FilerError | null, found: any[]) => void) | undefined | null,
    /* INCOMPLETE? */
    callback: (err: FilerError | null, found: any[]) => void
  ) => void
  ls: (
    dir: string,
    options: {
      recursive?: boolean
    } | ((err: FilerError | null) => void) | undefined | null,
    callback: (err: FilerError | null) => void
  ) => void
  exec: (
    path: string,
    args: Array<string | number> | ((err: FilerError | null, result: string) => void) | undefined | null,
    callback: (err: FilerError | null, result: string) => void
  ) => void
  touch: (
    path: string,
    options: {
      updateOnly?: boolean
      date: Date
    } | ((err: FilerError | null) => void) | undefined | null,
    callback: (err: FilerError | null) => void
  ) => void
  cat: (
    files: string[],
    callback: (err: FilerError | null, data: string) => void
  ) => void
  rm: (
    path: string,
    options: {
      recursive?: boolean
    } | ((err: FilerError | null) => void) | undefined | null,
    callback: (err: FilerError | null) => void
  ) => void
  tempDir: (
    callback: (err: FilerError | null, tmp: string) => void
  ) => void
  mkdirp: (
    path: string,
    callback: (err: FilerError | null) => void
  ) => void
}

export interface FileSystemShellOptions {
  env: {
    [key: string]: string
  }
}

export default interface Filer {
  FileSystem: (options: FileSystemOptions, callback: (err: FilerError | null, guid: string) => void) => FileSystem
  Buffer: Buffer
  Path: Path
  path: Path
  Errors: Errors
  Shell: (fs: FileSystem, options: FileSystemShellOptions) => FileSystemShell
}
