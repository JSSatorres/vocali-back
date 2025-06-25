import { UserName } from '../../../../../src/Contexts/Users/domain/UserName.js'

/**
 * Object Mother para generar UserNames válidos para testing
 */
export class UserNameMother {
  static create(value?: string): UserName {
    return new UserName(value ?? this.random())
  }

  static random(): string {
    const firstNames = ['John', 'Jane', 'Alice', 'Bob', 'Charlie', 'Diana', 'Edward', 'Fiona', 'George', 'Helen']
    const lastNames = [
      'Smith',
      'Johnson',
      'Brown',
      'Davis',
      'Wilson',
      'Moore',
      'Taylor',
      'Anderson',
      'Thomas',
      'Jackson'
    ]

    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)]
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)]

    return `${firstName} ${lastName}`
  }

  static valid(): UserName {
    return this.create('John Doe')
  }

  static another(): UserName {
    return this.create('Jane Smith')
  }

  static withFirstName(firstName: string): UserName {
    return this.create(`${firstName} Doe`)
  }

  static withLastName(lastName: string): UserName {
    return this.create(`John ${lastName}`)
  }

  static single(): UserName {
    return this.create('Alice')
  }

  static long(): UserName {
    return this.create('Very Long Full Name With Multiple Words Here')
  }
}
