const { createDefaultResponse } = require('../../src/utils/response')
const request = require('supertest')
const app = require('../../src/app')

const genBasicAppRouteTest = (route, expectedMessage) => async () => {
  const response = await request(app).get(route)
  const expected = createDefaultResponse(false, expectedMessage)
  expect(response.status).toEqual(200)
  expect(response.body).toEqual(expected)
}

describe('App basic routes', () => {
  it(
    'GET /api returns API name',
    genBasicAppRouteTest('/api', 'PSP Challenge API')
  )
  it(
    'GET /api/health returns Ok status',
    genBasicAppRouteTest('/api/health', 'Ok')
  )
})
