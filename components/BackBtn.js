import Link from "next/link"

const BackBtn = ({ href }) => {
  return (
    <Link href={href}>
      <a className="absolute left-4 top-8 shadow p-2 hover:bg-cta hover:text-white transition-all rounded-sm">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </a>
    </Link>
  )
}

export default BackBtn
