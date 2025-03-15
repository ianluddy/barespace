'use client'

import { useState, useRef, useEffect } from 'react'
import styled from 'styled-components'

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

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([
    { text: "Hi! How can I help you today?", isUser: false }
  ])
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef(null)


  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const [email, setEmail] = useState("")
  const [bookingRef, setBookingRef] = useState("")
  const [booking, setBooking] = useState(null)
  const [action, setAction] = useState(null)

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = async () => {
    if (!inputValue.trim()) return

    // Add user message
    const userMessage = { text: inputValue, isUser: true }
    setMessages(prev => [...prev, userMessage])
    setInputValue("")
    setIsTyping(true)

    // Simulate bot response
    setTimeout(async () => {
      const responses = await getBotResponse(inputValue)
      const botMessages = responses.map(text => ({ text, isUser: false }))
      setMessages(prev => [...prev, ...botMessages])
      setIsTyping(false)
    }, 1000)
  }

  const getBotResponse = async (message) => {

    const response = [];
    message = message.toUpperCase();

    const bookingRefMatch = message.match(/BR[A-Z]{6}/);
    const messageBookingRef = bookingRefMatch ? bookingRefMatch[0].toUpperCase() : bookingRef;
    setBookingRef(messageBookingRef); // Set the booking reference for the session

    const emailMatch =  message.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
    const messageEmail = emailMatch ? emailMatch[0] : email;
    setEmail(messageEmail); // Set the email for the session

    console.log(messageEmail);
    console.log(messageBookingRef);

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
    if ( message.includes('CANCEL') || action === 'CANCEL') {
      setAction('CANCEL');
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
          `Are you sure you want to cancel booking ${booking.id}? \n\n If so, please confirm by typing 'yes'`,
        ]);
      }
    }

    // CONFIRM CANCEL
    if (message === 'YES' && action === 'cancel' && booking) {
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
    
    if (message.includes('BOOK') || message.includes('APPOINTMENT')) {
      response.push(...[
        "You can book an appointment by clicking the 'Book Your Appointment' button or visiting our booking page.",
        "Would you like me to help you with that?"
      ]);
    }

    if (message.includes('BOOK') || message.includes('APPOINTMENT')) {
      response.push(...[
        "You can book an appointment by clicking the 'Book Your Appointment' button or visiting our booking page.",
        "Would you like me to help you with that?"
      ]);
    }
    
    if (message.includes('PRICE') || message.includes('COST')) {
      response.push(...[
        "Our prices vary depending on the service. You can find detailed pricing information on our services page.",
        "Would you like me to show you our service menu?"
      ]);
    }
    
    if (message.includes('LOCATION') || message.includes('ADDRESS')) {
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
                {message.text.split("\n").map((i,key) => {
                  return <div key={key}>{i}</div>;
                })}
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