const { createDefaultResponse } = require('../../../src/utils/request')
const { responseHelpersMiddleware } = require('../../../src/middlewares/request')

const genFakeResponse = () => {
  let _status = null
  return {
    status (code) {
      _status = code
      return this
    },
    json: (data) => ({
      data,
      status: _status
    })
  }
}

describe('Response helpers middleware', () => {
  const fakeResponse = genFakeResponse()
  responseHelpersMiddleware(null, fakeResponse, () => {})

  it('Checks helpers insertion', () => {
    expect(fakeResponse).toHaveProperty('sendError')
    expect(fakeResponse).toHaveProperty('sendErrorMessage')
    expect(fakeResponse).toHaveProperty('sendResponse')
    expect(typeof fakeResponse.sendError).toEqual('function')
    expect(typeof fakeResponse.sendErrorMessage).toEqual('function')
    expect(typeof fakeResponse.sendResponse).toMatch('function')
  })
  it('Checks sendError with trusted error', () => {
    const json = fakeResponse.sendError({
      error: new Error('Test error'),
      trusted: true
    })
    expect(json).toEqual({
      data: createDefaultResponse(true, 'Test error'),
      status: 500
    })
  })
  it('Checks sendError with untrusted error', () => {
    const json = fakeResponse.sendError({
      error: new Error('Test error'),
      trusted: false
    })
    expect(json).toEqual({
      data: createDefaultResponse(true, 'Internal Server Error'),
      status: 500
    })
  })
  it('Checks sendError all parameters', () => {
    const json = fakeResponse.sendError({
      error: new Error('Test error'),
      forceStack: true,
      replacer: 'None',
      status: 403,
      trusted: false
    })
    expect(json).toHaveProperty('data')
    expect(json).toHaveProperty('status', 403)
    expect(json.data).toHaveProperty('data', null)
    expect(json.data).toHaveProperty('error', true)
    expect(json.data).toHaveProperty('message')
    expect(json.data.message).toMatch('None (Error:')
  })
  it('Checks sendErrorMessage without args', () => {
    const json = fakeResponse.sendErrorMessage()
    expect(json).toEqual({
      data: createDefaultResponse(true, 'Internal Server Error'),
      status: 500
    })
  })
  it('Checks sendErrorMessage with args', () => {
    const json = fakeResponse.sendErrorMessage('Fake error', 403)
    expect(json).toEqual({
      data: createDefaultResponse(true, 'Fake error'),
      status: 403
    })
  })
  it('Checks sendResponse without args', () => {
    const json = fakeResponse.sendResponse()
    expect(json).toEqual({
      data: createDefaultResponse(false, 'Done'),
      status: 200
    })
  })
  it('Checks sendResponse with args', () => {
    const json = fakeResponse.sendResponse({
      data: { id: 5 },
      message: 'Created'
    }, 201)
    expect(json).toEqual({
      data: createDefaultResponse(false, 'Created', { id: 5 }),
      status: 201
    })
  })
})
