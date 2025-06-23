import { UserRepository, User, UserId, Email, Password, UserName } from '../../../../src/Contexts/Users/domain/index.js'
import { expect, describe, it } from '@jest/globals'

describe('UserRepository', () => {
  // Mock implementation del repositorio para testing
  class MockUserRepository implements UserRepository {
    private users: Map<string, User> = new Map()

    async save(user: User): Promise<void> {
      const primitives = user.toPrimitives()
      this.users.set(primitives.id, user)
    }

    async findById(id: UserId): Promise<User | null> {
      const user = this.users.get(id.value)
      return user || null
    }

    async findByEmail(email: Email): Promise<User | null> {
      for (const user of this.users.values()) {
        const primitives = user.toPrimitives()
        if (primitives.email === email.value) {
          return user
        }
      }
      return null
    }

    async existsByEmail(email: Email): Promise<boolean> {
      const user = await this.findByEmail(email)
      return user !== null
    }

    async delete(id: UserId): Promise<void> {
      this.users.delete(id.value)
    }

    async findAll(limit?: number, offset?: number): Promise<User[]> {
      const allUsers = Array.from(this.users.values())

      if (offset !== undefined) {
        return allUsers.slice(offset, limit ? offset + limit : undefined)
      }

      if (limit !== undefined) {
        return allUsers.slice(0, limit)
      }

      return allUsers
    }

    async count(): Promise<number> {
      return this.users.size
    }
  }

  describe('Repository Interface Contract', () => {
    it('should save and find user by id', async () => {
      const repository = new MockUserRepository()
      const userId = new UserId('550e8400-e29b-41d4-a716-446655440000')
      const email = new Email('test@example.com')
      const password = new Password('SecurePass123!')
      const name = new UserName('John Doe')

      const user = User.create(userId, email, password, name)

      await repository.save(user)

      const foundUser = await repository.findById(userId)

      expect(foundUser).not.toBeNull()
      expect(foundUser?.toPrimitives().id).toBe(userId.value)
      expect(foundUser?.toPrimitives().email).toBe(email.value)
    })

    it('should find user by email', async () => {
      const repository = new MockUserRepository()
      const userId = new UserId('550e8400-e29b-41d4-a716-446655440001')
      const email = new Email('findme@example.com')
      const password = new Password('SecurePass123!')
      const name = new UserName('Jane Doe')

      const user = User.create(userId, email, password, name)

      await repository.save(user)

      const foundUser = await repository.findByEmail(email)

      expect(foundUser).not.toBeNull()
      expect(foundUser?.toPrimitives().email).toBe(email.value)
    })

    it('should check if user exists by email', async () => {
      const repository = new MockUserRepository()
      const userId = new UserId('550e8400-e29b-41d4-a716-446655440002')
      const email = new Email('exists@example.com')
      const password = new Password('SecurePass123!')
      const name = new UserName('Bob Doe')

      const user = User.create(userId, email, password, name)

      await repository.save(user)

      const exists = await repository.existsByEmail(email)
      const notExists = await repository.existsByEmail(new Email('nonexistent@example.com'))

      expect(exists).toBe(true)
      expect(notExists).toBe(false)
    })

    it('should delete user', async () => {
      const repository = new MockUserRepository()
      const userId = new UserId('550e8400-e29b-41d4-a716-446655440003')
      const email = new Email('delete@example.com')
      const password = new Password('SecurePass123!')
      const name = new UserName('Delete Me')

      const user = User.create(userId, email, password, name)

      await repository.save(user)
      await repository.delete(userId)

      const foundUser = await repository.findById(userId)

      expect(foundUser).toBeNull()
    })

    it('should find all users with pagination', async () => {
      const repository = new MockUserRepository()

      // Crear varios usuarios
      const names = ['Alice Smith', 'Bob Johnson', 'Charlie Brown', 'Diana Prince', 'Edward Norton']
      for (let i = 0; i < 5; i++) {
        const userId = new UserId(`550e8400-e29b-41d4-a716-44665544000${i}`)
        const email = new Email(`user${i}@example.com`)
        const password = new Password('SecurePass123!')
        const name = new UserName(names[i]!)

        const user = User.create(userId, email, password, name)
        await repository.save(user)
      }

      const allUsers = await repository.findAll()
      const limitedUsers = await repository.findAll(3)
      const paginatedUsers = await repository.findAll(2, 2)

      expect(allUsers).toHaveLength(5)
      expect(limitedUsers).toHaveLength(3)
      expect(paginatedUsers).toHaveLength(2)
    })

    it('should count users', async () => {
      const repository = new MockUserRepository()

      expect(await repository.count()).toBe(0)

      const userId = new UserId('550e8400-e29b-41d4-a716-446655440010')
      const email = new Email('count@example.com')
      const password = new Password('SecurePass123!')
      const name = new UserName('Count Me')

      const user = User.create(userId, email, password, name)
      await repository.save(user)

      expect(await repository.count()).toBe(1)
    })

    it('should return null when user not found', async () => {
      const repository = new MockUserRepository()
      const nonExistentId = new UserId('550e8400-e29b-41d4-a716-446655440999')
      const nonExistentEmail = new Email('notfound@example.com')

      const userById = await repository.findById(nonExistentId)
      const userByEmail = await repository.findByEmail(nonExistentEmail)

      expect(userById).toBeNull()
      expect(userByEmail).toBeNull()
    })
  })
})
