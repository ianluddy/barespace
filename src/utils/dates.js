/**
 * Generates an array of available dates for booking, excluding Sundays
 * @param {number} daysAhead - Number of days to generate ahead (default: 14)
 * @returns {Date[]} Array of available dates
 */
export function generateAvailableDates(daysAhead = 14) {
  const dates = []
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  for (let i = 0; i < daysAhead; i++) {
    const date = new Date(today)
    date.setDate(today.getDate() + i)
    if (date.getDay() !== 0) { // Exclude Sundays
      dates.push(date)
    }
  }

  return dates
}

/**
 * Generates available time slots for a given date
 * @param {Date} date - The date to generate time slots for
 * @param {number} startHour - Starting hour in 24h format (default: 9)
 * @param {number} endHour - Ending hour in 24h format (default: 17)
 * @param {number} intervalMinutes - Interval between slots in minutes (default: 30)
 * @returns {Date[]} Array of available time slots
 */
export function generateTimeSlots(date, startHour = 9, endHour = 17, intervalMinutes = 30) {
  if (!date) return []

  const slots = []
  const startTime = new Date(date)
  startTime.setHours(startHour, 0, 0, 0)
  const endTime = new Date(date)
  endTime.setHours(endHour, 0, 0, 0)

  while (startTime < endTime) {
    slots.push(new Date(startTime))
    startTime.setMinutes(startTime.getMinutes() + intervalMinutes)
  }

  return slots
}

/**
 * Checks if a time slot is available based on existing appointments
 * @param {Date} time - The time slot to check
 * @param {Object} service - The selected service
 * @param {Object} staff - The selected staff member
 * @param {Array} appointments - Array of existing appointments
 * @returns {boolean} Whether the time slot is available
 */
export function isTimeSlotAvailable(time, service, staff, appointments) {
  if (!service || !staff) return true

  const slotEnd = new Date(time)
  slotEnd.setMinutes(slotEnd.getMinutes() + service.duration)

  return !appointments.some(appointment => {
    const appointmentStart = new Date(appointment.startTime)
    const appointmentEnd = new Date(appointment.endTime)
    return (
      (time >= appointmentStart && time < appointmentEnd) ||
      (slotEnd > appointmentStart && slotEnd <= appointmentEnd)
    )
  })
} 

export function getDaySuffix(day) {
  if (day === 1 || day === 21 || day === 31) return 'st';
  if (day === 2 || day === 22) return 'nd';
  if (day === 3 || day === 23) return 'rd';
  return 'th';
}
