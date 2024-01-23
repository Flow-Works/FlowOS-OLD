
import FlowWindow from '../structures/FlowWindow'
import { Process } from '../types'

const UserAccessControl: Process = {
  config: {
    name: 'User Access Control',
    type: 'process',
    targetVer: '1.0.0-indev.0'
  },
  run: async (process) => {
    if (Object.keys(process.data).length <= 0) {
      return
    }
    const initiator = process.data.process.process
    const target = process.data.executable
    return await new Promise((resolve) => {
      process.loadLibrary('lib/WindowManager').then(async wm => {
        let message = 'Unknown action'
        switch (process.data.type) {
          case 'launch': {
            message = `${initiator.config.name as string} wants to launch ${target.config.name as string}`
            break
          }
          case 'kill': {
            message = `${initiator.config.name as string} wants to kill ${process.data.name as string}`
            break
          }
          case 'fs': {
            message = `${initiator.config.name as string} wants to modify/access ${process.data.path as string}`
            break
          }
        }

        wm.createModal('allow', 'User Account Control', message, process)
          .then(async ({ value, win }: {
            value: boolean
            win: FlowWindow
          }) => {
            if (value) {
              resolve(true)
            } else {
              resolve(false)
            }
          }).catch((e) => console.error(e))
      }).catch((e) => console.error(e))
    })
  }
}

export default UserAccessControl
