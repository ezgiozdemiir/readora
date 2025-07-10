import '@testing-library/jest-dom'
import fetchMock from 'jest-fetch-mock'
if (typeof global.TextEncoder === 'undefined') {
    // @ts-ignore
    const { TextEncoder, TextDecoder } = require('util')
    // @ts-ignore
    global.TextEncoder = TextEncoder
    // @ts-ignore
    global.TextDecoder = TextDecoder
}

fetchMock.enableMocks()
