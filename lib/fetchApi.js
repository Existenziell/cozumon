async function fetchApi(...args) {
  const res = await fetch(...args)
  return await res.json()
}

export default fetchApi
