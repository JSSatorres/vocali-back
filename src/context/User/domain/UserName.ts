import { StringValueObject } from '../../Shared/domain/value-object/StringValueObject'
import { InvalidArgumentError } from '../../Shared/domain/value-object/InvalidArgumentError'

export class UserName extends StringValueObject {
  constructor (value: string) {
    super(value)
    this.ensureValidName(value)
  }

  private ensureValidName (value: string): void {
    if (value.length === 0) {
      throw new InvalidArgumentError('User name cannot be empty')
    }
    if (value.length > 100) {
      throw new InvalidArgumentError('User name cannot exceed 100 characters')
    }
  }
}
