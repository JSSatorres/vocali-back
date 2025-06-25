import { injectable, inject } from 'tsyringe'
import { TranscriptionRepository } from '../domain/TranscriptionRepository'
import { SpeechmaticsService } from '../domain/TranscriptionProcessorService'
import { TranscriptionText } from '../domain/TranscriptionText'
import { TranscriptionId } from '../domain/TranscriptionId'

@injectable()
export class TranscriptionProcessor {
  constructor (
    @inject('TranscriptionRepository') private readonly repository: TranscriptionRepository,
    @inject('SpeechmaticsService') private readonly speechmaticsService: SpeechmaticsService
  ) {}

  async run (transcriptionId: string, s3Key: string, filename: string): Promise<void> {
    try {
      console.log('TranscriptionProcessor: Starting processing', { transcriptionId, s3Key, filename })

      // 1. Obtener la transcripción
      const transcription = await this.repository.findById(new TranscriptionId(transcriptionId))
      if (transcription === null) {
        throw new Error(`Transcription with ID ${transcriptionId} not found`)
      }

      // 2. Marcar como procesando
      transcription.startProcessing()
      await this.repository.save(transcription)

      // 3. Procesar con Speechmatics
      const transcriptionResult = await this.speechmaticsService.transcribeAudio(s3Key, filename)

      // 4. Actualizar con el resultado
      transcription.completeTranscription(new TranscriptionText(transcriptionResult))
      await this.repository.save(transcription)

      console.log('TranscriptionProcessor: Processing completed successfully', { transcriptionId })
    } catch (error) {
      console.error('TranscriptionProcessor: Error processing transcription', error)

      // Marcar como fallido si es posible
      try {
        const transcription = await this.repository.findById(new TranscriptionId(transcriptionId))
        if (transcription !== null) {
          transcription.markAsFailed()
          await this.repository.save(transcription)
        }
      } catch (saveError) {
        console.error('TranscriptionProcessor: Error saving failed state', saveError)
      }

      throw error
    }
  }
}
