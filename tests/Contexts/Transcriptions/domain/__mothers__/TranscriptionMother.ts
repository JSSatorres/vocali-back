import { Transcription } from '../../../../../src/context/Transcription/domain/Transcription'
import { TranscriptionId } from '../../../../../src/context/Transcription/domain/TranscriptionId'
import { TranscriptionFilename } from '../../../../../src/context/Transcription/domain/TranscriptionFilename'
import { TranscriptionDuration } from '../../../../../src/context/Transcription/domain/TranscriptionDuration'
import { TranscriptionFileSize } from '../../../../../src/context/Transcription/domain/TranscriptionFileSize'
import { TranscriptionS3Key } from '../../../../../src/context/Transcription/domain/TranscriptionS3Key'
import { TranscriptionStatus } from '../../../../../src/context/Transcription/domain/TranscriptionStatus'
import { TranscriptionText } from '../../../../../src/context/Transcription/domain/TranscriptionText'
import { TranscriptionIdMother } from './TranscriptionIdMother'
import { TranscriptionFilenameMother } from './TranscriptionFilenameMother'
import { TranscriptionDurationMother } from './TranscriptionDurationMother'
import { TranscriptionFileSizeMother } from './TranscriptionFileSizeMother'
import { TranscriptionS3KeyMother } from './TranscriptionS3KeyMother'
import { TranscriptionStatusMother } from './TranscriptionStatusMother'
import { TranscriptionTextMother } from './TranscriptionTextMother'

export const TranscriptionMother = {
  create (
    id?: TranscriptionId,
    filename?: TranscriptionFilename,
    duration?: TranscriptionDuration,
    fileSize?: TranscriptionFileSize,
    s3Key?: TranscriptionS3Key,
    status?: TranscriptionStatus,
    transcriptionText?: TranscriptionText,
    createdAt?: Date
  ): Transcription {
    return new Transcription(
      id ?? TranscriptionIdMother.create(),
      filename ?? TranscriptionFilenameMother.create(),
      duration ?? TranscriptionDurationMother.create(),
      fileSize ?? TranscriptionFileSizeMother.create(),
      s3Key ?? TranscriptionS3KeyMother.create(),
      status ?? TranscriptionStatusMother.pending(),
      transcriptionText ?? TranscriptionTextMother.empty(),
      createdAt ?? new Date()
    )
  },

  random (): Transcription {
    return this.create()
  },

  valid (): Transcription {
    return this.create(
      TranscriptionIdMother.valid(),
      TranscriptionFilenameMother.valid(),
      TranscriptionDurationMother.valid(),
      TranscriptionFileSizeMother.valid(),
      TranscriptionS3KeyMother.valid(),
      TranscriptionStatusMother.pending(),
      TranscriptionTextMother.empty(),
      new Date('2024-01-01T00:00:00.000Z')
    )
  },

  pending (): Transcription {
    return this.create(
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      TranscriptionStatusMother.pending(),
      TranscriptionTextMother.empty()
    )
  },

  completed (): Transcription {
    return this.create(
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      TranscriptionStatusMother.completed(),
      TranscriptionTextMother.valid()
    )
  },

  failed (): Transcription {
    return this.create(
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      TranscriptionStatusMother.failed(),
      TranscriptionTextMother.empty()
    )
  }
}
