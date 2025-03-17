'use client'

import styled from 'styled-components'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const Header = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  padding: 1rem;
  background: var(--secondary);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  z-index: 1000;
`

const Nav = styled.nav`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const Logo = styled(Link)`
  font-size: 1.5rem;
  font-weight: bold;
  color: var(--text-primary);
  &:hover {
    text-decoration: none;
  }
`

const NavLinks = styled.div`
  display: flex;
  gap: 2rem;
  align-items: center;

  @media (max-width: 768px) {
    display: none;
  }
`

const NavLink = styled(Link)`
  color: var(--text-secondary);
  transition: color 0.2s;
  
  &:hover {
    color: var(--text-primary);
    text-decoration: none;
  }
  
  &.active {
    color: var(--primary);
  }
`

const BookButton = styled(Link)`
  background: var(--primary);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  transition: opacity 0.2s;
  
  &:hover {
    opacity: 0.9;
    text-decoration: none;
  }
`

export default function Navigation() {
  const pathname = usePathname()

  return (
    <Header>
      <Nav>
        <Logo href="/">SPAREBACE</Logo>
        <NavLinks>
          <NavLink href="/services" className={pathname === '/services' ? 'active' : ''}>Our Services</NavLink>
          <NavLink href="/staff" className={pathname === '/staff' ? 'active' : ''}>Our Team</NavLink>
          <NavLink href="/salons" className={pathname === '/salons' ? 'active' : ''}>Our Salons</NavLink>
          <BookButton href="/book" className={pathname === '/book' ? 'active' : ''}>Book Now</BookButton>
        </NavLinks>
      </Nav>
    </Header>
  )
} 