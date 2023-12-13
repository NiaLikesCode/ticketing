import request from "supertest";
import { app } from "../../app";
import mongoose from "mongoose";
import { Order } from "../../models/order";
import { OrderStatus } from "@blackanimegirl/txcommon";
import { stripe } from "../../stripe";
import { Payment } from "../../models/payment";

//jest.mock('../../stripe');

it('returns a 404 when purchasing an order that doesn not exist', async () => {
    await request(app)
        .post('/api/payments')
        .set('Cookie', global.signin())
        .send({
            orderId: new mongoose.Types.ObjectId().toHexString(),
        })
        .expect(404);
});
it('returns a 401 when purchasing an order that doesn\'t belong to the user', async () => {
    const order = Order.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        userId: new mongoose.Types.ObjectId().toHexString(),
        version: 0,
        price: 20,
        status: OrderStatus.Created
    });
    await order.save();

    await request(app)
        .post('/api/payments')
        .set('Cookie', global.signin())
        .send({
            orderId: order.id
        })
        .expect(401);
});
it('returns a 400 when purchasing a cancelled order', async () => {
    const userId = new mongoose.Types.ObjectId().toHexString();
    const order = Order.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        userId,
        version: 0,
        price: 20,
        status: OrderStatus.Cancelled
    });
    await order.save();

    await request(app)
        .post('/api/payments')
        .set('Cookie', global.signin(userId))
        .send({
            orderId: order.id
        })
        .expect(400);
});

it('return a 204 and client_secret with valid inputs', async () => {
    const userId = new mongoose.Types.ObjectId().toHexString();
    const price = Math.floor(Math.random() * 1000000);
    const order = Order.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        userId,
        version: 0,
        price,
        status: OrderStatus.Created
    });
    await order.save();

    const paymentIntentResponse = await request(app)
        .post('/api/payments')
        .set('Cookie', global.signin(userId))
        .send({
            orderId: order.id
        })
        .expect(201);
    
    // mock test
    // const paymentIntentOptions = (stripe.paymentIntents.create as jest.Mock).mock.calls[0][0];
    // expect(paymentIntentOptions.amount).toEqual(price * 100);
    // expect(paymentIntentOptions.currency).toEqual('usd');
    // expect(paymentIntentOptions.confirm).toBeTruthy();
    // console.log(paymentIntentResponse.body);
    // expect(paymentIntentResponse.body.clientSecret).toEqual('asdflkjs');

    //integration test
    const paymentIntents = await stripe.paymentIntents.list({ limit: 50 });
    const paymentIntent = paymentIntents.data.find(amount => {
        return amount.amount === price * 100
    });

    expect(paymentIntent).toBeDefined();

    const payment = await Payment.findOne({
        orderId: order.id,
        stripeId: paymentIntent!.id
    });

    expect(payment).not.toBeNull();

});
