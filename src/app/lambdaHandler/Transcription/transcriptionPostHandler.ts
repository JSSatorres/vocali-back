import '../../../context/Shared/infrastructure/bootstrap'
import { container } from 'tsyringe'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { TranscriptionCreator } from '../../../context/Transcription/application/TranscriptionCreator'
import { withErrorHandling } from '../../shared/middleware/errorHandlingMiddleware'
import { withCorsHeaders } from '../../shared/middleware/corsMiddleware'
import { compose } from '../../shared/middleware/compose'
import { initializeDIContainer } from '../../../context/Shared/infrastructure/DI/DIContainer'
import { FileParserService } from '../../../context/Shared/domain/FileParserService'

// Initialize DI container once
initializeDIContainer()

const transcriptionPostHandlerCore = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  // Check if this is a multipart/form-data request
  const contentType = event.headers['content-type'] ?? event.headers['Content-Type'] ?? ''

  if (!contentType.includes('multipart/form-data')) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: 'Content-Type must be multipart/form-data for file uploads',
        status: 'error',
        timestamp: new Date().toISOString(),
        requestId: event.requestContext.requestId
      })
    }
  }

  // Parse the multipart file
  const fileParserService = container.resolve<FileParserService>('FileParserService')
  const { filename, fileContent, mimeType } = await fileParserService.parseMultipart(
    event.body ?? '',
    contentType
  )

  // Validate file type (basic validation)
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
        supportedTypes: allowedMimeTypes,
        receivedType: mimeType,
        timestamp: new Date().toISOString(),
        requestId: event.requestContext.requestId
      })
    }
  }

  // Create transcription through the application service
  const transcriptionCreator = container.resolve(TranscriptionCreator)
  const transcriptionId = await transcriptionCreator.run({
    filename,
    fileContent,
    mimeType
  })

  return {
    statusCode: 201,
    body: JSON.stringify({
      message: 'Transcription created successfully',
      status: 'success',
      transcriptionId,
      filename,
      fileSize: `${(fileContent.length / 1024 / 1024).toFixed(2)} MB`,
      timestamp: new Date().toISOString(),
      requestId: event.requestContext.requestId
    })
  }
}

export const transcriptionPostHandler = compose(
  withErrorHandling,
  withCorsHeaders({
    methods: ['POST', 'OPTIONS'],
    headers: ['Content-Type', 'Authorization']
  })
  // Note: Removed withBodyValidation because we're handling multipart data manually
)(transcriptionPostHandlerCore)
