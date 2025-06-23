import Busboy from 'busboy'
import { injectable } from 'tsyringe'
import { FileParserService } from '../../domain/FileParserService'
import { APIGatewayProxyEvent } from 'aws-lambda'

@injectable()
export class BusboyMultipartParser implements FileParserService {
  async parseMultipart (body: string, contentType: string): Promise<{
    filename: string
    fileContent: Buffer
    mimeType: string
  }> {
    return await new Promise((resolve, reject) => {
      if (contentType === '' || !contentType?.includes('multipart/form-data')) {
        reject(new Error('Invalid content type. Expected multipart/form-data'))
        return
      }

      const busboy = Busboy({ headers: { 'content-type': contentType } })
      let fileData: { filename: string, fileContent: Buffer, mimeType: string } | null = null

      busboy.on('file', (fieldname: string, file: any, info: any) => {
        const { filename, mimeType } = info
        const chunks: Buffer[] = []

        file.on('data', (chunk: Buffer) => {
          chunks.push(chunk)
        })

        file.on('end', () => {
          fileData = {
            filename: filename !== null && filename !== undefined ? filename : 'unknown',
            fileContent: Buffer.concat(chunks),
            mimeType: mimeType !== null && mimeType !== undefined ? mimeType : 'application/octet-stream'
          }
        })
      })

      busboy.on('finish', () => {
        if (fileData !== null) {
          resolve(fileData)
        } else {
          reject(new Error('No file found in request'))
        }
      })

      busboy.on('error', (error: Error) => {
        reject(error)
      })

      // Parse the body - handle base64 if needed
      const bodyBuffer = body.includes('base64')
        ? Buffer.from(body.split(',')[1] !== '' ? body.split(',')[1] : body, 'base64')
        : Buffer.from(body, 'utf8')

      busboy.write(bodyBuffer)
      busboy.end()
    })
  }

  // Helper method for Lambda events
  async parseFromEvent (event: APIGatewayProxyEvent): Promise<{
    filename: string
    fileContent: Buffer
    mimeType: string
  }> {
    const contentType = event.headers['content-type'] ?? event.headers['Content-Type'] ?? ''
    const body = event.isBase64Encoded
      ? Buffer.from(event.body ?? '', 'base64').toString()
      : event.body ?? ''

    return await this.parseMultipart(body, contentType)
  }
}
