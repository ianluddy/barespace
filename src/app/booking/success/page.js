'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import styled from 'styled-components'
import Link from 'next/link'

const Container = styled.div`
  max-width: 600px;
  margin: 8rem auto 2rem;
  padding: 2rem;
  text-align: center;
  min-height: 50vh;
`

const SuccessIcon = styled.div`
  width: 80px;
  height: 80px;
  margin: 0 auto 2rem;
  background: var(--success);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 2.5rem;
`

const Title = styled.h1`
  color: var(--text-primary);
  margin-bottom: 1rem;
`

const Message = styled.p`
  color: var(--text-secondary);
  margin-bottom: 2rem;
`

const Button = styled(Link)`
  display: inline-block;
  padding: 0.75rem 1.5rem;
  background: var(--primary);
  color: white;
  border-radius: 4px;
  text-decoration: none;
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.9;
    text-decoration: none;
  }
`

export default function Success() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get('session_id')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [appointment, setAppointment] = useState(null)

  useEffect(() => {
    if (sessionId) {
      fetch(`/api/verify-payment?session_id=${sessionId}`)
        .then(res => res.json())
        .then(data => {
          if (data.error) {
            setError(data.error)
          } else {
            setAppointment(data.appointment)
          }
        })
        .catch(err => {
          setError('Failed to verify payment')
          console.error(err)
        })
        .finally(() => {
          setLoading(false)
        })
    }
  }, [sessionId])

  if (loading) {
    return (
      <Container>
        <Title>Processing...</Title>
        <Message>Please wait while we confirm your payment.</Message>
      </Container>
    )
  }

  if (error) {
    return (
      <Container>
        <Title>Oops!</Title>
        <Message>{error}</Message>
        <Button href="/book">Try Again</Button>
      </Container>
    )
  }

  return (
    <Container>
      <SuccessIcon>✓</SuccessIcon>
      <Title>Payment Successful!</Title>
      <Message>
        Thank you for your booking. We've sent a confirmation email with your appointment details.
      </Message>
      {appointment && (
        <Message>
          Your appointment reference is: {appointment.id}
        </Message>
      )}
      <Button href="/">Return Home</Button>
    </Container>
  )
} 