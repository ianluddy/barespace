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

const ServicesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
`

const ServiceCard = styled.div`
  background: var(--secondary);
  padding: 2rem 2rem 1.75rem 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  text-align: center;
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-5px);
  }
`

const ServiceTitle = styled.h3`
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: var(--text-primary);
`

const ServiceDescription = styled.p`
  color: var(--text-secondary);
  margin-bottom: 0.5rem;  
`

const ServicePrice = styled.p`
  font-weight: bold;
  color: var(--primary);
  font-size: 1.2rem;
  margin-bottom: 0.75rem;  
`

const ServiceDuration = styled.p`
  color: var(--text-secondary);
  font-size: 0.9rem;
  margin-bottom: 0.5rem;  
`

const BookButton = styled(Link)`
  display: inline-block;
  background: var(--primary);
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  text-decoration: none;
  font-weight: 500;
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.9;
    text-decoration: none;
  }
`

export default function Services() {
  const [services, setServices] = useState([])

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch('/api/services')
        const data = await response.json()
        setServices(data)
      } catch (error) {
        console.error('Error fetching services:', error)
      }
    }

    fetchServices()
  }, [])

  return (
    <Container>
      <PageHeader>
        <PageTitle>Our Services</PageTitle>
        <PageDescription>
          Discover our comprehensive range of hair care services, from classic cuts to modern styling.
          Each service is tailored to meet your unique needs and preferences.
        </PageDescription>
      </PageHeader>

      <ServicesGrid>
        {services.map((service) => (
          <ServiceCard key={service.id}>
            <ServiceTitle>{service.name}</ServiceTitle>
            <ServiceDescription>{service.description}</ServiceDescription>
            <ServiceDuration>{service.duration} minutes</ServiceDuration>
            <ServicePrice>${service.price}</ServicePrice>
            <BookButton href={`/book?service=${service.id}`}>
              Book Now
            </BookButton>
          </ServiceCard>
        ))}
      </ServicesGrid>
    </Container>
  )
} 