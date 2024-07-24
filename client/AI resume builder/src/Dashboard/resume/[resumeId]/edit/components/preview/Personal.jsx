import React from 'react'

const Personal = ({resumeInfo}) => {
  return (
    <div>
      <h2 className='font-bold text-xl text-center' style={{color: resumeInfo?.themeColor}}>{resumeInfo?.firstName} {resumeInfo?.lastName}</h2>
      <h2 className='font-medium text-md text-center'>{resumeInfo?.jobTitle}</h2>
      <h2 className='font-normal text-sm text-center' style={{color: resumeInfo?.themeColor}}>{resumeInfo?.address}</h2>
        <div className='flex justify-between'>
        <h2 className='font-normal text-sm' style={{color: resumeInfo?.themeColor}}>{resumeInfo?.phone}</h2>
        <h2 className='font-normal text-sm' style={{color: resumeInfo?.themeColor}}>{resumeInfo?.email}</h2>
        </div>
        <hr  className='border-[1.5px] my-4' style={{borderColor: resumeInfo?.themeColor}}/>
    </div>
  )
}

export default Personal
