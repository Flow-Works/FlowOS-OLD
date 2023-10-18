export const meta = {
  name: 'Desktop Switcher',
  description: 'Allows you to switch between desktops.',
  pkg: 'flow.switcher',
  version: '1.0.0'
}

export const run = (element: HTMLDivElement): void => {
  element.style.display = 'flex'
  element.style.gap = '10px'
  element.style.alignItems = 'center'
  element.style.paddingLeft = '15px'
  element.style.paddingRight = '15px'
  element.innerHTML = '<i class=\'bx bxs-dice-1\'></i><i class=\'bx bx-dice-2\'></i><i class=\'bx bx-dice-3\'></i>'
}
