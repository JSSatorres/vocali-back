import { UserId } from '../../../../../src/Contexts/Users/domain/UserId.js'

/**
 * Object Mother para generar UserIds válidos para testing
 */
export class UserIdMother {
  static create(value?: string): UserId {
    return new UserId(value ?? this.random())
  }

  static random(): string {
    // Genera un UUID v4 válido para testing
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      const r = (Math.random() * 16) | 0
      const v = c === 'x' ? r : (r & 0x3) | 0x8
      return v.toString(16)
    })
  }

  static valid(): UserId {
    return this.create('550e8400-e29b-41d4-a716-446655440000')
  }

  static another(): UserId {
    return this.create('550e8400-e29b-41d4-a716-446655440001')
  }

  static withValue(value: string): UserId {
    return this.create(value)
  }
}
