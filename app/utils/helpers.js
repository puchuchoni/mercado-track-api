module.exports = {
  stringify,
  chunkArray
}

function stringify (json) {
  return JSON.stringify(json, null, 4)
}

function chunkArray (arr, size) {
  const len = arr.length
  const res = []
  for (let i = 0; i < len; i += size) {
    const chunk = arr.slice(i, i + size)
    res.push(chunk)
  }
  return res
}
