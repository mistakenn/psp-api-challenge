const {
  camelToSnake,
  keyMapper,
  snakeToCamel
} = require('../../../src/utils/knex')

describe('Knex utils', () => {
  it('Checks camelToSnake with simple key', () => {
    const response = camelToSnake('imAKey')
    expect(response).toEqual('im_a_key')
  })
  it('Checks camelToSnake with upper starting letter', () => {
    const response = camelToSnake('ImAKey')
    expect(response).toEqual('im_a_key')
  })
  it('Checks camelToSnake with key starting with underscore', () => {
    const response = camelToSnake('_ImAKey')
    expect(response).toEqual('_im_a_key')
  })
  it('Checks snakeToCamel with simple key', () => {
    const response = snakeToCamel('im_a_key')
    expect(response).toEqual('imAKey')
  })
  it('Checks snakeToCamel with upper starting letter', () => {
    const response = snakeToCamel('Im_a_key')
    expect(response).toEqual('ImAKey')
  })
  it('Checks snakeToCamel with key starting with underscore', () => {
    const response = snakeToCamel('_im_a_key')
    expect(response).toEqual('_imAKey')
  })
  it('Checks keyMapper on object', () => {
    const response = keyMapper(snakeToCamel, {
      first_one: 'the_first',
      second: 'the_second'
    })
    expect(response).toEqual({
      firstOne: 'the_first',
      second: 'the_second'
    })
  })
  it('Checks that keyMapper does not modify arrays', () => {
    const arr = [
      { thirdOne: 'three' },
      { fourthOne: 'four' }
    ]
    const response = keyMapper(camelToSnake, arr)
    expect(response).toBe(arr)
  })
  it('Checks that keyMapper only affects first level keys', () => {
    const response = keyMapper(
      (key) => `$${key}`,
      { outer: { inner: 'content' } }
    )
    expect(response).toEqual({ $outer: { inner: 'content' } })
  })
})
