export default class HTML {
  /** The HTML element referenced in this instance. Change using `.swapRef()`, or remove using `.cleanup()`. */
  elm: HTMLInputElement | HTMLElement
  /**
   * Create a new instance of the HTML class.
   * @param elm The HTML element to be created or classified from.
   */
  constructor (elm: string | HTMLElement) {
    if (elm instanceof HTMLElement) {
      this.elm = elm
    } else {
      this.elm = document.createElement(elm === '' ? 'div' : elm)
    }
  }

  /**
   * Sets the text of the current element.
   * @param val The text to set to.
   * @returns HTML
   */
  text (val: string): HTML {
    this.elm.innerText = val
    return this
  }

  /**
   * Sets the text of the current element.
   * @param val The text to set to.
   * @returns HTML
   */
  html (val: string): HTML {
    this.elm.innerHTML = val
    return this
  }

  /**
   * Safely remove the element. Can be used in combination with a `.swapRef()` to achieve a "delete & swap" result.
   * @returns HTML
   */
  cleanup (): HTML {
    this.elm.remove()
    return this
  }

  /**
   * querySelector something.
   * @param selector The query selector.
   * @returns The HTML element (not as HTML)
   */
  query (selector: string): HTMLElement | null {
    return this.elm.querySelector(selector)
  }

  /**
   * An easier querySelector method.
   * @param query The string to query
   * @returns a new HTML
   */
  qs (query: string): HTML | null {
    if (this.elm.querySelector(query) != null) {
      return HTML.from(this.elm.querySelector(query) as HTMLElement)
    } else {
      return null
    }
  }

  /**
   * An easier querySelectorAll method.
   * @param query The string to query
   * @returns a new HTML
   */
  qsa (query: string): Array<HTML | null> | null {
    if (this.elm.querySelector(query) != null) {
      return Array.from(this.elm.querySelectorAll(query)).map((e) =>
        HTML.from(e as HTMLElement)
      )
    } else {
      return null
    }
  }

  /**
   * Sets the ID of the element.
   * @param val The ID to set.
   * @returns HTML
   */
  id (val: string): HTML {
    this.elm.id = val
    return this
  }

  /**
   * Toggle on/off a class.
   * @param val The class to toggle.
   * @returns HTML
   */
  class (...val: string[]): HTML {
    for (let i = 0; i < val.length; i++) {
      this.elm.classList.toggle(val[i])
    }
    return this
  }

  /**
   * Toggles ON a class.
   * @param val The class to enable.
   * @returns HTML
   */
  classOn (...val: string[]): HTML {
    for (let i = 0; i < val.length; i++) {
      this.elm.classList.add(val[i])
    }
    return this
  }

  /**
   * Toggles OFF a class.
   * @param val The class to disable.
   * @returns HTML
   */
  classOff (...val: string[]): HTML {
    for (let i = 0; i < val.length; i++) {
      this.elm.classList.remove(val[i])
    }
    return this
  }

  /**
   * Apply CSS styles (dashed method.) Keys use CSS syntax, e.g. `background-color`.
   * @param obj The styles to apply (as an object of `key: value;`.)
   * @returns HTML
   */
  style (obj: { [x: string]: string | null }): HTML {
    for (const key of Object.keys(obj)) {
      this.elm.style.setProperty(key, obj[key])
    }
    return this
  }

  /**
   * Apply CSS styles (JS method.) Keys use JS syntax, e.g. `backgroundColor`.
   * @param obj The styles to apply (as an object of `key: value;`)
   * @returns HTML
   */
  styleJs (obj: { [key: string]: string | null }): HTML {
    for (const key of Object.keys(obj)) {
      // @ts-expect-error No other workaround I could find.
      this.elm.style[key] = obj[key]
    }
    return this
  }

  /**
   * Apply an event listener.
   * @param ev The event listener type to add.
   * @param cb The event listener callback to add.
   * @returns HTML
   */
  on (ev: string, cb: EventListenerOrEventListenerObject): HTML {
    this.elm.addEventListener(ev, cb)
    return this
  }

  /**
   * Remove an event listener.
   * @param ev The event listener type to remove.
   * @param cb The event listener callback to remove.
   * @returns HTML
   */
  un (ev: string, cb: EventListenerOrEventListenerObject): HTML {
    this.elm.removeEventListener(ev, cb)
    return this
  }

  /**
   * Append this element to another element. Uses `appendChild()` on the parent.
   * @param parent Element to append to. HTMLElement, HTML, and string (as querySelector) are supported.
   * @returns HTML
   */
  appendTo (parent: HTMLElement | HTML | string): HTML {
    if (parent instanceof HTMLElement) {
      parent.appendChild(this.elm)
    } else if (parent instanceof HTML) {
      parent.elm.appendChild(this.elm)
    } else if (typeof parent === 'string') {
      document.querySelector(parent)?.appendChild(this.elm)
    }
    return this
  }

  /**
   * Append an element. Typically used as a `.append(new HTML(...))` call.
   * @param elem The element to append.
   * @returns HTML
   */
  append (elem: string | HTMLElement | HTML): HTML {
    if (elem instanceof HTMLElement) {
      this.elm.appendChild(elem)
    } else if (elem instanceof HTML) {
      this.elm.appendChild(elem.elm)
    } else if (typeof elem === 'string') {
      const newElem = document.createElement(elem)
      this.elm.appendChild(newElem)
      return new HTML(newElem.tagName)
    }
    return this
  }

  /**
   * Append multiple elements. Typically used as a `.appendMany(new HTML(...), new HTML(...)` call.
   * @param elements The elements to append.
   * @returns HTML
   */
  appendMany (...elements: any[]): HTML {
    for (const elem of elements) {
      this.append(elem)
    }
    return this
  }

  /**
   * Clear the innerHTML of the element.
   * @returns HTML
   */
  clear (): HTML {
    this.elm.innerHTML = ''
    return this
  }

  /**
   * Set attributes (object method.)
   * @param obj The attributes to set (as an object of `key: value;`)
   * @returns HTML
   */
  attr (obj: { [x: string]: any }): HTML {
    for (const key in obj) {
      if (obj[key] !== null && obj[key] !== undefined) {
        this.elm.setAttribute(key, obj[key])
      } else {
        this.elm.removeAttribute(key)
      }
    }
    return this
  }

  /**
   * Set the text value of the element. Only works if element is `input` or `textarea`.
   * @param str The value to set.
   * @returns HTML
   */
  val (str: any): HTML {
    const x = this.elm as HTMLInputElement
    x.value = str
    return this
  }

  /**
   * Retrieve text content from the element. (as innerText, not trimmed)
   * @returns string
   */
  getText (): string {
    return (this.elm as HTMLInputElement).innerText
  }

  /**
   * Retrieve HTML content from the element.
   * @returns string
   */
  getHTML (): string {
    return (this.elm as HTMLInputElement).innerHTML
  }

  /**
   * Retrieve the value of the element. Only applicable if it is an `input` or `textarea`.
   * @returns string
   */
  getValue (): string {
    return (this.elm as HTMLInputElement).value
  }

  /**
   * Swap the local `elm` with a new HTMLElement.
   * @param elm The element to swap with.
   * @returns HTML
   */
  swapRef (elm: HTMLElement): HTML {
    this.elm = elm
    return this
  }

  /**
   * An alternative method to create an HTML instance.
   * @param elm Element to create from.
   * @returns HTML
   */
  static from (elm: HTMLElement | string): HTML | null {
    if (typeof elm === 'string') {
      const element = HTML.qs(elm)
      if (element === null) return null
      else return element
    } else {
      return new HTML(elm)
    }
  }

  /**
   * An easier querySelector method.
   * @param query The string to query
   * @returns a new HTML
   */
  static qs (query: string): HTML | null {
    if (document.querySelector(query) != null) {
      return HTML.from(document.querySelector(query) as HTMLElement)
    } else {
      return null
    }
  }

  /**
   * An easier querySelectorAll method.
   * @param query The string to query
   * @returns a new HTML
   */
  static qsa (query: string): Array<HTML | null> | null {
    if (document.querySelector(query) != null) {
      return Array.from(document.querySelectorAll(query)).map((e) =>
        HTML.from(e as HTMLElement)
      )
    } else {
      return null
    }
  }
}
