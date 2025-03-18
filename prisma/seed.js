const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  // Delete existing data
  await prisma.appointment.deleteMany()
  await prisma.$executeRaw`DELETE FROM "_ServiceToStaff"`
  await prisma.staff.deleteMany()
  await prisma.service.deleteMany()
  await prisma.customer.deleteMany()
  await prisma.salon.deleteMany()

  // Create services
  const services = await Promise.all([
    prisma.service.create({
      data: {
        name: 'Classic Haircut',
        description: 'Traditional haircut with wash and style',
        duration: 30,
        price: 35.00,
      },
    }),
    prisma.service.create({
      data: {
        name: 'Premium Haircut',
        description: 'Premium haircut with wash, style, and treatment',
        duration: 45,
        price: 50.00,
      },
    }),
    prisma.service.create({
      data: {
        name: 'Beard Trim',
        description: 'Professional beard trimming and shaping',
        duration: 20,
        price: 25.00,
      },
    }),
    prisma.service.create({
      data: {
        name: 'Hair Color',
        description: 'Full hair coloring service',
        duration: 120,
        price: 85.00,
      },
    }),
    prisma.service.create({
      data: {
        name: 'Kids Haircut',
        description: 'Haircut for children under 12',
        duration: 20,
        price: 25.00,
      },
    }),
  ])

  // Create salons
  const salons = await Promise.all([
    prisma.salon.create({
      data: {
        name: 'Downtown Salon',
        address: '123 Main St, Downtown',
        phone: '(555) 123-4567',
        email: 'downtown@sparebace.com',
        description: 'Our flagship location in the heart of downtown',
        imageUrl: '/salons/downtown.jpg',
      },
    }),
    prisma.salon.create({
      data: {
        name: 'Westside Salon',
        address: '456 West Ave, Westside',
        phone: '(555) 234-5678',
        email: 'westside@sparebace.com',
        description: 'Modern salon in the trendy Westside district',
        imageUrl: '/salons/westside.jpg',
      },
    }),
    prisma.salon.create({
      data: {
        name: 'Eastside Salon',
        address: '789 East Blvd, Eastside',
        phone: '(555) 345-6789',
        email: 'eastside@sparebace.com',
        description: 'Cozy salon with a welcoming atmosphere',
        imageUrl: '/salons/eastside.jpg',
      },
    }),
  ])

  // Create staff members
  const staff = await Promise.all([
    // Downtown Salon staff
    prisma.staff.create({
      data: {
        name: 'John Smith',
        email: 'john@sparebace.com',
        phone: '(555) 111-2222',
        title: 'Senior Stylist',
        imageUrl: '/staff/john-smith.jpg',
        salonId: salons[0].id,
        services: {
          connect: [
            { id: services[0].id },
            { id: services[1].id },
            { id: services[2].id },
          ],
        },
      },
    }),
    prisma.staff.create({
      data: {
        name: 'Sarah Johnson',
        email: 'sarah@sparebace.com',
        phone: '(555) 333-4444',
        title: 'Color Specialist',
        imageUrl: '/staff/sarah-johnson.jpg',
        salonId: salons[0].id,
        services: {
          connect: [
            { id: services[0].id },
            { id: services[3].id },
            { id: services[4].id },
          ],
        },
      },
    }),
    prisma.staff.create({
      data: {
        name: 'Mike Wilson',
        email: 'mike@sparebace.com',
        phone: '(555) 555-6666',
        title: 'Master Barber',
        imageUrl: '/staff/mike-wilson.jpg',
        salonId: salons[0].id,
        services: {
          connect: [
            { id: services[0].id },
            { id: services[1].id },
            { id: services[2].id },
          ],
        },
      },
    }),
    // Westside Salon staff
    prisma.staff.create({
      data: {
        name: 'Emma Davis',
        email: 'emma@sparebace.com',
        phone: '(555) 777-8888',
        title: 'Senior Stylist',
        imageUrl: '/staff/emma-davis.jpg',
        salonId: salons[1].id,
        services: {
          connect: [
            { id: services[0].id },
            { id: services[1].id },
            { id: services[3].id },
          ],
        },
      },
    }),
    prisma.staff.create({
      data: {
        name: 'David Brown',
        email: 'david@sparebace.com',
        phone: '(555) 999-0000',
        title: 'Color Specialist',
        imageUrl: '/staff/david-brown.jpg',
        salonId: salons[1].id,
        services: {
          connect: [
            { id: services[0].id },
            { id: services[3].id },
            { id: services[4].id },
          ],
        },
      },
    }),
    prisma.staff.create({
      data: {
        name: 'Lisa Anderson',
        email: 'lisa@sparebace.com',
        phone: '(555) 111-3333',
        title: 'Master Barber',
        imageUrl: '/staff/lisa-anderson.jpg',
        salonId: salons[1].id,
        services: {
          connect: [
            { id: services[0].id },
            { id: services[1].id },
            { id: services[2].id },
          ],
        },
      },
    }),
    // Eastside Salon staff
    prisma.staff.create({
      data: {
        name: 'James Wilson',
        email: 'james@sparebace.com',
        phone: '(555) 444-5555',
        title: 'Senior Stylist',
        imageUrl: '/staff/james-wilson.jpg',
        salonId: salons[2].id,
        services: {
          connect: [
            { id: services[0].id },
            { id: services[1].id },
            { id: services[2].id },
          ],
        },
      },
    }),
    prisma.staff.create({
      data: {
        name: 'Sophie Taylor',
        email: 'sophie@sparebace.com',
        phone: '(555) 666-7777',
        title: 'Color Specialist',
        imageUrl: '/staff/sophie-taylor.jpg',
        salonId: salons[2].id,
        services: {
          connect: [
            { id: services[0].id },
            { id: services[3].id },
            { id: services[4].id },
          ],
        },
      },
    }),
    prisma.staff.create({
      data: {
        name: 'Alex Thompson',
        email: 'alex@sparebace.com',
        phone: '(555) 888-9999',
        title: 'Master Barber',
        imageUrl: '/staff/alex-thompson.jpg',
        salonId: salons[2].id,
        services: {
          connect: [
            { id: services[0].id },
            { id: services[1].id },
            { id: services[2].id },
          ],
        },
      },
    }),
  ])

  // Create customers
  const customers = await Promise.all([
    prisma.customer.create({
      data: {
        name: 'Alice Brown',
        email: 'alice@example.com',
        phone: '(555) 123-4567',
      },
    }),
    prisma.customer.create({
      data: {
        name: 'Bob White',
        email: 'bob@example.com',
        phone: '(555) 234-5678',
      },
    }),
    prisma.customer.create({
      data: {
        name: 'Charlie Green',
        email: 'charlie@example.com',
        phone: '(555) 345-6789',
      },
    }),
  ])

  // Create appointments
  await Promise.all([
    prisma.appointment.create({
      data: {
        id: 'BRNLEMTN',
        customerId: customers[0].id,
        staffId: staff[0].id,
        serviceId: services[0].id,
        date: new Date('2024-03-20'),
        startTime: new Date('2024-03-20T10:00:00'),
        endTime: new Date('2024-03-20T10:30:00'),
        status: 'CONFIRMED',
      },
    }),
    prisma.appointment.create({
      data: {
        id: 'BRKLMNOP',
        customerId: customers[1].id,
        staffId: staff[1].id,
        serviceId: services[3].id,
        date: new Date('2024-03-20'),
        startTime: new Date('2024-03-20T11:00:00'),
        endTime: new Date('2024-03-20T13:00:00'),
        status: 'CONFIRMED',
      },
    }),
    prisma.appointment.create({
      data: {
        id: 'BRQRSTUV',
        customerId: customers[2].id,
        staffId: staff[2].id,
        serviceId: services[2].id,
        date: new Date('2024-03-20'),
        startTime: new Date('2024-03-20T14:00:00'),
        endTime: new Date('2024-03-20T14:20:00'),
        status: 'CONFIRMED',
      },
    }),
  ])

  console.log('Seed data created successfully')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 