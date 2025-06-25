import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { injectable } from 'tsyringe'
import { FileUploadService } from '../../domain/FileUploadService'

@injectable()
export class S3FileUploadService implements FileUploadService {
  private readonly client: S3Client
  private readonly bucketName: string

  constructor () {
    this.client = new S3Client({ region: process.env.AWS_REGION ?? 'eu-west-1' })
    this.bucketName = process.env.S3_BUCKET_NAME ?? 'vocali-transcriptions'
  }

  async upload (filename: string, fileContent: Buffer): Promise<string> {
    const timestamp = Date.now()
    const s3Key = `${timestamp}-${filename}`

    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: s3Key,
      Body: fileContent,
      ContentType: this.getContentType(filename)
    })

    await this.client.send(command)
    return s3Key
  }

  private getContentType (filename: string): string {
    const ext = filename.toLowerCase().split('.').pop()
    switch (ext) {
      case 'mp3': return 'audio/mpeg'
      case 'wav': return 'audio/wav'
      case 'm4a': return 'audio/mp4'
      case 'mp4': return 'video/mp4'
      default: return 'application/octet-stream'
    }
  }
}
