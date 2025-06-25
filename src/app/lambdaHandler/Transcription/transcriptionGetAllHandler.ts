import { container } from 'tsyringe'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { TranscriptionLister } from '../../../context/Transcription/application/TranscriptionLister'
import { createHandler } from '@/app/shared/middleware/createHandler'

const transcriptionGetAllHandlerCore = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  const status = event.queryStringParameters?.status

  const transcriptionLister = container.resolve(TranscriptionLister)

  const transcriptions = status !== undefined
    ? await transcriptionLister.runByStatus(status)
    : await transcriptionLister.run()

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
