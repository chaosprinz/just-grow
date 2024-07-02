import request from 'supertest'

import app from '../src/app'

describe('Test app', () => {
  test('catch-all route', async () => {
    const res = await request(app).get('/')
    expect(res.body).toEqual({ message: 'growdb running'})
  })
})