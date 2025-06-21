import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'

export type LambdaHandler = (event: APIGatewayProxyEvent) => Promise<APIGatewayProxyResult>
export type Middleware = (handler: LambdaHandler) => LambdaHandler

export const compose = (...middlewares: Middleware[]) => {
  return (handler: LambdaHandler): LambdaHandler => {
    return middlewares.reduceRight((acc, middleware) => middleware(acc), handler)
  }
}
