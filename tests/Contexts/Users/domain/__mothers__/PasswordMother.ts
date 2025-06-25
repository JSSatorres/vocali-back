import { Password } from '../../../../../src/Contexts/Users/domain/Password.js'

/**
 * Object Mother para generar Passwords válidos para testing
 */
export class PasswordMother {
  static create(value?: string): Password {
    return new Password(value ?? this.random())
  }

  static random(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*'
    let result = ''

    // Asegurar que tenga al menos una mayúscula, minúscula, número y símbolo
    result += 'A' // Mayúscula
    result += 'a' // Minúscula
    result += '1' // Número
    result += '!' // Símbolo

    // Completar hasta 12 caracteres
    for (let i = 4; i < 12; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length))
    }

    // Mezclar los caracteres
    return result
      .split('')
      .sort(() => Math.random() - 0.5)
      .join('')
  }

  static valid(): Password {
    return this.create('SecurePass123!')
  }

  static weak(): Password {
    return this.create('123456')
  }

  static strong(): Password {
    return this.create('VeryStr0ng@Password!')
  }

  static withLength(length: number): Password {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*'
    let result = 'Aa1!' // Base válida

    for (let i = 4; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length))
    }

    return this.create(result)
  }
}
