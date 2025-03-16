import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { PrismaClient } from '@prisma/client'
import { sendAppointmentConfirmationEmail } from '@/lib/email'
import { generateReference } from '@/lib/utils'
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
const prisma = new PrismaClient()

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const sessionId = searchParams.get('session_id')

    if (!sessionId) {
      return NextResponse.json({ error: 'Session ID is required' }, { status: 400 })
    }

    // Retrieve the session from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['payment_intent']
    })

    if (session.payment_status !== 'paid') {
      return NextResponse.json(
        { error: 'Payment not completed' },
        { status: 400 }
      )
    }

    // Check if appointment already exists with this payment intent
    const existingAppointment = await prisma.appointment.findFirst({
      where: {
        paymentIntentId: session.payment_intent.id
      }
    })

    if (existingAppointment) {
      return NextResponse.json({ appointment: existingAppointment })
    }

    // Create the appointment with payment details
    const appointment = await prisma.appointment.create({
      data: {
        id: generateReference(),
        date: new Date(session.metadata.appointmentDate),
        startTime: session.metadata.appointmentStartTime,
        endTime: session.metadata.appointmentEndTime,
        customerId: session.metadata.customerId,
        serviceId: session.metadata.serviceId,
        staffId: session.metadata.staffId,
        salonId: session.metadata.salonId,
        status: 'confirmed',
        notes: session.metadata.notes || '',
        paymentStatus: 'paid',
        paymentAmount: session.amount_total / 100, // Convert from cents to dollars
        paymentIntentId: session.payment_intent.id
      },
      include: {
        customer: true,
        service: true,
        staff: true,
        salon: true
      }
    })

    // Send confirmation email
    await sendAppointmentConfirmationEmail({
      customerEmail: appointment.customer.email,
      customerName: appointment.customer.name,
      appointmentDate: appointment.date,
      startTime: appointment.startTime,
      serviceName: appointment.service.name,
      staffName: appointment.staff.name,
      salonName: appointment.salon.name,
      salonAddress: appointment.salon.address,
      reference: appointment.id
    })

    return NextResponse.json({ appointment })
  } catch (error) {
    console.error('Error verifying payment:', error)
    return NextResponse.json(
      { error: 'Failed to verify payment' },
      { status: 500 }
    )
  }
} 