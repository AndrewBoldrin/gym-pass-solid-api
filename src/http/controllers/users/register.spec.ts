import request from 'supertest'
import { app } from '@/app'
import { describe, it, afterAll, beforeAll, expect } from 'vitest'

describe('Register (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to register', async () => {
    const response = await request(app.server).post('/users').send({
      name: 'John Doe',
      email: 'johndoe@email.com',
      password: '123456',
    })

    expect(response.statusCode).toEqual(201)
  })
})
