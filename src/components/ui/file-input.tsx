'use client'

import { NotifModal } from '@/src/app/notify-modal'
import {
  forwardRef,
  useRef,
  useState,
  type ChangeEvent,
  type DragEvent,
} from 'react'

import { cn } from '@/lib/utils'

import { type ValidationResult, parseCsv, validateCsv } from '@/src/app/ssc'

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {}

const FileInput = forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => {
    const [display, setDisplay] = useState(false)
    const [dragActive, setDragActive] = useState<boolean>(false)
    const info = useRef<ValidationResult>({
      valid: true,
      message: [
        { section: '[Header]', details: [] },
        { section: '[Settings]', details: [] },
        { section: '[Data]', details: [] },
      ],
    })

    // handle drag events
    const handleDrag = (e: DragEvent<HTMLFormElement | HTMLDivElement>) => {
      e.preventDefault()
      e.stopPropagation()
      if (e.type === 'dragenter' || e.type === 'dragover') {
        setDragActive(true)
      } else if (e.type === 'dragleave') {
        setDragActive(false)
      }
    }

    // triggers when file is selected with click
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
      // e.preventDefault()
      if (e.target.files && e.target.files[0]) {
        const file = e.target.files[0]
        const reader = new FileReader()
        reader.readAsText(file)

        reader.onload = (event: ProgressEvent<FileReader>) => {
          const text = event.target?.result as string
          const [headSection, dataSection] = parseCsv(text)
          // console.log('🚀 ~ header:', parsedCsv)
          // console.log('🚀 ~ data:', dataSection)
          const isValid = validateCsv(headSection, dataSection)
          info.current = isValid
          // console.log('isvalid', isValid)

          setDisplay(true)
          // if (isValid.isValid) {
          //   // info.current.message.push({
          //   //   title: 'No Error found updatedxxx',
          //   //   details: 'Sample Sheet valid xxx',
          //   // })
          // } else {
          //   // setNotPassDisplay(true);
          //   // setText(JSON.stringify(isValid.errors, null, 2));
          // }

          // if (fileInputRef.current) {
          //   fileInputRef.current.value = ''
          // }

          reader.onerror = (e) => {
            console.error('Error reading file:', e)
          }
        }
        e.target.value = ''
      }
    }

    // triggers when file is dropped
    const handleDrop = async (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault()
      e.stopPropagation()

      // validate file type
      // if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      //   const { name, size } = e.dataTransfer.files[0]
      //   console.log('name', name)
      //   console.log('size', size)
      //   const file = e.dataTransfer.files[0]
      //   const reader = new FileReader()
      //   reader.readAsText(file)

      //   reader.onload = (e: ProgressEvent<FileReader>) => {
      //     console.log('loading')
      //     const text = e.target?.result as string
      //     const parsedCsv = parseCsv(text)
      //     // const isValid = validateCsv(parsedCsv)
      //     console.log('isvalid', isValid)
      //     setDisplay(true)
      //     if (isValid.isValid) {
      //       // setPassDisplay(true);
      //     } else {
      //       // setNotPassDisplay(true);
      //       // setText(JSON.stringify(isValid.errors, null, 2));
      //     }

      //     // if (fileInputRef.current) {
      //     //   fileInputRef.current.value = ''
      //     // }

      //     reader.onerror = (e) => {
      //       console.error('Error reading file:', e)
      //     }
      //   }

      //   try {
      //     setDragActive(false)
      //     // at least one file has been selected

      //     e.dataTransfer.clearData()
      //   } catch (error) {
      //     // already handled
      //   }
      // }
    }

    return (
      <>
        <NotifModal
          display={display}
          setDisplay={setDisplay}
          info={info.current}
        />
        <form
          onSubmit={(e) => e.preventDefault()}
          onDragEnter={handleDrag}
          className="flex size-full items-center justify-start lg:w-2/3"
        >
          <label
            htmlFor="dropzone-file"
            className={cn(
              'size-ful group relative flex aspect-video flex-col items-center justify-center rounded-lg border-2 border-dashed border-slate-300 transition dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-slate-800',
              { 'dark:border-slate-400 dark:bg-slate-800': dragActive }
              // { 'aspect-auto h-fit': !noInput },
              // { 'items-start justify-start': !noInput },
            )}
          >
            <div
              className={cn(
                'size-ful relative flex flex-col items-center justify-center'
              )}
            >
              <div
                className="absolute inset-0 cursor-pointer"
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              />

              <svg
                aria-hidden="true"
                className="mb-3 size-10 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                ></path>
              </svg>

              <p className="mb-2 px-10 text-sm text-gray-500 dark:text-gray-400">
                <span className="font-semibold">Click to upload csv file.</span>{' '}
              </p>

              <input
                {...props}
                ref={ref}
                onChange={handleChange}
                accept="csv"
                id="dropzone-file"
                type="file"
                className="hidden"
              />
            </div>
          </label>
        </form>
      </>
    )
  }
)
FileInput.displayName = 'FileInput'

export { FileInput }
