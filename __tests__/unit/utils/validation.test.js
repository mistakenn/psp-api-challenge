const { validate } = require('../../../src/utils/validation')
const Joi = require('joi')

describe('Validation utils', () => {
  const schema = Joi.object({ error: Joi.boolean().required() })
  it('Successful validation', () => {
    const response = validate(schema, { error: false })
    expect(response).toEqual([null, { error: false }])
  })
  it('Successful validation parsing', () => {
    const response = validate(schema, { error: 'false' })
    expect(response).toEqual([null, { error: false }])
  })
  it('Unsuccessful validation', () => {
    const response = validate(schema, {})
    expect(response).toEqual([new Error('\'error\' is required'), null])
  })
})
