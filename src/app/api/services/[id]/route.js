import prisma from '@/lib/prisma'

// GET /api/services/[id]
export async function GET(request, { params }) {
  try {
    const service = await prisma.service.findUnique({
      where: { id: params.id },
      include: {
        staff: true,
        appointments: true,
      },
    })
    
    if (!service) {
      return Response.json({ error: 'Service not found' }, { status: 404 })
    }
    
    return Response.json(service)
  } catch (error) {
    return Response.json({ error: 'Failed to fetch service' }, { status: 500 })
  }
}

// PUT /api/services/[id]
export async function PUT(request, { params }) {
  try {
    const body = await request.json()
    const service = await prisma.service.update({
      where: { id: params.id },
      data: {
        name: body.name,
        description: body.description,
        duration: body.duration,
        price: body.price,
      },
    })
    return Response.json(service)
  } catch (error) {
    return Response.json({ error: 'Failed to update service' }, { status: 400 })
  }
}

// DELETE /api/services/[id]
export async function DELETE(request, { params }) {
  try {
    await prisma.service.delete({
      where: { id: params.id },
    })
    return new Response(null, { status: 204 })
  } catch (error) {
    return Response.json({ error: 'Failed to delete service' }, { status: 400 })
  }
} 