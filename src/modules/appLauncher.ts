export const meta = {
  name: 'App View',
  description: 'Opens the app view.',
  id: 'appview'
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
