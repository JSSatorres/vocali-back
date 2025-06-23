import { User, UserId, Email, Password, UserName } from '../../../../src/Contexts/Users/domain/index.js'

describe('User Entity', () => {
  it('should create a new user', () => {
    const id = new UserId('550e8400-e29b-41d4-a716-446655440000')
    const email = new Email('test@example.com')
    const password = new Password('SecurePass123!')
    const name = new UserName('John Doe')

    const user = User.create(id, email, password, name)

    expect(user.getId().value).toBe('550e8400-e29b-41d4-a716-446655440000')
    expect(user.getEmail().value).toBe('test@example.com')
    expect(user.getName().value).toBe('John Doe')
  })

  it('should record domain event when user is created', () => {
    const id = new UserId('550e8400-e29b-41d4-a716-446655440000')
    const email = new Email('test@example.com')
    const password = new Password('SecurePass123!')
    const name = new UserName('John Doe')

    const user = User.create(id, email, password, name)
    const events = user.pullDomainEvents()

    expect(events).toHaveLength(1)
    expect(events[0]?.eventName()).toBe('user.created')
  })

  it('should convert to primitives', () => {
    const id = new UserId('550e8400-e29b-41d4-a716-446655440000')
    const email = new Email('test@example.com')
    const password = new Password('SecurePass123!')
    const name = new UserName('John Doe')

    const user = User.create(id, email, password, name)
    const primitives = user.toPrimitives()

    expect(primitives.id).toBe('550e8400-e29b-41d4-a716-446655440000')
    expect(primitives.email).toBe('test@example.com')
    expect(primitives.name).toBe('John Doe')
    expect(primitives.createdAt).toBeInstanceOf(Date)
    expect(primitives.updatedAt).toBeInstanceOf(Date)
  })

  it('should create user from primitives', () => {
    const primitives = {
      id: '550e8400-e29b-41d4-a716-446655440000',
      email: 'test@example.com',
      password: 'SecurePass123!',
      name: 'John Doe',
      createdAt: new Date(),
      updatedAt: new Date()
    }

    const user = User.fromPrimitives(primitives)

    expect(user.getId().value).toBe(primitives.id)
    expect(user.getEmail().value).toBe(primitives.email)
    expect(user.getName().value).toBe(primitives.name)
  })
})
