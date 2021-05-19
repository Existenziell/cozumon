const scrollToTop = (e) => {
  e.preventDefault()
  window.scroll({ top: 0, left: 0, behavior: 'smooth' })
}

export default scrollToTop
