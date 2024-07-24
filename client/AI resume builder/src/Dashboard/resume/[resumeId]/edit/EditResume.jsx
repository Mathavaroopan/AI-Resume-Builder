import React, { useEffect, useState } from 'react'
import FormSection from './components/FormSection'
import ResumePreview from './components/ResumePreview'
import { ResumeInfoContext } from '@/context/ResumeInfoContext'
import dummy from '@/data/dummy'

const EditResume = () => {
    const [resumeInfo, setResumeInfo] = useState(null);
    useEffect(() => {
        setResumeInfo(dummy);
    }, [])
  return (
    <div className='grid grid-cols-2 p-10 gap-10'>
      <ResumeInfoContext.Provider value={{resumeInfo, setResumeInfo}}>
        <FormSection />
        <ResumePreview />
      </ResumeInfoContext.Provider>
    </div>
  )
}

export default EditResume