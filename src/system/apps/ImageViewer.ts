import { Process } from '../../types'
import icon from '../../assets/icons/org.gnome.Loupe.svg'

const ImageViewer: Process = {
  config: {
    name: 'Image Viewer',
    type: 'process',
    icon,
    targetVer: '1.0.0-indev.0'
  },
  run: async (process) => {
    if (Object.keys(process.data).length > 0) {
      const win = await process.loadLibrary('lib/WindowManager').then((wm: any) => {
        return wm.createWindow({
          title: 'Image Viewer',
          icon,
          width: 500,
          height: 500
        }, process)
      })

      const fs = process.fs
      const MIMETypes: Record<string, { type: string }> = await process.loadLibrary('lib/MIMETypes')
      const HTML = await process.loadLibrary('lib/HTML')

      const render = async (): Promise<void> => {
        win.content.innerHTML = ''
        const fileData = await fs.readFile(process.data.path)
        const url = `data:${MIMETypes[(process.data.path.split('.').at(-1) as string)].type};base64,${encodeURIComponent(Buffer.from(fileData).toString('base64'))}`

        new HTML('div').style({
          width: '100%',
          height: '100%',
          background: `url(${url})`,
          'background-size': 'contain',
          'background-position': 'center',
          'background-repeat': 'no-repeat',
          'aspect-ratio': '1 / 1'
        }).appendTo(win.content)
      }

      await render()
      document.addEventListener('fs_update', () => {
        render().catch(e => console.error(e))
      })
      return
    }
    await process.kill()
    await process.launch('apps/Files')
  }
}

export default ImageViewer
