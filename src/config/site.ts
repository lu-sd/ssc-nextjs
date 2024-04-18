import { NavItem } from '@/src/types/nav'

interface SiteConfig {
  name: string
  description: string
  mainNav: NavItem[]
  links: {
    ssc: string
    guide: string
  }
}

export const siteConfig: SiteConfig = {
  name: 'Singular Genomics',
  description: 'SampleSheet Checker',
  mainNav: [
    {
      title: '',
      href: '/',
    },
  ],
  links: {
    ssc: 'https://techwriting.singulargenomics.com/calculator/SDS-Generator/Content/Topics/Calculators/SDS-Generator.htm',
    guide:
      'https://techwriting.singulargenomics.com/Analysis/Demux-Guide-G4-600034.pdf',
  },
}
