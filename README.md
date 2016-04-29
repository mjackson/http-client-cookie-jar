# http-client-cookie-jar [![Travis][build-badge]][build] [![npm package][npm-badge]][npm]

[build-badge]: https://img.shields.io/travis/mjackson/http-client-cookie-jar/master.svg?style=flat-square
[build]: https://travis-ci.org/mjackson/http-client-cookie-jar

[npm-badge]: https://img.shields.io/npm/v/http-client-cookie-jar.svg?style=flat-square
[npm]: https://www.npmjs.org/package/http-client-cookie-jar

[http-client-cookie-jar](https://www.npmjs.com/package/http-client-cookie-jar) is an [http-client](https://www.npmjs.com/package/http-client) middleware that automatically saves cookies as responses are received and sends them back to the appropriate origins as requests are made.

This package is backed by the excellent [tough-cookie](https://www.npmjs.com/package/tough-cookie) library. This means that it has robust cookie handling, but is not yet available for use in browser builds.

## Installation

Using [npm](https://www.npmjs.com/):

    $ npm install --save http-client tough-cookie http-client-cookie-jar

http-client requires you to bring your own [global `fetch`](https://developer.mozilla.org/en-US/docs/Web/API/GlobalFetch/fetch) function. [isomorphic-fetch](https://github.com/matthew-andrews/isomorphic-fetch) is a great polyfill.

Then, use as you would anything else:

```js
// using ES6 modules
import { cookieJar } from 'http-client-cookie-jar'

// using CommonJS modules
var cookieJar = require('http-client-cookie-jar').cookieJar
```

## Usage

http-client-cookie-jar is mostly useful when building web scrapers. To use it, you'll need to first instantiate a [`CookieJar`](https://www.npmjs.com/package/tough-cookie#cookiejar) and pass it to the middleware. The middleware uses this cookie jar to store all cookies it receives and automatically append them to outgoing requests.

```js
import { createFetch } from 'http-client'
import { cookieJar } from 'http-client-cookie-jar'
import { CookieJar } from 'tough-cookie'

const jar = new CookieJar

const fetch = createFetch(
  cookieJar(jar)
)

fetch('http://example.com').then(response => {
  // The cookie jar automatically tracks cookie values that
  // are returned in the Set-Cookie HTTP header.
  response.headers.get('Set-Cookie')

  // A Cookie header will automatically be appended to
  // requests to the same origin.
  fetch('http://example.com')
})
```
