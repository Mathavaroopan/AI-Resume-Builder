import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import React, { useContext, useEffect, useState } from 'react';
import RichTextEditor from '../RichTextEditor';
import { ResumeInfoContext } from '@/context/ResumeInfoContext';

const initialFormField = {
  title: "",
  companyName: "",
  city: "",
  state: "",
  startDate: "",
  endDate: "",
  workSummery: ""
};

const ExperienceForm = ({ setNext }) => {
  const [experienceList, setExperienceList] = useState([{ ...initialFormField }]);
  const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext);

  const onSave = (e) => {
    e.preventDefault();
    setNext(true);
    toast({
      title: "Experience Details Updated",
      description: "Keep editing",
    });
  };

  const handleChange = (index, event) => {
    const newEntries = experienceList.slice();
    const { name, value } = event.target;
    newEntries[index][name] = value;
    setExperienceList(newEntries);
  };

  const addExperience = () => {
    setExperienceList([...experienceList, { ...initialFormField }]);
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
    console.log(experienceList);
  }, [experienceList]);

  return (
    <div className='border-t-primary border-t-4 my-10 p-4 rounded-lg shadow-lg'>
      <h2 className='font-bold text-xl my-2'>Professional Experience</h2>
      <p>Add Your Previous Job Experiences</p>
      <div>
        {experienceList.map((item, index) => (
          <div key={index}>
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
