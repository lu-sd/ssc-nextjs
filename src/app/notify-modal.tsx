'use client'

import { useEffect, useState } from 'react'
import { CircleCheckBig } from 'lucide-react'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'

interface Props {
  display: boolean
  setDisplay: (value: boolean) => void
  info: {
    valid: boolean
    message: { title: string; details: string }[]
  }
}

export const NotifModal = ({ display, setDisplay, info }: Props) => {
  return (
    <Dialog open={display} onOpenChange={setDisplay}>
      <DialogContent>
        <DialogHeader className="space-y-4">
          <DialogTitle className="flex  justify-center gap-x-2">
            <CircleCheckBig className='text-green-500'/>
            <p>Pass</p>
          </DialogTitle>
          {/* <DialogDescription className="space-y-2 px-1 text-left">
            Please send the url to
            <span className="mx-1 font-medium text-sky-500">bioinfo team</span>
            to retrieve your data
          </DialogDescription> */}
        </DialogHeader>

        <Separator />
        <ul className="space-y-1">
          {['Header','Setting','Data'].map((msg, index) => (
            <li
              key={index}
              className="rounded-md p-1 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <h3 className="font-bold"> • [{msg}]</h3>
              <p className="text-gray-500 dark:text-gray-400">
                No error found in this section.
              </p>
            </li>
          ))}
        </ul>
        {/* <p className="text-2xl font-medium">
          <span className="text-sm font-normal">
            Function avaible to Bioinfo Team only, ({' '}
            <span className="mx-1 font-medium text-sky-500">{'test '}</span>)
            fastqs to thaw
          </span>
        </p> */}
      </DialogContent>
    </Dialog>
  )
}
