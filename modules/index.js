import { CookieJar } from 'tough-cookie'

const appendHeader = (options, name, value) => {
  const headers = options.headers

  if (headers) {
    if (typeof headers.append === 'function') {
      headers.append(name, value)
    } else {
      headers[name] = [ headers[name], value ].filter(Boolean).join(';')
    }
  } else {
    options.headers = { [name]: value }
  }
}

const addResponseHandler = (options, handler) => {
  (options.responseHandlers || (options.responseHandlers = [])).push(handler)
}

/**
 * Automatically inserts cookies into request headers and remembers
 * cookies received in responses.
 */
export const cookieJar = (jar = new CookieJar) =>
  (fetch, input, options = {}) =>
    new Promise((resolve, reject) => {
      const currentURL = input.url || input

      jar.getCookieString(currentURL, (error, cookieString) => {
        if (error) {
          reject(error)
          return
        }

        if (cookieString)
          appendHeader(options, 'Cookie', cookieString)

        addResponseHandler(options, (response) => {
          const setCookie = response.headers.get('Set-Cookie')

          if (!setCookie)
            return response

          return new Promise((resolve, reject) => {
            jar.setCookie(setCookie, currentURL, (error) => {
              if (error) {
                reject(error)
              } else {
                resolve(response)
              }
            })
          })
        })

        resolve(fetch(input, options))
      })
    })
