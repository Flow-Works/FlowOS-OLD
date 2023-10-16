export const meta = {
  name: 'Desktop Switcher',
  description: 'Allows you to switch between desktops.',
  id: 'switcher'
}

export const run = (element: HTMLDivElement): void => {
  element.style.display = 'flex'
  element.style.gap = '10px'
  element.style.alignItems = 'center'
  element.style.paddingLeft = '15px'
  element.style.paddingRight = '15px'
  element.innerHTML = '<i class=\'bx bxs-dice-1\'></i><i class=\'bx bx-dice-2\'></i><i class=\'bx bx-dice-3\'></i>'
}
