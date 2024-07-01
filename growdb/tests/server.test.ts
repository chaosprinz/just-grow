import request from 'supertest'

import server from '../src/app'

describe('Test server', () => {
  test('catch-all route', async () => {
    const res = await request(server).get('/')
    expect(res.body).toEqual({ message: 'Hey'})
  })
})