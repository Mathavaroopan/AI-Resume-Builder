import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import React, { useContext, useEffect, useState } from 'react';
import RichTextEditorEducation from '../RichTextEditorEducation'; // Ensure you have this component for education descriptions
import { ResumeInfoContext } from '@/context/ResumeInfoContext';
import { toast } from '@/components/ui/use-toast';
import { v4 as uuidv4 } from 'uuid';

const initialFormField = {
  id: uuidv4(),
  universityName: '',
  startDate: '',
  endDate: '',
  degree: '',
  major: '',
  description: ''
};

const EducationForm = ({ setNext }) => {
  const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext);
  const [educationList, setEducationList] = useState([{ ...initialFormField }]);

  useEffect(() => {
    console.log(resumeInfo);
    if (resumeInfo.education && resumeInfo.education.length > 0) {
      setEducationList(resumeInfo.education);
    } else {
      setEducationList([{ ...initialFormField }]);
    }
  }, []);

  const onSave = async (e) => {
    e.preventDefault();
    setNext(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/update-resume`, {
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
        title: "Education Details Updated",
        description: "Keep editing",
      });
    } catch (error) {
      console.error('Error updating resume:', error);
      toast({
        title: "Error",
        description: "Failed to update education details",
        variant: "destructive",
      });
    }
  };

  const handleChange = (index, event) => {
    const newEntries = educationList.slice();
    const { name, value } = event.target;
    newEntries[index][name] = value;
    setEducationList(newEntries);
  };

  const addEducation = () => {
    setEducationList([...educationList, { ...initialFormField, id: uuidv4() }]);
  };

  const removeEducation = () => {
    setEducationList(educationList => educationList.slice(0, -1));
  };

  const handleTextEditor = (event, index) => {
    const newEntries = educationList.slice();
    const { value } = event.target;
    newEntries[index]["description"] = value;
    setEducationList(newEntries);
    console.log(educationList);
  };

  useEffect(() => {
    setResumeInfo({
      ...resumeInfo,
      education: educationList
    });
  }, [educationList]);

  return (
    <div className='border-t-primary border-t-4 my-10 p-4 rounded-lg shadow-lg'>
      <h2 className='font-bold text-xl my-2'>Education Details</h2>
      <p>Add Your Education details</p>
      <div>
        {educationList.map((item, index) => (
          <div key={index}>
            <div className='grid grid-cols-2 gap-4 border my-5 rounded-lg p-6'>
              <div>
                <label className='text-sm font-medium mb-6'>University Name</label>
                <Input
                  name="universityName"
                  value={item.universityName}
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
              <div>
                <label className='text-sm font-medium mb-6'>Degree</label>
                <Input
                  name="degree"
                  value={item.degree}
                  onChange={e => handleChange(index, e)}
                />
              </div>
              <div>
                <label className='text-sm font-medium mb-6'>Major</label>
                <Input
                  name="major"
                  value={item.major}
                  onChange={e => handleChange(index, e)}
                />
              </div>
              <div className='col-span-2'>
                <RichTextEditorEducation
                  index={index}
                  value={item.description}
                  onTextChange={(e, idx) => handleTextEditor(e, idx)}
                  item={item}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className='flex justify-between'>
        <div className='flex gap-3'>
          <Button variant="outline" className="text-primary" onClick={removeEducation}>- Remove Education</Button>
          <Button variant="outline" className="text-primary" onClick={addEducation}>+ Add More Education</Button>
        </div>
        <Button onClick={onSave}>Save</Button>
      </div>
    </div>
  );
};

export default EducationForm;
