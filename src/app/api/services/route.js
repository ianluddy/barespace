import prisma from '@/lib/prisma'

// GET /api/services
export async function GET() {
  try {
    const services = await prisma.service.findMany({
      include: {
        staff: true,
      },
    })
    return Response.json(services)
  } catch (error) {
    return Response.json({ error: 'Failed to fetch services' }, { status: 500 })
  }
}

// POST /api/services
export async function POST(request) {
  try {
    const body = await request.json()
    const service = await prisma.service.create({
      data: {
        name: body.name,
        description: body.description,
        duration: body.duration,
        price: body.price,
      },
    })
    return Response.json(service, { status: 201 })
  } catch (error) {
    return Response.json({ error: 'Failed to create service' }, { status: 400 })
  }
} 