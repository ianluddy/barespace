import prisma from '@/lib/prisma'

// GET /api/customers/[id]
export async function GET(request, { params }) {
  try {
    const customers = await prisma.customer.findMany({
      where: { id: params.id },
      include: {
        appointments: true,
      },
    })
    return Response.json(customers)
  } catch (error) {
    console.error(error);
    return Response.json({ error: 'Failed to fetch customers' }, { status: 500 })
  }
}
