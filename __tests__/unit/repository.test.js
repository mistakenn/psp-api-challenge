const { createDbInstance, DbRep } = require('../../src/database')
const moment = require('moment')

const checkPayableData = (data, expectedId, payable) => {
  const { paymentDate, status, transactionId, value } = payable
  expect(data).toHaveProperty('id', expectedId)
  expect(data).toHaveProperty('paymentDate', paymentDate)
  expect(data).toHaveProperty('status', status)
  expect(data).toHaveProperty('transactionId', transactionId)
  expect(data).toHaveProperty('value', value)
  expect(data).toHaveProperty('createdAt')
}

const checkTransactionData = (data, expectedId, transaction) => {
  const { cardLastDigits, description, paymentMethod, value } = transaction
  expect(data).toHaveProperty('id', expectedId)
  expect(data).toHaveProperty('cardLastDigits', cardLastDigits)
  expect(data).toHaveProperty('description', description)
  expect(data).toHaveProperty('paymentMethod', paymentMethod)
  expect(data).toHaveProperty('value', value)
  expect(data).toHaveProperty('createdAt')
}

describe('Database repository', () => {
  const db = createDbInstance()
  const dbRep = DbRep({ db })

  beforeAll(() => db.migrate.rollback().then(() => db.migrate.latest()))
  afterAll(() => db.migrate.rollback())

  describe('Transaction repository', () => {
    const transactions = [
      {
        cardLastDigits: '0123',
        description: 'Test Product I',
        paymentMethod: 'debit_card',
        value: 100
      },
      {
        cardLastDigits: '4567',
        description: 'Test Product II',
        paymentMethod: 'credit_card',
        value: 1000
      }
    ]

    it('create with debit_card method', async () => {
      const [error, data] = await dbRep.transaction.create(transactions[0])
      expect(error).toBeNull()
      checkTransactionData(data, 1, transactions[0])
    })
    it('create with credit_card method', async () => {
      const [error, data] = await dbRep.transaction.create(transactions[1])
      expect(error).toBeNull()
      checkTransactionData(data, 2, transactions[1])
    })
    it('Error handling on create', async () => {
      const [error, data] = await dbRep.transaction.create({
        description: 'Test Product I',
        paymentMethod: 'credit_card',
        value: 100
      })
      expect(error).not.toBeNull()
      expect(data).toBeNull()
    })

    it('getPage without total listing all transactions', async () => {
      const [error, page] = await dbRep.transaction.getPage(1, 2)
      expect(error).toBeNull()
      expect(page).toHaveProperty('currentPage', 1)
      expect(page).toHaveProperty('pageSize', 2)
      expect(page).toHaveProperty('items')
      expect(page.items).toHaveLength(2)
      page.items.forEach((transaction) => checkTransactionData(
        transaction,
        transaction.id,
        transactions[transaction.id - 1]
      ))
    })
    it('getPage with total retrieving second transaction', async () => {
      const [error, page] = await dbRep.transaction.getPage(2, 1)
      expect(error).toBeNull()
      expect(page).toHaveProperty('currentPage', 2)
      expect(page).toHaveProperty('pageSize', 1)
      expect(page).toHaveProperty('items')
      expect(page.items).toHaveLength(1)
      checkTransactionData(page.items[0], 2, transactions[1])
    })
  })

  describe('Payable repository', () => {
    it('create first with paid status', async () => {
      const payable = {
        paymentDate: moment().toISOString(),
        status: 'paid',
        transactionId: 1,
        value: 50
      }
      const [error, data] = await dbRep.payable.create(payable)
      expect(error).toBeNull()
      checkPayableData(data, 1, payable)
    })
    it('create second with paid status', async () => {
      const payable = {
        paymentDate: moment().toISOString(),
        status: 'paid',
        transactionId: 1,
        value: 47
      }
      const [error, data] = await dbRep.payable.create(payable)
      expect(error).toBeNull()
      checkPayableData(data, 2, payable)
    })
    it('create with waiting_funds status', async () => {
      const payable = {
        paymentDate: moment().add(30, 'days').toISOString(),
        status: 'waiting_funds',
        transactionId: 2,
        value: 950
      }
      const [error, data] = await dbRep.payable.create(payable)
      expect(error).toBeNull()
      checkPayableData(data, 3, payable)
    })
    it('Error handling on create', async () => {
      const [error, data] = await dbRep.payable.create({
        paymentDate: moment().toISOString(),
        status: 'waiting_funds',
        value: 950
      })
      expect(error).not.toBeNull()
      expect(data).toBeNull()
    })

    it('getTotalValuesPerStatus returning correct total values', async () => {
      const [error, totalValuesPerStatus] =
        await dbRep.payable.getTotalValuesPerStatus()
      expect(error).toBeNull()
      expect(totalValuesPerStatus).toHaveLength(2)
      expect(totalValuesPerStatus).toContainEqual({
        status: 'paid',
        total: 97
      })
      expect(totalValuesPerStatus).toContainEqual({
        status: 'waiting_funds',
        total: 950
      })
    })
  })
})
