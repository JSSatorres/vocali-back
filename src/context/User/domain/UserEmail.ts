import { StringValueObject } from '../../Shared/domain/value-object/StringValueObject'
import { InvalidArgumentError } from '../../Shared/domain/value-object/InvalidArgumentError'

export class UserEmail extends StringValueObject {
  constructor (value: string) {
    super(value)
    this.ensureValidEmail(value)
  }

  private ensureValidEmail (value: string): void {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(value)) {
      throw new InvalidArgumentError('Invalid email format')
    }
  }
}
