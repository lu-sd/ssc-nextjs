'use client'

import { useEffect, useState } from 'react'
import { CircleCheckBig, OctagonAlert } from 'lucide-react'

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
    message: { section: string; details: string[] }[]
  }
}

export const NotifModal = ({ display, setDisplay, info }: Props) => {
  const sectionKeys = info.message.map((msg) => msg.section)
  return (
    <Dialog open={display} onOpenChange={setDisplay}>
      <DialogContent>
        <DialogHeader className="space-y-4">
          <DialogTitle className="flex items-center justify-center gap-x-2">
            {info.valid ? (
              <CircleCheckBig className=" text-green-500" />
            ) : (
              <OctagonAlert className="text-pink-500" />
            )}
            {info.valid ? <p>Pass</p> : <p>Issue found</p>}
          </DialogTitle>
          {/* <DialogDescription className="space-y-2 px-1 text-left">
            Please send the url to
            <span className="mx-1 font-medium text-sky-500">bioinfo team</span>
            to retrieve your data
          </DialogDescription> */}
        </DialogHeader>

        <Separator />
        <ul className="space-y-1">
          {sectionKeys.map((msg, index) => (
            <li
              key={index}
              className="rounded-md p-1 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <h3 className="font-bold"> • {msg}</h3>
              {info.message[index].details.length > 0 ? (
                <>
                  {info.message[index].details.map((detail, index) => (
                    <div key={index}>
                      <p className="text-gray-500 dark:text-gray-400">
                        {detail}
                      </p>
                      <br />
                    </div>
                  ))}
                </>
              ) : (
                <p className="text-gray-500 dark:text-gray-400">
                  No error found
                </p>
              )}
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
