export abstract class DomainEvent {
  readonly eventName: string
  readonly aggregateId: string
  readonly eventId: string
  readonly occurredOn: Date

  constructor (
    eventName: string,
    aggregateId: string,
    eventId?: string,
    occurredOn?: Date
  ) {
    this.eventName = eventName
    this.aggregateId = aggregateId
    this.eventId = eventId ?? this.generateId()
    this.occurredOn = occurredOn ?? new Date()
  }

  abstract toPrimitives (): any

  private generateId (): string {
    return `${Date.now()}-${Math.random().toString(36).substring(7)}`
  }
}
