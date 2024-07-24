import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { ResumeInfoContext } from '@/context/ResumeInfoContext';
import { Brain } from 'lucide-react';
import React, { useContext, useState } from 'react'
import { BtnBold, BtnItalic, Editor, EditorProvider, Toolbar } from 'react-simple-wysiwyg'
import { AIchatSession } from '../../../../../../service/AIModel'

let prompt = "University Name: {UniName}, studied {degree} major in {major}. write 3 lines of experience to impress the resume viewer. Don't add any other text. Just write 3 lines impressively like activities and stuff"

const RichTextEditorEducation = ({onTextChange, index}) => {
    const [value, setValue] = useState();
    const {resumeInfo, setResumeInfo} = useContext(ResumeInfoContext);
    const generateSummaryAI = async () => {
        if(!resumeInfo?.education[index].universityName || !resumeInfo?.education[index].degree || !resumeInfo?.education[index].major){
            toast({
                title: "Please add necessary details",
                description: "Add University Name, Degree, and Major to generate Summary"
            })
            return;
        }
        prompt = prompt.replace("{UniName}", resumeInfo?.education[index].universityName);
        prompt = prompt.replace("{degree}", resumeInfo?.education[index].degree);
        prompt = prompt.replace("{major}", resumeInfo?.education[index].major);
        const result = await AIchatSession.sendMessage(prompt);
        console.log(result.response.text());
        setValue(result.response.text());
    }

    return (
    <div>
        <div className='flex justify-between my-2 items-center'>
            <label className='text-sm font-medium'>Summery</label>
            <Button variant="outline" className="text-primary flex gap-2 border-primary" onClick={generateSummaryAI}><Brain className='h-4 w-4'/> Generate From AI</Button>
        </div>
      <EditorProvider>
      <Editor value={value} onChange={(e) => {
        setValue(e.target.value)
        onTextChange(e)
      }}>
      <Toolbar>
          <BtnBold />
          <BtnItalic />
        </Toolbar>
      </Editor>
    </EditorProvider>
    </div>
  )
}

export default RichTextEditorEducation
