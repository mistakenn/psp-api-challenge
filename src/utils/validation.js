const JOI_OPTIONS = {
  language: {
    key: '\'{{key}}\' ',
    string: {
      creditCard: 'must be a valid credit or debit card',
      regex: {
        base: 'fails to match the required pattern'
      }
    }
  }
}

/**
 * @description Realiza uma validacao a partir de um esquema do Joi e obtem os
 *   detalhes do erro, caso haja um
 * @param {Joi.Schema} schema
 * @param {Object} data
 * @returns {[ Error?, Any? ]}
 */
const validate = (schema, data) => {
  const { error, value: validationData } = schema.validate(data, JOI_OPTIONS)
  const validationError = error !== null
    ? new Error(((error.details || [])[0] || {}).message || 'Validation error')
    : null
  return [validationError, validationData]
}

module.exports = { validate }
