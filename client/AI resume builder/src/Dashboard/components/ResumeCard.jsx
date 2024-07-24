import { Notebook } from 'lucide-react'
import React from 'react'
import { Link } from 'react-router-dom'

const ResumeCard = ({resume}) => {
  console.log("In the resume card", resume);
  return (
    <Link to={`/dashboard/resume/${resume}/edit`}>
      <div className='p-14 bg-gradient-to-b from-pink-100 via-purple-200 to-blue-200 bg-secondary flex items-center justify-center h-[280px] border border-primary rounded-lg hover:scale-105 transition-all hover:shadow-md cursor-pointer shadow-primary'>
        <Notebook />
      </div>
    </Link>
  )
}

export default ResumeCard
