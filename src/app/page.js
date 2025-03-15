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

const Hero = styled.section`
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  background: linear-gradient(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.8)),
              url('https://menspire.com/cdn/shop/files/HP_Banner_08_24_Final_180x.jpg?v=1724108376') center/cover;
  color: var(--text-primary);
  padding: 0 2rem;
  flex: 1;
`

const HeroContent = styled.div`
  max-width: 800px;
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

export default function Home() {
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
    </Container>
  )
}

