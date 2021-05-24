import translateStatusName from './translateStatusName'

const downloadCsv = (species) => {
  const rows = [
    ["Name", "Latin Name", "Taxonomy", "Observations", "Status", "Wikipedia Link", "Photo"],
  ]
  species.map(s => {
    const element = [
      s.taxon.preferred_common_name,
      s.taxon.name,
      s.taxon.iconic_taxon_name,
      s.count,
      s.taxon.conservation_status?.status_name ? translateStatusName(s.taxon.conservation_status.status_name) : "no data",
      s.taxon.wikipedia_url,
      s.taxon.default_photo?.medium_url,
    ]
    rows.push(element)
  })

  const csvContent = "data:text/csv;charset=utf-8," + rows.map(e => e.join(",")).join("\n")
  const encodedUri = encodeURI(csvContent)
  return encodedUri
}

export default downloadCsv
