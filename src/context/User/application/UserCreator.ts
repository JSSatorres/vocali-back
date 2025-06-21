import { injectable, inject } from 'tsyringe'
// import { EventBus } from '../../Shared/domain/EventBus'
import { User } from '../domain/User'
import { UserId } from '../domain/UserId'
import { UserName } from '../domain/UserName'
import { UserEmail } from '../domain/UserEmail'
import { UserRepository } from '../domain/UserRepository'
import { UserCreatorRequest } from './UserCreatorRequest'
import { Uuid } from '../../Shared/domain/value-object/Uuid'

@injectable()
export class UserCreator {
  constructor (@inject('UserRepository') private readonly repository: UserRepository) {}

  async run (request: UserCreatorRequest): Promise<void> {
    console.log('UserCreator.run', request)

    const user = User.create(
      new UserId(Uuid.random().value),
      new UserName(request.name),
      new UserEmail(request.email)
    )

    await this.repository.save(user)
    // await this.eventBus.publish(user.pullDomainEvents())
  }
}
