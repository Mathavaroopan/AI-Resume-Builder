import React, { useContext, useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { ResumeInfoContext } from '@/context/ResumeInfoContext';
import { Brain } from 'lucide-react';
import { BtnBold, BtnBulletList, BtnClearFormatting, BtnItalic, BtnLink, BtnNumberedList, BtnStrikeThrough, BtnStyles, BtnUnderline, Editor, EditorProvider, HtmlButton, Separator, Toolbar } from 'react-simple-wysiwyg';
import { AIchatSession } from '../../../../../../service/AIModel';
import { Input } from '@/components/ui/input';

let p = "University Name: {UniName}, studied {degree} major in {major}. write 3 lines of experience to impress the resume viewer. Don't add any other text. Just write 3 lines impressively like activities and stuff";

const RichTextEditorEducation = ({ onTextChange, index, item }) => {
    const [value, setValue] = useState(item.description || "");
    const { resumeInfo } = useContext(ResumeInfoContext);
    const [prompt, setPrompt] = useState("");

    // Effect to update `value` when `item.description` changes
    useEffect(() => {
        setValue(item.description || "");
    }, [item.description]);

    const generateSummaryAI = async () => {
        if (!resumeInfo?.education[index].universityName || !resumeInfo?.education[index].degree || !resumeInfo?.education[index].major) {
            toast({
                title: "Please add necessary details",
                description: "Add University Name, Degree, and Major to generate Summary"
            });
            return;
        }

        let PROMPT = p
            .replace("{UniName}", resumeInfo?.education[index].universityName)
            .replace("{degree}", resumeInfo?.education[index].degree)
            .replace("{major}", resumeInfo?.education[index].major);
        PROMPT += prompt + ". Give bullet points";
        const result = await AIchatSession.sendMessage(PROMPT);
        const generatedSummary = await result.response.text();

        setValue(generatedSummary);
        onTextChange({ target: { value: generatedSummary } }, index);
    };

    return (
        <div>
            <label className='text-sm font-medium'>Summary</label>
            <div className='flex justify-between my-2 items-center gap-6'>
                <Input placeholder={(prompt === "") ? "Give details to generate summary..." : prompt} onChange={e => setPrompt(e.target.value)}/>
                <Button variant="outline" disabled={prompt === ""} className="text-primary flex gap-2 border-primary" onClick={generateSummaryAI}><Brain className='h-4 w-4'/> Generate From AI</Button>
            </div>

            <EditorProvider>
                <Editor value={value} onChange={(e) => {
                    setValue(e.target.value);
                    onTextChange(e, index);
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
    );
};

export default RichTextEditorEducation;
