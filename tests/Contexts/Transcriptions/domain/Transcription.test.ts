import { describe, expect, test } from '@jest/globals'
import { TranscriptionMother } from './__mothers__/TranscriptionMother'
import { TranscriptionFilenameMother } from './__mothers__/TranscriptionFilenameMother'
import { TranscriptionDurationMother } from './__mothers__/TranscriptionDurationMother'
import { TranscriptionFileSizeMother } from './__mothers__/TranscriptionFileSizeMother'
import { TranscriptionS3KeyMother } from './__mothers__/TranscriptionS3KeyMother'
import { TranscriptionTextMother } from './__mothers__/TranscriptionTextMother'
import { Transcription } from '@/context/Transcription/domain/Transcription'
import { TrasncriptionUserId } from '@/context/Transcription/domain/TrasncriptionUserId'

describe('Transcription Domain', () => {
  test('should create a new transcription with pending status', () => {
    const filename = TranscriptionFilenameMother.valid()
    const duration = TranscriptionDurationMother.valid()
    const fileSize = TranscriptionFileSizeMother.valid()
    const userId = new TrasncriptionUserId('test-user-123')
    const s3Key = TranscriptionS3KeyMother.valid()

    const transcription = Transcription.create(filename, duration, fileSize, userId, s3Key)

    expect(transcription.filename.value).toBe(filename.value)
    expect(transcription.duration.value).toBe(duration.value)
    expect(transcription.fileSize.value).toBe(fileSize.value)
    expect(transcription.s3Key.value).toBe(s3Key.value)
    expect(transcription.status.value).toBe('pending')
    expect(transcription.transcriptionText.value).toBe('')
    expect(transcription.trasncriptionUserId.value).toBe('test-user-123')
    expect(transcription.id).toBeDefined()
    expect(transcription.createdAt).toBeInstanceOf(Date)
  })

  test('should create transcription with custom transcription text', () => {
    const transcriptionText = TranscriptionTextMother.valid()

    const transcriptionWithText = TranscriptionMother.create(
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      transcriptionText
    )

    expect(transcriptionWithText.transcriptionText.value).toBe(transcriptionText.value)
  })

  test('should convert transcription to primitives correctly', () => {
    const transcription = TranscriptionMother.valid()

    const primitives = transcription.toPrimitives()

    expect(primitives).toEqual({
      id: transcription.id.value,
      filename: transcription.filename.value,
      duration: transcription.duration.value,
      fileSize: transcription.fileSize.value,
      s3Key: transcription.s3Key.value,
      status: transcription.status.value,
      transcriptionText: transcription.transcriptionText.value,
      createdAt: transcription.createdAt.toISOString()
    })
    expect(typeof primitives.id).toBe('string')
    expect(typeof primitives.filename).toBe('string')
    expect(typeof primitives.createdAt).toBe('string')
  })
})
