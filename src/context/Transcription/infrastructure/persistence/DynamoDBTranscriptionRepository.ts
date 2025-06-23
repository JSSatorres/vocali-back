import { injectable } from 'tsyringe'
import { DynamoDBDocumentClient, PutCommand, GetCommand, ScanCommand, UpdateCommand, DeleteCommand } from '@aws-sdk/lib-dynamodb'
import { Transcription } from '../../domain/Transcription'
import { TranscriptionRepository } from '../../domain/TranscriptionRepository'
import { createDynamoDBClient } from '../../../Shared/infrastructure/persistence/dynamodb/DynamoDBConfig'

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

  async search (id: string): Promise<Transcription | null> {
    const command = new GetCommand({
      TableName: this.tableName,
      Key: { transcriptionId: id }
    })

    const result = await this.client.send(command)

    if (result.Item === undefined) {
      return null
    }

    return Transcription.fromPrimitives({
      id: result.Item.transcriptionId,
      filename: result.Item.filename,
      duration: result.Item.duration,
      fileSize: result.Item.fileSize,
      s3Key: result.Item.s3Key,
      status: result.Item.status,
      transcriptionText: result.Item.transcriptionText,
      createdAt: result.Item.createdAt
    })
  }

  async searchAll (): Promise<Transcription[]> {
    const command = new ScanCommand({
      TableName: this.tableName
    })

    const result = await this.client.send(command)

    if (result.Items === undefined) {
      return []
    }

    return result.Items.map(item => Transcription.fromPrimitives({
      id: item.transcriptionId,
      filename: item.filename,
      duration: item.duration,
      fileSize: item.fileSize,
      s3Key: item.s3Key,
      status: item.status,
      transcriptionText: item.transcriptionText,
      createdAt: item.createdAt
    }))
  }

  async searchByStatus (status: string): Promise<Transcription[]> {
    const command = new ScanCommand({
      TableName: this.tableName,
      FilterExpression: '#status = :status',
      ExpressionAttributeNames: {
        '#status': 'status'
      },
      ExpressionAttributeValues: {
        ':status': status
      }
    })

    const result = await this.client.send(command)

    if (result.Items === undefined) {
      return []
    }

    return result.Items.map(item => Transcription.fromPrimitives({
      id: item.transcriptionId,
      filename: item.filename,
      duration: item.duration,
      fileSize: item.fileSize,
      s3Key: item.s3Key,
      status: item.status,
      transcriptionText: item.transcriptionText,
      createdAt: item.createdAt
    }))
  }

  async update (transcription: Transcription): Promise<void> {
    const command = new UpdateCommand({
      TableName: this.tableName,
      Key: { transcriptionId: transcription.id.value },
      UpdateExpression: 'SET #status = :status, transcriptionText = :transcriptionText, updatedAt = :updatedAt',
      ExpressionAttributeNames: {
        '#status': 'status'
      },
      ExpressionAttributeValues: {
        ':status': transcription.status.value,
        ':transcriptionText': transcription.transcriptionText.value,
        ':updatedAt': new Date().toISOString()
      }
    })

    await this.client.send(command)
  }

  async delete (id: string): Promise<void> {
    const command = new DeleteCommand({
      TableName: this.tableName,
      Key: { transcriptionId: id }
    })

    await this.client.send(command)
  }
}
