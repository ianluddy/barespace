'use client'

import styled from 'styled-components'
import Link from 'next/link'

const Container = styled.div`
  max-width: 600px;
  margin: 8rem auto 2rem;
  padding: 2rem;
  text-align: center;
  min-height: 50vh;
`

const CancelIcon = styled.div`
  width: 80px;
  height: 80px;
  margin: 0 auto 2rem;
  background: var(--error);
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

export default function Cancel() {
  return (
    <Container>
      <CancelIcon>×</CancelIcon>
      <Title>Payment Cancelled</Title>
      <Message>
        Your payment was cancelled and no charges were made.
        You can try booking again whenever you're ready.
      </Message>
      <Button href="/book">Try Again</Button>
    </Container>
  )
} 