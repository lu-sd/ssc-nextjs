import Link from 'next/link'

import { siteConfig } from '@/config/site'
import { Icons } from '@/components/icons'
import { MainNav } from '@/components/main-nav'
import { buttonVariants } from '@/components/ui/button'

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-b-slate-200 bg-white dark:border-b-slate-700 dark:bg-slate-900">
      <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
        <MainNav items={siteConfig.mainNav} />
        <div className="flex flex-1 items-center justify-end space-x-4">
          {/* samplesheet link */}
          <nav className="flex items-center space-x-1">
            <Link
              href={siteConfig.links.guide}
              target="_blank"
              rel="noreferrer"
            >
              <div
                className={buttonVariants({
                  size: 'sm',
                  variant: 'ghost',
                  className: 'text-slate-700 dark:text-slate-400',
                })}
              >
                <Icons.Link2 className="mr-2 size-5" />
                <span className="">Demux Guide</span>
              </div>
            </Link>
            <Link href={siteConfig.links.ssc} target="_blank" rel="noreferrer">
              <div
                className={buttonVariants({
                  size: 'sm',
                  variant: 'ghost',
                  className: 'text-slate-700 dark:text-slate-400',
                })}
              >
                <Icons.Link2 className="mr-2 h-5 w-5" />
                <span className="">SampleSheet Generator</span>
              </div>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  )
}
