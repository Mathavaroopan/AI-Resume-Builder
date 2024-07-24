import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from '@/components/ui/use-toast'
import { ResumeInfoContext } from '@/context/ResumeInfoContext'
import { Brain } from 'lucide-react'
import React, { useContext } from 'react'
import { AIchatSession } from '../../../../../../../service/AIModel'

const prompt = "job title: {jobTitle} using mern stack. give summary for my resume focused on skills only in 4 lines"
const SummaryForm = ({setNext}) => {
    const {resumeInfo, setResumeInfo} = useContext(ResumeInfoContext);
    const handleChange = (e) => {
        setNext(false);
        const {name, value} = e.target;
        setResumeInfo({
            ...resumeInfo,
            [name] : value
        })
    }

    const generateSummaryAI = async () => {
        const PROMPT = prompt.replace("{jobTitle}", resumeInfo?.jobTitle);
        const result = await AIchatSession.sendMessage(PROMPT);
        console.log(result.response.text());
    }
    const onSave = (e) => {
        e.preventDefault();
        setNext(true);
        toast({
            title: "Summary Updated",
            description: "Keep editing",
        })
    }

  return (
    <div className='border-t-primary border-t-4 my-10 p-4 rounded-lg shadow-lg'>
        <div className='flex justify-between items-center'>
            <div>
                <h2 className='font-bold text-xl my-2'>Summary</h2>
                <p>Add A Summary For Your Job Title</p>
            </div>    
            <Button variant="outline" className="border-primary text-primary gap-2 items-center hover:text-primary" onClick={generateSummaryAI}> <Brain/> Generate from AI</Button>
        </div> 
        <form onSubmit={onSave}>
            <textarea name='summery' onChange={handleChange} className='w-[90%] m-8 h-100 border-2 border-primary'/>
            <div className='col-span-2 flex justify-end'>
                <Button type="submit">Save</Button>
            </div>
        </form>
    </div>
  )
}

export default SummaryForm
