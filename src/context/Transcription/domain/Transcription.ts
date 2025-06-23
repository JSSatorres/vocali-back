import { AggregateRoot } from '../../Shared/domain/AggregateRoot'
import { TranscriptionId } from './TranscriptionId'
import { TranscriptionFilename } from './TranscriptionFilename'
import { TranscriptionDuration } from './TranscriptionDuration'
import { TranscriptionFileSize } from './TranscriptionFileSize'
import { TranscriptionStatus } from './TranscriptionStatus'
import { TranscriptionText } from './TranscriptionText'
import { TranscriptionS3Key } from './TranscriptionS3Key'

export class Transcription extends AggregateRoot {
  readonly id: TranscriptionId
  readonly filename: TranscriptionFilename
  readonly duration: TranscriptionDuration
  readonly fileSize: TranscriptionFileSize
  readonly s3Key: TranscriptionS3Key
  readonly createdAt: Date
  private _status: TranscriptionStatus
  private _transcriptionText: TranscriptionText

  constructor (
    id: TranscriptionId,
    filename: TranscriptionFilename,
    duration: TranscriptionDuration,
    fileSize: TranscriptionFileSize,
    s3Key: TranscriptionS3Key,
    status: TranscriptionStatus,
    transcriptionText: TranscriptionText,
    createdAt: Date
  ) {
    super()
    this.id = id
    this.filename = filename
    this.duration = duration
    this.fileSize = fileSize
    this.s3Key = s3Key
    this._status = status
    this._transcriptionText = transcriptionText
    this.createdAt = createdAt
  }

  get status (): TranscriptionStatus {
    return this._status
  }

  get transcriptionText (): TranscriptionText {
    return this._transcriptionText
  }

  static create (
    filename: TranscriptionFilename,
    duration: TranscriptionDuration,
    fileSize: TranscriptionFileSize,
    s3Key: TranscriptionS3Key
  ): Transcription {
    const transcription = new Transcription(
      TranscriptionId.random(),
      filename,
      duration,
      fileSize,
      s3Key,
      TranscriptionStatus.pending(),
      new TranscriptionText(''),
      new Date()
    )

    return transcription
  }

  startProcessing (): void {
    this._status = TranscriptionStatus.processing()
  }

  completeTranscription (transcriptionText: TranscriptionText): void {
    this._status = TranscriptionStatus.completed()
    this._transcriptionText = transcriptionText
  }

  markAsFailed (): void {
    this._status = TranscriptionStatus.failed()
  }

  toPrimitives (): any {
    return {
      id: this.id.value,
      filename: this.filename.value,
      duration: this.duration.value,
      fileSize: this.fileSize.value,
      s3Key: this.s3Key.value,
      status: this._status.value,
      transcriptionText: this._transcriptionText.value,
      createdAt: this.createdAt.toISOString()
    }
  }

  static fromPrimitives (plainData: {
    id: string
    filename: string
    duration: string
    fileSize: string
    s3Key: string
    status: string
    transcriptionText: string
    createdAt: string
  }): Transcription {
    return new Transcription(
      new TranscriptionId(plainData.id),
      new TranscriptionFilename(plainData.filename),
      new TranscriptionDuration(plainData.duration),
      new TranscriptionFileSize(plainData.fileSize),
      new TranscriptionS3Key(plainData.s3Key),
      new TranscriptionStatus(plainData.status),
      new TranscriptionText(plainData.transcriptionText),
      new Date(plainData.createdAt)
    )
  }
}
