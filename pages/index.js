import Head from 'next/head'
import Image from 'next/image'
import { useState } from 'react'
import HashLoader from "react-spinners/HashLoader"

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
  const [displayEndemic, setDisplayEndemic] = useState(false)
  const [endemicSpeciesCount, setEndemicSpeciesCount] = useState(0)

  if (!species) {
    return <div><h2>Sorry, error fetching data.</h2></div>
  }

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
    if (displayEndemic || filtered) return ``
    return (
      <div className="w-full flex justify-between mt-4">
        <div className="w-1/3">
          {currentPage > 1 &&
            <svg xmlns="http://www.w3.org/2000/svg" onClick={() => paginate(0)} className="h-10 w-10 text-gray-600 cursor-pointer hover:text-brand" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          }
        </div>
        <p>Page {currentPage} / {totalPages}</p>
        <div className="w-1/3 flex justify-end">
          {currentPage < totalPages &&
            <svg xmlns="http://www.w3.org/2000/svg" onClick={() => paginate(1)} className="h-10 w-10 text-gray-600 cursor-pointer hover:text-brand" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          }
        </div>
      </div>
    )
  }

  const showEndemic = async () => {
    if (displayEndemic) {
      setDisplayEndemic(false)
      return setSpecies(allSpecies)
    } else {
      setFetching(true)
      const req = await fetch(`https://api.inaturalist.org/v1/observations/species_counts?endemic=true&place_id=37612`)
      const endemicSpecies = await req.json()
      setEndemicSpeciesCount(endemicSpecies.total_results)
      setFetching(false)
      setDisplayEndemic(true)
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
    setFilteredSpeciesCount(filteredSpecies.total_results)
    setFilered(true)
    setFetching(false)
    return setSpecies(filteredSpecies.results)
  }

  const getStatusName = (name) => {
    switch (name) {
      case "amenazada":
        return "threatened"
      case "sujeta a protección especial":
        return "subject to special protection"
      case "en peligro de extinción":
        return "in danger of extinction"
      default:
        return name
    }
  }

  return (
    <>
      <Head>
        <title>Cozumon</title>
        <meta name="description" content="Cozumon | Cozumel Taxonomy" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex flex-col items-center px-16 w-screen">
        <h1 className="text-4xl mt-4 mb-8 text-brand">Cozumel Taxonomy</h1>

        <div className="flex flex-col items-center w-full pb-16">
          <h2 className="my-6 bg-gray-50 shadow p-6 text-center max-w-md">
            The following list shows all animals and plants that have been observed on Cozumel and is ordered by the number of observations.
            <p className="text-xs mt-2">Total number of observed species: {totalAmount}</p>
          </h2>

          {fetching &&
            <div className="mt-16">
              <HashLoader color={"#556B2F"} loading={fetching} size={50} />
            </div>
          }

          {!fetching &&
            <>
              <a href="#" onClick={() => setShowFilters(!showFilters)} className="flex items-center w-max hover:text-brand mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
                <span>Filter</span>
              </a>

              {showFilters &&
                <div className="border border-dashed p-6 mb-12">
                  <p>Filter per taxanomy class:</p>
                  <ul className="flex flex-wrap mt-2">
                    {speciesClasses.map((c) => {
                      // console.log(selectedSpeciesClass);
                      return (
                        <li key={c} className="w-32 mr-8 mt-1">
                          <label htmlFor={c} className="block cursor-pointer">
                            <input type="radio" id={c} checked={selectedSpeciesClass === c} onChange={() => filterSpecies(c)} />{` `}{c.charAt(0).toUpperCase() + c.slice(1)}
                          </label>
                        </li>
                      )
                    })
                    }
                  </ul>
                  {selectedSpeciesClass === 'all' &&
                    <label htmlFor="endemic" className="mt-4 block cursor-pointer">
                      <input type="checkbox" id="endemic" checked={displayEndemic} onChange={showEndemic} />{` `}Show only endemic species
                    </label>
                  }
                </div>
              }

              <ul className="w-full">

                <Pagination />

                {filtered &&
                  <p><span className="font-bold">{filteredSpeciesCount}</span> species found in <span className="font-bold">{selectedSpeciesClass.charAt(0).toUpperCase() + selectedSpeciesClass.slice(1)}</span></p>
                }
                {displayEndemic && !filtered &&
                  <p><span className="font-bold">{endemicSpeciesCount}</span> endemic species found</p>
                }

                {species.map(s => {
                  const t = s.taxon
                  return (
                    <li key={t.id} className="bg-gray-50 shadow rounded p-6 my-6 flex space-x-6">

                      <div>
                        {t.default_photo?.square_url ?
                          <Image
                            src={t.default_photo.square_url}
                            height={100}
                            width={100}
                          />
                          :
                          <div className="w-24 h-24 text-sm flex items-center justify-center">No image</div>
                        }
                        <a href={t.wikipedia_url} target="_blank" className="block text-xs hover:text-brand">More information</a>
                      </div>

                      <div className="text-sm">
                        <h2 className="text-lg font-bold mb-4 text-brand">{t.preferred_common_name}</h2>
                        <p>Taxonomy: {t.iconic_taxon_name}</p>
                        <p>Latin: {t.name}</p>
                        <p>Number of observations: {s.count}</p>

                        <p>Status: {t.conservation_status?.status_name ? getStatusName(t.conservation_status.status_name) : "no data"}</p>

                        {t.extinct ? <p>Species has become extinct...</p> : ``}
                      </div>
                    </li>
                  )
                })}

                <Pagination />
              </ul>
            </>
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
