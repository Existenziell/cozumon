import { useState, useEffect } from 'react'

const DarkModeToggle = () => {
  const [darkmode, setDarkmode] = useState()

  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    // First check localstorage
    if (localStorage.theme === 'dark') {
      setDark()
    } else if (localStorage.theme === 'light') {
      setLight()
    } else if (localStorage.theme === 'auto') {
      setAuto()
    } else {
      // If no theme found, check user preferences
      checkUserPreference()
    }
  }, [])
  /* eslint-enable react-hooks/exhaustive-deps */

  const setLight = () => {
    localStorage.theme = 'light'
    document.documentElement.classList.remove('dark')
    setDarkmode('light')
  }

  const setDark = () => {
    localStorage.theme = 'dark'
    document.documentElement.classList.add('dark')
    setDarkmode('dark')
  }

  const setAuto = async () => {
    await checkUserPreference()
    localStorage.theme = 'auto'
    setDarkmode('auto')
  }

  const checkUserPreference = async () => {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setDark()
    } else {
      setLight()
    }
  }

  return (
    <div className=' absolute top-4 right-4'>
      {darkmode === 'light' ?
        <svg onClick={setDark} xmlns='http://www.w3.org/2000/svg' className='h-8 w-8 md:h-6 md:w-6 cursor-pointer text-brand-dark hover:text-cta transition-colors' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z' />
        </svg>
        :
        <svg onClick={setLight} xmlns='http://www.w3.org/2000/svg' className='h-8 w-8 md:h-6 md:w-6 cursor-pointer text-brand hover:text-cta transition-colors' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z' />
        </svg>
      }
    </div>
  )
}

export default DarkModeToggle
