'use client'

import { useState, useRef, useEffect, Fragment } from 'react'
import styled from 'styled-components'
import { generateAvailableDates, generateTimeSlots, isTimeSlotAvailable } from '@/utils/dates'
import { VoiceInput } from '@/lib/voice'
import { loadStripe } from '@stripe/stripe-js'

const ChatContainer = styled.div`
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 1000;
`

const ChatButton = styled.button`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: var(--primary);
  color: white;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transition: transform 0.2s;

  &:hover {
    transform: scale(1.05);
  }
`

const ChatWindow = styled.div`
  position: absolute;
  bottom: 80px;
  right: 0;
  width: 350px;
  height: 500px;
  background: var(--secondary);
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  overflow: hidden;
`

const ChatHeader = styled.div`
  padding: 1rem;
  background: var(--primary);
  color: white;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: space-between;
`
const ChatFooter = styled.div`
  padding: 0 0.5rem 0.75rem 0;
  color: var(--text-secondary);
  font-size: 0.8rem;
  text-align: center;
  font-style: italic;
  opacity: 0.5;
`

const ChatMessages = styled.div`
  flex: 1;
  padding: 1rem;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`

const Message = styled.div`
  max-width: 80%;
  padding: 0.75rem 1rem;
  border-radius: 12px;
  ${props => props.$isUser ? `
    background: var(--primary);
    color: white;
    align-self: flex-end;
    border-bottom-right-radius: 4px;
  ` : `
    background: var(--accent);
    color: var(--text-primary);
    align-self: flex-start;
    border-bottom-left-radius: 4px;
  `}
`

const ChatInput = styled.div`
  padding: 1rem;
  border-top: 1px solid var(--border);
  display: flex;
  gap: 0.5rem;
`

const Input = styled.input`
  flex: 1;
  padding: 0.75rem;
  border: 1px solid var(--border);
  border-radius: 6px;
  background: var(--background);
  color: var(--text-primary);
  
  &:focus {
    outline: none;
    border-color: var(--primary);
  }

  @media (max-width: 768px) {
    font-size: 16px;
  }
`

const SendButton = styled.button`
  padding: 0.75rem 1rem;
  background: var(--primary);
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.9;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`

const CloseButton = styled.button`
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  font-size: 1.2rem;
  padding: 0;
  opacity: 0.8;

  &:hover {
    opacity: 1;
  }
`

const ActionButton = styled.button`
  background: var(--primary);
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0.5rem 1rem;
  margin: 0.25rem 0.15rem 0 0;
  cursor: pointer;
  font-size: 0.9rem;
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.9;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`

const MicButton = styled.button`
  background: ${props => props.$isListening ? 'var(--error)' : 'var(--primary)'};
  color: white;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  margin-right: 10px;

  &:hover {
    opacity: 0.9;
  }

  &:disabled {
    background: var(--border);
    cursor: not-allowed;
  }

  svg {
    width: 100%;
    height: 100%;
    transform: scale(2.6);
  }
`

const LoadingOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white;
  z-index: 2000;
`

const LoadingSpinner = styled.div`
  width: 50px;
  height: 50px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 1s ease-in-out infinite;
  margin-bottom: 1rem;

  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`

const LoadingText = styled.div`
  font-size: 1.2rem;
  text-align: center;
  max-width: 80%;
  line-height: 1.5;
`

const responses = {
  default: 'I\'m sorry, I didn\'t understand your request. Please choose from one of the following options: \n - Book \n - Confirm \n - Cancel \n - Reschedule',
  book: 'Sounds like you want to book an appointment, is that correct?',
  cancel: 'Sounds like you want to cancel an appointment, is that correct?',
  reschedule: 'Sounds like you want to reschedule an appointment, is that correct?',
  confirm: 'Sounds like you want to confirm an appointment, is that correct?',
  price: 'Our prices vary depending on the service. You can find detailed pricing information on our services page.',
  salon: 'Here are our available salon locations. Please select one:',
  service: 'Please select the service you\'d like to book:',
  staff: 'Please select the stylist you\'d like to book:',
  date: 'Please select the date you\'d like to book:',
  time: 'Please select the time you\'d like to book:',
  email: 'Please provide your email address for the booking confirmation.',
  help: 'Ok let me help you with that.',
  bookingRef: 'What is your booking reference number, in the format BRXXXXXX?',
  confirmCancel: 'Are you sure you want to cancel this booking? \n If so, please confirm by typing \'confirm\'',
  confirmReschedule: 'Are you sure you want to reschedule this booking? \n If so, please confirm by typing \'confirm\'',
  confirmBooking: 'Type \'confirm\' to confirm your booking. \n You will be redirected to Stripe to complete the payment.',
  confirmBookingSuccess: 'Thanks! You\'ll be redirected to our secure payment page to complete your booking.',
  welcome: 'You\'re very welcome!',
  restart: 'Let\'s start over. What can I help you with?',
  salonError: 'I\'m having trouble retrieving our salon locations. Please try again later.',
  serviceError: 'I\'m having trouble retrieving our services. Please try again later.',
  staffError: 'I\'m having trouble retrieving our staff members. Please try again later.',
  dateError: 'I\'m having trouble retrieving our dates. Please try again later.',
  timeError: 'I\'m having trouble retrieving our times. Please try again later.',
  confirmError: 'I\'m having trouble confirming your booking. Please try again later.',
  emailError: 'I\'m having trouble retrieving your email address. Please try again later.',
  bookingError: 'I\'m having trouble retrieving your booking. Please try again later.',
  bookingSuccess: 'Your booking is confirmed.',
  hi: 'Hi! How can I help you today?',
  voiceError: 'Sorry, I couldn\'t understand that. Please try again or type your message.',
  cancelSuccess: 'Booking cancelled successfully.',
  cancelError: 'I\'m having trouble cancelling your booking. Please try again later.',
  rescheduleSuccess: 'Now let\'s create a new booking. Type \'book\' to get started.',
  rescheduleFirst: 'First let\'s cancel your existing booking.',
  rescheduleError: 'I\'m having trouble rescheduling your booking. Please try again later.',
  bookingNotFound: 'I couldn\'t find a booking with that reference number. Please make sure you\'ve entered it correctly.',
}

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([
    { body: responses.hi, isUser: false }
  ])
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [isRedirecting, setIsRedirecting] = useState(false)
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)
  const voiceInput = useRef(new VoiceInput())

  const [newBookingEmail, setNewBookingEmail] = useState("")
  const [newBookingDate, setNewBookingDate] = useState("")
  const [newBookingTime, setNewBookingTime] = useState("")
  const [newBookingService, setNewBookingService] = useState("")
  const [newBookingStaff, setNewBookingStaff] = useState("")
  const [newBookingSalon, setNewBookingSalon] = useState("")

  const [existingBooking, setExistingBooking] = useState(null)

  const [action, setAction] = useState(null)
  const [actionConfirmed, setActionConfirmed] = useState(false)

  useEffect(() => {
    if( newBookingSalon ) {
      handleSend(newBookingSalon.name);
      setNewBookingService(null);
      setNewBookingStaff(null);
      setNewBookingDate(null);
      setNewBookingTime(null);
    }
  }, [newBookingSalon]);

  useEffect(() => {
    if( newBookingService ) {
      handleSend(newBookingService.name);
      setNewBookingStaff(null);
      setNewBookingDate(null);
      setNewBookingTime(null);
    }
  }, [newBookingService]);

  useEffect(() => {
    if( newBookingStaff ) {
      handleSend(newBookingStaff.name);
      setNewBookingDate(null);
      setNewBookingTime(null);
    }
  }, [newBookingStaff]);

  useEffect(() => {
    if( newBookingDate ) {
      handleSend(newBookingDate);
      setNewBookingTime(null);
    }
  }, [newBookingDate]);

  useEffect(() => {
    if( newBookingTime ) {
      handleSend(newBookingTime.toTimeString().split(' ')[0]);
    }
  }, [newBookingTime]);

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsOpen(location.pathname === '/');
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const handleVoiceInput = () => {
    if (isListening) {
      voiceInput.current.stopListening()
      setIsListening(false)
      return
    }

    setIsListening(true)
    voiceInput.current.startListening(
      // onResult
      (text) => {
        setIsListening(false)
        setInputValue(text)
        handleSend(text)
      },
      // onError
      (error) => {
        console.error('Voice input error:', error)
        setIsListening(false)
        setMessages(prev => [...prev, {
          body: responses.voiceError,
          isUser: false
        }])
      }
    )
  }

  const handleSend = async (programmaticValue = null) => {
    if (!inputValue.trim() && !programmaticValue) return

    let userMessageValue = inputValue.trim() || programmaticValue;

    // Add user message
    const userMessage = { body: userMessageValue, isUser: true }
    setMessages(prev => [...prev, userMessage])
    setInputValue("")
    setIsTyping(true)

    // Simulate bot response
    setTimeout(async () => {
      const responses = await getBotResponse(userMessageValue)
      const botMessages = responses.map(body => ({ body, isUser: false }))
      setMessages(prev => [...prev, ...botMessages])
      setIsTyping(false)
    }, 700)
  }

  const getBotResponse = async (message) => {
    const response = [];
    message = message.toLowerCase();

    const bookingRef = message.match(/br[a-z]{6}/);
    const email = message.match(/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/)
    const yes = message.match(/yes|ya|yeah|yup|yep/);
    const reschedule = message.match(/reschedule/);
    const confirm = message.match(/confirm/);
    const cancel = message.match(/cancel/);
    const price = message.match(/price|cost/);
    const book = message.match(/book|make|create|schedule|new|appointment/);
    const restart = message.match(/start/);    

    if( restart ) {
      setAction(null);
      setActionConfirmed(false);
      setNewBookingSalon(null);
      setNewBookingService(null);
      setNewBookingStaff(null);
      setNewBookingDate(null);
      setNewBookingTime(null);
      setNewBookingEmail(null);
      setExistingBooking(null);
      return [responses.restart];
    }

    if( action && yes ) {
      setActionConfirmed(true);
      response.push(
        responses.help
      );
    }

    if (action === 'book' && (yes || actionConfirmed)) {
      if( !newBookingSalon ) {
        try {
          const salons = await fetch('/api/salons').then(res => res.json());
          if (salons && salons.length > 0) {
          response.push(
            responses.salon,
            salons.map(salon => 
              <ActionButton key={salon.id} onClick={() => setNewBookingSalon(salon)}>{salon.name} - {salon.address}</ActionButton>
            )
          );
        } else {
          response.push(responses.salonError);
        }
        } catch (error) {
          console.error(error);
          response.push(responses.salonError);
        }
        return response;
      }

      if (!newBookingService) {
        try {
          const services = await fetch(`/api/services?salonId=${newBookingSalon.id}`).then(res => res.json());
          if (services && services.length > 0) {
            response.push(
              responses.service,
              services.map(service => 
                <ActionButton key={service.id} onClick={() => setNewBookingService(service)}>
                  {service.name} - ${service.price}
                </ActionButton>
              )
            );
          } else {
            response.push(responses.serviceError);
          }
        } catch (error) {
          console.error(error);
          response.push(responses.serviceError);
        }
        return response;
      }

      if (!newBookingStaff) {
        try {
          const staff = await fetch(`/api/staff?salonId=${newBookingSalon.id}&serviceId=${newBookingService.id}`).then(res => res.json());
          if (staff && staff.length > 0) {
            response.push(
              responses.staff,
              staff.map(stylist => 
                <ActionButton key={stylist.id} onClick={() => setNewBookingStaff(stylist)}>
                  {stylist.name}
                </ActionButton>
              )
            );
          } else {
            response.push(responses.staffError);
          }
        } catch (error) {
          console.error(error);
          response.push(responses.staffError);
        }
        return response;
      }

      if (!newBookingDate) {
        try {
          const availableDates = generateAvailableDates();

          if (availableDates.length > 0) {
            response.push(
              responses.date,
              availableDates.map(date => 
                <ActionButton key={date.toISOString()} onClick={() => setNewBookingDate(date.toISOString().split('T')[0])}>
                  {date.toLocaleDateString()}
                </ActionButton>
              )
            );
          } else {
            response.push(responses.dateError);
          }
        } catch (error) {
          console.error(error);
          response.push(responses.dateError);
        }
        return response;
      }

      if (!newBookingTime) {
        try {
          const appointments = await fetch(`/api/appointments?staffId=${newBookingStaff.id}&date=${newBookingDate}`).then(res => res.json());
          const selectedDate = new Date(newBookingDate);
          const availableTimes = generateTimeSlots(selectedDate);
          
          const filteredTimes = availableTimes.filter(time => 
            isTimeSlotAvailable(time, newBookingService, newBookingStaff, appointments)
          );

          if (filteredTimes.length > 0) {
            response.push(
              responses.time,
              filteredTimes.map(time => 
                <ActionButton key={time.toISOString()} onClick={() => setNewBookingTime(time)}>
                  {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </ActionButton>
              )
            );
          } else {
            response.push(responses.timeError);
          }
        } catch (error) {
          console.error(error);
          response.push(responses.timeError);
        }
        return response;
      }

      if (!newBookingEmail && !email) {
        response.push(responses.email);
        return response;
      }

      if( email ) {
        setNewBookingEmail(email[0]);
        response.push(
          `Great! Here's a summary of your booking:\n` +
          `Salon: ${newBookingSalon.name}\n` +
          `Service: ${newBookingService.name}\n` + 
          `Stylist: ${newBookingStaff.name}\n` +
          `Date: ${new Date(newBookingDate).toLocaleDateString()}\n` +
          `Time: ${new Date(newBookingTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}\n` +
          `Email: ${email}\n` 
        );
        response.push(
          responses.confirmBooking
        );
        return response;
      }

      if( confirm ) {
        try {
          setIsRedirecting(true);
          // Create or retrieve customer first
          const customerResponse = await fetch('/api/customers', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              email: newBookingEmail
            })
          });

          if (!customerResponse.ok) {
            throw new Error('Failed to create/retrieve customer');
          }

          const customerData = await customerResponse.json();

          const endTime = new Date(newBookingTime);
          endTime.setMinutes(endTime.getMinutes() + newBookingService.duration)

          // Create Stripe checkout session
          const checkoutSession = await fetch('/api/create-checkout-session', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              appointmentDate: newBookingDate,
              appointmentStartTime: new Date(newBookingTime),
              appointmentEndTime: endTime,
              serviceId: newBookingService.id,
              serviceName: newBookingService.name,          
              servicePrice: newBookingService.price,
              staffId: newBookingStaff.id,
              staffName: newBookingStaff.name,
              salonId: newBookingSalon.id,
              salonName: newBookingSalon.name,
              customerId: customerData.id,
              customerEmail: customerData.email,
              customerName: customerData.name || 'Guest',
              notes: 'Booked via chatbot'
            }),
          });            

          const { sessionId, error } = await checkoutSession.json();

          if (error) {
            throw new Error('Failed to create checkout session');
          }

          response.push(
            responses.confirmBookingSuccess
          );

          // Redirect to Stripe Checkout
          const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);
          const { error: stripeError } = await stripe.redirectToCheckout({
            sessionId,
          });

          if (stripeError) {
            throw new Error(stripeError.message);
          }

          // Reset booking state
          setAction(null);
          setActionConfirmed(false);
          setNewBookingSalon(null);
          setNewBookingService(null);
          setNewBookingStaff(null);
          setNewBookingDate(null);
          setNewBookingTime(null);
          setNewBookingEmail(null);
        } catch (error) {
          console.error(error);
          setIsRedirecting(false);
          response.push(responses.confirmError);
        }
        return response;
      }
      return response;
    }

    if( ['confirm', 'cancel', 'reschedule'].includes(action) && (yes || actionConfirmed) ) {
      if (!bookingRef && !existingBooking) {
        response.push(responses.bookingRef);
        return response;
      }

      if( bookingRef ) {
        let booking = null;
        try {
          booking = await fetch(`/api/appointments/${bookingRef}`).then(res => res.json());
        } catch (error) {
          console.error(error);
        }
        if (!booking || booking.error) {
          response.push(responses.bookingNotFound);
        } else {
          setExistingBooking(booking);
          response.push(...[
            `I found your booking. \n Booking ID: ${booking.id} \n Date: ${new Date(booking.date).toLocaleDateString()} \n Time: ${new Date(booking.startTime).toLocaleTimeString()} \n Service: ${booking.service.name} \n Stylist: ${booking.staff.name}`
          ]);

          if( action === 'cancel' ) {
            response.push(responses.confirmCancel);
          } else if( action === 'reschedule' ) {
            response.push(responses.confirmReschedule);
          } else {
            setExistingBooking(null);
            setAction(null);
            setActionConfirmed(false);
          }
        }
        return response;
      }

      if( action === 'cancel' && existingBooking && confirm ) {
        try{
          await fetch(`/api/appointments/${existingBooking.id}`, {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json'
            }
          });
          response.push(responses.cancelSuccess);
          setExistingBooking(null);
          setAction(null);
          setActionConfirmed(false);
        } catch (error) {
          console.error(error);
          response.push(responses.cancelError);
        }
        return response;
      }

      if( action === 'reschedule' && existingBooking && confirm ) {
        response.push(responses.rescheduleFirst);
        try{
          await fetch(`/api/appointments/${existingBooking.id}`, {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json'
            }
          });
          response.push(responses.cancelSuccess);
          setExistingBooking(null);
          setAction(null);
          setActionConfirmed(false);
        } catch (error) {
          console.error(error);
          response.push(responses.cancelError);
        }
        response.push(responses.rescheduleSuccess);
        return response;
      }
    }

    if( cancel ) {
      setAction('cancel');
      response.push(
        responses.cancel,
      );
      return response;
    }

    if( reschedule ) {
      setAction('reschedule');
      response.push(
        responses.reschedule,
      );
      return response;
    }

    if( confirm ) {
      setAction('confirm');
      response.push(
        responses.confirm,
      );
      return response;
    }

    if( book ) {
      setAction('book');
      response.push(
        responses.book,
      );
      return response;
    }

    if( price ) {
      response.push(
        responses.price
      );
      return response;
    }

    return [responses.default];
  }
  return (
    <ChatContainer>
      {isRedirecting && (
        <LoadingOverlay>
          <LoadingSpinner />
          <LoadingText>
            Preparing your secure payment page...
            <br />
            Please don't close this window.
          </LoadingText>
        </LoadingOverlay>
      )}
      {isOpen && (
        <ChatWindow>
          <ChatHeader>
            Sparebace Assistant
            <CloseButton onClick={() => setIsOpen(false)}>✕</CloseButton>
          </ChatHeader>
          <ChatMessages>
            {messages.map((message, index) => (
              <Message key={index} $isUser={message.isUser}>
                {typeof message.body === 'string' ? message.body.split('\n').map((line, i) => (
                  <Fragment key={i}>
                    {line}
                    {i < message.body.split('\n').length - 1 && <br />}
                  </Fragment>
                )) : message.body}
              </Message>
            ))}
            {isTyping && (
              <Message $isUser={false}>
                Typing...
              </Message>
            )}
            <div ref={messagesEndRef} />
          </ChatMessages>
          <ChatInput>
            <MicButton
              onClick={handleVoiceInput}
              $isListening={isListening}
              title={isListening ? 'Stop listening' : 'Start voice input'}
            >
              {isListening ? (
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <rect x="6" y="6" width="12" height="12" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/>
                  <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/>
                </svg>
              )}
            </MicButton>
            <Input
              ref={inputRef}
              type="text"
              placeholder="Type your message..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            />
            <SendButton
              onClick={() => handleSend()}
              disabled={!inputValue.trim() || isTyping}
            >
              Send
            </SendButton>
          </ChatInput>
        </ChatWindow>
      )}
      <ChatButton onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? '✕' : '💬'}
      </ChatButton>
    </ChatContainer>
  )
} 