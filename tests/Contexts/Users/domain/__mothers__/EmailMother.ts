import { Email } from '../../../../../src/Contexts/Users/domain/Email.js'

/**
 * Object Mother para generar Emails válidos para testing
 */
export class EmailMother {
  static create(value?: string): Email {
    return new Email(value ?? this.random())
  }

  static random(): string {
    const domains = ['example.com', 'test.org', 'demo.net', 'sample.io']
    const names = ['john', 'jane', 'alice', 'bob', 'charlie', 'diana']

    const name = names[Math.floor(Math.random() * names.length)]
    const domain = domains[Math.floor(Math.random() * domains.length)]
    const number = Math.floor(Math.random() * 1000)

    return `${name}${number}@${domain}`
  }

  static valid(): Email {
    return this.create('test@example.com')
  }

  static another(): Email {
    return this.create('another@example.com')
  }

  static withDomain(domain: string): Email {
    return this.create(`user@${domain}`)
  }

  static withName(name: string): Email {
    return this.create(`${name}@example.com`)
  }
}
