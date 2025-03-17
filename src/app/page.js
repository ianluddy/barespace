'use client'

import { useState, useEffect } from 'react'
import styled from 'styled-components'
import Link from 'next/link'

const Container = styled.div`
  min-height: 100vh;
  background: var(--background);
  display: flex;
  flex-direction: column;
  margin: 0;
`

const Hero = styled.section`
  min-height: 100vh;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  background: linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)),
              url('/sparebace.jpg') center/cover;
  color: var(--text-primary);
  margin-bottom: 4rem;
  
`

const HeroContent = styled.div`
  max-width: 800px;
  padding: 0 2rem;
  z-index: 1;
`

const HeroTitle = styled.h1`
  font-size: 4rem;
  margin-bottom: 1rem;
  font-weight: bold;
  color: var(--text-primary);
`

const HeroSubtitle = styled.p`
  font-size: 1.5rem;
  margin-bottom: 2rem;
  color: var(--text-secondary);
`

const CTAButton = styled(Link)`
  background: var(--primary);
  color: white;
  padding: 1rem 2rem;
  border-radius: 4px;
  text-decoration: none;
  font-weight: 500;
  font-size: 1.1rem;
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.9;
    text-decoration: none;
  }
`

const CardButton = styled(Link)`
  display: inline-block;
  background: var(--primary);
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  text-decoration: none;
  font-weight: 500;
  font-size: 1rem;
  transition: opacity 0.2s;
  margin-top: 1rem;

  &:hover {
    opacity: 0.9;
    text-decoration: none;
  }
`

const Section = styled.section`
  padding: 4rem 2rem;
  background: var(--background);
`

const SectionTitle = styled.h2`
  font-size: 2.5rem;
  text-align: center;
  margin-bottom: 3rem;
  color: var(--text-primary);
`

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`

const Card = styled.div`
  background: var(--secondary);
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-5px);
  }
`

const CardImage = styled.div`
  height: 200px;
  background: ${props => `url(${props.image || '/placeholder.jpg'}) center/cover`};
`

const CardContent = styled.div`
  padding: 1.5rem;
`

const CardTitle = styled.h3`
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
  color: var(--text-primary);
`

const CardDescription = styled.p`
  color: var(--text-secondary);
  margin-bottom: 1rem;
`

const CardPrice = styled.p`
  font-size: 1.25rem;
  color: var(--primary);
  font-weight: bold;
`

export default function Home() {
  const [services, setServices] = useState([])
  const [salons, setSalons] = useState([])
  const [staff, setStaff] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [servicesRes, salonsRes, staffRes] = await Promise.all([
          fetch('/api/services'),
          fetch('/api/salons'),
          fetch('/api/staff')
        ])

        const [servicesData, salonsData, staffData] = await Promise.all([
          servicesRes.json(),
          salonsRes.json(),
          staffRes.json()
        ])

        setServices(servicesData)
        setSalons(salonsData)
        setStaff(staffData)
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }

    fetchData()
  }, [])

  return (
    <Container>
      <Hero>
        <HeroContent>
          <HeroTitle>Premium Hair Care Experience</HeroTitle>
          <HeroSubtitle>
            Experience the perfect blend of traditional barbering and modern styling
          </HeroSubtitle>
          <CTAButton href="/book">Book Your Appointment</CTAButton>
        </HeroContent>
      </Hero>

      <Section>
        <SectionTitle>Our Services</SectionTitle>
        <Grid>
          {services.map(service => (
            <Card key={service.id}>
              <CardContent>
                <CardTitle>{service.name}</CardTitle>
                <CardDescription>{service.description}</CardDescription>
                <CardPrice>${service.price}</CardPrice>
                <CardDescription>{service.duration} minutes</CardDescription>
                <CardButton href={`/book?service=${service.id}`}>Book Now</CardButton>
              </CardContent>
            </Card>
          ))}
        </Grid>
      </Section>

      <Section>
        <SectionTitle>Our Salons</SectionTitle>
        <Grid>
          {salons.map(salon => (
            <Card key={salon.id}>
              <CardImage image={salon.imageUrl} />
              <CardContent>
                <CardTitle>{salon.name}</CardTitle>
                <CardDescription>{salon.address}</CardDescription>
                <CardDescription>📞 {salon.phone}</CardDescription>
                <CardDescription>✉️ {salon.email}</CardDescription>
                <CardButton href={`/book?salon=${salon.id}`}>Book at this Salon</CardButton>
              </CardContent>
            </Card>
          ))}
        </Grid>
      </Section>

      <Section>
        <SectionTitle>Our Staff</SectionTitle>
        <Grid>
          {staff.map(member => (
            <Card key={member.id}>
              <CardImage image={member.imageUrl} />
              <CardContent>
                <CardTitle>{member.name}</CardTitle>
                <CardDescription>{member.title}</CardDescription>
                <CardButton href={`/book?staff=${member.id}`}>Book with {member.name}</CardButton>
              </CardContent>
            </Card>
          ))}
        </Grid>
      </Section>
    </Container>
  )
}

