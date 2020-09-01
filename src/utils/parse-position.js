export function parePositon(position) {
  if (typeof (position) === 'string') {
    const pList = position.split(',')
    if (pList.length >= 1) {
      const index = pList.findIndex(item => isNaN(item) || item === '')
      if (index === -1) {
        const temp = pList.map(i => parseFloat(i))
        return temp
      }
    }
  }
  return false
}
