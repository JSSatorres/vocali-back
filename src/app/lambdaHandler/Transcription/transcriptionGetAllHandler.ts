import { TranscriptionLister } from './../../../context/Transcription/application/TranscriptionLister'
import { container } from 'tsyringe'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { createHandler } from '@/app/shared/middleware/createHandler'

const transcriptionGetAllHandlerCore = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  const transcriptionUserId = event.requestContext.authorizer?.jwt?.claims?.sub

  if (!transcriptionUserId) {
    return {
      statusCode: 401,
      body: JSON.stringify({ message: 'Unauthorized: User ID not found in token' })
    }
  }

  const transcriptionLister = container.resolve<TranscriptionLister>('TranscriptionLister')
  const transcriptions = await transcriptionLister.run(transcriptionUserId)

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: 'Transcriptions retrieved successfully',
      status: 'success',
      data: transcriptions.map(transcription => transcription.toPrimitives()),
      count: transcriptions.length,
      timestamp: new Date().toISOString(),
      requestId: event.requestContext.requestId
    })
  }
}

export const transcriptionGetAllHandler = createHandler(transcriptionGetAllHandlerCore, {
  methods: ['GET', 'OPTIONS']
})
