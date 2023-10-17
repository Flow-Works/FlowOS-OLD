export const meta = {
  name: 'Clock',
  description: 'Displays the date & time.',
  id: 'clock'
}

export const run = (element: HTMLDivElement): void => {
  element.style.display = 'flex'
  element.style.alignItems = 'center'

  const refreshDate = (): any => {
    const split = date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }).split(',')
    return `<i>${split[0]}</i>,${split[1]} `
  }

  const refreshClock = (): any => {
    return date.toLocaleTimeString('en-US', { hour12: false, hour: 'numeric', minute: 'numeric' })
  }

  let date: Date = new Date()

  refreshDate()
  refreshClock()

  setInterval(() => {
    date = new Date()
    const date_: string = refreshDate()
    element.innerHTML = `${date_} <br><span id="time">,  </span>`
  }, 1000)
  setInterval(() => {
    date = new Date()
    const clock: string = refreshClock()
    const time = document.getElementById('time')
    if (time !== null) {
      time.innerText = ` | ${clock}`
    }
  }, 1000)
}
