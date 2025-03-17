import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

// GET /api/salons/[id]
export async function GET(request, { params }) {
  try {
    const salons = await prisma.salon.findMany({
      where: { id: params.id },
      include: {
        staff: {
          select: {
            id: true,
            name: true,
            title: true,
          },
        },
      },
    })

    return NextResponse.json(salons, {
      headers: {
        'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=43200',
      },
    })
  } catch (error) {
    console.error('Error fetching salons:', error)
    return NextResponse.json(
      { error: 'Failed to fetch salons' },
      { status: 500 }
    )
  }
} 