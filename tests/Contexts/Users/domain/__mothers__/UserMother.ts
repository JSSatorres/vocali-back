import { User } from '../../../../../src/Contexts/Users/domain/User.js'
import { UserId } from '../../../../../src/Contexts/Users/domain/UserId.js'
import { Email } from '../../../../../src/Contexts/Users/domain/Email.js'
import { Password } from '../../../../../src/Contexts/Users/domain/Password.js'
import { UserName } from '../../../../../src/Contexts/Users/domain/UserName.js'
import { UserIdMother } from './UserIdMother.js'
import { EmailMother } from './EmailMother.js'
import { PasswordMother } from './PasswordMother.js'
import { UserNameMother } from './UserNameMother.js'

/**
 * Object Mother para generar Users válidos para testing
 */
export class UserMother {
  static create(id?: UserId, email?: Email, password?: Password, name?: UserName): User {
    return User.create(
      id ?? UserIdMother.create(),
      email ?? EmailMother.create(),
      password ?? PasswordMother.create(),
      name ?? UserNameMother.create()
    )
  }

  static random(): User {
    return this.create()
  }

  static valid(): User {
    return this.create(UserIdMother.valid(), EmailMother.valid(), PasswordMother.valid(), UserNameMother.valid())
  }

  static withId(id: UserId): User {
    return this.create(id)
  }

  static withEmail(email: Email): User {
    return this.create(undefined, email)
  }

  static withName(name: UserName): User {
    return this.create(undefined, undefined, undefined, name)
  }

  static withEmailValue(emailValue: string): User {
    return this.withEmail(EmailMother.create(emailValue))
  }

  static withNameValue(nameValue: string): User {
    return this.withName(UserNameMother.create(nameValue))
  }

  static registered(registrationSource?: string): User {
    return User.register(
      UserIdMother.create(),
      EmailMother.create(),
      PasswordMother.create(),
      UserNameMother.create(),
      registrationSource
    )
  }
}
