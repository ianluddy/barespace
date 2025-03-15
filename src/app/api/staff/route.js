import prisma from '@/lib/prisma'

// GET /api/staff
export async function GET() {
  try {
    const staff = await prisma.staff.findMany({
      include: {
        services: true,
        appointments: true,
      },
    })
    return Response.json(staff)
  } catch (error) {
    return Response.json({ error: 'Failed to fetch staff' }, { status: 500 })
  }
}

// POST /api/staff
export async function POST(request) {
  try {
    const body = await request.json()
    const staff = await prisma.staff.create({
      data: {
        name: body.name,
        email: body.email,
        phone: body.phone,
        services: {
          connect: body.serviceIds?.map(id => ({ id })) || [],
        },
      },
      include: {
        services: true,
      },
    })
    return Response.json(staff, { status: 201 })
  } catch (error) {
    return Response.json({ error: 'Failed to create staff member' }, { status: 400 })
  }
} 