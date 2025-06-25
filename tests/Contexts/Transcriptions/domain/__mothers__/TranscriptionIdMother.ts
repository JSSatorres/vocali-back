import { TranscriptionId } from '../../../../../src/context/Transcription/domain/TranscriptionId'

export const TranscriptionIdMother = {
  create (value?: string): TranscriptionId {
    return new TranscriptionId(value ?? this.random())
  },

  random (): string {
    return `transcription-${Math.random().toString(36).substring(7)}`
  },

  valid (): TranscriptionId {
    return new TranscriptionId('550e8400-e29b-41d4-a716-446655440000')
  },

  invalid (): string {
    return 'invalid-id'
  }
}
