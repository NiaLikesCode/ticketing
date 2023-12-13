import { Publisher, OrderCancelledEvent, Subjects } from '@blackanimegirl/txcommon';

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
    readonly subject = Subjects.OrderCancelled;
}