import { routes } from '@/router'

describe('Router Tests', () => {
  test('the router should have this configuration', () => {
    console.log(routes)
    expect(routes).toMatchObject([
      { path: '/', name: 'home', component: expect.any(Function) },
      { path: '/about', name: 'about', component: expect.any(Function) },
      { 
        path: '/manage', 
        name: 'manage', 
        component: expect.any(Function),
        meta: { requiresAuth: true }
      },
      { path: '/song/:id', name: 'song', component: expect.any(Function) },
      { path: '/:catchAll(.*)*', redirect: { name: 'home' } }
    ])
  })

  test('manage route should have restriction to only users logged in', async () => {
    const manageRouteMeta =  routes[2].meta
    expect(manageRouteMeta).toStrictEqual({
      requiresAuth: true
    })
  })
})