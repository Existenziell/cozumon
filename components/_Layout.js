import NextNprogress from 'nextjs-progressbar'
import DarkModeToggle from './darkModeToggle'

export default function Layout({ children }) {
  return (
    <>
      <NextNprogress
        startPosition={0.3}
        stopDelayMs={100}
        height={3}
        showOnShallow={true}
        color='var(--color-cta)'
      />
      <DarkModeToggle />

      <main className='w-full min-h-screen px-4 sm:px-8 pb-20 pt-20 bg-brand text-brand-dark dark:bg-brand-dark dark:text-brand'>
        {children}
      </main>
    </>
  )
}
