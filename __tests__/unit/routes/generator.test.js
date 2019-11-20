const generator = require('../../../src/routes/generator')

const registerMethod = (method) => function (path, controller) {
  this.routes.push({ controller, method, path })
}

const genFakeRouter = () => ({
  routes: [],
  get: registerMethod('get'),
  post: registerMethod('post')
})

describe('Routes generator', () => {
  it('Generates simple routes array', () => {
    const router = genFakeRouter()
    const routes = [
      {
        path: '/',
        method: 'get',
        controller: () => {}
      },
      {
        path: '/',
        method: 'post',
        controller: () => {}
      }
    ]
    generator(router, routes)
    expect(router).toHaveProperty('routes', routes)
  })
  it('Generates simple routes object', () => {
    const router = genFakeRouter()
    const routes = {
      path: '/api',
      method: 'get',
      controller: () => {}
    }
    generator(router, routes)
    expect(router).toHaveProperty('routes', [routes])
  })
  it('Generates full routes object', () => {
    const router = genFakeRouter()
    const deepController = () => {}
    const testController = () => {}
    const routes = {
      path: '/api',
      subroutes: [
        {
          path: '/test',
          subroutes: [
            {
              path: '/deep',
              method: 'post',
              controller: deepController
            }
          ]
        },
        {
          path: '/test',
          method: 'get',
          controller: testController
        }
      ]
    }
    generator(router, routes)
    expect(router).toHaveProperty('routes')
    expect(router.routes).toHaveLength(2)
    expect(router.routes).toContainEqual({
      path: '/api/test',
      method: 'get',
      controller: testController
    })
    expect(router.routes).toContainEqual({
      path: '/api/test/deep',
      method: 'post',
      controller: deepController
    })
  })
})
