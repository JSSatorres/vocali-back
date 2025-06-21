import { injectable } from 'tsyringe'
import { DynamoDBDocumentClient, PutCommand, GetCommand } from '@aws-sdk/lib-dynamodb'
import { User } from '../../domain/User'
import { UserRepository } from '../../domain/UserRepository'
import { createDynamoDBClient } from '../../../Shared/infrastructure/persistence/dynamodb/DynamoDBConfig'

@injectable()
export class DynamoDBUserRepository implements UserRepository {
  private readonly client: DynamoDBDocumentClient
  private readonly tableName: string

  constructor () {
    this.client = createDynamoDBClient()
    this.tableName = process.env.USER_TABLE_NAME ?? 'UserTable'
  }

  async save (user: User): Promise<void> {
    const item = {
      userId: user.id.value,
      name: user.name.value,
      email: user.email.value,
      createdAt: new Date().toISOString()
    }

    const command = new PutCommand({
      TableName: this.tableName,
      Item: item
    })

    await this.client.send(command)
  }

  async search (id: string): Promise<User | null> {
    const command = new GetCommand({
      TableName: this.tableName,
      Key: { userId: id }
    })

    const result = await this.client.send(command)

    if (result.Item === undefined) {
      return null
    }

    return User.fromPrimitives({
      id: result.Item.userId,
      name: result.Item.name,
      email: result.Item.email
    })
  }
}
