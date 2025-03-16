import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

// GET /api/services
export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const salonId = searchParams.get('salonId')

  const where = {}
  if (salonId) {
    where.staff = {
      some: {
        salonId: salonId
      }
    }
  }
  try {
    const services = await prisma.service.findMany({
      where,
      include: {
        staff: true,
      },
    })
    return Response.json(services, {
      headers: {
        'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=43200',
      },
    })
  } catch (error) {
    console.error(error);
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
    
    // Revalidate the services API route
    revalidatePath('/api/services')
    
    return Response.json(service, { status: 201 })
  } catch (error) {
    console.error(error);
    return Response.json({ error: 'Failed to create service' }, { status: 400 })
  }
} 