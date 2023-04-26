import { expect, describe, it, beforeEach, afterEach, vi } from 'vitest'
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { CheckInUseCase } from './check-in'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { Decimal } from '@prisma/client/runtime/library'

let checkInsRepository: InMemoryCheckInsRepository
let gymsRepository: InMemoryGymsRepository
let sut: CheckInUseCase

describe('Check-in Use Case', () => {
  beforeEach(() => {
    gymsRepository = new InMemoryGymsRepository()
    checkInsRepository = new InMemoryCheckInsRepository()
    sut = new CheckInUseCase(checkInsRepository, gymsRepository)

    gymsRepository.items.push({
      id: 'gym-01',
      title: 'JS Gym',
      description: '',
      phone: '',
      latitude: new Decimal(-22.1842202),
      longitude: new Decimal(-43.91965),
    })

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should be able check in', async () => {
    const { checkIn } = await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: -22.1842202,
      userLongitude: -43.91965,
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('should not be able to check in twice in the same day', async () => {
    // setando data do sistema para garantir que os check in serão criados no mesmo dia
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0))

    await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: -22.1842202,
      userLongitude: -43.91965,
    })

    await expect(() =>
      sut.execute({
        gymId: 'gym-01',
        userId: 'user-01',
        userLatitude: -22.1842202,
        userLongitude: -43.91965,
      }),
    ).rejects.toBeInstanceOf(Error)
  })

  it('should be able to check in twice but in different days', async () => {
    // setando data do sistema para garantir que os check in serão criados no mesmo dia
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0))

    await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: -22.1842202,
      userLongitude: -43.91965,
    })

    vi.setSystemTime(new Date(2022, 0, 21, 8, 0, 0))

    const { checkIn } = await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: -22.1842202,
      userLongitude: -43.91965,
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('should not be able to check in in on distant gym', async () => {
    gymsRepository.items.push({
      id: 'gym-02',
      title: 'JS Gym',
      description: '',
      phone: '',
      // -22.9842202,-43.21965,18z
      latitude: new Decimal(-22.9842202),
      longitude: new Decimal(-43.21965),
    })

    await expect(() =>
      sut.execute({
        gymId: 'gym-02',
        userId: 'user-01',
        userLatitude: -22.1842202,
        userLongitude: -43.91965,
      }),
    ).rejects.toBeInstanceOf(Error)
  })
})
