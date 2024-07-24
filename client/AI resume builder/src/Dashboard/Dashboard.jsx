import React from 'react'
import AddResume from './components/AddResume'
import ResumeCard from './components/ResumeCard'

const Dashboard = () => {
  return (
    <div className='p-10 md:px-20 lg:px-32'>
      <h2 className='font-bold text-3xl'>My Resumes</h2>
      <p>Start creating AI resumes for your next job roles</p>
      <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 mt-10 gap-5'>
        <AddResume />
        <ResumeCard resume={null}/>
      </div>
    </div>
  )
}

export default Dashboard
