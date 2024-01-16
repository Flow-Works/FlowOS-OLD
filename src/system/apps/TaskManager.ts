import { Process } from '../../types'
import icon from '../../assets/icons/utilities-system-monitor.svg'

const TaskManager: Process = {
  config: {
    name: 'Task Manager',
    type: 'process',
    icon,
    targetVer: '1.0.0-indev.0'
  },
  run: async (process) => {
    const win = await process.loadLibrary('lib/WindowManager').then((wm: any) => {
      return wm.createWindow({
        title: 'Task Manager',
        icon,
        width: 600,
        height: 200
      }, process)
    })

    const HTML = await process.loadLibrary('lib/HTML')

    win.content.style.display = 'flex'
    win.content.style.flexDirection = 'column'
    win.content.style.gap = '10px'
    win.content.style.padding = '10px'
    win.content.style.background = 'var(--base)'

    new HTML('style').html(
      `tbody tr:hover {
        background: var(--surface-1);
        border-radius: 10px;
      }

      tr:first-child td:first-child { border-top-left-radius: 10px; }
      tr:first-child td:last-child { border-top-right-radius: 10px; }

      tr:last-child td:first-child { border-bottom-left-radius: 10px; }
      tr:last-child td:last-child { border-bottom-right-radius: 10px; }
      
      table, table td, table th {
        border: none!important;
        border-collapse:collapse;
      }`
    ).appendTo(win.content)

    const table = new HTML('table').style({
      width: '100%'
    }).appendTo(win.content)

    const render = (): void => {
      const { processList } = process.kernel
      table.html('')

      new HTML('thead').appendTo(table)
        .append(
          new HTML('tr').style({
            padding: '5px',
            'border-radius': '10px'
          }).appendMany(
            new HTML('th').style({ 'text-align': 'center', width: '10%' }).text('PID'),
            new HTML('th').style({ 'text-align': 'left', width: '45%' }).text('Process Name'),
            new HTML('th').style({ 'text-align': 'left', width: '45%' }).text('Session Token')
          )
        )

      const tbody = new HTML('tbody').appendTo(table)

      for (const proc of processList) {
        new HTML('tr').style({
          padding: '5px',
          'border-radius': '10px'
        }).appendTo(tbody)
          .appendMany(
            new HTML('td').style({ 'text-align': 'center' }).text(proc.pid.toString()),
            new HTML('td').style({ 'text-align': 'left' }).text(proc.name),
            new HTML('td').style({ 'text-align': 'left' }).text(proc.token)
          )
          .on('click', () => {
            process.killProcess(proc.pid).catch((e: any) => console.error(e))
          })
      }
    }

    render()

    document.addEventListener('update_process', () => render())
  }
}

export default TaskManager
