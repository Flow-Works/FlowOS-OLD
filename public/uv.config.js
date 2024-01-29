/*global Ultraviolet*/

const xor = {
    encode: (str) => encodeURIComponent(
      str
        .toString()
        .split('')
        .map((char, ind) => {
          const indCheck = ind % 2 === 0 ? false : true

          return indCheck ? String.fromCharCode(char.charCodeAt(0) ^ 2) : char
        })
        .join('')
    ),
    decode: (str) => {
      const [input, ...search] = str.split('?')

      return (
        decodeURIComponent(input)
          .split('')
          .map((char, ind) => {
            const indCheck = ind % 2 === 0 ? false : true

            return indCheck ? String.fromCharCode(char.charCodeAt(0) ^ 2) : char
          })
          .join('') + ((search.length > 0) ? `?${search.join('?')}` : '')
      )
    }
}

self.__uv$config = {
    prefix: '/service/',
    encodeUrl: xor.encode,
    decodeUrl: xor.decode,
    handler: '/uv.handler.js',
    client: '/uv.client.js',
    bundle: '/uv.bundle.js',
    config: '/uv.config.js',
    sw: '/uv.sw.js',
};
