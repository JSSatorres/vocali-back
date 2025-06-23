import '../../../context/Shared/infrastructure/bootstrap'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb'
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import Busboy from 'busboy'

// Simple DynamoDB client
const dynamoClient = DynamoDBDocumentClient.from(new DynamoDBClient({
  region: process.env.AWS_REGION ?? 'eu-west-1'
}))

// Simple S3 client
const s3Client = new S3Client({
  region: process.env.AWS_REGION ?? 'eu-west-1'
})

// Simple file parser without complex dependencies
const parseMultipartFile = async (event: APIGatewayProxyEvent): Promise<{
  filename: string
  fileContent: Buffer
  mimeType: string
}> => {
  return await new Promise((resolve, reject) => {
    const contentType = event.headers['content-type'] ?? event.headers['Content-Type'] ?? ''

    if (!contentType.includes('multipart/form-data')) {
      reject(new Error('Content-Type must be multipart/form-data'))
      return
    }

    const busboy = Busboy({ headers: { 'content-type': contentType } })
    let fileData: { filename: string, fileContent: Buffer, mimeType: string } | null = null

    busboy.on('file', (fieldname: string, file: any, info: any) => {
      const { filename, mimeType } = info
      const chunks: Buffer[] = []

      file.on('data', (chunk: Buffer) => {
        chunks.push(chunk)
      })

      file.on('end', () => {
        fileData = {
          filename: filename !== null && filename !== undefined ? filename : 'unknown',
          fileContent: Buffer.concat(chunks),
          mimeType: mimeType !== null && mimeType !== undefined ? mimeType : 'application/octet-stream'
        }
      })
    })

    busboy.on('finish', () => {
      if (fileData !== null) {
        resolve(fileData)
      } else {
        reject(new Error('No file found in request'))
      }
    })

    busboy.on('error', (error: Error) => {
      reject(error)
    })

    // Parse the body
    const bodyBuffer = event.isBase64Encoded
      ? Buffer.from(event.body ?? '', 'base64')
      : Buffer.from(event.body ?? '', 'utf8')

    busboy.write(bodyBuffer)
    busboy.end()
  })
}

const transcriptionPostHandlerSimple = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    console.log('Handler iniciado correctamente')
    console.log('Environment variables:', {
      TRANSCRIPTION_TABLE_NAME: process.env.TRANSCRIPTION_TABLE_NAME,
      S3_BUCKET_NAME: process.env.S3_BUCKET_NAME,
      AWS_REGION: process.env.AWS_REGION
    })

    // Check if it's multipart/form-data
    const contentType = event.headers['content-type'] ?? event.headers['Content-Type'] ?? ''

    if (!contentType.includes('multipart/form-data')) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          message: 'Content-Type must be multipart/form-data for file uploads',
          status: 'error'
        })
      }
    }

    // Parse the file
    const { filename, fileContent, mimeType } = await parseMultipartFile(event)

    console.log(`File received: ${filename}, size: ${fileContent.length}, type: ${mimeType}`)

    // Validate file type
    const allowedMimeTypes = [
      'audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/mp4', 'audio/m4a',
      'audio/ogg', 'audio/flac', 'audio/x-wav', 'audio/x-m4a'
    ]

    if (!allowedMimeTypes.some(type => mimeType.includes(type))) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          message: 'Invalid file type. Only audio files are allowed.',
          status: 'error',
          receivedType: mimeType
        })
      }
    }

    // Generate unique ID and S3 key
    const transcriptionId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    const s3Key = `${transcriptionId}-${filename}`

    // Upload to S3
    const s3Command = new PutObjectCommand({
      Bucket: process.env.S3_BUCKET_NAME ?? 'vocali-transcriptions-dev',
      Key: s3Key,
      Body: fileContent,
      ContentType: mimeType
    })

    await s3Client.send(s3Command)
    console.log(`File uploaded to S3: ${s3Key}`)

    // Calculate simple metadata
    const fileSize = `${(fileContent.length / 1024 / 1024).toFixed(2)} MB`
    const estimatedDuration = '0:30' // Simple placeholder

    // Save to DynamoDB
    const dynamoCommand = new PutCommand({
      TableName: process.env.TRANSCRIPTION_TABLE_NAME ?? 'transcription',
      Item: {
        transcriptionId,
        filename,
        duration: estimatedDuration,
        fileSize,
        s3Key,
        status: 'pending',
        transcriptionText: '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    })

    await dynamoClient.send(dynamoCommand)
    console.log(`Record saved to DynamoDB: ${transcriptionId}`)

    return {
      statusCode: 201,
      body: JSON.stringify({
        message: 'Transcription created successfully',
        status: 'success',
        transcriptionId,
        filename,
        fileSize,
        s3Key,
        timestamp: new Date().toISOString(),
        requestId: event.requestContext.requestId
      })
    }
  } catch (error) {
    console.error('Error en handler:', error)
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: 'Error interno',
        error: error instanceof Error ? error.message : 'Unknown error'
      })
    }
  }
}

export { transcriptionPostHandlerSimple as transcriptionPostHandler }
