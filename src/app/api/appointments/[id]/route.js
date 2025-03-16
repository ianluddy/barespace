import prisma from '@/lib/prisma'

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
    
    await prisma.appointment.delete({
      where: { id },
    })
    return Response.json({ message: 'Appointment deleted successfully' })
  } catch (error) {
    console.error('Error deleting appointment:', error)
    return Response.json({ error: 'Failed to delete appointment' }, { status: 400 })
  }
} 