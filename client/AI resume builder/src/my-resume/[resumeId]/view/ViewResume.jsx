import { Button } from '@/components/ui/button'
import Header from '@/components/ui/custom/Header'
import { ResumeInfoContext } from '@/context/ResumeInfoContext'
import ResumePreview from '@/Dashboard/resume/[resumeId]/edit/components/ResumePreview'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
function ViewResume() {

    const [resumeInfo,setResumeInfo]=useState();
    const {resumeId}=useParams();

    useEffect(() => {
        console.log(resumeId);
        const fetchData = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/get-resume-details`, {
                    params: {
                        resumeId: resumeId // Pass resumeId as a query parameter
                    }
                });
                setResumeInfo(response.data);
                console.log("Resume details fetched successfully");
            } catch (error) {
                console.error('Error fetching resume details:', error);
                // Handle error response, e.g., show an error message
            }
        };
    
        if (resumeId) {
            fetchData();
        }
    }, [resumeId]);

    const HandleDownload=()=>{
        window.print();
    }

  return (
    <ResumeInfoContext.Provider value={{resumeInfo,setResumeInfo}} >
        <div id="no-print">
        <Header/>

        <div className='my-10 mx-10 md:mx-20 lg:mx-36'>
            <h2 className='text-center text-2xl font-medium'>
                Congrats! Your Ultimate AI generates Resume is ready ! </h2>
                <p className='text-center text-gray-400'>Now you are ready to download your resume and you can share unique 
                    resume url with your friends and family </p>
            <div className='flex justify-between px-44 my-10'>
                <Button onClick={HandleDownload}>Download</Button>
            </div>
        </div>
            
        </div>
        <div className='md:mx-30 lg:mx-40'>
        <div id="print-area" >
                <ResumePreview/>
            </div>
            </div>
    </ResumeInfoContext.Provider>
  )
}

export default ViewResume