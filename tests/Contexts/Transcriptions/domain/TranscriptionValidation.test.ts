import { describe, it, expect } from '@jest/globals'
import { TranscriptionStatus } from '../../../../src/context/Transcription/domain/TranscriptionStatus'
import { TranscriptionText } from '../../../../src/context/Transcription/domain/TranscriptionText'
import { TranscriptionFilename } from '../../../../src/context/Transcription/domain/TranscriptionFilename'
import { TranscriptionDuration } from '../../../../src/context/Transcription/domain/TranscriptionDuration'
import { TranscriptionFileSize } from '../../../../src/context/Transcription/domain/TranscriptionFileSize'
import { TranscriptionS3Key } from '../../../../src/context/Transcription/domain/TranscriptionS3Key'
import { TrasncriptionUserId } from '../../../../src/context/Transcription/domain/TrasncriptionUserId'
import { InvalidArgumentError } from '../../../../src/context/Shared/domain/value-object/InvalidArgumentError'
import { TranscriptionBuilder } from './TestHelpers'

describe('Transcription - Domain Validation and Business Rules', () => {
  it('should validate transcription filename extensions', () => {
    // Arrange & Act & Assert - Valid extensions
    expect(() => new TranscriptionFilename('test.mp3')).not.toThrow()
    expect(() => new TranscriptionFilename('test.wav')).not.toThrow()
    expect(() => new TranscriptionFilename('test.m4a')).not.toThrow()
    expect(() => new TranscriptionFilename('test.mp4')).not.toThrow()

    // Arrange & Act & Assert - Invalid extensions
    expect(() => new TranscriptionFilename('test.txt')).toThrow(InvalidArgumentError)
    expect(() => new TranscriptionFilename('test.pdf')).toThrow(InvalidArgumentError)
    expect(() => new TranscriptionFilename('test')).toThrow(InvalidArgumentError)
    expect(() => new TranscriptionFilename('')).toThrow(InvalidArgumentError)
  })

  it('should validate transcription duration format', () => {
    // Arrange & Act & Assert - Valid durations
    expect(() => new TranscriptionDuration('01:30')).not.toThrow()
    expect(() => new TranscriptionDuration('00:05')).not.toThrow()
    expect(() => new TranscriptionDuration('59:59')).not.toThrow()
    expect(() => new TranscriptionDuration('1:23:45')).not.toThrow()

    // Arrange & Act & Assert - Invalid durations
    expect(() => new TranscriptionDuration('1:60')).toThrow(InvalidArgumentError)
    expect(() => new TranscriptionDuration('60:30')).toThrow(InvalidArgumentError)
    expect(() => new TranscriptionDuration('invalid')).toThrow(InvalidArgumentError)
    expect(() => new TranscriptionDuration('1:2:3:4')).toThrow(InvalidArgumentError)
    expect(() => new TranscriptionDuration('')).toThrow(InvalidArgumentError)
  })

  it('should validate transcription file size format and constraints', () => {
    // Arrange & Act & Assert - Valid file sizes
    expect(() => new TranscriptionFileSize('1.5 MB')).not.toThrow()
    expect(() => new TranscriptionFileSize('500 KB')).not.toThrow()
    // expect(() => new TranscriptionFileSize('0.5 GB')).not.toThrow()
    expect(() => new TranscriptionFileSize('19.9 MB')).not.toThrow()

    // Arrange & Act & Assert - Invalid file sizes
    expect(() => new TranscriptionFileSize('25 MB')).toThrow(InvalidArgumentError) // Exceeds 20MB limit
    expect(() => new TranscriptionFileSize('1 GB')).toThrow(InvalidArgumentError) // Exceeds 20MB limit
    expect(() => new TranscriptionFileSize('invalid')).toThrow(InvalidArgumentError)
    expect(() => new TranscriptionFileSize('1.5')).toThrow(InvalidArgumentError)
    expect(() => new TranscriptionFileSize('')).toThrow(InvalidArgumentError)
  })

  it('should validate transcription S3 key format', () => {
    // Arrange & Act & Assert - Valid S3 keys
    expect(() => new TranscriptionS3Key('uploads/user/file.mp3')).not.toThrow()
    expect(() => new TranscriptionS3Key('audio/test.wav')).not.toThrow()
    expect(() => new TranscriptionS3Key('user-123/recording.m4a')).not.toThrow()

    // Arrange & Act & Assert - Invalid S3 keys
    expect(() => new TranscriptionS3Key('')).toThrow(InvalidArgumentError)
    expect(() => new TranscriptionS3Key('/invalid/path')).toThrow(InvalidArgumentError)
    expect(() => new TranscriptionS3Key('invalid//path')).toThrow(InvalidArgumentError)

    // Test S3 key methods
    const s3Key = new TranscriptionS3Key('uploads/user/test-file.mp3')
    expect(s3Key.getFileExtension()).toBe('.mp3')
    expect(s3Key.getFileName()).toBe('test-file.mp3')
  })

  it('should validate transcription text constraints and business rules', () => {
    // Arrange - Valid transcription text
    const validText = 'This is a valid transcription text'
    const emptyText = ''
    const longText = 'A'.repeat(49000) // Under 50,000 limit
    const tooLongText = 'B'.repeat(50001) // Over 50,000 limit

    // Act & Assert - Valid cases
    expect(() => new TranscriptionText(validText)).not.toThrow()
    expect(() => new TranscriptionText(emptyText)).not.toThrow()
    expect(() => new TranscriptionText(longText)).not.toThrow()

    // Act & Assert - Invalid cases
    expect(() => new TranscriptionText(tooLongText)).toThrow(InvalidArgumentError)

    // Test transcription text methods
    const textWithWords = new TranscriptionText('Hello world this is a test')
    expect(textWithWords.getWordCount()).toBe(6)

    const emptyTextObj = new TranscriptionText('')
    expect(emptyTextObj.getWordCount()).toBe(0)

    const longTextObj = new TranscriptionText('This is a very long text for preview testing')
    expect(longTextObj.getPreview(20)).toBe('This is a very long ...')
  })

  it('should validate transcription status transitions and business rules', () => {
    // Arrange - Test all valid statuses
    expect(() => TranscriptionStatus.pending()).not.toThrow()
    expect(() => TranscriptionStatus.processing()).not.toThrow()
    expect(() => TranscriptionStatus.completed()).not.toThrow()
    expect(() => TranscriptionStatus.failed()).not.toThrow()

    // Act & Assert - Invalid status
    expect(() => new TranscriptionStatus('invalid')).toThrow(InvalidArgumentError)
    expect(() => new TranscriptionStatus('')).toThrow(InvalidArgumentError)

    // Test status values
    expect(TranscriptionStatus.pending().value).toBe('pending')
    expect(TranscriptionStatus.processing().value).toBe('processing')
    expect(TranscriptionStatus.completed().value).toBe('completed')
    expect(TranscriptionStatus.failed().value).toBe('failed')

    // Test transcription with different statuses maintains business invariants
    const transcriptionBuilder = TranscriptionBuilder.create()

    const pendingTranscription = transcriptionBuilder.withPendingStatus().build()
    expect(pendingTranscription.status.value).toBe('pending')

    const processingTranscription = transcriptionBuilder.withProcessingStatus().build()
    expect(processingTranscription.status.value).toBe('processing')

    const completedTranscription = transcriptionBuilder.withCompletedStatus().build()
    expect(completedTranscription.status.value).toBe('completed')

    const failedTranscription = transcriptionBuilder.withFailedStatus().build()
    expect(failedTranscription.status.value).toBe('failed')
  })

  it('should validate transcription user ID constraints', () => {
    // Arrange & Act & Assert - Valid user IDs
    expect(() => new TrasncriptionUserId('user-123')).not.toThrow()
    expect(() => new TrasncriptionUserId('12345')).not.toThrow()
    expect(() => new TrasncriptionUserId('uuid-format-user-id')).not.toThrow()

    // Arrange & Act & Assert - Invalid user IDs
    expect(() => new TrasncriptionUserId('')).toThrow()

    // Test transcription with different user IDs
    const transcriptionWithUser1 = TranscriptionBuilder
      .create()
      .withUserIdValue('user-123')
      .build()

    const transcriptionWithUser2 = TranscriptionBuilder
      .create()
      .withUserIdValue('user-456')
      .build()

    expect(transcriptionWithUser1.trasncriptionUserId.value).toBe('user-123')
    expect(transcriptionWithUser2.trasncriptionUserId.value).toBe('user-456')
    expect(transcriptionWithUser1.trasncriptionUserId.value).not.toBe(transcriptionWithUser2.trasncriptionUserId.value)
  })

  it('should ensure transcription aggregate root maintains business invariants', () => {
    // Arrange - Create transcription with complete business data
    const transcription = TranscriptionBuilder
      .create()
      .withFilenameValue('business-rules.mp3')
      .withDurationValue('03:45')
      .withFileSizeValue('8.2 MB')
      .withS3KeyValue('uploads/business-user/business-rules.mp3')
      .withCompletedStatus()
      .withTranscriptionTextValue('This transcription follows all business rules and constraints')
      .withUserIdValue('business-user-789')
      .build()

    // Act - Serialize to test data integrity
    const primitives = transcription.toPrimitives()

    // Assert - Verify all business invariants are maintained
    expect(transcription.filename.value.endsWith('.mp3')).toBe(true)
    expect(transcription.duration.toSeconds()).toBeGreaterThan(0)
    expect(transcription.duration.toSeconds()).toBe(225) // 3:45 = 225 seconds
    expect(transcription.s3Key.getFileExtension()).toBe('.mp3')
    expect(transcription.s3Key.getFileName()).toBe('business-rules.mp3')
    expect(transcription.transcriptionText.getWordCount()).toBeGreaterThan(5)
    expect(transcription.status.value).toBe('completed')
    expect(transcription.trasncriptionUserId.value).toBe('business-user-789')
    expect(transcription.createdAt).toBeInstanceOf(Date)

    // Verify serialization maintains data integrity
    expect(primitives.filename).toBe(transcription.filename.value)
    expect(primitives.duration).toBe(transcription.duration.value)
    expect(primitives.fileSize).toBe(transcription.fileSize.value)
    expect(primitives.s3Key).toBe(transcription.s3Key.value)
    expect(primitives.status).toBe(transcription.status.value)
    expect(primitives.transcriptionText).toBe(transcription.transcriptionText.value)
  })
})
