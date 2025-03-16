'use client'

import { useState, useEffect, Suspense } from 'react'
import styled from 'styled-components'
import Link from 'next/link'
import { useSearchParams, useRouter } from 'next/navigation'

const Container = styled.div`
  min-height: 100vh;
  padding: 2rem;
  background: var(--background);
`

const BookingContainer = styled.div`
  max-width: 800px;
  margin: 5rem auto;
  padding: 2rem;
  background: var(--secondary);
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
`

const StepIndicator = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 2rem;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    top: 15px;
    left: 0;
    right: 0;
    height: 2px;
    background: var(--border);
    z-index: 1;
  }
`

const Step = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  z-index: 2;
`

const StepCircle = styled.div`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: ${props => {
    if (props.completed) return 'var(--primary)';
    if (props.active) return 'var(--accent)';
    return 'var(--border)';
  }};
  color: ${props => props.completed || props.active ? 'white' : 'var(--text-secondary)'};
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: ${props => props.completed || props.active ? 'bold' : 'normal'};
  transition: all 0.2s;
  margin-bottom: 0.5rem;
`

const StepName = styled.span`
  font-size: 0.8rem;
  color: ${props => props.completed || props.active ? 'var(--text-primary)' : 'var(--text-secondary)'};
  text-align: center;
  white-space: nowrap;
`

const StepContent = styled.div`
  margin-top: 2rem;
`

const ServiceGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1rem;
`

const ServiceCard = styled.div`
  padding: 1rem;
  border-radius: 8px;
  background: ${props => props.selected ? 'var(--accent)' : 'var(--secondary)'};
  border: 2px solid ${props => props.selected ? 'var(--primary)' : 'var(--border)'};
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    border-color: var(--primary);
  }
`

const StaffGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
`

const StaffCard = styled.div`
  padding: 1rem;
  border-radius: 8px;
  background: ${props => props.selected ? 'var(--accent)' : 'var(--secondary)'};
  border: 2px solid ${props => props.selected ? 'var(--primary)' : 'var(--border)'};
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    border-color: var(--primary);
  }
`

const DateGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 1rem;
`

const DateButton = styled.button`
  padding: 1rem;
  border-radius: 8px;
  background: ${props => props.selected ? 'var(--accent)' : 'var(--secondary)'};
  border: 2px solid ${props => props.selected ? 'var(--primary)' : 'var(--border)'};
  color: var(--text-primary);
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover:not(:disabled) {
    border-color: var(--primary);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`

const TimeGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 1rem;
`

const TimeButton = styled.button`
  padding: 1rem;
  border-radius: 8px;
  background: ${props => props.selected ? 'var(--accent)' : 'var(--secondary)'};
  border: 2px solid ${props => props.selected ? 'var(--primary)' : 'var(--border)'};
  color: var(--text-primary);
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover:not(:disabled) {
    border-color: var(--primary);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    background: var(--border);
  }
`

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 1rem;
`

const Input = styled.input`
  padding: 0.5rem;
  border-radius: 4px;
  background: var(--secondary);
  border: 1px solid var(--border);
  color: var(--text-primary);
  
  &:focus {
    outline: none;
    border-color: var(--primary);
  }
`

const Button = styled.button`
  padding: 0.5rem 1rem;
  border-radius: 4px;
  background: var(--primary);
  color: white;
  border: none;
  cursor: pointer;
  transition: opacity 0.2s;
  
  &:hover:not(:disabled) {
    opacity: 0.9;
  }
  
  &:disabled {
    background: var(--accent);
    cursor: not-allowed;
  }
`

const NavigationButtons = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 2rem;
`

const LoadingOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`

const LoadingSpinner = styled.div`
  border: 4px solid var(--border);
  border-top: 4px solid var(--primary);
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`

const ErrorMessage = styled.div`
  color: #ff4444;
  background: rgba(255, 68, 68, 0.1);
  padding: 1rem;
  border-radius: 4px;
  margin: 1rem 0;
`

const SuccessMessage = styled.div`
  color: #00c853;
  background: rgba(0, 200, 83, 0.1);
  padding: 1rem;
  border-radius: 4px;
  margin: 1rem 0;
`

const ConfirmationCard = styled.div`
  background: var(--secondary);
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 2rem;
`

const ConfirmationItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
  border-bottom: 1px solid var(--border);
  
  &:last-child {
    border-bottom: none;
  }
`

const ConfirmationLabel = styled.span`
  color: var(--text-secondary);
`

const ConfirmationValue = styled.span`
  color: var(--text-primary);
  font-weight: 500;
`

function BookingContent() {
  const [currentStep, setCurrentStep] = useState(1)
  const [selectedSalon, setSelectedSalon] = useState(null)
  const [selectedService, setSelectedService] = useState(null)
  const [selectedStaff, setSelectedStaff] = useState(null)
  const [selectedDate, setSelectedDate] = useState(null)
  const [selectedTime, setSelectedTime] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    notes: ''
  })
  const [salons, setSalons] = useState([])
  const [services, setServices] = useState([])
  const [staff, setStaff] = useState([])
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [salonsResponse, servicesResponse, staffResponse, appointmentsResponse] = await Promise.all([
          fetch('/api/salons'),
          fetch('/api/services'),
          fetch('/api/staff'),
          fetch('/api/appointments')
        ])

        const [salonsData, servicesData, staffData, appointmentsData] = await Promise.all([
          salonsResponse.json(),
          servicesResponse.json(),
          staffResponse.json(),
          appointmentsResponse.json()
        ])

        setSalons(salonsData)
        setServices(servicesData)
        setStaff(staffData)
        setAppointments(appointmentsData)

        // Handle pre-selected salon from URL
        const salonId = searchParams.get('salon')
        if (salonId) {
          const salon = salonsData.find(s => s.id === parseInt(salonId))
          if (salon) {
            setSelectedSalon(salon)
            setCurrentStep(2)
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error)
        setError('Failed to load booking data')
      }
    }

    fetchData()
  }, [searchParams])

  const handleSalonSelect = (salon) => {
    setSelectedSalon(salon)
    setSelectedService(null)
    setSelectedStaff(null)
    setSelectedDate(null)
    setSelectedTime(null)
  }

  const handleServiceSelect = (service) => {
    setSelectedService(service)
    setSelectedStaff(null)
    setSelectedDate(null)
    setSelectedTime(null)
  }

  const handleStaffSelect = (staffMember) => {
    setSelectedStaff(staffMember)
    setSelectedDate(null)
    setSelectedTime(null)
  }

  const handleDateSelect = (date) => {
    setSelectedDate(date)
    setSelectedTime(null)
  }

  const handleTimeSelect = (time) => {
    setSelectedTime(time)
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const generateAvailableDates = () => {
    const dates = []
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    for (let i = 0; i < 14; i++) {
      const date = new Date(today)
      date.setDate(today.getDate() + i)
      if (date.getDay() !== 0) { // Exclude Sundays
        dates.push(date)
      }
    }

    return dates
  }

  const generateTimeSlots = (date) => {
    if (!date) return []

    const slots = []
    const startTime = new Date(date)
    startTime.setHours(9, 0, 0, 0) // Start at 9 AM
    const endTime = new Date(date)
    endTime.setHours(17, 0, 0, 0) // End at 5 PM

    while (startTime < endTime) {
      slots.push(new Date(startTime))
      startTime.setMinutes(startTime.getMinutes() + 30)
    }

    return slots
  }

  const isTimeSlotAvailable = (time) => {
    if (!selectedService || !selectedStaff) return true

    const slotEnd = new Date(time)
    slotEnd.setMinutes(slotEnd.getMinutes() + selectedService.duration)

    return !appointments.some(appointment => {
      const appointmentStart = new Date(appointment.startTime)
      const appointmentEnd = new Date(appointment.endTime)
      return (
        time >= appointmentStart && time < appointmentEnd ||
        slotEnd > appointmentStart && slotEnd <= appointmentEnd
      )
    })
  }

  const handleSubmit = async () => {
    setLoading(true)
    setError(null)

    try {
      // Create customer
      const customerResponse = await fetch('/api/customers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
        }),
      })

      if (!customerResponse.ok) {
        const error = await customerResponse.json()
        throw new Error(error.message || 'Failed to create customer')
      }

      const customerData = await customerResponse.json()

      // Calculate end time based on service duration
      const endTime = new Date(selectedTime)
      endTime.setMinutes(endTime.getMinutes() + selectedService.duration)

      // Create appointment
      const appointmentResponse = await fetch('/api/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          date: selectedDate,
          startTime: selectedTime,
          endTime: endTime,
          serviceId: selectedService.id,
          staffId: selectedStaff.id,
          customerId: customerData.id,
          notes: formData.notes,
        }),
      })

      if (!appointmentResponse.ok) {
        const error = await appointmentResponse.json()
        throw new Error(error.message || 'Failed to create appointment')
      }

      setSuccess(true)
      setTimeout(() => {
        router.push('/')
      }, 2000)
    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleNext = () => {
    if (currentStep === 1 && !selectedSalon) {
      setError('Please select a salon')
      return
    }
    if (currentStep === 2 && !selectedService) {
      setError('Please select a service')
      return
    }
    if (currentStep === 3 && !selectedStaff) {
      setError('Please select a staff member')
      return
    }
    if (currentStep === 4 && !selectedDate) {
      setError('Please select a date')
      return
    }
    if (currentStep === 5 && !selectedTime) {
      setError('Please select a time')
      return
    }
    setError(null)
    setCurrentStep(currentStep + 1)
  }

  const handleBack = () => {
    // Clear selections based on the current step
    switch (currentStep) {
      case 2:
        setSelectedService(null);
        break;
      case 3:
        setSelectedStaff(null);
        break;
      case 4:
        setSelectedDate(null);
        break;
      case 5:
        setSelectedTime(null);
        break;
      case 6:
        setFormData({
          name: '',
          email: '',
          phone: '',
          notes: ''
        });
        break;
      default:
        break;
    }
    setCurrentStep(currentStep - 1);
    setError(null);
  }

  const isStepCompleted = (step) => {
    switch (step) {
      case 1:
        return selectedSalon !== null;
      case 2:
        return selectedService !== null;
      case 3:
        return selectedStaff !== null;
      case 4:
        return selectedDate !== null;
      case 5:
        return selectedTime !== null;
      case 6:
        return formData.name && formData.email && formData.phone;
      default:
        return false;
    }
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <ServiceGrid>
            {salons.map((salon) => (
              <ServiceCard
                key={salon.id}
                selected={selectedSalon?.id === salon.id}
                onClick={() => handleSalonSelect(salon)}
              >
                <h3>{salon.name}</h3>
                <p>{salon.address}</p>
                <p>{salon.description}</p>
                <p>📞 {salon.phone}</p>
                <p>✉️ {salon.email}</p>
              </ServiceCard>
            ))}
          </ServiceGrid>
        )
      case 2:
        return (
          <ServiceGrid>
            {services.map((service) => (
              <ServiceCard
                key={service.id}
                selected={selectedService?.id === service.id}
                onClick={() => handleServiceSelect(service)}
              >
                <h3>{service.name}</h3>
                <p>{service.description}</p>
                <p>Duration: {service.duration} minutes</p>
                <p>Price: ${service.price}</p>
              </ServiceCard>
            ))}
          </ServiceGrid>
        )
      case 3:
        const availableStaff = staff.filter(staffMember => 
          staffMember.salonId === selectedSalon.id && 
          staffMember.services.some(service => service.id === selectedService.id)
        );

        return (
          <>
            {availableStaff.length === 0 ? (
              <ErrorMessage>
                No staff members are currently available for {selectedService.name} at {selectedSalon.name}. 
                Please select a different service or salon.
              </ErrorMessage>
            ) : (
              <StaffGrid>
                {availableStaff.map((staffMember) => (
                  <StaffCard
                    key={staffMember.id}
                    selected={selectedStaff?.id === staffMember.id}
                    onClick={() => handleStaffSelect(staffMember)}
                  >
                    <img
                      src={staffMember.imageUrl || '/placeholder-staff.jpg'}
                      alt={staffMember.name}
                      style={{ width: '100%', height: '200px', objectFit: 'cover' }}
                    />
                    <h3>{staffMember.name}</h3>
                    <p>{staffMember.title}</p>
                  </StaffCard>
                ))}
              </StaffGrid>
            )}
          </>
        )
      case 4:
        return (
          <DateGrid>
            {generateAvailableDates().map((date) => (
              <DateButton
                key={date.toISOString()}
                selected={selectedDate?.toDateString() === date.toDateString()}
                onClick={() => handleDateSelect(date)}
              >
                {date.toLocaleDateString('en-US', {
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric'
                })}
              </DateButton>
            ))}
          </DateGrid>
        )
      case 5:
        return (
          <TimeGrid>
            {generateTimeSlots(selectedDate).map((time) => (
              <TimeButton
                key={time.toISOString()}
                selected={selectedTime?.toISOString() === time.toISOString()}
                onClick={() => handleTimeSelect(time)}
                disabled={!isTimeSlotAvailable(time)}
              >
                {time.toLocaleTimeString('en-US', {
                  hour: 'numeric',
                  minute: '2-digit'
                })}
              </TimeButton>
            ))}
          </TimeGrid>
        )
      case 6:
        return (
          <>
            <ConfirmationCard>
              <ConfirmationItem>
                <ConfirmationLabel>Salon:</ConfirmationLabel>
                <ConfirmationValue>{selectedSalon?.name || 'Not selected'}</ConfirmationValue>
              </ConfirmationItem>
              <ConfirmationItem>
                <ConfirmationLabel>Service:</ConfirmationLabel>
                <ConfirmationValue>{selectedService?.name || 'Not selected'}</ConfirmationValue>
              </ConfirmationItem>
              <ConfirmationItem>
                <ConfirmationLabel>Staff:</ConfirmationLabel>
                <ConfirmationValue>{selectedStaff?.name || 'Not selected'}</ConfirmationValue>
              </ConfirmationItem>
              <ConfirmationItem>
                <ConfirmationLabel>Date:</ConfirmationLabel>
                <ConfirmationValue>
                  {selectedDate ? selectedDate.toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  }) : 'Not selected'}
                </ConfirmationValue>
              </ConfirmationItem>
              <ConfirmationItem>
                <ConfirmationLabel>Time:</ConfirmationLabel>
                <ConfirmationValue>
                  {selectedTime ? selectedTime.toLocaleTimeString('en-US', {
                    hour: 'numeric',
                    minute: '2-digit'
                  }) : 'Not selected'}
                </ConfirmationValue>
              </ConfirmationItem>
              <ConfirmationItem>
                <ConfirmationLabel>Duration:</ConfirmationLabel>
                <ConfirmationValue>{selectedService?.duration ? `${selectedService.duration} minutes` : 'Not selected'}</ConfirmationValue>
              </ConfirmationItem>
              <ConfirmationItem>
                <ConfirmationLabel>Price:</ConfirmationLabel>
                <ConfirmationValue>{selectedService?.price ? `$${selectedService.price}` : 'Not selected'}</ConfirmationValue>
              </ConfirmationItem>
            </ConfirmationCard>

            <Form>
              <h3>Your Information</h3>
              <Input
                type="text"
                name="name"
                placeholder="Your Name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
              <Input
                type="email"
                name="email"
                placeholder="Your Email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
              <Input
                type="tel"
                name="phone"
                placeholder="Your Phone"
                value={formData.phone}
                onChange={handleInputChange}
                required
              />
              <Input
                type="text"
                name="notes"
                placeholder="Additional Notes (Optional)"
                value={formData.notes}
                onChange={handleInputChange}
              />
            </Form>
          </>
        )
      default:
        return null
    }
  }

  if (loading) {
    return (
      <LoadingOverlay>
        <LoadingSpinner />
      </LoadingOverlay>
    )
  }

  if (success) {
    return (
      <Container>
        <BookingContainer>
          <SuccessMessage>
            Appointment booked successfully! Redirecting to homepage...
          </SuccessMessage>
        </BookingContainer>
      </Container>
    )
  }

  return (
    <Container>
      <BookingContainer>
        <StepIndicator>
          <Step>
            <StepCircle 
              active={currentStep === 1} 
              completed={isStepCompleted(1)}
            >
              1
            </StepCircle>
            <StepName 
              completed={isStepCompleted(1)}
              active={currentStep === 1}
            >
              Salon
            </StepName>
          </Step>
          <Step>
            <StepCircle 
              active={currentStep === 2} 
              completed={isStepCompleted(2)}
            >
              2
            </StepCircle>
            <StepName 
              completed={isStepCompleted(2)}
              active={currentStep === 2}
            >
              Service
            </StepName>
          </Step>
          <Step>
            <StepCircle 
              active={currentStep === 3} 
              completed={isStepCompleted(3)}
            >
              3
            </StepCircle>
            <StepName 
              completed={isStepCompleted(3)}
              active={currentStep === 3}
            >
              Staff
            </StepName>
          </Step>
          <Step>
            <StepCircle 
              active={currentStep === 4} 
              completed={isStepCompleted(4)}
            >
              4
            </StepCircle>
            <StepName 
              completed={isStepCompleted(4)}
              active={currentStep === 4}
            >
              Date
            </StepName>
          </Step>
          <Step>
            <StepCircle 
              active={currentStep === 5} 
              completed={isStepCompleted(5)}
            >
              5
            </StepCircle>
            <StepName 
              completed={isStepCompleted(5)}
              active={currentStep === 5}
            >
              Time
            </StepName>
          </Step>
          <Step>
            <StepCircle 
              active={currentStep === 6} 
              completed={isStepCompleted(6)}
            >
              6
            </StepCircle>
            <StepName 
              completed={isStepCompleted(6)}
              active={currentStep === 6}
            >
              Confirm
            </StepName>
          </Step>
        </StepIndicator>

        {error && <ErrorMessage>{error}</ErrorMessage>}
        
        <StepContent>
          {renderStepContent()}
        </StepContent>

        <NavigationButtons>
          {currentStep > 1 && (
            <Button onClick={handleBack}>Back</Button>
          )}
          {currentStep < 6 && (
            <Button onClick={handleNext}>Next</Button>
          )}
          {currentStep === 6 && (
            <Button 
              onClick={handleSubmit}
              disabled={!formData.name || !formData.email || !formData.phone}
            >
              Confirm Booking
            </Button>
          )}
        </NavigationButtons>
      </BookingContainer>
    </Container>
  )
}

export default function Booking() {
  return (
    <Container>
      <Suspense fallback={
        <BookingContainer>
          <LoadingOverlay>
            <LoadingSpinner />
          </LoadingOverlay>
        </BookingContainer>
      }>
        <BookingContent />
      </Suspense>
    </Container>
  )
} 