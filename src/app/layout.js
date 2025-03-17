import { GeistSans } from 'geist/font'
import { GeistMono } from 'geist/font'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import ChatBot from '@/components/ChatBot'
import './globals.css'

export const metadata = {
  title: 'Sparebace',
  description: 'Premium hair care experience',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${GeistSans.variable} ${GeistMono.variable}`}>
        <Navigation />
        {children}
        <ChatBot />
        <Footer />
      </body>
    </html>
  )
}
