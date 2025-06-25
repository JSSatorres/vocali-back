import { TranscriptionDeleter } from './../../../context/Transcription/application/TranscriptionDeleter'
import { container } from 'tsyringe'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { createHandler } from '@/app/shared/middleware/createHandler'

const transcriptionDeleteHandlerCore = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  const transcriptionId = event.pathParameters?.id

  if (!transcriptionId) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'Bad Request: transcriptionId is required in path' })
    }
  }

  const transcriptionDeleter = container.resolve<TranscriptionDeleter>('TranscriptionDeleter')
  await transcriptionDeleter.run(transcriptionId)

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: 'Transcription deleted successfully',
      status: 'success',
      transcriptionId,
      timestamp: new Date().toISOString(),
      requestId: event.requestContext.requestId
    })
  }
}

export const transcriptionDeleteHandler = createHandler(transcriptionDeleteHandlerCore, {
  methods: ['DELETE', 'OPTIONS']
})
