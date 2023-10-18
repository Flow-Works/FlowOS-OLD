export const meta = {
  name: 'Battery',
  description: 'Tells you your device\'s battery.',
  pkg: 'flow.battery',
  version: '1.0.0'
}

export const run = (element: HTMLDivElement): void => {
  element.style.display = 'flex'
  element.style.alignItems = 'center'
  element.style.paddingLeft = '15px'
  element.style.paddingRight = '15px'

  if ('getBattery' in navigator) {
    // types don't exist for battery api
    // @ts-expect-error
    navigator.getBattery().then((battery) => {
      element.innerHTML = `🔋 ${(battery.level * 100).toFixed(0)}%`
      battery.addEventListener('', () => {
        element.innerHTML = `🔋 ${(battery.level * 100).toFixed(0)}%`
      })
    })
  } else {
    console.log('Battery API is not supported on this device')
  }
}
