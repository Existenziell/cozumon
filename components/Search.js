import { XMarkIcon } from '@heroicons/react/24/solid'

const Search = ({ search, setSearch }) => {
  return (
    <div className='search relative w-max flex items-center justify-center mx-auto'>
      <input
        type='search'
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        name='search'
        placeholder='Search'
        autoComplete='off' autoCorrect='off' spellCheck='false' autoCapitalize='false'
      />
      <button onClick={() => setSearch('')} className='absolute right-2 text-brand-dark/20 dark:text-brand/20 hover:text-cta dark:hover:text-cta h-max' aria-label='Reset search'>
        <XMarkIcon className='w-5' />
      </button>
    </div>
  )
}

export default Search
