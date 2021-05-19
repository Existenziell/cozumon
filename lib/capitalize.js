const capitalize = (string) => {
  const cap = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
  return string.split(' ').map(cap).join(' ');
}

export default capitalize
