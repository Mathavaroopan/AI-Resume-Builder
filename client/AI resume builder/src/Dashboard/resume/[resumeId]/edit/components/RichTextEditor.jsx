import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { ResumeInfoContext } from '@/context/ResumeInfoContext';
import { Description } from '@radix-ui/react-dialog';
import { Brain } from 'lucide-react';
import React, { useContext, useState } from 'react'
import { BtnBold, BtnBulletList, BtnClearFormatting, BtnItalic, BtnLink, BtnNumberedList, BtnStrikeThrough, BtnStyles, BtnUnderline, Editor, EditorProvider, HtmlButton, Separator, Toolbar } from 'react-simple-wysiwyg'
import { AIchatSession } from '../../../../../../service/AIModel'

const prompt = "job title: {jobTitle}, depends on work experience, give summary for my resume in 4 lines. I want pure text that can be directly on my resume. Don't add any useless things. Don't write replace and all. The user will take care."

const RichTextEditor = ({onTextChange, index, item}) => {
    const [value, setValue] = useState(item.workSummery);
    const {resumeInfo, setResumeInfo} = useContext(ResumeInfoContext);
    const generateSummaryAI = async () => {
        if(resumeInfo?.experience[index].title == null){
            toast({
                title: "Please add position",
                description: ""
            })
            return;
        }
        const PROMPT = prompt.replace("{jobTitle}", resumeInfo?.experience[index].title);
        const result = await AIchatSession.sendMessage(PROMPT);
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
          <BtnUnderline />
          <BtnStrikeThrough />
          <Separator />
          <BtnBulletList />
          <Separator />
          <BtnLink />
        </Toolbar>
      </Editor>
    </EditorProvider>
    </div>
  )
}

export default RichTextEditor
