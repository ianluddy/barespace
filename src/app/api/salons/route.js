import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET() {
  try {
    const salons = await prisma.salon.findMany({
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

    return NextResponse.json(salons)
  } catch (error) {
    console.error('Error fetching salons:', error)
    return NextResponse.json(
      { error: 'Failed to fetch salons' },
      { status: 500 }
    )
  }
} 