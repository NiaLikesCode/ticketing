import { PaymentCreatedEvent, Publisher, Subjects } from "@blackanimegirl/txcommon";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
    readonly subject = Subjects.PaymentCreated;
}