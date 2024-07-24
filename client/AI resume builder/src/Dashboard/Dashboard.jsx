import React, { useEffect, useState } from 'react'
import AddResume from './components/AddResume'
import ResumeCard from './components/ResumeCard'
import { useUser } from '@clerk/clerk-react'
import axios from 'axios'

const Dashboard = () => {
  const { user } = useUser();
  const [resumeIds, setResumeIds] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.post('http://localhost:3001/api/get-resume-ids', {
          userEmail: user?.primaryEmailAddress?.emailAddress
        });
        setResumeIds(response.data);
        console.log("Resume IDs fetched successfully");
      } catch (error) {
        console.error('Error fetching resume IDs:', error);
        // Handle error response, e.g., show an error message
      }
    }

    if (user?.primaryEmailAddress?.emailAddress) {
      fetchData();
    }
  }, [user]);

  return (
    <div className='p-10 md:px-20 lg:px-32'>
      <h2 className='font-bold text-3xl'>My Resumes</h2>
      <p>Start creating AI resumes for your next job roles</p>
      <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 mt-10 gap-5'>
        <AddResume />
        {resumeIds.map(key => console.log(key.id))}
        {resumeIds.map((val) => (
          <ResumeCard resume={val.id} />
        ))}
      </div>
    </div>
  )
}

export default Dashboard
