import React from 'react'

const Education = ({resumeInfo}) => {
  return (
    <div>
    <h2 className='font-bold text-lg my-4 text-center' style={{color: resumeInfo?.themeColor}}>Education</h2>
    <hr  className='border-[1.5px] my-4' style={{borderColor: resumeInfo?.themeColor}}/>
    {resumeInfo?.education.map((val, ind) => (
      <div key={ind} className='my-4'>
          <h2 className='text-lg font-bold' style={{color: resumeInfo?.themeColor}}>{val.universityName}</h2>
          <div className='flex justify-between'>
              <h2 className='text-sm font-medium'>{val.degree} in {val.major}</h2>
              <span className='text-sm font-medium'>{val.startDate} - {val.endDate}</span>
          </div>
          <div
            className='text-sm my-2'
            style={{
              maxWidth: '100%', // Or any specific width you prefer
              overflowWrap: 'break-word', // Break words if necessary to prevent overflow
              wordBreak: 'break-word', // Ensure long words break
            }}
            dangerouslySetInnerHTML={{ __html: val?.description }}
          ></div>

      </div>
    ))}
    </div>
  )
}

export default Education
