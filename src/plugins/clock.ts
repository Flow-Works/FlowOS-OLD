export const meta = {
  name: 'Clock',
  description: 'Displays the date & time.',
  pkg: 'flow.clock',
  version: '1.0.0'
}

export const run = (element: HTMLDivElement): void => {
  let date: Date = new Date()

  element.style.display = 'flex'
  element.style.flexDirection = 'column'
  element.style.padding = '5px 10px'
  element.style.fontSize = '12.5px'
  element.style.justifyContent = 'center'

  const refreshDate = (): string => {
    const split = date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }).split(',')
    return `<i>${split[0]}</i>,${split[1]} `
  }

  const refreshClock = (): string => {
    return date.toLocaleTimeString('en-US', { hour12: false, hour: 'numeric', minute: 'numeric' })
  }

  refreshDate()
  refreshClock()

  setInterval(() => {
    date = new Date()
    const clock = refreshClock()
    const date_ = refreshDate()
    element.innerHTML = `${clock}<div>${date_}</div>`
  }, 1000)
}
