import Kernel from '../kernel'

const ProcLib = {
  findEmptyPID: function (kernel: Kernel) {
    const r = kernel.processList.findIndex((p) => p === null)
    return r !== -1 ? r : kernel.processList.length
  },
  cleanupProcess: function (kernel: Kernel, pid: number) {
    const proc = kernel.processList
      .filter((p) => p !== null)
      .find((p) => p.pid === pid)
    if (proc === undefined) throw new Error(`Process ${pid} not found.`)
    console.group(`Killing process ${pid} (${proc.name})`)
    document.dispatchEvent(new CustomEvent('app_closed', {
      detail: {
        token: proc.token
      }
    }))
    kernel.processList.splice(pid, 1)
    document.dispatchEvent(new CustomEvent('update_process', {}))
    console.groupEnd()
    console.groupEnd()
  }
}

export default ProcLib
