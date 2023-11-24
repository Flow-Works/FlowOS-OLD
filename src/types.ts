import FlowWindow from './structures/FlowWindow'

export type AppOpenFunction = (data: any) => Promise<FlowWindow>
export type PluginRunFunction = (element: HTMLDivElement, config: any) => void | Promise<void>

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

export interface Apps {
  [key: string]: App
}

export interface Plugins {
  [key: string]: Plugin
}

export interface App {
  meta: AppMeta
  open: AppOpenFunction
}

export interface Plugin {
  meta: PluginMeta
  run: PluginRunFunction
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

export interface FlowConfig {
  SERVER_URL: string
  HOSTNAME: string
  USERNAME: string
  '24HOUR_CLOCK': boolean
}
