import { LambdaHandler } from '../createHandler'

export type Middleware = (handler: LambdaHandler) => LambdaHandler

export const compose = (...middlewares: Middleware[]) => {
  return (handler: LambdaHandler): LambdaHandler => {
    const composed = middlewares.reduceRight((acc, middleware) => middleware(acc), handler)
    return async (...args: Parameters<LambdaHandler>) => {
      try {
        return await composed(...args)
      } catch (error) {
        console.error('Unhandled error in composed middleware:', error)
        return {
          statusCode: 500,
          body: JSON.stringify({ message: 'Internal Server Error', error: error instanceof Error ? error.message : String(error) })
        }
      }
    }
  }
}
