const request = require('supertest')
const app = require('../../src/app')

const PAGE_SIZE = parseInt(process.env.PAGE_SIZE) || 30

const transactions = [
  {
    card: {
      cvv: '202',
      expiration: '06/2026',
      owner: 'Daniel Rodriguez',
      number: '5168441223630339'
    },
    description: 'Smartband XYZ 5.0',
    paymentMethod: 'debit_card',
    value: 1000
  },
  {
    card: {
      cvv: '609',
      expiration: '10/2024',
      owner: 'Landon Gonzalez',
      number: '4024753713545448'
    },
    description: 'Smartband XYZ 3.0',
    paymentMethod: 'credit_card',
    value: 100
  },
  {
    card: {
      cvv: '476',
      expiration: '10/2023',
      owner: 'Alexis White',
      number: '4931923702044131'
    },
    description: 'Smartband XYZ 4.0',
    paymentMethod: 'credit_card',
    value: 500
  }
]

const genTransactionBadRequestTest = (data, errorPattern) => async () => {
  const response = await request(app).post('/api/transaction').send(data)
  expect(response.status).toEqual(400)
  expect(response.body).toHaveProperty('data', null)
  expect(response.body).toHaveProperty('error', true)
  expect(response.body).toHaveProperty('message')
  expect(response.body.message).toMatch(errorPattern)
}

const getTransactionRetrievalTest = (params = {}) => async () => {
  const { page = 1, pageSize = PAGE_SIZE } = params
  const firstIndex = (page - 1) * pageSize
  const expectedLength = Math.min(Math.max(transactions.length - firstIndex, 0), pageSize)
  const response = await request(app).get('/api/transaction').query(params)
  expect(response.status).toEqual(200)
  expect(response.body).toHaveProperty('data')
  expect(response.body).toHaveProperty('error', false)
  expect(response.body).toHaveProperty('message')
  expect(response.body.data).toHaveProperty('currentPage', page)
  expect(response.body.data).toHaveProperty('pageSize', pageSize)
  expect(response.body.data).toHaveProperty('items')
  if (params.includeTotal) {
    expect(response.body.data).toHaveProperty('total', 3)
  }
  expect(response.body.data.items).toHaveLength(expectedLength)
  response.body.data.items.forEach((item, index) => {
    delete item.createdAt
    const transaction = transactions[item.id - 1]
    expect(item).toEqual({
      id: firstIndex + index + 1,
      cardLastDigits: transaction.card.number.slice(-4),
      description: transaction.description,
      value: transaction.value,
      paymentMethod: transaction.paymentMethod
    })
  })
}

describe('Business rules routes', () => {
  const db = app.getDbInstance()
  beforeAll(async () => {
    await db.migrate.rollback()
    await db.migrate.latest()
  })

  describe('Transaction routes', () => {
    it(
      'POST /api/transaction without card information',
      genTransactionBadRequestTest({
        description: 'Smartband XYZ 3.0',
        paymentMethod: 'credit_card',
        value: 100
      }, '\'card\'')
    )
    it(
      'POST /api/transaction with invalid payment method',
      genTransactionBadRequestTest({
        card: {
          cvv: '609',
          expiration: '10/2024',
          owner: 'Landon Gonzalez',
          number: '4024753713545448'
        },
        description: 'Smartband XYZ 3.0',
        paymentMethod: 'unknown_card',
        value: 100
      }, '\'paymentMethod\'')
    )
    it(
      'POST /api/transaction with invalid value',
      genTransactionBadRequestTest({
        card: {
          cvv: '609',
          expiration: '10/2024',
          owner: 'Landon Gonzalez',
          number: '4024753713545448'
        },
        description: 'Smartband XYZ 3.0',
        paymentMethod: 'credit_card',
        value: 0
      }, '\'value\'')
    )
    it(
      'POST /api/transaction with invalid card',
      genTransactionBadRequestTest({
        card: {
          cvv: '609',
          expiration: '10/2024',
          owner: 'Landon Gonzalez',
          number: '4024753713545449'
        },
        description: 'Smartband XYZ 3.0',
        paymentMethod: 'credit_card',
        value: 0
      }, '\'number\'')
    )
    it(
      'POST /api/transaction with invalid expiration date',
      genTransactionBadRequestTest({
        card: {
          cvv: '609',
          expiration: '13/2019',
          owner: 'Landon Gonzalez',
          number: '4024753713545448'
        },
        description: 'Smartband XYZ 3.0',
        paymentMethod: 'credit_card',
        value: 100
      }, 'expiration')
    )
    it(
      'POST /api/transaction with expired card',
      genTransactionBadRequestTest({
        card: {
          cvv: '609',
          expiration: '11/2019',
          owner: 'Landon Gonzalez',
          number: '4024753713545448'
        },
        description: 'Smartband XYZ 3.0',
        paymentMethod: 'credit_card',
        value: 100
      }, 'card')
    )
    it('POST /api/transaction to create debit card transaction', async () => {
      const debitTransaction = transactions[0]
      const response = await request(app)
        .post('/api/transaction')
        .send(debitTransaction)
      expect(response.status).toEqual(200)
      expect(response.body).toHaveProperty('data', { id: 1 })
      expect(response.body).toHaveProperty('error', false)
      expect(response.body).toHaveProperty('message')
    })
    it('POST /api/transaction to create credit card transactions', () => Promise.all(
      transactions.slice(-2).map(async (transaction, index) => {
        const response = await request(app)
          .post('/api/transaction')
          .send(transaction)
        expect(response.status).toEqual(200)
        expect(response.body).toHaveProperty('data', { id: index + 2 })
        expect(response.body).toHaveProperty('error', false)
        expect(response.body).toHaveProperty('message')
      })
    ))
    it('GET /api/transaction with invalid params', async () => {
      const response = await request(app).get('/api/transaction').query({
        page: 0
      })
      expect(response.status).toEqual(400)
      expect(response.body).toHaveProperty('data', null)
      expect(response.body).toHaveProperty('error', true)
      expect(response.body).toHaveProperty('message')
      expect(response.body.message).toMatch('\'page\'')
    })
    it(
      'GET /api/transaction without params',
      getTransactionRetrievalTest()
    )
    it(
      'GET /api/transaction with page',
      getTransactionRetrievalTest({ page: 2 })
    )
    it(
      'GET /api/transaction with page and page size',
      getTransactionRetrievalTest({ page: 2, pageSize: 1 })
    )
    it(
      'GET /api/transaction with all params',
      getTransactionRetrievalTest({ includeTotal: true, page: 3, pageSize: 1 })
    )
  })

  describe('Balance route', () => {
    it('GET /api/balance', async () => {
      const response = await request(app).get('/api/balance')
      expect(response.status).toEqual(200)
      expect(response.body).toHaveProperty('error', false)
      expect(response.body).toHaveProperty('message')
      expect(response.body).toHaveProperty('data', {
        available: 970,
        waiting_funds: 570
      })
    })
  })
})
