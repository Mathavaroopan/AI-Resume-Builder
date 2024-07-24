import React from 'react';

const Summary = ({ resumeInfo }) => {
  return (
    <div
      className='text-sm'
      style={{
        overflowWrap: 'break-word', // Break long words
        wordBreak: 'break-word', // Ensure long words break
      }}
    >
      {resumeInfo?.summery}
    </div>
  );
};

export default Summary;
