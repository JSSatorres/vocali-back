import { AggregateRoot } from '../../Shared/domain/AggregateRoot'
import { UserId } from './UserId'
import { UserName } from './UserName'
import { UserEmail } from './UserEmail'

export class User extends AggregateRoot {
  readonly id: UserId
  readonly name: UserName
  readonly email: UserEmail

  constructor (id: UserId, name: UserName, email: UserEmail) {
    super()
    this.id = id
    this.name = name
    this.email = email
  }

  static create (id: UserId, name: UserName, email: UserEmail): User {
    const user = new User(id, name, email)
    return user
  }

  toPrimitives (): any {
    return {
      id: this.id.value,
      name: this.name.value,
      email: this.email.value
    }
  }

  static fromPrimitives (plainData: { id: string, name: string, email: string }): User {
    return new User(
      new UserId(plainData.id),
      new UserName(plainData.name),
      new UserEmail(plainData.email)
    )
  }
}
