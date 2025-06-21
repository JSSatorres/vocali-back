import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb'

export interface DynamoDBConfig {
  region: string

}

export const createDynamoDBConfig = (): DynamoDBConfig => {
  return {
    region: 'eu-west-1'
  }
}

export const createDynamoDBClient = (config?: DynamoDBConfig): DynamoDBDocumentClient => {
  const dbConfig = config ?? createDynamoDBConfig()

  const clientConfig: any = {
    region: dbConfig.region
  }

  const client = new DynamoDBClient(clientConfig)
  return DynamoDBDocumentClient.from(client)
}
