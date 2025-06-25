// import { APIGatewayProxyEvent } from 'aws-lambda'
import { HttpError } from '../errors/HttpError'

// export function validateMultipartFormData (event: APIGatewayProxyEvent): string {
//   const contentType = event.headers['content-type'] ?? event.headers['Content-Type'] ?? ''

//   if (!contentType.includes('multipart/form-data')) {
//     throw new HttpError(400, {
//       message: 'Content-Type must be multipart/form-data for file uploads',
//       status: 'error',
//       timestamp: new Date().toISOString(),
//       requestId: event.requestContext.requestId
//     })
//   }

//   return contentType
// }

const allowedMimeTypes = [
  'audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/mp4', 'audio/m4a',
  'audio/ogg', 'audio/flac', 'audio/x-wav', 'audio/x-m4a'
]

export function validateAudioMimeType (mimeType: string, requestId: string): void {
  const isValid = allowedMimeTypes.some(type => mimeType.includes(type))

  if (!isValid) {
    throw new HttpError(400, {
      supportedTypes: allowedMimeTypes,
      receivedType: mimeType,
      timestamp: new Date().toISOString(),
      requestId
    })
  }
}
