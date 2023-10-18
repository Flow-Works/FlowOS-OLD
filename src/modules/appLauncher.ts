export const meta = {
  name: 'App Launcher',
  description: 'Opens the app launcher.',
  id: 'applauncher'
}

export const run = (element: HTMLDivElement): void => {
  element.style.display = 'flex'
  element.style.alignItems = 'center'
  element.style.justifyContent = 'center'
  element.style.aspectRatio = '1 / 1'
  element.innerHTML = '<i class=\'bx bx-category\'></i>'

  element.onclick = () => {
    window.wm.toggleLauncher()
  }
}
