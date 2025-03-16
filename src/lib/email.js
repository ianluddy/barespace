import emailjs from '@emailjs/browser'

// Initialize EmailJS
emailjs.init({
  publicKey: process.env.EMAILJS_PUBLIC_KEY,
})

export async function sendAppointmentConfirmation({ 
  customerEmail, 
  customerName, 
  appointmentDate,
  startTime,
  serviceName,
  staffName,
  salonName,
  salonAddress,
  reference
}) {
  const date = new Date(appointmentDate).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
  
  const time = new Date(startTime).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit'
  })

  emailjs.send(
    process.env.EMAILJS_SERVICE_ID,
    process.env.EMAILJS_TEMPLATE_ID,
    {
      to_email: customerEmail,
      to_name: customerName,
      appointment_date: date,
      appointment_time: time,
      service_name: serviceName,
      staff_name: staffName,
      salon_name: salonName,
      salon_address: salonAddress,
      reference: reference
    }
  );
} 