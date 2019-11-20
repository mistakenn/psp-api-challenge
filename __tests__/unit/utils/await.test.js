const { safeAwait } = require('../../../src/utils/await')

describe('Await utils', () => {
  it('safeAwait receiving Promise', async () => {
    const response = await safeAwait(new Promise(
      (resolve, reject) => resolve('done')
    ))
    expect(response).toEqual([null, 'done'])
  })
  it('safeAwait receiving function', async () => {
    const response = await safeAwait(() =>
      new Promise((resolve, reject) => resolve('done'))
    )
    expect(response).toEqual([null, 'done'])
  })
  it('safeAwait exception catch', async () => {
    const error = new Error('failed')
    const response = await safeAwait(new Promise(
      (resolve, reject) => reject(error)
    ))
    expect(response).toEqual([error, null])
  })
})
