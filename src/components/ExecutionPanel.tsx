import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Separator } from './ui/separator'
import React from 'react'
import { Plus, PlusIcon } from 'lucide-react'

function ExecutionPanel() {
  return (
    <div className='w-1/3 max-w-3xl h-screen border-2 border-solid text-center '>
      <Label className='text-center block py-3'> write your instructions</Label>
      <Separator/>
      
      <div className='m-auto flex items-center space-x-2'>
        <Label>1</Label>
        <Input placeholder='Your Command, here.'/>
      </div>

      <div className='m-auto flex items-center space-x-2 my-1'>
        <Label>2</Label>
        <Input placeholder='Your Command, here.'/>
      </div>

      <div className='w-full h-fit py-2 border-2 border-solid m-auto'>
        <Plus/>
      </div>
    </div>
  )
}

export default ExecutionPanel