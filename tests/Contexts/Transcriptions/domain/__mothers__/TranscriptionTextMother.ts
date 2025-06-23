import { TranscriptionText } from '../../../../../src/context/Transcription/domain/TranscriptionText'

export const TranscriptionTextMother = {
  create (value?: string): TranscriptionText {
    return new TranscriptionText(value ?? this.random())
  },

  random (): string {
    const phrases = [
      'Hello, this is a test transcription.',
      'The quick brown fox jumps over the lazy dog.',
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      'This is an audio transcription for testing purposes.'
    ]
    return phrases[Math.floor(Math.random() * phrases.length)]
  },

  empty (): TranscriptionText {
    return new TranscriptionText('')
  },

  valid (): TranscriptionText {
    return new TranscriptionText('This is a valid transcription text for testing.')
  },

  long (): TranscriptionText {
    return new TranscriptionText(
      'This is a very long transcription text that contains multiple sentences. ' +
      'It simulates what a real transcription might look like when processing ' +
      'longer audio files with substantial content.'
    )
  }
}
