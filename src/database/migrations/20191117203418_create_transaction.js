exports.up = (knex) => Promise.all([
  knex.schema.createTable('transaction', (table) => {
    table.increments('id').primary()
    table.string('card_last_digits', 4).notNullable()
    table.timestamp('created_at', true).defaultTo(knex.fn.now()).notNullable()
    table.string('description', 100).notNullable()
    table.decimal('value', 12, 2).notNullable()
    table.enu('payment_method', null, {
      enumName: 'payment_methods',
      existingType: true,
      useNative: true
    }).notNullable()
  })
])

exports.down = (knex) => Promise.all([
  knex.schema.dropTableIfExists('transaction')
])
