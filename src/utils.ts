/**
 * Gets the current time in 12hrs/24hrs.
 *
 * @returns The time.
 */
export const getTime = async (): Promise<string> => {
  const config = await window.config()
  const use24hrs = config['24HOUR_CLOCK']

  const now = new Date()
  let hours: string | number = now.getHours()
  let minutes: string | number = now.getMinutes()
  let period = 'AM'

  if (!use24hrs) {
    period = (hours >= 12) ? 'PM' : 'AM'
    if (hours === 0) {
      hours = 12
    } else if (hours > 12) {
      hours = hours % 12
    }
  }

  hours = (hours < 10) ? `0${hours}` : hours
  minutes = (minutes < 10) ? `0${minutes}` : minutes

  const timeString = use24hrs
    ? `${hours}:${minutes}`
    : `${hours}:${minutes} ${period}`

  return timeString
}
