import { v4 as uuid, validate } from 'uuid'
import { InvalidArgumentError } from './InvalidArgumentError'
import { ValueObject } from './ValueObject'

export class Uuid extends ValueObject<string> {
  constructor (value: string) {
    super(value)
    this.ensureIsValidUuid(value)
  }

  static random (): Uuid {
    return new Uuid(uuid())
  }

  private ensureIsValidUuid (id: string): void {
    // eslint-disable-next-line
    if (!Boolean(validate(id))) {
      throw new InvalidArgumentError(`<${this.constructor.name}> does not allow the value <${id}>`)
    }
  }
}
