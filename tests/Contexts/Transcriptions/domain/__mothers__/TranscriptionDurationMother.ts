import { TranscriptionDuration } from '../../../../../src/context/Transcription/domain/TranscriptionDuration'

export const TranscriptionDurationMother = {
  create (value?: string): TranscriptionDuration {
    return new TranscriptionDuration(value ?? this.random())
  },

  random (): string {
    const minutes = Math.floor(Math.random() * 60)
    const seconds = Math.floor(Math.random() * 60)
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  },

  valid (): TranscriptionDuration {
    return new TranscriptionDuration('03:45')
  },

  short (): TranscriptionDuration {
    return new TranscriptionDuration('00:30')
  },

  long (): TranscriptionDuration {
    return new TranscriptionDuration('45:30')
  }
}
