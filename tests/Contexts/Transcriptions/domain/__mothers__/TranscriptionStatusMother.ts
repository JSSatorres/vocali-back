import { TranscriptionStatus } from '../../../../../src/context/Transcription/domain/TranscriptionStatus'

export const TranscriptionStatusMother = {
  create (value?: string): TranscriptionStatus {
    return new TranscriptionStatus(value ?? this.random())
  },

  random (): string {
    const statuses = ['pending', 'processing', 'completed', 'failed']
    return statuses[Math.floor(Math.random() * statuses.length)]
  },

  pending (): TranscriptionStatus {
    return TranscriptionStatus.pending()
  },

  processing (): TranscriptionStatus {
    return TranscriptionStatus.processing()
  },

  completed (): TranscriptionStatus {
    return TranscriptionStatus.completed()
  },

  failed (): TranscriptionStatus {
    return TranscriptionStatus.failed()
  }
}
