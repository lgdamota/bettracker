'use client'

import { AboutSection } from '@/components/about-section'
import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <AboutSection />
    </div>
  )
}
