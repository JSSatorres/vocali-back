import '../../../context/Shared/infrastructure/bootstrap'
import { container } from 'tsyringe'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { TranscriptionLister } from '../../../context/Transcription/application/TranscriptionLister'
import { withErrorHandling } from '../../shared/middleware/errorHandlingMiddleware'
import { withCorsHeaders } from '../../shared/middleware/corsMiddleware'
import { compose } from '../../shared/middleware/compose'
import { initializeDIContainer } from '../../../context/Shared/infrastructure/DI/DIContainer'

// Initialize DI container once
initializeDIContainer()

const transcriptionGetAllHandlerCore = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  const status = event.queryStringParameters?.status

  // Resolve TranscriptionLister from the DI container
  const transcriptionLister = container.resolve(TranscriptionLister)

  const transcriptions = status !== undefined
    ? await transcriptionLister.runByStatus(status)
    : await transcriptionLister.run()

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: 'Transcriptions retrieved successfully',
      status: 'success',
      data: transcriptions.map(t => t.toPrimitives()),
      count: transcriptions.length,
      timestamp: new Date().toISOString(),
      requestId: event.requestContext.requestId
    })
  }
}

export const transcriptionGetAllHandler = compose(
  withErrorHandling,
  withCorsHeaders({
    methods: ['GET', 'OPTIONS'],
    headers: ['Content-Type', 'Authorization']
  })
)(transcriptionGetAllHandlerCore)
