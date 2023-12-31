const Environment = require('jest-environment-jsdom')

module.exports = class CustomTestEnvironment extends Environment {
  async setup() {
    await super.setup()
    if (typeof this.global.TextEncoder === 'undefined') {
      // eslint-disable-next-line global-require
      const { TextEncoder, TextDecoder } = require('util')
      this.global.TextEncoder = TextEncoder
      this.global.TextDecoder = TextDecoder
      this.global.Uint8Array = Uint8Array
      this.global.fetch = fetch
      this.global.Request = Request
      this.global.Response = Response
    }
  }
}
