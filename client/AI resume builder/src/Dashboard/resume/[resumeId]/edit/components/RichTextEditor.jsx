import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { ResumeInfoContext } from '@/context/ResumeInfoContext';
import { Description } from '@radix-ui/react-dialog';
import { Brain } from 'lucide-react';
import React, { useContext, useState } from 'react'
import { BtnBold, BtnBulletList, BtnClearFormatting, BtnItalic, BtnLink, BtnNumberedList, BtnStrikeThrough, BtnStyles, BtnUnderline, Editor, EditorProvider, HtmlButton, Separator, Toolbar } from 'react-simple-wysiwyg'
import { AIchatSession } from '../../../../../../service/AIModel'
import { Input } from '@/components/ui/input';

const p = "job title: {jobTitle}, depends on work experience, give summary for my resume in 4 lines."

const RichTextEditor = ({onTextChange, index, item}) => {
    const [value, setValue] = useState(item.workSummery);
    const [prompt, setPrompt] = useState("");
    const {resumeInfo, setResumeInfo} = useContext(ResumeInfoContext);
    const generateSummaryAI = async () => {
      if(resumeInfo?.experience[index].title == null){
          toast({
              title: "Please add position",
              description: ""
          })
          return;
      }
      let PROMPT = p.replace("{jobTitle}", resumeInfo?.experience[index].title);
      PROMPT += " " + prompt + ". Write 4 points summary only using the given information"; // Use + for concatenation
      console.log(PROMPT);
      const result = await AIchatSession.sendMessage(PROMPT);
      console.log(result.response.text());
      setValue(result.response.text());
  }
  

    return (
    <div>
        <label className='text-sm font-medium'>Summary</label>
        <div className='flex justify-between my-2 items-center gap-6'>
              <Input placeholder={(prompt == "") ? "Give details to generate summary..." : prompt} onChange={e => setPrompt(e.target.value)}/>
            <Button variant="outline" disabled={prompt == ""} className="text-primary flex gap-2 border-primary" onClick={generateSummaryAI}><Brain className='h-4 w-4'/> Generate From AI</Button>
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
