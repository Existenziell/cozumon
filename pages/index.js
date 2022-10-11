import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import HashLoader from "react-spinners/HashLoader"
import translateStatusName from '../lib/translateStatusName'
import downloadCsv from '../lib/downloadCsv'
import capitalize from '../lib/capitalize'
import scrollToTop from '../lib/scrollToTop'
import Router from 'next/router'

const Cozumon = ({ initialData }) => {

  const speciesClasses = ['all', 'actinopterygii', 'animalia', 'amphibia', 'arachnida', 'aves', 'chromista', 'fungi', 'insecta', 'mammalia', 'mollusca', 'reptilia', 'plantae', 'protozoa', 'unknown']
  const [allSpecies, setAllSpecies] = useState(initialData.results)
  const [species, setSpecies] = useState(initialData.results)
  const [totalAmount, setTotalAmount] = useState(initialData.total_results)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(Math.ceil(initialData.total_results / initialData.per_page))
  const [fetching, setFetching] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [selectedSpeciesClass, setSelectedSpeciesClass] = useState("all")
  const [filteredSpeciesCount, setFilteredSpeciesCount] = useState(0)
  const [filtered, setFilered] = useState(false)
  const [showEndemic, setShowEndemic] = useState(false)
  const [endemicSpeciesCount, setEndemicSpeciesCount] = useState(0)
  const [searched, setSearched] = useState(false)
  const [searchedSpeciesCount, setSearchedSpeciesCount] = useState(0)
  const [showScrollToTop, setShowScrollToTop] = useState(false)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  if (!species) {
    return <div><h2>Sorry, error fetching data.</h2></div>
  }

  useEffect(() => {
    document.addEventListener('scroll', function (e) {
      window.scrollY > 800 ? setShowScrollToTop(true) : setShowScrollToTop(false)
    })
    setLoading(false)
  })

  const fetchData = async (mode) => {
    setFetching(true)
    const nextPage = mode ? currentPage + 1 : currentPage - 1
    const req = await fetch(`https://api.inaturalist.org/v1/observations/species_counts?place_id=37612&locale=en&page=${nextPage}`)
    const newSpecies = await req.json()
    setCurrentPage(nextPage)
    setFetching(false)
    return setSpecies(newSpecies.results)
  }

  const paginate = (mode) => {
    fetchData(mode)
  }

  const Pagination = () => {
    if (showEndemic || filtered || searched) return ``
    return (
      <div className="w-full flex justify-between mt-4">
        <div className="w-1/3">
          {currentPage > 1 &&
            <svg xmlns="http://www.w3.org/2000/svg" onClick={() => paginate(0)} className="h-10 w-10 text-gray-600 cursor-pointer border border-dotted p-2 hover:bg-brand hover:text-white transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          }
        </div>
        <p>Page {currentPage} / {totalPages}</p>
        <div className="w-1/3 flex justify-end">
          {currentPage < totalPages &&
            <svg xmlns="http://www.w3.org/2000/svg" onClick={() => paginate(1)} className="h-10 w-10 text-gray-600 cursor-pointer border border-dotted p-2 hover:bg-brand hover:text-white transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          }
        </div>
      </div>
    )
  }

  const showEndemicSpecies = async () => {
    if (showEndemic) {
      setShowEndemic(false)
      return setSpecies(allSpecies)
    } else {
      setFetching(true)
      const req = await fetch(`https://api.inaturalist.org/v1/observations/species_counts?endemic=true&place_id=37612`)
      const endemicSpecies = await req.json()
      setEndemicSpeciesCount(endemicSpecies.total_results)
      setFetching(false)
      setShowEndemic(true)
      return setSpecies(endemicSpecies.results)
    }
  }

  const filterSpecies = async (identifier) => {
    setSelectedSpeciesClass(identifier)
    if (identifier === "all") {
      setFilered(false)
      return setSpecies(allSpecies)
    }
    setFetching(true)
    const req = await fetch(`https://api.inaturalist.org/v1/observations/species_counts?place_id=37612&iconic_taxa=${identifier}`)
    const filteredSpecies = await req.json()
    setFilered(true)
    setFilteredSpeciesCount(filteredSpecies.total_results)
    setFetching(false)
    return setSpecies(filteredSpecies.results)
  }

  const searchSpecies = async (e) => {
    const form = document.forms[0]
    if (form.checkValidity()) {
      const searchterm = document.getElementById("searchterm").value
      setSearchTerm(searchterm)
      setFetching(true)
      setShowFilters(false)
      setShowEndemic(false)
      const req = await fetch(`https://api.inaturalist.org/v1/observations/species_counts?place_id=37612&q=${searchterm}`)
      const searchedSpecies = await req.json()
      setSearched(true)
      setSearchedSpeciesCount(searchedSpecies.total_results)
      setFetching(false)
      return setSpecies(searchedSpecies.results)
    }
  }

  const resetSearch = () => {
    setSearched(false)
    setSearchTerm("")
    setSearchedSpeciesCount(0)
    setSpecies(allSpecies)
  }

  const navigate = (e) => {
    e.preventDefault()
    Router.push(`/species/${e.target.dataset.id}`)
  }

  return (
    <>
      <Head>
        <title>Cozumon</title>
        <meta name="description" content="Cozumon | Cozumel Taxonomy" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex flex-col items-center px-16 w-screen">
        <h1 className="text-4xl my-8 text-brand">Cozumel Taxonomy</h1>

        <div className="flex flex-col items-center w-full pb-16">
          <h2 className="my-6 bg-gray-50 shadow p-6 text-center max-w-xl">
            The following list shows all species that have been observed on Cozumel and is ordered by the number of these observations.
            <p className="text-xs mt-2">Total number of observed species: {totalAmount}</p>
          </h2>

          {fetching &&
            <div className="mt-16">
              <HashLoader color={"#207068"} loading={fetching} size={50} />
            </div>
          }

          {!fetching && !loading &&
            <>
              <form onSubmit={searchSpecies} className="flex items-center space-x-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input type="text" placeholder="Search" id="searchterm" required className="px-4 py-2 border border-dashed"></input>
                <input type="submit" onClick={searchSpecies} className="cursor-pointer bg-white hover:text-brand" value="Go" />
              </form>

              <div className="flex justify-between w-full">
                {searched ?
                  <div></div>
                  :
                  <a href="#" onClick={(e) => e.preventDefault() & setShowFilters(!showFilters)} className="flex items-center w-max hover:text-brand mb-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                    </svg>
                    <span>Filter</span>
                  </a>
                }
                <a href="#" onClick={(e) => e.preventDefault() & downloadCsv(species)} target="_blank" className="flex items-center w-max hover:text-brand mb-2">
                  <span>Download</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </a>
              </div>

              {showFilters &&
                <div className="border border-dashed p-6 mb-12">
                  <p>Filter per taxanomy class:</p>
                  <ul className="flex flex-wrap mt-2">
                    {speciesClasses.map((c) => {
                      return (
                        <li key={c} className="w-32 mr-8 mt-1">
                          <label htmlFor={c} className="block cursor-pointer">
                            <input type="radio" id={c} checked={selectedSpeciesClass === c} onChange={() => filterSpecies(c)} />{` `}{capitalize(c)}
                          </label>
                        </li>
                      )
                    })
                    }
                  </ul>
                  {selectedSpeciesClass === 'all' &&
                    <label htmlFor="endemic" className="mt-4 block cursor-pointer">
                      <input type="checkbox" id="endemic" checked={showEndemic} onChange={showEndemicSpecies} />{` `}Show only endemic species
                    </label>
                  }
                </div>
              }

              <ul className="w-full">

                <Pagination />

                {filtered &&
                  <p><span className="font-bold">{filteredSpeciesCount}</span> species found in <span className="font-bold">{capitalize(selectedSpeciesClass)}</span>.</p>
                }
                {showEndemic && !filtered &&
                  <p><span className="font-bold">{endemicSpeciesCount}</span> endemic species found.</p>
                }

                {searched &&
                  <div className="flex items-center">
                    <p>
                      <span className="font-bold">{searchedSpeciesCount}</span> species found for search '{searchTerm}'
                    </p>
                    <div onClick={resetSearch} className="ml-6 flex space-x-1 items-center border border-brand px-2 py-1 cursor-pointer hover:bg-brand hover:text-white transition-all">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      <span className="text-sm">Reset</span>
                    </div>
                  </div>
                }

                {species.map(s => {
                  const { id, name, preferred_common_name, iconic_taxon_name, conservation_status, extinct, default_photo, wikipedia_url } = s.taxon

                  return (
                    <li onClick={navigate} data-id={id} key={id + name + preferred_common_name} className="bg-gray-50 shadow rounded p-6 my-6 flex space-x-6 cursor-pointer">
                      <div className="pointer-events-none">
                        {default_photo?.square_url ?
                          <Image
                            src={default_photo.square_url}
                            height={100}
                            width={100}
                          />
                          :
                          <div className="w-24 h-24 text-sm flex items-center justify-center">No image</div>
                        }
                        {/* {wikipedia_url &&
                          <a href={wikipedia_url} target="_blank" className="block text-xs hover:text-brand pointer-events-auto">More information</a>
                        } */}
                      </div>

                      <div className="text-sm pointer-events-none">
                        <h2 className="text-lg font-bold mb-4 text-brand">{preferred_common_name ? capitalize(preferred_common_name) : "No common name available"}</h2>
                        <p>Latin Name: {name}</p>
                        <p>Taxonomy: {iconic_taxon_name}</p>
                        <p>Number of observations: {s.count}</p>
                        <p>Status: {conservation_status?.status_name ? translateStatusName(conservation_status.status_name) : "no data"}</p>
                        {extinct ? <p>Species has become extinct...</p> : ``}
                      </div>
                    </li>
                  )
                })}

                <Pagination />
              </ul>
            </>
          }

          {showScrollToTop &&
            <a href="#" onClick={scrollToTop} className="fixed bottom-2 right-2 z-10 cursor-pointer border border-dotted p-2 hover:bg-brand hover:text-white transition-all">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 11l7-7 7 7M5 19l7-7 7 7" />
              </svg>
            </a>
          }

        </div>

      </main>
    </>
  )
}

export async function getServerSideProps(context) {
  // https://api.inaturalist.org/v1/observations?place_id=37612&per_page=200&order=desc&order_by=created_at
  const url = `https://api.inaturalist.org/v1/observations/species_counts?place_id=37612&locale=en`
  const res = await fetch(url)
  const data = await res.json()

  return {
    props: {
      initialData: data
    },
  }
}

export default Cozumon
