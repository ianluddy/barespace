import prisma from '@/lib/prisma'
import { generateReference } from '@/lib/utils'
import { revalidatePath } from 'next/cache'
import { sendAppointmentConfirmationEmail } from '@/lib/email'

// GET /api/appointments
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const date = searchParams.get('date')
    const staffId = searchParams.get('staffId')
    const customerEmail = searchParams.get('email')
    const id = searchParams.get('id')
    
    let where = {}
    if (date) {
      const startDate = new Date(date)
      const endDate = new Date(startDate)
      endDate.setDate(endDate.getDate() + 1)
      where.date = {
        gte: startDate,
        lt: endDate,
      }
    }
    if (staffId) {
      where.staffId = staffId
    }
    if (customerEmail) {
      where.customer = {
        email: customerEmail
      }
    }
    if (id) {
      where.id = id
    }

    const appointments = await prisma.appointment.findMany({
      where,
      include: {
        service: true,
        staff: true,
        customer: true,
      },
      orderBy: {
        date: 'asc',
      },
    })

    if (id && appointments.length > 0) {
      return Response.json(appointments[0], {
        headers: {
          'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=30',
        },
      })
    }
    
    return Response.json(appointments, {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=30',
      },
    })
  } catch (error) {
    console.error('Error fetching appointments:', error);
    return Response.json({ error: 'Failed to fetch appointments' }, { status: 500 })
  }
}

// POST /api/appointments
export async function POST(request) {
  try {
    const body = await request.json()
    
    // Validate time slot availability
    const existingAppointment = await prisma.appointment.findFirst({
      where: {
        staffId: body.staffId,
        date: body.date,
        OR: [
          {
            AND: [
              { startTime: { lte: new Date(body.startTime) } },
              { endTime: { gt: new Date(body.startTime) } },
            ],
          },
          {
            AND: [
              { startTime: { lt: new Date(body.endTime) } },
              { endTime: { gte: new Date(body.endTime) } },
            ],
          },
        ],
      },
    })

    if (existingAppointment) {
      return Response.json(
        { error: 'Time slot is not available' },
        { status: 400 }
      )
    }

    const appointment = await prisma.appointment.create({
      data: {
        id: generateReference(),
        date: body.date,
        startTime: body.startTime,
        endTime: body.endTime,
        serviceId: body.serviceId,
        staffId: body.staffId,
        salonId: body.salonId,
        customerId: body.customerId,
        notes: body.notes,
      },
      include: {
        service: true,
        staff: true,
        customer: true,
        salon: true,
      },
    })
    
    // Send confirmation email
    try {
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
    } catch (emailError) {
      console.error('Failed to send confirmation email:', emailError)
      // Don't fail the request if email sending fails
    }
    
    // Revalidate appointments and staff API routes since staff availability changed
    revalidatePath('/api/appointments')
    revalidatePath('/api/staff')
    
    return Response.json(appointment, { status: 201 })
  } catch (error) {
    console.error('Error creating appointment:', error);
    return Response.json({ error: 'Failed to create appointment' }, { status: 400 })
  }
} 