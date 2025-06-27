import { HttpError } from '../errors/HttpError'

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
