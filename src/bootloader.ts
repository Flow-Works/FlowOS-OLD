/**
 * FlowOS Bootloader
 *
 */

import Kernel, { spaces } from './kernel'
import HTML from './HTML'

import logo from './assets/flow.png'

const body = new HTML(document.body)

body.html('<style>* { box-sizing: border-box }</style>')
body.style({
  margin: '0',
  width: '100vw',
  height: '100vh',
  overflow: 'hidden'
})

const boot = new HTML('div').styleJs({
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  width: '100%',
  background: '#11111b',
  padding: '100px',
  'font-family': 'monospace',
  userSelect: 'none',
  overflow: 'hidden'
}).appendTo(body)

boot.appendMany(
  new HTML('div')
    .styleJs({
      display: 'flex',
      height: '40px',
      alignItems: 'center',
      gap: '10px'
    })
    .appendMany(
      new HTML('img').attr({
        src: logo,
        height: '40px'
      }),
      new HTML('h1').text('FlowOS').styleJs({
        color: 'white'
      })
    ),
  new HTML('img').attr({
    src: logo
  }).styleJs({
    position: 'absolute',
    right: '-8vw',
    top: '-7vw',
    opacity: '0.03',
    height: '50vw',
    'pointer-events': 'none',
    zIndex: '0'
  })
)

const terminal = new HTML('div').style({
  color: '#89b4fa',
  padding: '10px 3px',
  'word-break': 'break-all',
  'white-space': 'pre-wrap',
  flex: '1',
  'user-select': 'text',
  position: 'relative',
  zIndex: '2'
}).appendTo(boot)

const progress = new HTML('div').style({
  width: '0',
  background: '#89b4fa',
  transition: 'width 0.5s cubic-bezier(1,0,0,1)',
  height: '5px'
})
new HTML('div').style({
  height: '5px',
  width: '100%',
  background: '#181825'
}).appendTo(boot)
  .append(progress)

const write = (content: string): void => {
  terminal.text(terminal.getText() + content)
}

const writeln = (content = ''): void => {
  write(`${content}\n`)
}

const originalConsoleLog = console.log
const originalConsoleError = console.error
const originalConsoleWarn = console.warn
const originalConsoleGroup = console.group
window.console.log = (...args: any) => {
  originalConsoleLog(...args)
  writeln(args)
}
window.console.warn = (...args: any) => {
  originalConsoleWarn(...args)
  writeln(args)
}
window.console.error = (...args: any) => {
  originalConsoleError(...args)
  writeln(args)
}
window.console.group = (...args: any) => {
  originalConsoleGroup(...args)
  writeln(spaces + String(args))
}

try {
  const args = new URLSearchParams(window.location.search)
  const kernel = new Kernel()
  await kernel.boot(boot, progress, args)
} catch (e) {
  writeln()
  writeln('An error occured while booting FlowOS.')
  writeln('Please report this error to Flow Works.')
  writeln()
  console.error(e.stack)
  writeln()
  terminal.html(terminal.getHTML() + '<a href="#" onclick="indexedDB.deleteDatabase(\'virtualfs\')">Would you like to reset the VirtualFS?</a>')
}
