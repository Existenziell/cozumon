const translateStatusName = (name) => {
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

export default translateStatusName
