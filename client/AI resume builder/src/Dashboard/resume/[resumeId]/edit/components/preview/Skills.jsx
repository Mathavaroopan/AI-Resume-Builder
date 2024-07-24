import React from 'react'

const Skills = ({resumeInfo}) => {
  return (
    <div>
    <h2 className='font-bold text-lg my-4 text-center' style={{color: resumeInfo?.themeColor}}>Skills</h2>
    <hr  className='border-[1.5px] my-4' style={{borderColor: resumeInfo?.themeColor}}/>
    <div className='grid grid-cols-2 gap-6'>
        {resumeInfo?.skills.map((val, ind) => (
        <div key={ind} className='flex justify-between items-center'>
            <h2 className='text-sm font-medium'>{val.name}</h2>
            <div className='h-2 bg-gray-200 w-[120px]'>
                <div style={{backgroundColor: resumeInfo?.themeColor, width: val?.rating*20 + '%'}} className='h-2'></div>
            </div>
        </div>
        ))}
    </div>
    </div>
  )
}

export default Skills
