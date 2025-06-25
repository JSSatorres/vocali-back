import { Transcription } from '../../../../../src/context/Transcription/domain/Transcription'
import { TranscriptionId } from '../../../../../src/context/Transcription/domain/TranscriptionId'
import { TranscriptionFilename } from '../../../../../src/context/Transcription/domain/TranscriptionFilename'
import { TranscriptionDuration } from '../../../../../src/context/Transcription/domain/TranscriptionDuration'
import { TranscriptionFileSize } from '../../../../../src/context/Transcription/domain/TranscriptionFileSize'
import { TranscriptionS3Key } from '../../../../../src/context/Transcription/domain/TranscriptionS3Key'
import { TranscriptionStatus } from '../../../../../src/context/Transcription/domain/TranscriptionStatus'
import { TranscriptionText } from '../../../../../src/context/Transcription/domain/TranscriptionText'
import { TrasncriptionUserId } from '../../../../../src/context/Transcription/domain/TrasncriptionUserId'
import { TranscriptionIdMother } from '../__mothers__/TranscriptionIdMother'
import { TranscriptionFilenameMother } from '../__mothers__/TranscriptionFilenameMother'
import { TranscriptionDurationMother } from '../__mothers__/TranscriptionDurationMother'
import { TranscriptionFileSizeMother } from '../__mothers__/TranscriptionFileSizeMother'
import { TranscriptionS3KeyMother } from '../__mothers__/TranscriptionS3KeyMother'
import { TranscriptionStatusMother } from '../__mothers__/TranscriptionStatusMother'
import { TranscriptionTextMother } from '../__mothers__/TranscriptionTextMother'

/**
 * Builder para construir Transcriptions de forma fluida para testing
 */
export class TranscriptionBuilder {
  private id: TranscriptionId
  private filename: TranscriptionFilename
  private duration: TranscriptionDuration
  private fileSize: TranscriptionFileSize
  private s3Key: TranscriptionS3Key
  private status: TranscriptionStatus
  private transcriptionText: TranscriptionText
  private userId: TrasncriptionUserId
  private createdAt: Date

  constructor () {
    this.id = TranscriptionIdMother.create()
    this.filename = TranscriptionFilenameMother.create()
    this.duration = TranscriptionDurationMother.create()
    this.fileSize = TranscriptionFileSizeMother.create()
    this.s3Key = TranscriptionS3KeyMother.create()
    this.status = TranscriptionStatusMother.pending()
    this.transcriptionText = TranscriptionTextMother.create()
    this.userId = new TrasncriptionUserId('user-123')
    this.createdAt = new Date()
  }

  static create (): TranscriptionBuilder {
    return new TranscriptionBuilder()
  }

  withId (id: TranscriptionId): TranscriptionBuilder {
    this.id = id
    return this
  }

  withIdValue (idValue: string): TranscriptionBuilder {
    this.id = TranscriptionIdMother.create(idValue)
    return this
  }

  withFilename (filename: TranscriptionFilename): TranscriptionBuilder {
    this.filename = filename
    return this
  }

  withFilenameValue (filenameValue: string): TranscriptionBuilder {
    this.filename = TranscriptionFilenameMother.create(filenameValue)
    return this
  }

  withDuration (duration: TranscriptionDuration): TranscriptionBuilder {
    this.duration = duration
    return this
  }

  withDurationValue (durationValue: string): TranscriptionBuilder {
    this.duration = TranscriptionDurationMother.create(durationValue)
    return this
  }

  withFileSize (fileSize: TranscriptionFileSize): TranscriptionBuilder {
    this.fileSize = fileSize
    return this
  }

  withFileSizeValue (fileSizeValue: string): TranscriptionBuilder {
    this.fileSize = TranscriptionFileSizeMother.create(fileSizeValue)
    return this
  }

  withS3Key (s3Key: TranscriptionS3Key): TranscriptionBuilder {
    this.s3Key = s3Key
    return this
  }

  withS3KeyValue (s3KeyValue: string): TranscriptionBuilder {
    this.s3Key = TranscriptionS3KeyMother.create(s3KeyValue)
    return this
  }

  withStatus (status: TranscriptionStatus): TranscriptionBuilder {
    this.status = status
    return this
  }

  withStatusValue (statusValue: string): TranscriptionBuilder {
    this.status = new TranscriptionStatus(statusValue)
    return this
  }

  withPendingStatus (): TranscriptionBuilder {
    this.status = TranscriptionStatus.pending()
    return this
  }

  withProcessingStatus (): TranscriptionBuilder {
    this.status = TranscriptionStatus.processing()
    return this
  }

  withCompletedStatus (): TranscriptionBuilder {
    this.status = TranscriptionStatus.completed()
    return this
  }

  withFailedStatus (): TranscriptionBuilder {
    this.status = TranscriptionStatus.failed()
    return this
  }

  withTranscriptionText (transcriptionText: TranscriptionText): TranscriptionBuilder {
    this.transcriptionText = transcriptionText
    return this
  }

  withTranscriptionTextValue (transcriptionTextValue: string): TranscriptionBuilder {
    this.transcriptionText = TranscriptionTextMother.create(transcriptionTextValue)
    return this
  }

  withEmptyTranscriptionText (): TranscriptionBuilder {
    this.transcriptionText = TranscriptionTextMother.empty()
    return this
  }

  withLongTranscriptionText (): TranscriptionBuilder {
    this.transcriptionText = TranscriptionTextMother.long()
    return this
  }

  withUserId (userId: TrasncriptionUserId): TranscriptionBuilder {
    this.userId = userId
    return this
  }

  withUserIdValue (userIdValue: string): TranscriptionBuilder {
    this.userId = new TrasncriptionUserId(userIdValue)
    return this
  }

  withCreatedAt (createdAt: Date): TranscriptionBuilder {
    this.createdAt = createdAt
    return this
  }

  withCreatedAtValue (createdAtValue: string): TranscriptionBuilder {
    this.createdAt = new Date(createdAtValue)
    return this
  }

  build (): Transcription {
    return new Transcription(
      this.id,
      this.filename,
      this.duration,
      this.fileSize,
      this.s3Key,
      this.status,
      this.transcriptionText,
      this.userId,
      this.createdAt
    )
  }
}
