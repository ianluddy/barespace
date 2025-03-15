const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

function generateReference() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let reference = 'BR';
  for (let i = 0; i < 6; i++) {
    reference += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return reference;
}

async function main() {
  // Delete existing data
  await prisma.appointment.deleteMany()
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
        email: 'downtown@barespace.com',
        description: 'Our flagship location in the heart of downtown',
        imageUrl: '/salons/downtown.jpg',
      },
    }),
    prisma.salon.create({
      data: {
        name: 'Westside Salon',
        address: '456 West Ave, Westside',
        phone: '(555) 234-5678',
        email: 'westside@barespace.com',
        description: 'Modern salon in the trendy Westside district',
        imageUrl: '/salons/westside.jpg',
      },
    }),
    prisma.salon.create({
      data: {
        name: 'Eastside Salon',
        address: '789 East Blvd, Eastside',
        phone: '(555) 345-6789',
        email: 'eastside@barespace.com',
        description: 'Cozy salon with a welcoming atmosphere',
        imageUrl: '/salons/eastside.jpg',
      },
    }),
  ])

  // Create staff members for each salon
  const staff = await Promise.all([
    // Downtown Salon staff
    prisma.staff.create({
      data: {
        name: 'John Smith',
        email: 'john@barespace.com',
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
        email: 'sarah@barespace.com',
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
        email: 'mike@barespace.com',
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
        email: 'emma@barespace.com',
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
        email: 'david@barespace.com',
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
        email: 'lisa@barespace.com',
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
        email: 'james@barespace.com',
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
        email: 'sophie@barespace.com',
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
        email: 'alex@barespace.com',
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

  // Create sample appointments
  const appointments = await Promise.all([
    prisma.appointment.create({
      data: {
        id: generateReference(),
        date: new Date('2024-03-15'),
        startTime: new Date('2024-03-15T10:00:00'),
        endTime: new Date('2024-03-15T10:30:00'),
        serviceId: services[0].id,
        staffId: staff[0].id,
        customerId: customers[0].id,
        notes: 'First appointment of the day',
      },
    }),
    prisma.appointment.create({
      data: {
        id: generateReference(),
        date: new Date('2024-03-15'),
        startTime: new Date('2024-03-15T11:00:00'),
        endTime: new Date('2024-03-15T11:45:00'),
        serviceId: services[1].id,
        staffId: staff[1].id,
        customerId: customers[1].id,
        notes: 'Premium service requested',
      },
    }),
    prisma.appointment.create({
      data: {
        id: generateReference(),
        date: new Date('2024-03-15'),
        startTime: new Date('2024-03-15T13:00:00'),
        endTime: new Date('2024-03-15T13:20:00'),
        serviceId: services[2].id,
        staffId: staff[2].id,
        customerId: customers[2].id,
        notes: 'Beard trim only',
      },
    }),
  ])

  console.log('Seed data created successfully:')
  console.log(`${services.length} services`)
  console.log(`${salons.length} salons`)
  console.log(`${staff.length} staff members`)
  console.log(`${customers.length} customers`)
  console.log(`${appointments.length} appointments`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 