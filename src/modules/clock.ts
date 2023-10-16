export const meta = {
  name: 'Clock',
  description: 'Displays the date & time.',
  id: 'clock'
}

export const run = (element: HTMLDivElement): void => {
  element.style.display = 'flex'
  element.style.alignItems = 'center'
  element.innerText = '9:41 AM\n10/14/2023'
}
