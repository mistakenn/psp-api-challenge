const { createDefaultResponse } = require('../../src/utils/response')
const { responseHelpersMiddleware } = require('../../src/middlewares/response')

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
    expect(fakeResponse).toHaveProperty('sendResponse')
    expect(typeof fakeResponse.sendError).toEqual('function')
    expect(typeof fakeResponse.sendResponse).toMatch('function')
  })
  it('Checks sendError without args', () => {
    const json = fakeResponse.sendError()
    expect(json).toEqual({
      data: createDefaultResponse(true, 'Internal Server Error'),
      status: 500
    })
  })
  it('Checks sendError with args', () => {
    const json = fakeResponse.sendError('Fake error', 403)
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
