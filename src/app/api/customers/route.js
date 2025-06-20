import prisma from '@/lib/prisma'

// GET /api/customers
export async function GET() {
  try {
    const customers = await prisma.customer.findMany({
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

// POST /api/customers
export async function POST(request) {
  try {
    const body = await request.json()

    // Validate required fields
    if (!body.email) {
      return Response.json(
        { error: 'An email address is required' },
        { status: 400 }
      )
    }

    // Check if customer with this email already exists
    const existingCustomer = await prisma.customer.findUnique({
      where: { email: body.email },
    })

    if (existingCustomer) {
      return Response.json(existingCustomer, { status: 200 })
    }

    // Create new customer
    const customer = await prisma.customer.create({
      data: {
        name: body.name || null,
        email: body.email,
        phone: body.phone || null,
      },
    })

    return Response.json(customer, { status: 201 })
  } catch (error) {
    console.error('Error creating customer:', error)
    return Response.json(
      { error: error.message || 'Failed to create customer' },
      { status: 400 }
    )
  }
} 