import React, { useState } from 'react'
import PersonalForm from './forms/PersonalForm'
import { Button } from '@/components/ui/button'
import { ArrowLeft, ArrowRight, LayoutGrid } from 'lucide-react'
import SummaryForm from './forms/SummaryForm'
import ExperienceForm from './forms/ExperienceForm'
import EducationForm from './forms/EducationForm'
import SkillsForm from './forms/SkillsForm'
import ThemeColor from './ThemeColor'

const FormSection = () => {
    const [formIndex, setFormIndex] = useState(1);
    const [next, setNext] = useState(false);
    return (
    <div>
        <div className='flex items-center justify-between'>
            <ThemeColor />
            <div className='flex gap-2'>
                    {formIndex > 1 && next && <Button className="flex items-center gap-2" size="sm" onClick={() => setFormIndex(formIndex - 1)}><ArrowLeft /></Button>} 
                    <Button className="flex items-center gap-2" size="sm" disabled={!next} onClick={() => setFormIndex(formIndex + 1)}>Next <ArrowRight /></Button>
            </div>
        </div>
      {formIndex == 1 && <PersonalForm setNext={setNext} />}
      {formIndex == 2 && <SummaryForm setNext={setNext} />}
      {formIndex == 3 && <ExperienceForm setNext={setNext} />}
      {formIndex == 4 && <EducationForm setNext={setNext} />}
      {formIndex == 5 && <SkillsForm setNext={setNext} />}
      </div>
  )
}

export default FormSection
