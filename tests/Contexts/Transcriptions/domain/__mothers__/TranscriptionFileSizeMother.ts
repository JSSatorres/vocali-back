import { TranscriptionFileSize } from '../../../../../src/context/Transcription/domain/TranscriptionFileSize'

export const TranscriptionFileSizeMother = {
  create (value?: string): TranscriptionFileSize {
    return new TranscriptionFileSize(value ?? this.random())
  },

  random (): string {
    // Genera un tamaño aleatorio entre 1.0 MB y 20.0 MB con un decimal
    const size = (Math.random() * 19 + 1).toFixed(1)
    return `${size} MB`
  },

  valid (): TranscriptionFileSize {
    return new TranscriptionFileSize('2.0 MB')
  },

  small (): TranscriptionFileSize {
    return new TranscriptionFileSize('1.0 MB')
  },

  large (): TranscriptionFileSize {
    return new TranscriptionFileSize('20.0 MB')
  }
}
