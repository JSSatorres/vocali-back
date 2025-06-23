import { TranscriptionS3Key } from '../../../../../src/context/Transcription/domain/TranscriptionS3Key'

export const TranscriptionS3KeyMother = {
  create (value?: string): TranscriptionS3Key {
    return new TranscriptionS3Key(value ?? this.random())
  },

  random (): string {
    const timestamp = Date.now()
    const randomId = Math.random().toString(36).substring(7)
    return `transcriptions/${timestamp}/${randomId}.mp3`
  },

  valid (): TranscriptionS3Key {
    return new TranscriptionS3Key('transcriptions/2024/01/550e8400-e29b-41d4-a716-446655440000.mp3')
  },

  withPrefix (prefix: string): TranscriptionS3Key {
    return new TranscriptionS3Key(`${prefix}/audio-file.mp3`)
  }
}
