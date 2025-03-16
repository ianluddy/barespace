import prisma from '@/lib/prisma'
import { sendAppointmentCancellationEmail } from '@/lib/email'

// GET /api/appointments/[id]
export async function GET(request, { params }) {
  try {
    const id = params.id
    
    const appointment = await prisma.appointment.findUnique({
      where: { id: id.toUpperCase() },
      include: {
        service: true,
        staff: true,
        customer: true,
      },
    })
    
    if (!appointment) {
      return Response.json({ error: 'Appointment not found' }, { status: 404 })
    }
    
    return Response.json(appointment)
  } catch (error) {
    console.error('Error fetching appointment:', error)
    return Response.json({ error: 'Failed to fetch appointment' }, { status: 500 })
  }
}

// PUT /api/appointments/[id]
export async function PUT(request, { params }) {
  try {
    const id = params.id.toUpperCase()
    const body = await request.json()
    
    const appointment = await prisma.appointment.update({
      where: { id },
      data: {
        status: body.status,
        notes: body.notes,
      },
      include: {
        service: true,
        staff: true,
        customer: true,
      },
    })
    return Response.json(appointment)
  } catch (error) {
    console.error('Error updating appointment:', error)
    return Response.json({ error: 'Failed to update appointment' }, { status: 400 })
  }
}

// DELETE /api/appointments/[id]
export async function DELETE(request, { params }) {
  try {
    const id = params.id
    
    const appointment = await prisma.appointment.delete({
      where: { id },
      include: {
        service: true,
        staff: true,
        customer: true,
        salon: true,
      },
    })

    // Send cancellation email
    try {
      sendAppointmentCancellationEmail({
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
      console.error('Failed to send cancellation email:', emailError)
      // Don't fail the request if email sending fails
    }

    return Response.json({ message: 'Appointment deleted successfully' })
  } catch (error) {
    console.error('Error deleting appointment:', error)
    return Response.json({ error: 'Failed to delete appointment' }, { status: 400 })
  }
} 