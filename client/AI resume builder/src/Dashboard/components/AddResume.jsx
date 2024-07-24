import { Loader2, PlusSquare } from 'lucide-react'
import React, { useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
import { Button } from '@/components/ui/button';
import { Input } from "@/components/ui/input"
import { v4 as uuidv4 } from 'uuid';
import { useUser } from '@clerk/clerk-react';

const AddResume = () => {
    const [openDialog, setOpenDialog] = useState(false);
    const [resumeTitle, setResumeTitle] = useState(null);
    const [loading, setLoading] = useState(false);
    const {user} = useUser();
    const onCreate = () => {
        setLoading(true);
        const uuid = uuidv4();
        const data = {
            data:{
                title: resumeTitle,
                resumeId: uuid,
                userEmail: user?.primaryEmailAddress?.emailAddress,
                userName: user?.fullName
            }
        }
        console.log(data);
        setTimeout(() => {
            console.log("do")
        }, (3000));
        setLoading(false);
    }
  return (
    <div>
        <div className='p-14 py-24 border items-center flex justify-center bg-secondary rounded-lg h-[280px] hover:scale-105 transition-all hover:shadow-md cursor-pointer' onClick={() => setOpenDialog(true)}>
            <PlusSquare />
        </div >
        <Dialog open={openDialog}>
        <DialogContent>
            <DialogHeader>
            <DialogTitle>Create New Resume</DialogTitle>
            <DialogDescription>
                <p>Add a title for your new resume</p>
                <Input className="my-2" placeholder="Ex..Full stack resume.." onChange={(e) => setResumeTitle(e.target.value)}/>
            </DialogDescription>
            <div className='flex justify-end gap-5'>
                <Button variant="ghost" onClick={() => setOpenDialog(false)}>Cancel</Button>
                <Button onClick={onCreate} disabled={!resumeTitle || loading}>
                    { loading ? <Loader2 className='animate-spin'/> : "Create"}
                </Button>
            </div>
            </DialogHeader>
        </DialogContent>
        </Dialog>

    </div>
  )
}

export default AddResume
