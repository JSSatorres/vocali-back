import { injectable } from 'tsyringe'
import { DynamoDBDocumentClient, PutCommand, QueryCommand, DeleteCommand, GetCommand } from '@aws-sdk/lib-dynamodb'
import { Transcription } from '../../domain/Transcription'
import { TranscriptionRepository } from '../../domain/TranscriptionRepository'
import { createDynamoDBClient } from '../../../Shared/infrastructure/persistence/dynamodb/DynamoDBConfig'
import { TranscriptionId } from '../../domain/TranscriptionId'

@injectable()
export class DynamoDBTranscriptionRepository implements TranscriptionRepository {
  private readonly client: DynamoDBDocumentClient
  private readonly tableName: string

  constructor () {
    this.client = createDynamoDBClient()
    this.tableName = process.env.TRANSCRIPTION_TABLE_NAME ?? 'transcription'
  }

  async save (transcription: Transcription): Promise<void> {
    const item = {
      transcriptionId: transcription.id.value,
      filename: transcription.filename.value,
      duration: transcription.duration.value,
      fileSize: transcription.fileSize.value,
      s3Key: transcription.s3Key.value,
      transcriptionUserId: transcription.trasncriptionUserId.value,
      status: transcription.status.value,
      transcriptionText: transcription.transcriptionText.value,
      createdAt: transcription.createdAt.toISOString(),
      updatedAt: new Date().toISOString()
    }

    const command = new PutCommand({
      TableName: this.tableName,
      Item: item
    })

    await this.client.send(command)
  }

  async download (id: TranscriptionId): Promise<Transcription | null> {
    const command = new GetCommand({
      TableName: this.tableName,
      Key: { transcriptionId: id.value }
    })

    const result = await this.client.send(command)

    if (!result.Item) {
      return null
    }

    const item = result.Item

    return Transcription.fromPrimitives({
      id: item.transcriptionId,
      filename: item.filename,
      duration: item.duration,
      fileSize: item.fileSize,
      s3Key: item.s3Key,
      status: item.status || 'pending',
      transcriptionText: item.transcriptionText || '',
      createdAt: item.createdAt || item.updatedAt || new Date().toISOString(),
      trasncriptionUserId: item.transcriptionUserId
    })
  }

  async searchAll (transcriptionUserId: string): Promise<Transcription[]> {
    const command = new QueryCommand({
      TableName: this.tableName,
      IndexName: 'TranscriptionUserIdIndex',
      KeyConditionExpression: 'transcriptionUserId = :userId',
      ExpressionAttributeValues: {
        ':userId': transcriptionUserId
      }
    })

    const result = await this.client.send(command)

    if (!result.Items || result.Items.length === 0) {
      return []
    }

    return result.Items.map(item =>
      Transcription.fromPrimitives({
        id: item.transcriptionId,
        filename: item.filename,
        duration: item.duration,
        fileSize: item.fileSize,
        s3Key: item.s3Key,
        status: 'completed',
        transcriptionText: item.transcriptionText || '',
        createdAt: item.createdAt || item.updatedAt || new Date().toISOString(),
        trasncriptionUserId: item.transcriptionUserId
      })
    )
  }

  async delete (id: string): Promise<void> {
    const command = new DeleteCommand({
      TableName: this.tableName,
      Key: { transcriptionId: id }
    })

    await this.client.send(command)
  }
}
