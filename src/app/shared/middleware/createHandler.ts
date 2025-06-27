import 'reflect-metadata'
import { compose, Middleware } from './HandlerFactory/compose'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { withErrorHandling } from './HandlerFactory/withErrorHandling'
import { withDependencies } from './HandlerFactory/withDependencies'
import { withCorsHeaders } from './HandlerFactory/withCorsHeaders'
import { withAuth } from './HandlerFactory/withAuth'
// import { withBodyValidation } from './HandlerFactory/withBodyValidation'

interface HandlerOptions {
  methods?: string[]
  headers?: string[]
  extraMiddleware?: Middleware[]
}

export type LambdaHandler = (event: APIGatewayProxyEvent) => Promise<APIGatewayProxyResult>

export const createHandler = (
  core: LambdaHandler,
  options: HandlerOptions = {}
): LambdaHandler => {
  const {
    methods = ['GET', 'POST', 'OPTIONS'],
    headers = ['Content-Type', 'Authorization'],
    extraMiddleware = []
  } = options

  return compose(
    withCorsHeaders({ methods, headers }),
    withAuth,
    withDependencies,
    withErrorHandling,
    ...extraMiddleware
  )(core)
}
