import flowIcon from '../assets/flow.png'

class Preloader {
  element: HTMLElement

  /**
   * Creates the preloader.
   */
  constructor () {
    this.element = document.createElement('preloader')

    this.element.innerHTML = `
      <img src="${flowIcon}" width="150px">
      <div class="done"></div>
      <div class="status"></div>
    `

    document.body.appendChild(this.element)
  }

  /**
   * Sets the status text of the preloader.
   *
   * @param value The preloader status text.
   */
  setStatus (value: string): void {
    (this.element.querySelector('.status') as HTMLElement).innerText = value
  }

  /**
   * Sets loading state of an instance to pending.
   *
   * @param value The name of an instance.
   */
  setPending (value: string): void {
    (this.element.querySelector('.done') as HTMLElement).innerHTML += `<div class="${value.split(' ').join('-')}"><span class='material-symbols-rounded'>check_indeterminate_small</span>${value}</div>`
  }

  /**
   * Sets loading state of an instance to done.
   *
   * @param value The name of an instance.
   */
  async setDone (value: string): Promise<void> {
    const icon = this.element.querySelector('.done')?.querySelector(`.${value.split(' ').join('-')}`)?.querySelector('.material-symbols-rounded') as HTMLElement
    icon.innerHTML = 'check_small'
    await new Promise(resolve => setTimeout(resolve, 300))
  }

  /**
   * Sets loading state of an instance to error.
   *
   * @param value The name of an instance.
   */
  async setError (value: string): Promise<void> {
    const icon = this.element.querySelector('.done')?.querySelector(`.${value.split(' ').join('-')}`)?.querySelector('.material-symbols-rounded') as HTMLElement
    icon.innerHTML = 'close_small'
    await new Promise(resolve => setTimeout(resolve, 300))
  }

  /**
   * Removes the preloader.
   */
  finish (): void {
    this.element.style.opacity = '0'
    this.element.style.pointerEvents = 'none'
  }
}

export default Preloader
