import 'reflect-metadata'
import { container } from 'tsyringe'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { TranscriptionCreator } from '../../../context/Transcription/application/TranscriptionCreator'
import { FileParserService } from '../../../context/Shared/domain/FileParserService'
import { createHandler } from '@/app/shared/middleware/createHandler'
import { validateAudioMimeType } from '@/app/shared/utils/transcriptionUtils'
process.traceDeprecation = true
// import { validateAudioMimeType, validateMultipartFormData } from '@/app/shared/utils/transcriptionUtils'

const transcriptionPostHandlerCore = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  console.log('[DEBUG] Claims:', JSON.stringify(event.requestContext, null, 2))
  const fileParserService = container.resolve<FileParserService>('FileParserService')
  const { filename, fileContent, mimeType } = await fileParserService.parseFromEvent(event)

  validateAudioMimeType(mimeType, event.requestContext.requestId)
  const trasncriptionUserId = event.requestContext.authorizer?.jwt?.claims?.sub
  const transcriptionCreator = container.resolve(TranscriptionCreator)
  const transcriptionId = await transcriptionCreator.run({
    filename,
    fileContent,
    mimeType,
    trasncriptionUserId
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

export const transcriptionPostHandler = createHandler(transcriptionPostHandlerCore, {
  methods: ['POST', 'OPTIONS']
})
