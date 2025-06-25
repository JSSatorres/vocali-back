import 'reflect-metadata'
import { container, DependencyContainer } from 'tsyringe'

// -----------------------------
// Transcription dependencies
// -----------------------------
import { TranscriptionRepository } from '../../../Transcription/domain/TranscriptionRepository'
import { DynamoDBTranscriptionRepository } from '../../../Transcription/infrastructure/persistence/DynamoDBTranscriptionRepository'
// import { TranscriptionProcessorService } from '../../../Transcription/domain/TranscriptionProcessorService'
// import { TranscriptionProcessor } from '../../../Transcription/application/TranscriptionProcessor'
// import { SpeechmaticsService } from '../../../Transcription/infrastructure/SpeechmaticsService/SpeechmaticsApiService'

// -----------------------------
// Shared services
// -----------------------------
import { FileUploadService } from '../../domain/FileUploadService'
import { S3FileUploadService } from '../FileUpload/S3FileUploadService'
import { AudioMetadataService } from '../../domain/AudioMetadataService'
import { BasicAudioMetadataService } from '../AudioMetadata/BasicAudioMetadataService'
import { FileParserService } from '../../domain/FileParserService'
import { LambdaMultipartParser } from '../FileParser/LambdaMultipartParser'

// -----------------------------
// Event bus and handlers
// -----------------------------
import { EventBus } from '../../../Shared/domain/EventBus'
import { InMemoryEventBus } from '../../../Shared/infrastructure/EventBus/InMemoryEventBus'
import { TranscriptionProcessorService } from '@/context/Transcription/domain/TranscriptionProcessorService'
import { SpeechmaticsService } from '@/context/Transcription/infrastructure/SpeechmaticsService/SpeechmaticsApiService'
// import { TranscriptionCreatedEventHandler } from '../../../Transcription/application/EventHandlers/TranscriptionCreatedEventHandler'
// import { TranscriptionCreatedDomainEvent } from '../../../Transcription/domain/events/TranscriptionCreatedDomainEvent'

container.register<TranscriptionRepository>('TranscriptionRepository', {
  useClass: DynamoDBTranscriptionRepository
})

container.register<TranscriptionProcessorService>(
  'TranscriptionProcessorService',
  { useClass: SpeechmaticsService }
)

// container.register<TranscriptionProcessorService>('TranscriptionProcessorService', {
//   useClass: SpeechmaticsService
// })

// container.register<TranscriptionProcessor>('TranscriptionProcessor', {
//   useClass: TranscriptionProcessor
// })

container.register<FileUploadService>('FileUploadService', {
  useClass: S3FileUploadService
})

container.register<AudioMetadataService>('AudioMetadataService', {
  useClass: BasicAudioMetadataService
})

container.register<FileParserService>('FileParserService', {
  useClass: LambdaMultipartParser
})

container.register<EventBus>('EventBus', {
  useClass: InMemoryEventBus
})

// Subscribe event handlers
// const eventBus = container.resolve<EventBus>('EventBus')
// const eventHandler = container.resolve(TranscriptionCreatedEventHandler)

// eventBus.subscribe(TranscriptionCreatedDomainEvent.EVENT_NAME, eventHandler)

console.log('All dependencies configured successfully')

// Optional: getter if needed elsewhere
export const getDIContainer = (): DependencyContainer => {
  return container
}
