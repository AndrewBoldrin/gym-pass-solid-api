import { UsersRepository } from '@/repositories/users-repository'
import { hash } from 'bcryptjs'

interface RegisterUseCaseParams {
  name: string
  email: string
  password: string
}

// ao inves de a classe instanciar as dependencias new Prism..., ela recebe as dependencias

export class RegisterUseCase {
  // quando coloca o private ele ja vira uma variavel da classe
  constructor(private usersRepository: UsersRepository) {}

  async execute({ name, email, password }: RegisterUseCaseParams) {
    const password_hash = await hash(password, 6)

    const userWithSameEmail = await this.usersRepository.findByEmail(email)

    if (userWithSameEmail) {
      throw new Error('E-mail já existe.')
    }

    await this.usersRepository.create({ name, email, password_hash })
  }
}
