import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import React, { useContext, useEffect, useState } from 'react';
import { ResumeInfoContext } from '@/context/ResumeInfoContext';
import { Rating } from '@smastrom/react-rating';

import '@smastrom/react-rating/style.css';
import { toast } from '@/components/ui/use-toast';

const formField = {
  name: "",
  rating: 0
};

const SkillsForm = ({ setNext }) => {
  const [skillsList, setSkillsList] = useState([ { ...formField } ]);
  const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext);

  const onSave = async (e) => {
    e.preventDefault();
    setNext(true);

    try {
        const response = await fetch('http://localhost:3001/api/update-resume', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(resumeInfo),
        });

        if (!response.ok) {
            throw new Error('Failed to update resume');
        }

        const data = await response.json();
        toast({
            title: "Personal Details Updated",
            description: "Keep editing",
        });
    } catch (error) {
        console.error('Error updating resume:', error);
        toast({
            title: "Error",
            description: "Failed to update resume details",
            variant: "destructive",
        });
    }
};

  const handleChange = (index, name, value) => {
    const newEntries = skillsList.slice();
    newEntries[index][name] = value;
    setSkillsList(newEntries);
  };

  const addSkill = () => {
    setSkillsList([...skillsList, { ...formField }]);
  };

  const removeSkill = () => {
    setSkillsList(skillsList => skillsList.slice(0, -1));
  };

  useEffect(() => {
    setResumeInfo({
      ...resumeInfo,
      skills: skillsList
    });
  }, [skillsList]);

  return (
    <div className='border-t-primary border-t-4 my-10 p-4 rounded-lg shadow-lg'>
      <h2 className='font-bold text-xl my-2'>Skill Details</h2>
      <p>Add Your Skills</p>
      <div>
        {skillsList.map((item, index) => (
          <div key={index}>
            <div className='flex justify-between border rounded-lg p-5 my-2'>
              <div>
                <label className='text-sm font-medium mb-6'>Skill Name</label>
                <Input
                  name="name"
                  value={item.name}
                  onChange={e => handleChange(index, 'name', e.target.value)}
                  className="mt-3"
                />
              </div>
              <div>
                <label className='text-sm font-medium mb-6'>Expertise</label>
                <Rating
                  value={item.rating}
                  style={{ maxWidth: '120px' }}
                  className="mt-3"
                  onChange={value => handleChange(index, 'rating', value)}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className='flex justify-between'>
        <div className='flex gap-3'>
          <Button variant="outline" className="text-primary" onClick={removeSkill}>- Remove Skill</Button>
          <Button variant="outline" className="text-primary" onClick={addSkill}>+ Add More Skills</Button>
        </div>
        <Button onClick={onSave}>Save</Button>
      </div>
    </div>
  );
};

export default SkillsForm;
