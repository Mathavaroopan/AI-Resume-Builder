import Header from '@/components/ui/custom/Header'
import { UserButton } from '@clerk/clerk-react'
import React from 'react'

export const Home = () => {
  return (
    <div>
      <Header />
      <UserButton />
    </div>
  )
}


