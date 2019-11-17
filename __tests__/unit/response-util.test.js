const { createDefaultResponse } = require('../../src/utils/response')

describe('Response utils', () => {
  it('Checks createDefaultResponse without data', () => {
    const response = createDefaultResponse(true, 'Error')
    expect(response).toEqual({
      data: null,
      error: true,
      message: 'Error'
    })
  }),
  it('Checks createDefaultResponse with data', () => {
    const response = createDefaultResponse(false, 'Success', { id: 1 })
    expect(response).toEqual({
      data: { id: 1 },
      error: false,
      message: 'Success'
    })
  })
})
