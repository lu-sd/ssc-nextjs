'use client'

import {
  forwardRef,
  useReducer,
  useRef,
  useState,
  type ChangeEvent,
  type DragEvent,
} from 'react'
import { NotifModal } from '@/src/app/notify-modal'

import { cn } from '@/lib/utils'

interface FileWithUrl {
  name: string
  getUrl: string
  size: number
  error?: boolean | undefined
}

type CsvSection = { [key: string]: string }
type ParsedCsv = { [sectionName: string]: CsvSection }

function parseCsv(csvString: string): ParsedCsv {
  const sections: ParsedCsv = {}
  const lines = csvString.split('\n')
  let currentSection = ''

  lines.forEach((line) => {
    const trimmedLine = line.trim()
    if (trimmedLine.startsWith('[')) {
      currentSection = trimmedLine.split(',')[0]
      sections[currentSection] = {}
    } else {
      const [key, value] = trimmedLine.split(',').map((item) => item.trim())
      if (key && value && currentSection) {
        sections[currentSection][key] = value
      }
    }
  })

  return sections
}

type ValidationResult = {
  isValid: boolean
  errors: { [section: string]: string[] }
}

function validateCsv(parsedCsv: ParsedCsv): ValidationResult {
  const validationResult: ValidationResult = { isValid: true, errors: {} }

  // Helper function to add errors
  function addError(section: string, message: string) {
    validationResult.isValid = false
    if (!validationResult.errors[section]) {
      validationResult.errors[section] = []
    }
    validationResult.errors[section].push(message)
  }

  // Check required data in Header
  if (!parsedCsv['[Header]'] || !parsedCsv['[Header]']['Date']) {
    addError('Header', 'Date in Header is required.')
  }

  // Check Read1 in Settings
  if (!parsedCsv['[Settings]'] || !parsedCsv['[Settings]']['Read1']) {
    addError('Settings', 'Read1 in Settings is required.')
  }

  // Assuming each 'Data' entry is properly formatted
  // if (parsedCsv["Settings"]) {
  //   const settings = parsedCsv["Settings"];
  //   const index1Length = parseInt(settings["Index1"] || "0");
  //   const index2Length = parseInt(settings["Index2"] || "0");
  //   const sumOfIndexLengths = index1Length + index2Length;

  //   Object.entries(parsedCsv["Data"] || {}).forEach(([key, value], index) => {
  //     // Assuming data is structured with index sequences immediately following their IDs
  //     if (
  //       (key.includes("Index1_Sequence") || key.includes("Index2_Sequence")) &&
  //       value
  //     ) {
  //       if (value.length !== sumOfIndexLengths) {
  //         addError(
  //           "Data",
  //           `Sum of Index lengths does not match the sequence lengths for entry ${
  //             Math.floor(index / 6) + 1
  //           }.`
  //         );
  //       }
  //     }
  //   });
  // } else {
  //   addError("Settings", "Index1 and Index2 lengths are required in Settings.");
  // }

  return validationResult
}

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {}

const FileInput = forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => {
    const [display, setDisplay] = useState(false)
    const [dragActive, setDragActive] = useState<boolean>(false)
    const info = useRef({
      valid: true,
      message: [{ title: 'No Error found', details: 'Sample Sheet valid' }],
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
      try {
        if (e.target.files && e.target.files[0]) {
          // at least one file has been selected

          // validate file type

          const { name, size } = e.target.files[0]
          console.log('name', name)
          console.log('size', size)

          const file = e.target.files[0]
          const reader = new FileReader()
          reader.readAsText(file)

          reader.onload = (e: ProgressEvent<FileReader>) => {
            console.log('loading')
            const text = e.target?.result as string
            const parsedCsv = parseCsv(text)
            const isValid = validateCsv(parsedCsv)
            console.log('isvalid', isValid)

            // update  info = validateCsc(parsedCsv)

            setDisplay(true)
            if (isValid.isValid) {
              // info.current.message.push({
              //   title: 'No Error found updatedxxx',
              //   details: 'Sample Sheet valid xxx',
              // })
            } else {
              // setNotPassDisplay(true);
              // setText(JSON.stringify(isValid.errors, null, 2));
            }

            // if (fileInputRef.current) {
            //   fileInputRef.current.value = ''
            // }

            reader.onerror = (e) => {
              console.error('Error reading file:', e)
            }
          }
        }
      } catch (error) {
        // already handled
      }
    }

    // triggers when file is dropped
    const handleDrop = async (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault()
      e.stopPropagation()

      // validate file type
      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        const { name, size } = e.dataTransfer.files[0]
        console.log('name', name)
        console.log('size', size)
        const file = e.dataTransfer.files[0]
        const reader = new FileReader()
        reader.readAsText(file)

        reader.onload = (e: ProgressEvent<FileReader>) => {
          console.log('loading')
          const text = e.target?.result as string
          const parsedCsv = parseCsv(text)
          const isValid = validateCsv(parsedCsv)
          console.log('isvalid', isValid)
          setDisplay(true)
          if (isValid.isValid) {
            // setPassDisplay(true);
          } else {
            // setNotPassDisplay(true);
            // setText(JSON.stringify(isValid.errors, null, 2));
          }

          // if (fileInputRef.current) {
          //   fileInputRef.current.value = ''
          // }

          reader.onerror = (e) => {
            console.error('Error reading file:', e)
          }
        }

        try {
          setDragActive(false)
          // at least one file has been selected

          e.dataTransfer.clearData()
        } catch (error) {
          // already handled
        }
      }
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
                multiple
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
