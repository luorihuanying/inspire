/**
     * 返回一批网格排列的经纬度

     * @param  {AMap.LngLat} center 网格中心
     * @param  {number} colNum 列数
     * @param  {number} size  总数
     * @param  {number} cellX  横向间距
     * @param  {number} cellY  竖向间距
     * @return {Array}  返回经纬度数组
     */
export function getGridLngLats(map, center, colNum, size, cellX, cellY) {
  var pxCenter = map.lnglatToPixel(center)

  var rowNum = Math.ceil(size / colNum)

  var startX = pxCenter.getX()
  var startY = pxCenter.getY()

  cellX = cellX || 70

  cellY = cellY || 70

  var lngLats = []

  for (var r = 0; r < rowNum; r++) {
    for (var c = 0; c < colNum; c++) {
      var x = startX + (c - (colNum - 1) / 2) * (cellX)

      var y = startY + (r - (rowNum - 1) / 2) * (cellY)

      lngLats.push(map.pixelToLngLat(new AMap.Pixel(x, y)))

      if (lngLats.length >= size) {
        break
      }
    }
  }
  return lngLats
}

/**
 *
 * @param {*} data
 * @return {String} string
 */
export function positonTostring(data) {
  if (data instanceof Array) {
    const temp = data.map(f => {
      return f.toFixed(2)
    })
    return temp.toString()
  } else if (data instanceof Object && data.position) {
    const temp = data.position.map(f => {
      return f.toFixed(2)
    })
    return temp.toString()
  }
  return '无坐标'
}
