'use client'

import { FC } from 'react'
import { Button, buttonVariants } from '@/ui/button'
import { FileInput } from '@/ui/file-input'

const page: FC = () => {
  return (
    <section className="container grid items-center gap-6 pt-6 pb-8 md:py-10">
      <div className="flex max-w-[980px] flex-col items-start gap-2">
        <h1 className="text-3xl font-extrabold leading-tight tracking-tighter sm:text-3xl md:text-5xl lg:text-6xl">
          Singular Genomics <br className="hidden sm:inline" />
          SampleSheet Checker
        </h1>
        <p className="max-w-[700px] text-lg text-slate-700 dark:text-slate-400 sm:text-xl">
          Validate the SampleSheet to ensure they are correct
        </p>
      </div>
      <div className="flex gap-4 max-w-md">
        <FileInput className="mx-12" />
      </div>

      {/* Legal disclaimers */}
      <div className="flex flex-col gap-4 mt-12">
        <p className="text-slate-400 text-sm"> Place holder</p>
        <div className="flex items-center gap-4">
          <Button
            href="/"
            className={buttonVariants({ variant: 'link', size: 'sm' })}
          >
            Terms
          </Button>
          <Button
            href="/"
            className={buttonVariants({ variant: 'link', size: 'sm' })}
          >
            Privacy Policy
          </Button>
        </div>
      </div>
    </section>
  )
}

export default page
