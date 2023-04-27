import request from 'supertest'
import { app } from '@/app'
import { describe, it, afterAll, beforeAll, expect } from 'vitest'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'

describe('Nearby Gyms (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to list nearby gyms', async () => {
    const { token } = await createAndAuthenticateUser(app)

    //       latitude: 22.8902344,
    //   longitude: -47.0516685,

    await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'JavaScript Gym Near',
        description: 'Some description.',
        phone: '1199999999',
        latitude: -22.1842202,
        longitude: -43.91965,
      })

    await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Typescript Gym Far',
        description: 'Some description.',
        phone: '1199999999',
        latitude: 22.8902344,
        longitude: -47.0516685,
      })

    const response = await request(app.server)
      .get('/gyms/nearby')
      .query({
        latitude: -22.1842202,
        longitude: -43.91965,
      })
      .set('Authorization', `Bearer ${token}`)
      .send()

    expect(response.statusCode).toEqual(200)
    expect(response.body.gyms).toHaveLength(1)
    expect(response.body.gyms).toEqual([
      expect.objectContaining({
        title: 'JavaScript Gym Near',
      }),
    ])
  })
})
