import { User } from '../../../../../src/Contexts/Users/domain/User.js'
import { UserId } from '../../../../../src/Contexts/Users/domain/UserId.js'
import { Email } from '../../../../../src/Contexts/Users/domain/Email.js'
import { Password } from '../../../../../src/Contexts/Users/domain/Password.js'
import { UserName } from '../../../../../src/Contexts/Users/domain/UserName.js'
import { UserIdMother } from '../__mothers__/UserIdMother.js'
import { EmailMother } from '../__mothers__/EmailMother.js'
import { PasswordMother } from '../__mothers__/PasswordMother.js'
import { UserNameMother } from '../__mothers__/UserNameMother.js'

/**
 * Builder para construir Users de forma fluida para testing
 */
export class UserBuilder {
  private id: UserId
  private email: Email
  private password: Password
  private name: UserName

  constructor() {
    this.id = UserIdMother.create()
    this.email = EmailMother.create()
    this.password = PasswordMother.create()
    this.name = UserNameMother.create()
  }

  static create(): UserBuilder {
    return new UserBuilder()
  }

  withId(id: UserId): UserBuilder {
    this.id = id
    return this
  }

  withIdValue(idValue: string): UserBuilder {
    this.id = UserIdMother.create(idValue)
    return this
  }

  withEmail(email: Email): UserBuilder {
    this.email = email
    return this
  }

  withEmailValue(emailValue: string): UserBuilder {
    this.email = EmailMother.create(emailValue)
    return this
  }

  withPassword(password: Password): UserBuilder {
    this.password = password
    return this
  }

  withPasswordValue(passwordValue: string): UserBuilder {
    this.password = PasswordMother.create(passwordValue)
    return this
  }

  withName(name: UserName): UserBuilder {
    this.name = name
    return this
  }

  withNameValue(nameValue: string): UserBuilder {
    this.name = UserNameMother.create(nameValue)
    return this
  }

  // Métodos de conveniencia
  withValidData(): UserBuilder {
    this.id = UserIdMother.valid()
    this.email = EmailMother.valid()
    this.password = PasswordMother.valid()
    this.name = UserNameMother.valid()
    return this
  }

  withRandomData(): UserBuilder {
    this.id = UserIdMother.create()
    this.email = EmailMother.create()
    this.password = PasswordMother.create()
    this.name = UserNameMother.create()
    return this
  }

  // Métodos de construcción
  build(): User {
    return User.create(this.id, this.email, this.password, this.name)
  }

  buildAndRegister(registrationSource?: string): User {
    return User.register(this.id, this.email, this.password, this.name, registrationSource)
  }

  buildFromPrimitives(): User {
    const primitives = {
      id: this.id.value,
      email: this.email.value,
      password: this.password.value,
      name: this.name.value,
      createdAt: new Date(),
      updatedAt: new Date()
    }
    return User.fromPrimitives(primitives)
  }
}
