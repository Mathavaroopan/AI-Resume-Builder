import React, { useEffect, useState } from 'react'
import FormSection from './components/FormSection'
import ResumePreview from './components/ResumePreview'
import { ResumeInfoContext } from '@/context/ResumeInfoContext'
import axios from 'axios'
import { useParams } from 'react-router-dom'

const EditResume = () => {
    const { resumeId } = useParams();  // Get resumeId from the URL params
    const [resumeInfo, setResumeInfo] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/get-resume-details`, {
                    params: {
                        resumeId: resumeId // Pass resumeId as a query parameter
                    }
                });
                console.log(response.data);
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

    return (
        <div className='grid grid-cols-2 p-10 gap-10'>
            <ResumeInfoContext.Provider value={{ resumeInfo, setResumeInfo }}>
                <FormSection />
                <ResumePreview />
            </ResumeInfoContext.Provider>
        </div>
    );
};

export default EditResume;
