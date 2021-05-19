import Head from 'next/head'
import Image from 'next/image'
import { useState } from 'react'
import HashLoader from "react-spinners/HashLoader"

const Cozumon = ({ initialData }) => {

  const [allSpecies, setAllSpecies] = useState(initialData.results)
  const [species, setSpecies] = useState(initialData.results)
  const [fetching, setFetching] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalAmount, setTotalAmount] = useState(initialData.total_results)
  const [totalPages, setTotalPages] = useState(Math.ceil(initialData.total_results / initialData.per_page))
  const [displayEndemic, setDisplayEndemic] = useState(false)

  if (!species) {
    return (
      <div>
        <h2>Sorry, error fetching data.</h2>
      </div>
    )
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
    if (displayEndemic) return ``
    return (
      <div className="w-full flex justify-between">
        <div className="w-1/3">
          {currentPage > 1 &&
            <svg xmlns="http://www.w3.org/2000/svg" onClick={() => paginate(0)} className="h-6 w-6 cursor-pointer hover:text-brand" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          }
        </div>
        <p>Page {currentPage} / {totalPages}</p>
        <div className="w-1/3 flex justify-end">
          {currentPage < totalPages &&
            <svg xmlns="http://www.w3.org/2000/svg" onClick={() => paginate(1)} className="h-6 w-6 cursor-pointer hover:text-brand" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          }
        </div>
      </div>
    )
  }

  const showEndemic = () => {
    if (displayEndemic) {
      setDisplayEndemic(false)
      return setSpecies(allSpecies)
    } else {
      const newSpecies = species.filter(s => {
        return s.taxon?.establishment_means?.establishment_means === "endemic"
      })
      setDisplayEndemic(true)
      return setSpecies(newSpecies)
    }
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

          <div className="mt-16">
            <HashLoader color={"#556B2F"} loading={fetching} size={50} />
          </div>

          {!fetching &&
            <ul className="w-full">

              <label htmlFor="endemic" className="mb-4 cursor-pointer">
                <input type="checkbox" id="endemic" value={displayEndemic} onClick={showEndemic} />{` `}Show only endemic species
              </label>

              <Pagination />

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
