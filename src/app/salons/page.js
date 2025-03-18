'use client'

import { useState, useEffect } from 'react'
import styled from 'styled-components'
import Link from 'next/link'

const Container = styled.div`
  min-height: 100vh;
  padding: 2rem;
  background: var(--background);
  display: flex;
  flex-direction: column;
`

const PageHeader = styled.div`
  text-align: center;
  max-width: 800px;
  margin: 80px auto 3rem;
  padding: 0 1rem;
`

const PageTitle = styled.h1`
  font-size: 2.5rem;
  color: var(--text-primary);
  margin-bottom: 1rem;
`

const PageDescription = styled.p`
  font-size: 1.1rem;
  color: var(--text-secondary);
  line-height: 1.6;
  margin-bottom: 2rem;
`

const SalonsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
  
  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
    padding: 0 0.5rem;
  }
`

const SalonCard = styled.div`
  background: var(--secondary);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  transition: transform 0.2s;
  
  &:hover {
    transform: translateY(-4px);
  }
`

const SalonImage = styled.div`
  width: 100%;
  height: 200px;
  position: relative;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  @media (max-width: 768px) {
    height: 180px;
  }
`

const SalonInfo = styled.div`
  padding: 1.5rem;
  
  @media (max-width: 768px) {
    padding: 1rem;
  }
`

const SalonName = styled.h3`
  font-size: 1.5rem;
  color: var(--text-primary);
  margin-bottom: 0.5rem;
  
  @media (max-width: 768px) {
    font-size: 1.25rem;
  }
`

const SalonAddress = styled.p`
  color: var(--text-secondary);
  margin-bottom: 1rem;
`

const SalonContact = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1rem;
  padding: 1rem 0;
  border-top: 1px solid var(--border);
  border-bottom: 1px solid var(--border);
`

const ContactInfo = styled.p`
  color: var(--text-secondary);
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  svg {
    color: var(--primary);
  }
`

const SalonDescription = styled.p`
  color: var(--text-secondary);
  margin-bottom: 1.5rem;
`

const BookButton = styled(Link)`
  display: inline-block;
  background: var(--primary);
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  transition: opacity 0.2s;
  
  &:hover {
    opacity: 0.9;
    text-decoration: none;
  }
  
  @media (max-width: 768px) {
    display: block;
    text-align: center;
    padding: 1rem;
  }
`

const ErrorMessage = styled.div`
  color: #ff4444;
  background: rgba(255, 68, 68, 0.1);
  padding: 1rem;
  border-radius: 4px;
  margin: 2rem auto;
  max-width: 600px;
  text-align: center;
`

export default function Salons() {
  const [salons, setSalons] = useState([])
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchSalons = async () => {
      try {
        const response = await fetch('/api/salons')
        if (!response.ok) {
          throw new Error('Failed to fetch salons')
        }
        const data = await response.json()
        setSalons(data)
      } catch (err) {
        setError(err.message)
      }
    }

    fetchSalons()
  }, [])

  if (error) {
    return (
      <Container>
        <ErrorMessage>Error: {error}</ErrorMessage>
      </Container>
    )
  }

  return (
    <Container>
      <PageHeader>
        <PageTitle>Our Salons</PageTitle>
        <PageDescription>
          Visit any of our three locations to experience our premium hair care services.
          Each salon is staffed with experienced professionals ready to help you achieve your desired look.
        </PageDescription>
      </PageHeader>

      <SalonsGrid>
        {salons.map((salon) => (
          <SalonCard key={salon.id}>
            <SalonImage>
              <img src={salon.imageUrl} alt={salon.name} />
            </SalonImage>
            <SalonInfo>
              <SalonName>{salon.name}</SalonName>
              <SalonAddress>{salon.address}</SalonAddress>
              <SalonContact>
                <ContactInfo>📞 {salon.phone}</ContactInfo>
                <ContactInfo>✉️ {salon.email}</ContactInfo>
              </SalonContact>
              <SalonDescription>{salon.description}</SalonDescription>
              <BookButton href={`/book?salon=${salon.id}`}>
                Book Appointment
              </BookButton>
            </SalonInfo>
          </SalonCard>
        ))}
      </SalonsGrid>
    </Container>
  )
} 