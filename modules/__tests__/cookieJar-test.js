import expect from 'expect'
import { enhanceFetch } from 'http-client'
import { Cookie, CookieJar } from 'tough-cookie'
import { cookieJar } from '../index'

const cookieResponse = (cookie) => {
  const headers = {
    'Set-Cookie': cookie.toString()
  }

  return {
    headers: {
      get: (headerName) => headers[headerName]
    }
  }
}

const fetchCookie = (cookie) =>
  enhanceFetch(() => Promise.resolve(cookieResponse(cookie)))

describe('cookieJar', () => {
  describe('when a response sets a cookie', () => {
    let url, jar, cookie
    beforeEach(() => {
      url = 'http://www.example.com'
      jar = new CookieJar
      cookie = new Cookie({
        key: 'the-key',
        value: 'the-value'
      })

      return cookieJar(jar)(fetchCookie(cookie), url).then(response => {
        expect(response.headers.get('Set-Cookie')).toEqual(cookie.toString())
      })
    })

    it('sets the Cookie header on subsequent requests to the same URL', () => (
      cookieJar(jar)(fetch, url).then(({ options }) => {
        expect(options.headers.Cookie).toEqual(cookie.toString())
      })
    ))

    describe('and the request already has a Cookie', () => {
      it('appends to the existing Cookie header', () => (
        cookieJar(jar)(fetch, url, { headers: { Cookie: 'a=b' } }).then(({ options }) => {
          expect(options.headers.Cookie).toEqual('a=b;' + cookie.toString())
        })
      ))
    })

    it('does not set the Cookie header on subsequent requests to a different URL', () => (
      cookieJar(jar)(fetch, 'http://www.example.org').then(({ options }) => {
        const headers = options.headers || {}
        expect(headers.Cookie).toNotEqual(cookie.toString())
      })
    ))
  })
})
