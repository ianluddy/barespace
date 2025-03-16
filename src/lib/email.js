import nodemailer from 'nodemailer'

// Create reusable transporter object using SMTP transport
var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },  
});

export async function sendAppointmentConfirmationEmail({ 
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
  try {
    const info = await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: customerEmail,
      subject: 'Your Barespace Appointment Confirmation',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #0070f3;">Appointment Confirmation</h1>
          <p>${customerName ? `Dear ${customerName}` : 'Hi there'},</p>
          <p>Your appointment has been confirmed. Here are the details:</p>
          
          <div style="background: #f8f8f8; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Reference:</strong> ${reference}</p>
            <p><strong>Date:</strong> ${new Date(appointmentDate).toLocaleDateString()}</p>
            <p><strong>Time:</strong> ${new Date(startTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
            <p><strong>Service:</strong> ${serviceName}</p>
            <p><strong>Stylist:</strong> ${staffName}</p>
            <p><strong>Salon:</strong> ${salonName}</p>
            <p><strong>Address:</strong> ${salonAddress}</p>
          </div>
          
          <p>Need to make changes? You can:</p>
          <ul>
            <li>Reschedule your appointment</li>
            <li>Cancel your appointment</li>
            <li>Contact us with questions</li>
          </ul>
          
          <p>Just reply to this email or use our chat assistant on the website.</p>
          
          <p style="margin-top: 30px;">Thank you for choosing Barespace!</p>
          
          <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #666;">
            <p>This is an automated message, please do not reply directly to this email.</p>
          </div>
        </div>
      `,
    })

    console.log('Email sent:', info.messageId)
    return info.messageId
  } catch (error) {
    console.error('Error sending email:', error)
    throw error
  }
} 

export async function sendAppointmentCancellationEmail({
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
  try {
    const info = await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: customerEmail,
      subject: 'Your Barespace Appointment Cancellation',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #0070f3;">Appointment Cancellation</h1>
          <p>${customerName ? `Dear ${customerName}` : 'Hi there'},</p>
          <p>Your appointment has been cancelled. Here are the details of the cancelled appointment:</p>
          
          <div style="background: #f8f8f8; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Reference:</strong> ${reference}</p>
            <p><strong>Date:</strong> ${new Date(appointmentDate).toLocaleDateString()}</p>
            <p><strong>Time:</strong> ${new Date(startTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
            <p><strong>Service:</strong> ${serviceName}</p>
            <p><strong>Stylist:</strong> ${staffName}</p>
            <p><strong>Salon:</strong> ${salonName}</p>
            <p><strong>Address:</strong> ${salonAddress}</p>
          </div>
          
          <p>Would you like to:</p>
          <ul>
            <li>Book a new appointment</li>
            <li>Contact us with questions</li>
          </ul>
          
          <p>Just reply to this email or use our chat assistant on the website.</p>
          
          <p style="margin-top: 30px;">Thank you for choosing Barespace!</p>
          
          <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #666;">
            <p>This is an automated message, please do not reply directly to this email.</p>
          </div>
        </div>
      `,
    })

    console.log('Email sent:', info.messageId)
    return info.messageId
  } catch (error) {
    console.error('Error sending email:', error)
    throw error
  }
}
