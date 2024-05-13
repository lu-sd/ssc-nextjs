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
        To ensure accurate demultiplexing of your data, please adhere to the following criteria in the data section:
        </p>
        <h2 className="mb-1 text-xl font-bold">Lane Configuration:</h2>
        <p className="mb-2">Ensure that the lane numbers range from 1 to 4.</p>
        <h2 className="mb-1 text-xl font-bold">Index Sequence Composition:</h2>
        <p className="mb-2">Index sequences must exclusively contain the nucleotides A, T, C, and G.</p>
        <h2 className="mb-1 text-xl font-bold ">Uniqueness of Index Pairs:</h2>
        <p className="mb-2"> Ensure each index1:index2 pair is unique per lane.</p>
        <h2 className="mb-1 text-xl font-bold ">Consistency of Index Length:</h2>
        <p className="mb-2"> Index pairs within the same lane must be of consistent length.</p>
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
