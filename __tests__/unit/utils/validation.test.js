const { validate } = require('../../../src/utils/validation')
const Joi = require('joi')

describe('Validation utils', () => {
  const schema = Joi.object({ error: Joi.boolean().required() })
  it('Checks successful validation', () => {
    const response = validate(schema, { error: false })
    expect(response).toEqual([ null, { error: false } ])
  })
  it('Checks successful validation parsing', () => {
    const response = validate(schema, { error: 'false' })
    expect(response).toEqual([ null, { error: false } ])
  })
  it('Checks unsuccessful validation', () => {
    const response = validate(schema, {})
    expect(response).toEqual([ new Error('\'error\' is required'), null ])
  })
})
