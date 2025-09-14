import axios from 'axios';
import { Notebook } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

const ResumeCard = ({resume}) => {
  const [name, setName] = useState("");
  useEffect(() => {
    const fetchData = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/get-resume-details`, {
                params: {
                    resumeId: resume
                }
            });
            console.log(response.data.jobTitle);
            setName(response.data.jobTitle);
            console.log(name);
            console.log("Resume details fetched successfully");
        } catch (error) {
            console.error('Error fetching resume details:', error);
        }
    };

    if (resume) {
        fetchData();
    }
}, [resume]);
  return (
    <Link to={`/dashboard/resume/${resume}/edit`}>
      <div className='p-14 bg-gradient-to-b from-pink-100 via-purple-200 to-blue-200 bg-secondary flex items-center justify-center h-[280px] border border-primary rounded-lg hover:scale-105 transition-all hover:shadow-md cursor-pointer shadow-primary'>
        <div className="flex flex-col justify-center items-center gap-4">
        <Notebook />
        <h3>{name}</h3>
        </div>
      </div>
    </Link>
  )
}

export default ResumeCard
