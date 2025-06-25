
import { DomainEvent } from './DomainEvent'

export abstract class AggregateRoot {
  private domainEvents: DomainEvent[] = []

  abstract toPrimitives (): any

  pullDomainEvents (): DomainEvent[] {
    const events = this.domainEvents.slice()
    this.domainEvents = []
    console.log('AggregateRoot.pullDomainEvents', events)

    return events
  }

  protected record (event: DomainEvent): void {
    this.domainEvents.push(event)
  }
}
