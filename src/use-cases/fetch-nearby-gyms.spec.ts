import { expect, describe, it, beforeEach } from 'vitest'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { FetchNearbyGymsUseCase } from './fetch-nearby-gyms'

let gymsRepository: InMemoryGymsRepository
let sut: FetchNearbyGymsUseCase

describe('Fetch Nearby Gyms Use Case', () => {
  beforeEach(async () => {
    gymsRepository = new InMemoryGymsRepository()
    sut = new FetchNearbyGymsUseCase(gymsRepository)
  })

  it('should be able to fetch nearby gyms', async () => {
    await gymsRepository.create({
      title: 'Near gym',
      description: null,
      phone: null,
      latitude: -22.1842202,
      longitude: -43.91965,
    })

    await gymsRepository.create({
      title: 'Far gym',
      description: null,
      phone: null,
      // -22.8902344,-47.0516685,9.5z
      latitude: 22.8902344,
      longitude: -47.0516685,
    })

    const { gyms } = await sut.execute({
      userLatitude: -22.1842202,
      userLongitude: -43.91965,
    })

    expect(gyms).toHaveLength(1)
    expect(gyms).toEqual([expect.objectContaining({ title: 'Near gym' })])
  })
})
