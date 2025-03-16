import { NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export async function POST(request) {
  try {
    const body = await request.json()
    const { 
      appointmentDate,
      appointmentStartTime,
      appointmentEndTime,
      serviceId,
      serviceName,
      servicePrice,
      staffId,
      staffName,
      salonId,
      salonName,
      customerId,
      customerEmail,
    } = body

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: serviceName,
              description: `Appointment with ${staffName} at ${salonName}`,
              metadata: {
                appointmentDate,
                appointmentStartTime,
                appointmentEndTime,
                serviceId,
                customerId,
                staffId,
                salonId,
              },
            },
            unit_amount: Math.round(servicePrice * 100), // Convert to cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/booking/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/booking/cancel`,
      customer_email: customerEmail,
      metadata: {
        appointmentDate,
        appointmentStartTime,
        appointmentEndTime,
        serviceId,
        customerId,
        staffId,
        salonId,
      },
    })

    return NextResponse.json({ sessionId: session.id })
  } catch (error) {
    console.error('Stripe error:', error)
    return NextResponse.json(
      { error: 'Error creating checkout session' },
      { status: 500 }
    )
  }
} 