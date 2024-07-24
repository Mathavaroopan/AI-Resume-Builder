import { ResumeInfoContext } from '@/context/ResumeInfoContext'
import React, { useContext } from 'react'
import Personal from './preview/Personal';
import Summary from './preview/summary';
import Experience from './preview/Experience';
import Education from './preview/Education';
import Skills from './preview/Skills';

const ResumePreview = () => {
    const {resumeInfo, setResumeInfo} = useContext(ResumeInfoContext);
  
    return (
    <div className='border-t-[20px] h-full p-14 shadow-lg' style={{borderColor: resumeInfo?.themeColor}}> 
      <Personal resumeInfo={resumeInfo} />
      <Summary resumeInfo={resumeInfo} />
      <Experience resumeInfo={resumeInfo} />
      <Education resumeInfo={resumeInfo} />
      <Skills resumeInfo={resumeInfo} />
      </div>
  )
}

export default ResumePreview
