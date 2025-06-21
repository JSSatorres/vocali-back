import 'reflect-metadata'
import { container, DependencyContainer } from 'tsyringe'
import { UserRepository } from '../../../User/domain/UserRepository'
import { DynamoDBUserRepository } from '../../../User/infrastructure/persistence/DynamoDBUserRepository'

export const initializeDIContainer = (): void => {
  container.register<UserRepository>('UserRepository', {
    useClass: DynamoDBUserRepository
  })
}

export const getDIContainer = (): DependencyContainer => {
  return container
}
