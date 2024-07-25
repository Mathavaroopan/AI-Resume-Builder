import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import React, { useContext, useEffect, useState } from 'react';
import RichTextEditor from '../RichTextEditor';
import { ResumeInfoContext } from '@/context/ResumeInfoContext';
import { toast } from '@/components/ui/use-toast';
import { v4 as uuidv4 } from 'uuid';

const initialFormField = {
  id: uuidv4(),
  title: "",
  companyName: "",
  city: "",
  state: "",
  startDate: "",
  endDate: "",
  workSummery: ""
};

const ExperienceForm = ({ setNext }) => {
  const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext);
  const [experienceList, setExperienceList] = useState([{ ...initialFormField }]);

  useEffect(() => {
    console.log(resumeInfo);
    if (resumeInfo.experience && resumeInfo.experience.length > 0) {
      console.log("I'm here")
      setExperienceList(resumeInfo.experience);
      console.log(experienceList);
    } else {
      setExperienceList([{ ...initialFormField }]);
    }
    console.log(experienceList);
  }, []);

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

  const handleChange = (index, event) => {
    const newEntries = experienceList.slice();
    const { name, value } = event.target;
    newEntries[index][name] = value;
    setExperienceList(newEntries);
  };

  const addExperience = () => {
    setExperienceList([...experienceList, { ...initialFormField, id: uuidv4() }]);
  };

  const removeExperience = () => {
    setExperienceList(experienceList => experienceList.slice(0, -1));
  };

  const handleTextEditor = (event, index) => {
    const newEntries = experienceList.slice();
    const { value } = event.target;
    newEntries[index]["workSummery"] = value;
    setExperienceList(newEntries);
  };

  useEffect(() => {
    setResumeInfo({
      ...resumeInfo,
      experience: experienceList
    });
  }, [experienceList]);

  return (
    <div className='border-t-primary border-t-4 my-10 p-4 rounded-lg shadow-lg'>
      <h2 className='font-bold text-xl my-2'>Professional Experience</h2>
      <p>Add Your Previous Job Experiences</p>
      <div>
        {experienceList.map((item, index) => (
          <div key={item.id}>
            <div className='grid grid-cols-2 gap-4 border my-5 rounded-lg p-6'>
              <div>
                <label className='text-sm font-medium mb-6'>Position</label>
                <Input
                  name="title"
                  value={item.title}
                  onChange={e => handleChange(index, e)}
                />
              </div>
              <div>
                <label className='text-sm font-medium mb-6'>Company Name</label>
                <Input
                  name="companyName"
                  value={item.companyName}
                  onChange={e => handleChange(index, e)}
                />
              </div>
              <div>
                <label className='text-sm font-medium mb-6'>City</label>
                <Input
                  name="city"
                  value={item.city}
                  onChange={e => handleChange(index, e)}
                />
              </div>
              <div>
                <label className='text-sm font-medium mb-6'>State</label>
                <Input
                  name="state"
                  value={item.state}
                  onChange={e => handleChange(index, e)}
                />
              </div>
              <div>
                <label className='text-sm font-medium mb-6'>Start Date</label>
                <Input
                  type="date"
                  name="startDate"
                  value={item.startDate}
                  onChange={e => handleChange(index, e)}
                />
              </div>
              <div>
                <label className='text-sm font-medium mb-6'>End Date</label>
                <Input
                  type="date"
                  name="endDate"
                  value={item.endDate}
                  onChange={e => handleChange(index, e)}
                />
              </div>
              <div className='col-span-2'>
                <RichTextEditor
                  index={index}
                  value={item.workSummery}
                  onTextChange={e => handleTextEditor(e, index)}
                  item={item}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className='flex justify-between'>
        <div className='flex gap-3'>
          <Button variant="outline" className="text-primary" onClick={removeExperience}>- Remove Experience</Button>
          <Button variant="outline" className="text-primary" onClick={addExperience}>+ Add More Experience</Button>
        </div>
        <Button onClick={onSave}>Save</Button>
      </div>
    </div>
  );
};

export default ExperienceForm;
