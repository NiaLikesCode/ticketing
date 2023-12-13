import nats from 'node-nats-streaming';
import { randomBytes } from 'crypto';
import { TicketCreatedListener } from './events/ticket-created-listener';

console.clear();

const stan = nats.connect('ticketing', randomBytes(4).toString('hex'), {
    url: 'http://localhost:4222'
});

stan.on('connect', () => {
    console.log('Listener connected to NATS');

    stan.on('close', () => {
        console.log('NATS connection closed');
        process.exit();
    });

    new TicketCreatedListener(stan).listen();
});

// none of these dumb options work
process.on('SIGINT', () => stan.close());
process.on('SIGTERM', () => stan.close());
process.on('CTRL_BREAK_EVENT', () => stan.close());
process.on('SIGBREAK', () => stan.close());
process.on('WM_QUIT', () => stan.close());
process.on('WM_ENDSESSION', () => stan.close());
process.on('SIGABRT', () => stan.close());