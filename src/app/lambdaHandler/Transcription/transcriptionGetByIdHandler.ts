import '../../../context/Shared/infrastructure/bootstrap'
import { container } from 'tsyringe'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { TranscriptionFinder } from '../../../context/Transcription/application/TranscriptionFinder'
import { withErrorHandling } from '../../shared/middleware/errorHandlingMiddleware'
import { withCorsHeaders } from '../../shared/middleware/corsMiddleware'
import { compose } from '../../shared/middleware/compose'
import { initializeDIContainer } from '../../../context/Shared/infrastructure/DI/DIContainer'

// Initialize DI container once
initializeDIContainer()

const transcriptionGetByIdHandlerCore = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  const transcriptionId = event.pathParameters?.id

  if (transcriptionId === undefined) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: 'Transcription ID is required',
        status: 'error',
        timestamp: new Date().toISOString(),
        requestId: event.requestContext.requestId
      })
    }
  }

  // Resolve TranscriptionFinder from the DI container
  const transcriptionFinder = container.resolve(TranscriptionFinder)
  const transcription = await transcriptionFinder.run({ id: transcriptionId })

  if (transcription === null) {
    return {
      statusCode: 404,
      body: JSON.stringify({
        message: 'Transcription not found',
        status: 'error',
        timestamp: new Date().toISOString(),
        requestId: event.requestContext.requestId
      })
    }
  }

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: 'Transcription retrieved successfully',
      status: 'success',
      data: transcription.toPrimitives(),
      timestamp: new Date().toISOString(),
      requestId: event.requestContext.requestId
    })
  }
}

export const transcriptionGetByIdHandler = compose(
  withErrorHandling,
  withCorsHeaders({
    methods: ['GET', 'OPTIONS'],
    headers: ['Content-Type', 'Authorization']
  })
)(transcriptionGetByIdHandlerCore)
