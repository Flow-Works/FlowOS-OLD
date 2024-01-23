/**
 * Gets the current time in 12hrs/24hrs.
 *
 * @returns The time.
 */
export const getTime = async (): Promise<string> => {
  const use24hrs = false

  const now = new Date()
  let hours: string | number = now.getHours()
  let minutes: string | number = now.getMinutes()
  let period = 'AM'

  if (!use24hrs) {
    period = (hours >= 12) ? 'PM' : 'AM'
    if (hours === 0) {
      hours = 12
    } else if (hours > 12) {
      hours %= 12
    }
  }

  hours = (hours < 10) ? `0${hours}` : hours
  minutes = (minutes < 10) ? `0${minutes}` : minutes

  return use24hrs
    ? `${hours}:${minutes}`
    : `${hours}:${minutes} ${period}`
}

/**
 * Sanitizes a string of all HTML elements.
 *
 * @param string String to be sanitized
 * @returns Sanitized string
 */
export const sanitize = (string: string): string => {
  const map: {
    [key: string]: string
  } = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    '\'': '&#x27;',
    '/': '&#x2F;'
  }
  const reg = /[&<>"'/]/ig
  return string.replace(reg, (match) => (map[match]))
}
