export const meta = {
  name: 'Battery',
  description: 'Tells you your device\'s battery.',
  id: 'battery'
}

export const run = (element: HTMLDivElement): void => {
  element.style.display = 'flex'
  element.style.alignItems = 'center'
  element.style.paddingLeft = '15px'
  element.style.paddingRight = '15px'
  element.innerHTML = '🔋 100%'
}
