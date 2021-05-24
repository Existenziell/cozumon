const capitalize = (string) => {
  const cap = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1)
  }
  if (!string) return
  return string.split(' ').map(cap).join(' ')
}

export default capitalize
