exports.up = (knex) => Promise.all([
  knex.schema.createTable('payable', (table) => {
    table.increments('id').primary()
    table.timestamp('payment_date', true).notNullable()
    table.decimal('value', 12, 2).notNullable()
    table.enu('status', null, {
      enumName: 'payable_statuses',
      existingType: true,
      useNative: true
    }).notNullable()

    table.integer('transaction_id').unsigned().notNullable()
    table.foreign('transaction_id').references('transaction.id')

    table.timestamp('created_at', true).defaultTo(knex.fn.now()).notNullable()
  })
])

exports.down = (knex) => Promise.all([
  knex.schema.dropTableIfExists('payable')
])
