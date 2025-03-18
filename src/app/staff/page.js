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

const StaffGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
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

const StaffCard = styled.div`
  background: var(--secondary);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-5px);
  }
`

const StaffImage = styled.div`
  height: 300px;
  background: var(--accent);
  background-image: url(${props => props.src || '/placeholder-staff.jpg'});
  background-size: cover;
  background-position: center;
`

const StaffInfo = styled.div`
  padding: 1.5rem;
  text-align: center;
`

const StaffName = styled.h3`
  font-size: 1.5rem;
  color: var(--text-primary);
  margin-bottom: 0.5rem;
`

const StaffTitle = styled.p`
  color: var(--primary);
  font-weight: 500;
  margin-bottom: 1rem;
`

const StaffServices = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  justify-content: center;
  margin-bottom: 1rem;
`

const ServiceTag = styled.span`
  background: var(--accent);
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.9rem;
  color: var(--text-secondary);
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
  margin-top: 1rem;

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

export default function Staff() {
  const [staff, setStaff] = useState([])

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const response = await fetch('/api/staff')
        const data = await response.json()
        setStaff(data)
      } catch (error) {
        console.error('Error fetching staff:', error)
      }
    }

    fetchStaff()
  }, [])

  return (
    <Container>
      <PageHeader>
        <PageTitle>Our Team</PageTitle>
        <PageDescription>
          Meet our talented team of professionals who are dedicated to providing you with the best hair care experience.
        </PageDescription>
      </PageHeader>

      <StaffGrid>
        {staff.map((member) => (
          <StaffCard key={member.id}>
            <StaffImage src={member.imageUrl} />
            <StaffInfo>
              <StaffName>{member.name}</StaffName>
              <StaffTitle>{member.title}</StaffTitle>
              <StaffServices>
                {member.services.map((service) => (
                  <ServiceTag key={service.id}>{service.name}</ServiceTag>
                ))}
              </StaffServices>
              <BookButton href={`/book?staff=${member.id}`}>
                Book with {member.name}
              </BookButton>
            </StaffInfo>
          </StaffCard>
        ))}
      </StaffGrid>
    </Container>
  )
} 