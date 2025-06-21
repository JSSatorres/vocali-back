import { DomainEvent } from '../../Shared/domain/DomainEvent'

export class UserCreatedDomainEvent extends DomainEvent {
  static readonly EVENT_NAME = 'user.created'

  constructor (params: {
    aggregateId: string
    name: string
    email: string
    eventId?: string
    occurredOn?: Date
  }) {
    super({
      eventName: UserCreatedDomainEvent.EVENT_NAME,
      aggregateId: params.aggregateId,
      eventId: params.eventId,
      occurredOn: params.occurredOn
    })
    this.name = params.name
    this.email = params.email
  }

  readonly name: string
  readonly email: string

  toPrimitives (): any {
    return {
      aggregateId: this.aggregateId,
      name: this.name,
      email: this.email,
      eventId: this.eventId,
      occurredOn: this.occurredOn.toISOString()
    }
  }

  static fromPrimitives (params: any): UserCreatedDomainEvent {
    return new UserCreatedDomainEvent({
      aggregateId: params.aggregateId,
      name: params.name,
      email: params.email,
      eventId: params.eventId,
      occurredOn: new Date(params.occurredOn)
    })
  }
}
