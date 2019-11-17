const enums = [
  {
    name: 'payable_statuses',
    values: [
      'paid',
      'waiting_funds'
    ]
  },
  {
    name: 'payment_methods',
    values: [
      'debit_card',
      'credit_card'
    ]
  }
]

exports.up = (knex) => Promise.all(enums.map(
  (enm) => knex.schema.raw(
    `create type ?? as enum (${enm.values.map((val) => `'${val}'`).join(',')})`,
    [enm.name]
  )
))

exports.down = (knex) => Promise.all(enums.map(
  (enm) => knex.schema.raw(`drop type ${enm.name}`)
))
