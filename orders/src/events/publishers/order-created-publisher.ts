import { Publisher, OrderCreatedEvent, Subjects } from '@blackanimegirl/txcommon';

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
    readonly subject = Subjects.OrderCreated;
}