import React from 'react'

const Summary = ({resumeInfo}) => {
  return (
    <p className='text-sm'>
        {resumeInfo?.summery}
    </p>      
  )
}

export default Summary
