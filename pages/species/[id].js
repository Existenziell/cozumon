import { useRouter } from 'next/router'
import { useEffect, useState } from 'react';
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import translateStatusName from '../../lib/translateStatusName'
import HashLoader from "react-spinners/HashLoader"

const Species = () => {

  const router = useRouter()
  const identifier = router.query.id
  const [species, setSpecies] = useState()

  const fetchSpecies = async (identifier) => {
    const url = `https://api.inaturalist.org/v1/taxa/${identifier}`
    const res = await fetch(url)
    const species = await res.json()
    setSpecies(species.results[0].taxon_photos[0])
  }

  useEffect(() => {
    if (identifier) fetchSpecies(identifier)
  }, [identifier]);

  if (!species) {
    return (
      <div className="mt-32 flex justify-center">
        <HashLoader color={"#207068"} size={100} />
      </div>
    )
  }

  const { id, name, preferred_common_name, iconic_taxon_name, observations_count, extinct, wikipedia_url } = species.taxon

  return (
    <>

      <Head>
        <title>Cozumon</title>
        <meta name="description" content="Cozumon | Cozumel Taxonomy" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex flex-col items-center px-16 w-screen">


        <Link href="/"><a className="absolute left-4 top-8  border border-dotted p-2 hover:bg-brand hover:text-white transition-all">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </a></Link>

        <h1 className="text-4xl my-8 text-brand">{preferred_common_name}</h1>

        <div className="flex flex-col items-center w-full pb-16">
          <div className="shadow border border-dotted px-8 py-4 mb-8">
            <p>Latin Name: {name}</p>
            <p>Taxonomy: {iconic_taxon_name}</p>
            <p>Number of observations: {observations_count}</p>
            {/* <p>Status: {conservation_status?.status_name ? translateStatusName(conservation_status.status_name) : "no data"}</p> */}
            {extinct ? <p>Species has become extinct...</p> : ``}
            <a href={wikipedia_url} target="_blank" className="mt-4 text-sm block">More information</a>
          </div>

          <Image
            src={species.photo.large_url}
            width={species.photo.original_dimensions.width}
            height={species.photo.original_dimensions.height}
          />
        </div>
      </main>
      {/* <pre>{JSON.stringify(species, null, 2)}</pre> */}
    </>
  )
}

export default Species
