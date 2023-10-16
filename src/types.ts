import { FlowWindow } from './wm'

export interface StatusItem {
  meta: {
    name: string
    description: string
    id: string
  }
  run: Function
}

export interface App {
  name: string
  pkg: string

  version: string

  icon: string

  open: (data: any) => Promise<FlowWindow>
}

export interface AppOpenedEvent extends CustomEvent {
  detail: {
    app: App
    win: FlowWindow
  }
}

export interface AppClosedEvent extends CustomEvent {
  detail: {
    win: FlowWindow
  }
}
