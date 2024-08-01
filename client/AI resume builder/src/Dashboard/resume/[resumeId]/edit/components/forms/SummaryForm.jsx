import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { ResumeInfoContext } from '@/context/ResumeInfoContext';
import { Brain } from 'lucide-react';
import React, { useContext, useState } from 'react';
import { AIchatSession } from '../../../../../../../service/AIModel';
import { Input } from '@/components/ui/input';

const p = "I'm applying for the role job title: {jobTitle}. Give quick intro section for my resume focused on skills only in 4 lines";

const SummaryForm = ({ setNext }) => {
    const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext);
    const [summeryValue, setSummeryValue] = useState(resumeInfo?.summery);
    const [prompt, setPrompt] = useState("");
    
    const handleChange = (e) => {
        setNext(false);
        const { name, value } = e.target;
        setResumeInfo({
            ...resumeInfo,
            [name]: value
        });
        setSummeryValue(value);
    };

    const generateSummaryAI = async () => {
        let PROMPT = p.replace("{jobTitle}", resumeInfo?.jobTitle);
        PROMPT += prompt
        const result = await AIchatSession.sendMessage(PROMPT);
        const generatedSummary = await result.response.text();

        setSummeryValue(generatedSummary);
        setResumeInfo({
            ...resumeInfo,
            summery: generatedSummary
        });
    };

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
            <div>
                <h2 className='font-bold text-xl my-2'>Summary</h2>
                <p>Add A Summary For Your Job Title</p>
            </div>
            <div className='flex justify-between my-2 items-center gap-6'>
                    <Input placeholder={(prompt == "") ? "Give details to generate summary..." : prompt} onChange={e => setPrompt(e.target.value)}/>
                    <Button variant="outline" disabled={prompt == ""} className="text-primary flex gap-2 border-primary" onClick={generateSummaryAI}><Brain className='h-4 w-4'/> Generate From AI</Button>
                </div>
            <form onSubmit={onSave}>
                <textarea
                    name='summery'
                    onChange={handleChange}
                    className='w-[90%] m-8 h-100 border-2 border-primary'
                    value={summeryValue}  // Use value instead of defaultValue
                />
                <div className='col-span-2 flex justify-end'>
                    <Button type="submit">Save</Button>
                </div>
            </form>
        </div>
    );
};

export default SummaryForm;
