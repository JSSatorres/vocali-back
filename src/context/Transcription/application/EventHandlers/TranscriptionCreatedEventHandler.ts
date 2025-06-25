import { injectable, inject } from 'tsyringe'
import { DomainEvent } from '../../../Shared/domain/DomainEvent'
import { TranscriptionCreatedDomainEvent } from '../../domain/events/TranscriptionCreatedDomainEvent'
import { TranscriptionProcessor } from '../TranscriptionProcessor'

@injectable()
export class TranscriptionCreatedEventHandler {
  constructor (
    @inject('TranscriptionProcessor') private readonly transcriptionProcessor: TranscriptionProcessor
  ) {}

  async handle (event: DomainEvent): Promise<void> {
    if (!(event instanceof TranscriptionCreatedDomainEvent)) {
      return
    }

    console.log('TranscriptionCreatedEventHandler: Handling transcription created event', {
      transcriptionId: event.transcriptionId,
      s3Key: event.s3Key,
      filename: event.filename
    })

    try {
      // Procesar la transcripción de forma asíncrona
      // En un entorno real, esto se haría con una cola (SQS, etc.)
      await this.transcriptionProcessor.run(
        event.transcriptionId,
        event.s3Key,
        event.filename
      )
    } catch (error) {
      console.error('TranscriptionCreatedEventHandler: Error handling event', error)
      // En un entorno real, aquí manejarías reintentos, DLQ, etc.
      throw error
    }
  }
}
