'use client'

import { useState, useRef, useEffect, Fragment } from 'react'
import styled from 'styled-components'
import { generateAvailableDates, generateTimeSlots, isTimeSlotAvailable } from '@/utils/dates'

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
  ${props => props.isUser ? `
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

const responses = {
  default: ['I\'m sorry, I didn\'t understand your request. Please choose from one of the following options: \n - Book \n - Confirm \n - Cancel \n - Reschedule'],
  booking: ['Sounds like you want to book an appointment. Would you like me to help you with that?'],
  cancel: ['Sounds like you want to cancel an appointment. Would you like me to help you with that?'],
  reschedule: ['Sounds like you want to reschedule an appointment. Would you like me to help you with that?'],
  confirm: ['Sounds like you want to confirm an appointment. Would you like me to help you with that?'],
  price: ['Our prices vary depending on the service. You can find detailed pricing information on our services page.'],
  salon: ['Here are our available salon locations. Please select one:'],
  service: ['Please select the service you\'d like to book:'],
  staff: ['Please select the stylist you\'d like to book:'],
  date: ['Please select the date you\'d like to book:'],
  time: ['Please select the time you\'d like to book:'],
  email: ['Please provide your email address for the booking confirmation.'],
  help: ['Ok let me help you with that.'],
  bookingRef: ['What is your booking reference number?'],
  confirmCancel: ['Are you sure you want to cancel booking ${booking.id}? \n If so, please confirm by typing \'yes\''],
  confirmReschedule: ['Are you sure you want to reschedule booking ${booking.id}? \n If so, please confirm by typing \'yes\''],
  confirmConfirm: ['Your booking is confirmed.'],
}

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([
    { body: "Hi! How can I help you today?", isUser: false }
  ])
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const [newBookingEmail, setNewBookingEmail] = useState("")
  const [newBookingDate, setNewBookingDate] = useState("")
  const [newBookingTime, setNewBookingTime] = useState("")
  const [newBookingService, setNewBookingService] = useState("")
  const [newBookingStaff, setNewBookingStaff] = useState("")
  const [newBookingSalon, setNewBookingSalon] = useState("")

    // const [bookingRef, setBookingRef] = useState("")
  const [booking, setBooking] = useState(null)
  const [action, setAction] = useState(null)


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
      handleSend(newBookingTime);
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
      setIsOpen(true);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

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
    }, 1000)
  }

  const getBotResponse = async (message) => {

    console.log(action);
    console.log(newBookingDate);
    console.log(newBookingTime);
    console.log(newBookingEmail);

    const response = [];
    message = message.toLowerCase();


    const bookingRef = message.match(/br[a-z]{6}/);
    const email = message.match(/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/);
    const date = message.match(/[0-9]{2}\/[0-9]{2}\/[0-9]{4}/);
    const time = message.match(/[0-9]{2}:[0-9]{2}/);
    // const service = message.match(/[a-z]+/);
    // const stylist = message.match(/[a-zA-Z]+/);
    const yes = message.match(/yes|ya|yeah|yup|yep/);
    const no = message.match(/no/);

    const reschedule = message.match(/reschedule/);
    const confirm = message.match(/confirm/);
    const cancel = message.match(/cancel/);
    const price = message.match(/price|cost/);
    const book = message.match(/book|make|create|schedule/);
    const restart = message.match(/start/);    

    if( restart ) {
      setAction(null);
      setNewBookingSalon(null);
      setNewBookingService(null);
      setNewBookingStaff(null);
      setNewBookingDate(null);
      setNewBookingTime(null);
      setNewBookingEmail(null);
      return ['Let\'s start over. What can I help you with?'];
    }

    if( booking && action && yes ) {
      console.log('booking', booking);
      console.log('action', action);
      console.log('yes', yes);
      return ['doing action'];
    }

    if( action && yes ) {
      response.push(
        responses.help
      );
      // if( ['confirm', 'cancel', 'reschedule'].includes(action) ) {
      //   response.push(
      //     'What is your booking reference number?'
      //   );
      // } else if( action === 'book' ) {
      //   response.push(
      //     'What is your email address???'
      //   );
      // }
      // return response;
    }

    if( action && no ) {
      response.push(
        responses.default
      );
      return response;
    }

    if (action === 'book' ) {
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
          response.push("I'm having trouble retrieving our salon locations. Please try again later.");
        }
        } catch (error) {
        console.error(error);
          response.push("Sorry, I couldn't fetch the salon locations. Please try again later.");
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
            response.push("I'm having trouble retrieving our services. Please try again later.");
          }
        } catch (error) {
          console.error(error);
          response.push("Sorry, I couldn't fetch the available services. Please try again later.");
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
            response.push("I'm having trouble retrieving available staff members for this service. Please try again later.");
          }
        } catch (error) {
          console.error(error);
          response.push("Sorry, I couldn't fetch the available staff members. Please try again later.");
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
            response.push("I'm having trouble finding available dates. Please try again later.");
          }
        } catch (error) {
          console.error(error);
          response.push("Sorry, I couldn't fetch the available dates. Please try again later.");
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
                <ActionButton key={time.toISOString()} onClick={() => setNewBookingTime(time.toTimeString().split(' ')[0])}>
                  {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </ActionButton>
              )
            );
          } else {
            response.push("I'm having trouble finding available time slots. Please try again later.");
          }
        } catch (error) {
          console.error(error);
          response.push("Sorry, I couldn't fetch the available time slots. Please try again later.");
        }
        return response;
      }
      console.log('email', email);

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
          `Time: ${new Date(`1970-01-01T${newBookingTime}`).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}\n` +
          `Email: ${email}\n` 
        );
        response.push(
          `Type 'confirm' to confirm your booking.`
        );
        return response;
      }

      if( confirm ) {
        try {
          const appointment = await fetch(`/api/appointments`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              salonId: newBookingSalon.id,
              serviceId: newBookingService.id,
              staffId: newBookingStaff.id,
              date: newBookingDate,
              startTime: newBookingTime,
              endTime: newBookingTime,
              email: newBookingEmail
            })
          });
          if( appointment ) {
            response.push(
              `Thanks! Your booking is confirmed. \n` +
              `Booking ID: ${appointment.id} \n` +
              `Date: ${new Date(appointment.date).toLocaleDateString()} \n` +
              `Time: ${new Date(appointment.startTime).toLocaleTimeString()} \n` +
              `Service: ${appointment.service.name} \n` +
              `Salon: ${appointment.salon.name} \n` +
              `Stylist: ${appointment.staff.name}` 
            );
            setAction(null);
            setNewBookingSalon(null);
            setNewBookingService(null);
            setNewBookingStaff(null);
            setNewBookingDate(null);
            setNewBookingTime(null);
            setNewBookingEmail(null);
          } else {
            response.push("I'm having trouble confirming your booking. Please try again later.");
          }
        } catch (error) {
          console.error(error);
          response.push("I'm having trouble confirming your booking. Please try again later.");
        }
      }

      
      // if( !newBookingEmail && !email ) {
      //   response.push(
      //     'What is your email address?'
      //   );
      // } else if (!newBookingDate && !date) {
      //   response.push(
      //     'What date would you like to book your appointment?'
      //   );
      // } else if (!newBookingTime && !time ) {
      //   response.push(
      //     'What time would you like to book your appointment?'
      //   );
      // }
      // if (email) {
      //   setNewBookingEmail(email[0]);
      // }
      // if (date) {
      //   setNewBookingDate(date[0]);
      // } 
      // if (time) {
      //   setNewBookingTime(time[0]);
      // }
      return response;
    }
    

    // if( ['confirm', 'cancel', 'reschedule'].includes(action) && bookingRef ) {
    //   response.push(
    //     'Let me check that for you...'
    //   );
    //   let fetchedBooking = null;
    //   try {
    //     fetchedBooking = await fetch(`/api/appointments/${bookingRef[0].toUpperCase()}`).then(res => res.json());
    //   } catch (error) {
    //     console.error(error);
    //   }
    //   if (!fetchedBooking || fetchedBooking.error) {
    //     response.push("I couldn't find a booking with that reference number. Please make sure you've entered it correctly.");
    //   } else {
    //     setBooking(fetchedBooking);
    //     response.push(...[
    //       `I found your booking. \n Booking ID: ${fetchedBooking.id} \n Date: ${new Date(fetchedBooking.date).toLocaleDateString()} \n Time: ${new Date(fetchedBooking.startTime).toLocaleTimeString()} \n Service: ${fetchedBooking.service.name} \n Stylist: ${fetchedBooking.staff.name}`,
    //     ]);
    //     if( action === 'cancel' ) {
    //       response.push(
    //         `Are you sure you want to cancel booking ${fetchedBooking.id}? \n If so, please confirm by typing 'yes'`
    //       );
    //     } else if( action === 'reschedule' ) {
    //       response.push(
    //         `Are you sure you want to reschedule booking ${fetchedBooking.id}? \n If so, please confirm by typing 'yes'`
    //       );
    //     } else if( action === 'confirm' ) {
    //       response.push(
    //         `Your booking is confirmed.`
    //       );
    //     }
    //   }
    //   return response;
    // }

    if( book ) {
      setAction('book');
      response.push(
        'Sounds like you want to book an appointment. Would you like me to help you with that?',
      );
      return response;
    }

    if( cancel ) {
      setAction('cancel');
      response.push(
        'Sounds like you want to cancel an appointment. Would you like me to help you with that?',
      );
      return response;
    }

    if( reschedule ) {
      setAction('reschedule');
      response.push(
        'Sounds like you want to reschedule an appointment. Would you like me to help you with that?',
      );
      return response;
    }

    if( confirm ) {
      setAction('confirm');
      response.push(
        'Sounds like you want to confirm an appointment. Would you like me to help you with that?',
      );
      return response;
    }

    if( price ) {
      response.push(
        'Our prices vary depending on the service. You can find detailed pricing information on our services page.',
      );
      return response;
    }

    // if( !action ) {
    //   return ['I\'m sorry, I didn\'t understand your request. Please choose from one of the following options: \n - Confirm \n - Cancel \n - Reschedule'];
    // }  

    return ['I\'m sorry, I didn\'t understand your request. Please choose from one of the following options: \n - Book \n - Confirm \n - Cancel \n - Reschedule'];

    if (message.includes('book') || message.includes('appointment')) {
      response.push(...[
        "You can book an appointment by clicking the 'Book Your Appointment' button or visiting our booking page.",
        "Would you like me to help you with that?"
      ]);
    }








    // const bookingRefMatch = message.match(/br[a-z]{6}/);
    // const messageBookingRef = bookingRefMatch ? bookingRefMatch[0] : bookingRef;
    // setBookingRef(messageBookingRef); // Set the booking reference for the session

    // const emailMatch =  message.match(/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/);
    // const messageEmail = emailMatch ? emailMatch[0] : email;
    // setEmail(messageEmail); // Set the email for the session

    // console.log(messageEmail);
    // console.log(messageBookingRef);

    // return response;

    // Retrieve my booking
    // Cancel my booking
    // Reschedule my booking

    // RETRIEVE BOOKING
    if (message.includes(messageBookingRef)) {
      let booking = null;
      try {
        booking = await fetch(`/api/appointments/${messageBookingRef}`).then(res => res.json());
      } catch (error) {
        console.error(error);
      }
      if (!booking || booking.error) {
        response.push("I couldn't find a booking with that reference number. Please make sure you've entered it correctly.");
      } else {
        setBooking(booking);
        response.push(...[
          `I found your booking. \n Booking ID: ${booking.id} \n Date: ${new Date(booking.date).toLocaleDateString()} \n Time: ${new Date(booking.startTime).toLocaleTimeString()} \n Service: ${booking.service.name} \n Stylist: ${booking.staff.name}`,
          `What would you like to do with this booking?`
        ]);
      }
    }

    // CANCEL BOOKING
    if ( message.includes('cancel') || action === 'cancel') {
      setAction('cancel');
      if( !booking ) {
        response.push(...[
          "Please provide your booking reference number in the format BRXXXXXX",
          "We will help you cancel or reschedule your appointment."
        ]);
      } else if (!messageEmail) {
        response.push(...[
          "Please provide your email address to confirm your booking cancellation.",
        ]);
      } else {
        response.push(...[
          `Are you sure you want to cancel booking ${booking.id}? \n If so, please confirm by typing 'yes'`,
        ]);
      }
    }

    // CONFIRM CANCEL
    if (message === 'yes' && action === 'cancel' && booking) {
      try{
        await fetch(`/api/appointments/${booking.id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json'
          }
        });
        setAction(null);
        setBooking(null);
        setEmail(null);
        setBookingRef(null);
        response.push("Booking cancelled successfully.");
      } catch (error) {
        console.error(error);
        response.push("I couldn't cancel your booking. Please try again later.");
      }
    }

    // if (lowerMessage.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/)) {
    //   const booking = await fetch(`/api/appointments?email=${lowerMessage.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/)[0]}&next=true`).then(res => res.json());
    //   if (!booking || booking.error) {
    //     return ["I couldn't find any bookings for that email address. Please make sure you've entered the correct email."];
    //   }
    //   setBookingDetails({
    //     email: lowerMessage.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/)[0],
    //     id: booking.id,
    //     booking: booking
    //   });
    //   return [
    //     `I found your booking:`,
    //     `Booking ID: ${booking.id}`,
    //     `Date: ${new Date(booking.date).toLocaleDateString()}`,
    //     `Time: ${new Date(booking.startTime).toLocaleTimeString()}`,
    //     `Service: ${booking.service.name}`,
    //     `Stylist: ${booking.staff.name}`,
    //     `You can cancel or reschedule this appointment by providing the booking ID.`
    //   ];
    // }
    
    if (message.includes('book') || message.includes('appointment')) {
      response.push(...[
        "You can book an appointment by clicking the 'Book Your Appointment' button or visiting our booking page.",
        "Would you like me to help you with that?"
      ]);
    }

    if (message.includes('book') || message.includes('appointment')) {
      response.push(...[
        "You can book an appointment by clicking the 'Book Your Appointment' button or visiting our booking page.",
        "Would you like me to help you with that?"
      ]);
    }
    
    if (message.includes('price') || message.includes('cost')) {
      response.push(...[
        "Our prices vary depending on the service. You can find detailed pricing information on our services page.",
        "Would you like me to show you our service menu?"
      ]);
    }
    
    if (message.includes('location') || message.includes('address')) {
      response.push(...[
        "We have multiple salon locations. You can find all our locations and their details on our salons page.",
        "Would you like me to direct you there?"
      ]);
    }

    if( response.length === 0 ) {
      response.push(...[
        "I'm here to help!",
        "Feel free to ask about our services, locations, booking process, or anything else you'd like to know."
      ]);
    }

    return response;
  }

  console.log(messages);

  return (
    <ChatContainer>
      {isOpen && (
        <ChatWindow>
          <ChatHeader>
            Barespace Assistant
            <CloseButton onClick={() => setIsOpen(false)}>✕</CloseButton>
          </ChatHeader>
          <ChatMessages>
            {messages.map((message, index) => (
              <Message key={index} isUser={message.isUser}>
                {typeof message.body === 'string' ? message.body.split('\n').map((line, i) => (
                  <Fragment key={i}>
                    {line}
                    {i < message.body.split('\n').length - 1 && <br />}
                  </Fragment>
                )) : message.body}
              </Message>
            ))}
            {isTyping && (
              <Message isUser={false}>
                Typing...
              </Message>
            )}
            <div ref={messagesEndRef} />
          </ChatMessages>
          <ChatInput>
            <Input
              ref={inputRef}
              type="text"
              placeholder="Type your message..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            />
            <SendButton
              onClick={handleSend}
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