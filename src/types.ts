import { FlowWindow } from './wm'

/* EVENTS */

export interface AppClosedEvent extends CustomEvent {
  detail: {
    win: FlowWindow
  }
}

export interface AppOpenedEvent extends CustomEvent {
  detail: {
    app: App
    win: FlowWindow
  }
}

/* METADATA */

export interface BaseMeta {
  name: string
  description: string
  pkg: string
  version: string
}

export interface AppMeta extends BaseMeta {
  icon: string
}

export interface PluginMeta extends BaseMeta {
  icon?: string
}

/* OBJECTS */

export interface Apps {
  [key: string]: App
}

export interface Plugins {
  [key: string]: Plugin
}

/* MAIN INTERFACES */

export interface App {
  meta: AppMeta
  open: (data: any) => Promise<FlowWindow>
}

export interface Plugin {
  meta: PluginMeta
  run: (element: HTMLDivElement) => void | Promise<void>
}

/* MISC */

export interface FlowPlugin {
  name: string
  pkg: string
  version?: string
  authors?: string[]

  init: (data: any) => void | Promise<void>
  openWindow?: (data: any) => FlowWindow | Promise<FlowWindow>
  addStatusbarItem: (data: any) => void | Promise<void>
  loadTheme: (data: any) => void | Promise<void>
}

export interface FlowWindowConfig {
  title: string
  icon: string

  width?: number
  height?: number

  canResize?: boolean

  minWidth?: number
  minHeight?: number
}

export interface LoadedApp extends App {
  builtin: boolean
}

export interface LoadedPlugin extends Plugin {
  builtin: boolean
}

export interface PackageJSON {
  version: string
}
