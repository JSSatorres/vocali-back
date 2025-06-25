import { TranscriptionDownloader } from './../../../context/Transcription/application/TranscriptionDownloader'
import { container } from 'tsyringe'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { createHandler } from '@/app/shared/middleware/createHandler'

const transcriptionDownloadHandlerCore = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  const transcriptionId = event.pathParameters?.id

  if (!transcriptionId) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'Bad Request: transcriptionId is required in path' })
    }
  }

  const transcriptionDownloader = container.resolve<TranscriptionDownloader>('TranscriptionDownloader')
  const downloadInfo = await transcriptionDownloader.run(transcriptionId)

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Content-Disposition': `attachment; filename="${downloadInfo.filename}"`,
      'Cache-Control': 'no-cache'
    },
    body: downloadInfo.textContent
  }
}

export const transcriptionDownloadHandler = createHandler(transcriptionDownloadHandlerCore, {
  methods: ['GET', 'OPTIONS']
})
