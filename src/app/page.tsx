'use client'

import { FC } from 'react'
import { Button, buttonVariants } from '@/ui/button'
import { FileInput } from '@/ui/file-input'


const page: FC = () => {
  return (
    <section className="container grid items-center gap-6 pb-8 pt-6 md:py-10">
      <div className="flex max-w-[980px] flex-col items-start gap-2">
        <h1 className="my-2 text-3xl font-extrabold leading-tight tracking-tighter sm:text-3xl md:text-4xl lg:text-5xl">
          Singular Genomics <br className="hidden sm:inline" />
          Sample Sheet Checker
        </h1>
        <p className="mb-4 max-w-[700px] text-lg text-slate-700 dark:text-slate-400 sm:text-xl">
        The following sections will be checked:
        </p>
        <h2 className="mb-1 text-xl font-bold">[Header] section</h2>
        <p className="mb-2">General information about the run.</p>
        <h2 className="mb-1 text-xl font-bold ">[Setting] section</h2>
        <p className="mb-2">Read length and index length.</p>
        <h2 className="mb-1 text-xl font-bold ">[Data] section</h2>
        <p className="mb-2">Sample ID and index sequence</p>
      </div>

      <div className="flex max-w-md gap-4">
        <FileInput className="mx-12" />
      </div>

      {/* Legal disclaimers */}
      <div className="mt-12 flex flex-col gap-4">
        {/* <p className="text-sm text-slate-400"> Place holder</p> */}
        <div className="flex items-center gap-4">
          <Button
            href="https://singulargenomics.com/legal/"
            className={buttonVariants({ variant: 'ghost', size: 'sm' })}
          >
            Terms
          </Button>
          <Button
            href="https://singulargenomics.com/privacy/"
            className={buttonVariants({ variant: 'ghost', size: 'sm' })}
          >
            Privacy Policy
          </Button>
        </div>
      </div>
    </section>
  )
}

export default page
