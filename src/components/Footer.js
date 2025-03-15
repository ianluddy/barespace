'use client'

import styled from 'styled-components'
import Link from 'next/link'

const Footer = styled.footer`
  background: var(--secondary);
  padding: 3rem 2rem;
  color: var(--text-secondary);
  margin-top: 5rem;
`

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
`

const FooterSection = styled.div`
  h3 {
    color: var(--text-primary);
    font-size: 1.2rem;
    margin-bottom: 1rem;
  }

  ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  li {
    margin-bottom: 0.5rem;
  }

  a {
    color: var(--text-secondary);
    text-decoration: none;
    transition: color 0.2s;

    &:hover {
      color: var(--primary);
    }
  }
`

const SocialLinks = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;

  a {
    color: var(--text-secondary);
    font-size: 1.5rem;
    transition: color 0.2s;

    &:hover {
      color: var(--primary);
    }
  }
`

const Copyright = styled.div`
  text-align: center;
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid var(--accent);
  color: var(--text-secondary);
`

export default function () {
  return (
    <Footer>
      <FooterContent>
        <FooterSection>
          <h3>Quick Links</h3>
          <ul>
            <li><Link href="/services">Services</Link></li>
            <li><Link href="/staff">Our Team</Link></li>
            <li><Link href="/salons">Our Salons</Link></li>
            <li><Link href="/book">Book Appointment</Link></li>
          </ul>
        </FooterSection>
        <FooterSection>
          <h3>Contact Us</h3>
          <ul>
            <li>📞 (555) 123-4567</li>
            <li>✉️ info@barespace.com</li>
            <li>📍 123 Main St, City, State</li>
            <li>⏰ Mon-Sat: 9am-7pm</li>
          </ul>
        </FooterSection>
        <FooterSection>
          <h3>Follow Us</h3>
          <SocialLinks>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">📸</a>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">👥</a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">🐦</a>
          </SocialLinks>
        </FooterSection>
      </FooterContent>
      <Copyright>
        © {new Date().getFullYear()} Barespace. All rights reserved.
      </Copyright>
    </Footer>
  )
} 