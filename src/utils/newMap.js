class Dictionary {
  constructor(keys, values) {
    if (keys && values) {
      // eslint-disable-next-line no-array-constructor
      const data = new Array()
      for (let i = 0; i < keys.length;) {
        data[keys[i]] = values[i]
      }
      this.data = data
      // eslint-disable-next-line no-array-constructor
    } else { this.data = new Array() }
  }
  add(key, value) {
    this.data[key] = value
  }
  find(key) {
    return this.data[key]
  }
  getFirstKey() {
    const keys = Object.keys(this.data)
    return keys[0]
  }
  getKeys() {
    return Object.keys(this.data)
  }
  remove(key) {
    var temp = this.data[key]
    delete this.data[key]
    return temp
  }
  update(key, newData) {
    this.data[key] = newData
    return this.data[key]
  }
  changeKey(oldKey, newKey) {
    if (oldKey === newKey) { return true }
    const data = this.data[oldKey]
    delete this.data[oldKey]
    const keys = Object.keys(this.data)
    if (keys.indexOf(newKey) >= 0) { return false } else {
      this.data[newKey] = data
      return true
    }
  }
  checkKey(key) {
    const keys = Object.keys(this.data)
    if (keys.indexOf(key) >= 0) { return false } else {
      return true
    }
  }
  getData() {
    return this.data
  }
  count() {
    return Object.keys(this.data).length
  }
  clearAll() {
    for (var key of Object.keys(this.data)) {
      delete this.data[key]
    }
  }
  toList() {
    const temp = []
    for (const key of Object.keys(this.data)) {
      temp.push(this.data[key])
    }
    return temp
  }
}
export default Dictionary
