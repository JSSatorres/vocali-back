import { TranscriptionFilename } from '../../../../../src/context/Transcription/domain/TranscriptionFilename'

export const TranscriptionFilenameMother = {
  create (value?: string): TranscriptionFilename {
    return new TranscriptionFilename(value ?? this.random())
  },

  random (): string {
    const extensions = ['mp3', 'wav', 'mp4', 'm4a']
    const randomExt = extensions[Math.floor(Math.random() * extensions.length)]
    return `audio-${Math.random().toString(36).substring(7)}.${randomExt}`
  },

  valid (): TranscriptionFilename {
    return new TranscriptionFilename('test-audio.mp3')
  },

  withExtension (extension: string): TranscriptionFilename {
    return new TranscriptionFilename(`test-audio.${extension}`)
  },

  longFilename (): TranscriptionFilename {
    return new TranscriptionFilename('very-long-audio-filename-for-testing-purposes.mp3')
  }
}
