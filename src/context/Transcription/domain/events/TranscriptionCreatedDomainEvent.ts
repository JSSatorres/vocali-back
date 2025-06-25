import { DomainEvent } from '../../../Shared/domain/DomainEvent'
import { TranscriptionId } from '../TranscriptionId'
import { TranscriptionS3Key } from '../TranscriptionS3Key'
import { TranscriptionFilename } from '../TranscriptionFilename'

export class TranscriptionCreatedDomainEvent extends DomainEvent {
  static readonly EVENT_NAME = 'transcription.created'

  readonly transcriptionId: string
  readonly s3Key: string
  readonly filename: string

  constructor (
    transcriptionId: TranscriptionId,
    s3Key: TranscriptionS3Key,
    filename: TranscriptionFilename,
    eventId?: string,
    occurredOn?: Date
  ) {
    super(TranscriptionCreatedDomainEvent.EVENT_NAME, transcriptionId.value, eventId, occurredOn)
    this.transcriptionId = transcriptionId.value
    this.s3Key = s3Key.value
    this.filename = filename.value
  }

  toPrimitives (): any {
    return {
      transcriptionId: this.transcriptionId,
      s3Key: this.s3Key,
      filename: this.filename
    }
  }

  static fromPrimitives (params: {
    aggregateId: string
    eventId: string
    occurredOn: Date
    attributes: any
  }): TranscriptionCreatedDomainEvent {
    return new TranscriptionCreatedDomainEvent(
      new TranscriptionId(params.attributes.transcriptionId),
      new TranscriptionS3Key(params.attributes.s3Key),
      new TranscriptionFilename(params.attributes.filename),
      params.eventId,
      params.occurredOn
    )
  }
}
