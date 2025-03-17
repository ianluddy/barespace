-- Clean up existing data
DELETE FROM "Appointment";
DELETE FROM "_ServiceToStaff";
DELETE FROM "Staff";
DELETE FROM "Service";
DELETE FROM "Customer";
DELETE FROM "Salon";

-- Create services with UUIDs
DO $$ 
DECLARE 
    service1_id UUID := gen_random_uuid();
    service2_id UUID := gen_random_uuid();
    service3_id UUID := gen_random_uuid();
    service4_id UUID := gen_random_uuid();
    service5_id UUID := gen_random_uuid();
    salon1_id UUID := gen_random_uuid();
    salon2_id UUID := gen_random_uuid();
    salon3_id UUID := gen_random_uuid();
    staff1_id UUID := gen_random_uuid();
    staff2_id UUID := gen_random_uuid();
    staff3_id UUID := gen_random_uuid();
    staff4_id UUID := gen_random_uuid();
    staff5_id UUID := gen_random_uuid();
    staff6_id UUID := gen_random_uuid();
    staff7_id UUID := gen_random_uuid();
    staff8_id UUID := gen_random_uuid();
    staff9_id UUID := gen_random_uuid();
    customer1_id UUID := gen_random_uuid();
    customer2_id UUID := gen_random_uuid();
    customer3_id UUID := gen_random_uuid();
BEGIN
    -- Create services
    INSERT INTO "Service" (id, name, description, duration, price, "createdAt", "updatedAt") VALUES
      (service1_id, 'Classic Haircut', 'Traditional haircut with wash and style', 30, 35.00, NOW(), NOW()),
      (service2_id, 'Premium Haircut', 'Premium haircut with wash, style, and treatment', 45, 50.00, NOW(), NOW()),
      (service3_id, 'Beard Trim', 'Professional beard trimming and shaping', 20, 25.00, NOW(), NOW()),
      (service4_id, 'Hair Color', 'Full hair coloring service', 120, 85.00, NOW(), NOW()),
      (service5_id, 'Kids Haircut', 'Haircut for children under 12', 20, 25.00, NOW(), NOW());

    -- Create salons
    INSERT INTO "Salon" (id, name, address, phone, email, description, "imageUrl", "createdAt", "updatedAt") VALUES
      (salon1_id, 'Downtown Salon', '123 Main St, Downtown', '(555) 123-4567', 'downtown@sparebace.com', 'Our flagship location in the heart of downtown', '/salons/downtown.jpg', NOW(), NOW()),
      (salon2_id, 'Westside Salon', '456 West Ave, Westside', '(555) 234-5678', 'westside@sparebace.com', 'Modern salon in the trendy Westside district', '/salons/westside.jpg', NOW(), NOW()),
      (salon3_id, 'Eastside Salon', '789 East Blvd, Eastside', '(555) 345-6789', 'eastside@sparebace.com', 'Cozy salon with a welcoming atmosphere', '/salons/eastside.jpg', NOW(), NOW());

    -- Create staff members
    INSERT INTO "Staff" (id, name, email, phone, title, "imageUrl", "salonId", "createdAt", "updatedAt") VALUES
      -- Downtown Salon staff
      (staff1_id, 'John Smith', 'john@sparebace.com', '(555) 111-2222', 'Senior Stylist', '/staff/john-smith.jpg', salon1_id, NOW(), NOW()),
      (staff2_id, 'Sarah Johnson', 'sarah@sparebace.com', '(555) 333-4444', 'Color Specialist', '/staff/sarah-johnson.jpg', salon1_id, NOW(), NOW()),
      (staff3_id, 'Mike Wilson', 'mike@sparebace.com', '(555) 555-6666', 'Master Barber', '/staff/mike-wilson.jpg', salon1_id, NOW(), NOW()),
      -- Westside Salon staff
      (staff4_id, 'Emma Davis', 'emma@sparebace.com', '(555) 777-8888', 'Senior Stylist', '/staff/emma-davis.jpg', salon2_id, NOW(), NOW()),
      (staff5_id, 'David Brown', 'david@sparebace.com', '(555) 999-0000', 'Color Specialist', '/staff/david-brown.jpg', salon2_id, NOW(), NOW()),
      (staff6_id, 'Lisa Anderson', 'lisa@sparebace.com', '(555) 111-3333', 'Master Barber', '/staff/lisa-anderson.jpg', salon2_id, NOW(), NOW()),
      -- Eastside Salon staff
      (staff7_id, 'James Wilson', 'james@sparebace.com', '(555) 444-5555', 'Senior Stylist', '/staff/james-wilson.jpg', salon3_id, NOW(), NOW()),
      (staff8_id, 'Sophie Taylor', 'sophie@sparebace.com', '(555) 666-7777', 'Color Specialist', '/staff/sophie-taylor.jpg', salon3_id, NOW(), NOW()),
      (staff9_id, 'Alex Thompson', 'alex@sparebace.com', '(555) 888-9999', 'Master Barber', '/staff/alex-thompson.jpg', salon3_id, NOW(), NOW());

    -- Create service-staff relationships
    INSERT INTO "_ServiceToStaff" ("A", "B") VALUES
      -- John Smith's services
      (service1_id, staff1_id), (service2_id, staff1_id), (service3_id, staff1_id),
      -- Sarah Johnson's services
      (service1_id, staff2_id), (service4_id, staff2_id), (service5_id, staff2_id),
      -- Mike Wilson's services
      (service1_id, staff3_id), (service2_id, staff3_id), (service3_id, staff3_id),
      -- Emma Davis's services
      (service1_id, staff4_id), (service2_id, staff4_id), (service4_id, staff4_id),
      -- David Brown's services
      (service1_id, staff5_id), (service4_id, staff5_id), (service5_id, staff5_id),
      -- Lisa Anderson's services
      (service1_id, staff6_id), (service2_id, staff6_id), (service3_id, staff6_id),
      -- James Wilson's services
      (service1_id, staff7_id), (service2_id, staff7_id), (service3_id, staff7_id),
      -- Sophie Taylor's services
      (service1_id, staff8_id), (service4_id, staff8_id), (service5_id, staff8_id),
      -- Alex Thompson's services
      (service1_id, staff9_id), (service2_id, staff9_id), (service3_id, staff9_id);

    -- Create customers
    INSERT INTO "Customer" (id, name, email, phone, "createdAt", "updatedAt") VALUES
      (customer1_id, 'Alice Brown', 'alice@example.com', '(555) 123-4567', NOW(), NOW()),
      (customer2_id, 'Bob White', 'bob@example.com', '(555) 234-5678', NOW(), NOW()),
      (customer3_id, 'Charlie Green', 'charlie@example.com', '(555) 345-6789', NOW(), NOW());

    -- Create appointments
    INSERT INTO "Appointment" (id, "customerId", "staffId", "serviceId", date, "startTime", "endTime", status, "createdAt", "updatedAt") VALUES
      ('BRNLEMTN', 
       customer1_id,
       staff1_id,
       service1_id,
       '2024-03-20',
       '2024-03-20 10:00:00',
       '2024-03-20 10:30:00',
       'CONFIRMED',
       NOW(),
       NOW()),
      ('BRKLMNOP',
       customer2_id,
       staff2_id,
       service4_id,
       '2024-03-20',
       '2024-03-20 11:00:00',
       '2024-03-20 13:00:00',
       'CONFIRMED',
       NOW(),
       NOW()),
      ('BRQRSTUV',
       customer3_id,
       staff3_id,
       service3_id,
       '2024-03-20',
       '2024-03-20 14:00:00',
       '2024-03-20 14:20:00',
       'CONFIRMED',
       NOW(),
       NOW());
END $$; 