import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

  // GET /api/staff/[id]
export async function GET(request, { params }) {
  const { id } = params
  try {
    const staff = await prisma.staff.findUnique({
      where: { id },
      include: {
        services: true,
        appointments: true,
      },
    })
    if (!staff) {
      return Response.json({ error: 'Staff member not found' }, { status: 404 })
    }
    return Response.json(staff)
  } catch (error) {
    console.error(error)
    return Response.json({ error: 'Failed to fetch staff member' }, { status: 500 })
  }
}