import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { LambdaHandler } from '../createHandler'

interface CorsOptions {
  origin?: string
  methods?: string[]
  headers?: string[]
  credentials?: boolean
}

export const withCorsHeaders = (options: CorsOptions = {}): ((handler: LambdaHandler) => LambdaHandler) => {
  const {
    origin = '*',
    methods = ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    headers = ['Content-Type', 'Authorization'],
    credentials = false
  } = options

  return (handler: LambdaHandler): LambdaHandler => {
    return async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
      const response = await handler(event)

      const corsHeaders: Record<string, string> = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': origin,
        'Access-Control-Allow-Methods': methods.join(', '),
        'Access-Control-Allow-Headers': headers.join(', ')
      }

      if (credentials) {
        corsHeaders['Access-Control-Allow-Credentials'] = 'true'
      }

      return {
        ...response,
        headers: {
          ...response.headers,
          ...corsHeaders
        }
      }
    }
  }
}
