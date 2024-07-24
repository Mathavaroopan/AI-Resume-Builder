import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';
import { ResumeInfoContext } from '@/context/ResumeInfoContext';
import React, { useContext } from 'react';

const PersonalForm = ({ setNext }) => {
    const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext);

    const handleChange = (e) => {
        setNext(false);
        const { name, value } = e.target;
        setResumeInfo({
            ...resumeInfo,
            [name]: value
        });
    };

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

    return (
        <div className='border-t-primary border-t-4 my-10 p-4 rounded-lg shadow-lg'>
            <h2 className='font-bold text-xl my-2'>Personal Details</h2>
            <p>Get started with the basic details</p> 
            <form onSubmit={onSave}>
                <div className='grid grid-cols-2 gap-5 mt-10'>
                    <div>
                        <label className="text-md font-normal">First Name</label>
                        <Input name="firstName" required onChange={handleChange} defaultValue={resumeInfo?.firstName} />
                    </div>
                    <div>
                        <label className="text-md font-normal">Last Name</label>
                        <Input name="lastName" required onChange={handleChange} defaultValue={resumeInfo?.lastName} />
                    </div>
                    <div className='col-span-2'>
                        <label className="text-md font-normal">Job Title</label>
                        <Input name="jobTitle" required onChange={handleChange} defaultValue={resumeInfo?.jobTitle} />
                    </div>
                    <div className='col-span-2'>
                        <label className="text-md font-normal">Address</label>
                        <Input name="address" required onChange={handleChange} defaultValue={resumeInfo?.address} />
                    </div>
                    <div>
                        <label className="text-md font-normal">Phone</label>
                        <Input name="phone" required onChange={handleChange} defaultValue={resumeInfo?.phone} />
                    </div>
                    <div>
                        <label className="text-md font-normal">Email</label>
                        <Input name="email" required onChange={handleChange} defaultValue={resumeInfo?.email} />
                    </div>
                    <div className='col-span-2 flex justify-end'>
                        <Button type="submit">Save</Button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default PersonalForm;
