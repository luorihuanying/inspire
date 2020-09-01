<template>
  <div class="main">
    <!-- header info nav -->
    <div class="header-box">
      <div class="content">
        <div>项目基地分布地图</div>
        <div>基地数量:{{ regTotal }}个</div>
        <div>分布总面积:{{ totalRange }}公顷</div>
      </div>
    </div>
    <!-- show current region intro -->
    <div class="creginfo">
      <div class="cregcontent">
        <div class="creg">分区:{{ cregName? cregName:'未选' }}</div>
        <div class="czoom">层级：{{ cZoom||9 }}</div>
      </div>
    </div>
    <div class="plot-area">
      <div v-show="plotArea?true:false">计算面积:{{ plotArea.toFixed(4) }}亩</div>
    </div>
    <!-- show current group intro -->
    <div v-show="gIntroVisible" class="cgintro">
      <div class="cgcontent">
        <div style="padding-top:10px">
          <span style="font-weight: 600;">设备组信息</span>
          <i class="el-icon-close" @click="gIntroVisible=false" />
        </div>
        <hr>
        <ul>
          <li>名称：{{ cgInfo.gName }}</li>
          <li>
            <p>简介:</p>
            <p style="text-indent:2em;">{{ cgInfo.desc }}</p>
          </li>
          <li>坐标：{{ cgInfo.gPosition }}</li>
          <li>
            设备总数:
            <span>{{ cgInfo.devsTotal }}个</span>
          </li>
        </ul>
      </div>
    </div>
    <div class="container">
      <div class="mapcontainer" :style="{height:(fullHeight-140)+'px'}">
        <el-amap
          ref="map"
          v-loading="mapLoading"
          vid="amapDemo"
          :center="center"
          :resize-enable="resizeEnable"
          :amap-manager="amapManager"
          :events="events"
          :zooms="[9,20]"
          @zoomchange="zoomchange"
        >
          <el-amap-info-window
            ref="tooltip"
            vid="Tooltip box"
            is-custom="true"
            :position="tooltipPosition"
            :visible="tooltipVisible"
          >
            <!-- Tooltip info box  -->
            <div class="tooltip-box">
              <s class="s">
                <i class="i" />
              </s>
              <div class="tooltip-box">
                <p>
                  <span>基地代号: {{ cregInfo.regName }}</span>
                  <span style="margin-left:10px">基地面积:{{ cregInfo.regRange }}(单位)</span>
                </p>
                <p>
                  <strong>简介 :</strong>
                  <span>{{ cregInfo.regDesc }}</span>
                </p>
                <p>
                  <strong>位置 :</strong>
                  <span>{{ cregInfo.regLocation }}</span>
                </p>
              </div>
              <!-- end Tooltip info box -->
            </div>
          </el-amap-info-window>
        </el-amap>
      </div>
    </div>
    <div v-show="plotIntroVisible" class="side-info">
      <div class="side-header">
        <span>{{ cplot.plotName }}</span>
        <i class="el-icon-close side-close" @click="plotIntroVisible=false" />
        <hr>
      </div>
      <div class="info-content">
        <div class="image_preview">
          <el-image
            class="side-image"
            :src="cplot.layerUrl"
            :preview-src-list="[cplot.layerUrl]"
          />
        </div>
        <div class="info bottom">
          描述：<span>{{ cplot.desc }}</span>
        </div>
        <div class="lotrange bottom">
          当前面积：<span>{{ cplot.lotRange }}平方米</span>
        </div>
      </div>
    </div>

    <div class="footer">
      <p class="copyRight">
        <svg-icon icon-class="copyright" />copyright
      </p>
    </div>
  </div>
</template>
<style scoped lang='scss'>
@import "@/styles/amap.scss";
@import url("//at.alicdn.com/t/font_1660789_otfz79hm9za.css");
.icon {
  width: 1em;
  height: 1em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}
</style>
<script>
import VueAMap from 'vue-amap'
import defaultSettings from '@/settings'
import { getRegDevsInfoFromApi } from '@/api/amap-about'
// import getGridLngLats from '@/utils/map-about'
const amapManager = new VueAMap.AMapManager()
const { mapCenter } = defaultSettings
let map = {}
export default {
  name: 'Amap',
  data() {
    return {
      test: 'https://ftp.bmp.ovh/imgs/2020/03/cd58c169f68fc13f.png',
      url: 'https://ftp.bmp.ovh/imgs/2020/03/cd58c169f68fc13f.png',
      regDevsData: [],
      mapLoading: false,
      gIntroVisible: false,
      tooltipVisible: false,
      plotIntroVisible: false,

      cplot: {
        bounds: undefined,
        desc: '',
        layerUrl: '',
        plotName: '',
        lotRange: 0
      },
      cregInfo: {
        regName: '',
        regDesc: '',
        regLocation: '',
        regRange: 0
      },
      cgInfo: {
        gName: '',
        gDesc: '',
        gPosition: '',
        gDevsTotal: 0
      },

      cregName: '', // current region
      regTotal: 0,
      totalRange: 0,
      gIntro: {},

      tooltipPosition: mapCenter,
      fullHeight: document.documentElement.clientHeight,
      dragEnable: true,
      resizeEnable: true,
      center: mapCenter,
      amapManager,
      events: {
        init: this.mapInit,
        zoomchange: this.zoomchange,
        complete: this.mapInitComplete
      },

      cZoom: 0,
      regionGroupMarkerData: {},
      devsMarkerData: {},
      AMapUIPlugin: {},
      regOverlayManageList: [],
      regList: [],
      regImageLayer: [], // 图层管理

      infoWin: {}, // 地块的信息窗口
      plotArea: 0
    }
  },
  watch: {
    fullHeight(val) {
      if (!this.timer) {
        this.fullHeight = val
        console.log('fullHeight', this.fullHeight)
        this.timer = true
        const that = this
        setTimeout(function() {
          that.timer = false
        }, 400)
      }
    }
  },
  created() {
    console.log('get data from api')
    this.getRegDevsInfo()
  },
  mounted() {
    const that = this
    window.onresize = () => {
      return (() => {
        that.fullHeight = document.documentElement.clientHeight
      })()
    }
  },
  methods: {
    getRegDevsInfo() {
      getRegDevsInfoFromApi().then(res => {
        this.regDevsData = res.data
      })
    },
    // init map setting
    mapInit(amap) {
      map = amap
      this.mapLoading = true
      // lazy load ui plugin
      // 覆盖默认的css引用
      AMapUI.define(
        'polyfill/require/require-css/css!plug/ext/font-awesome/css/font-awesome',
        [],
        function() {}
      )
      AMapUI.loadUI(
        ['overlay/SimpleMarker', 'overlay/AwesomeMarker'],
        (SimpleMarker, AwesomeMarker) => {
          // save AMapUIPlugin
          this.AMapUIPlugin = { SimpleMarker, AwesomeMarker }
          this.pageInit()
        }
      )
      // set map style
      map.setMapStyle('amap://styles/fresh')
      const bounds = map.getBounds()
      const limitBounds = map.getLimitBounds()
      if (!limitBounds) {
        map.setLimitBounds(bounds)
      } else {
        this.$message.error('set map style error')
      }
      this.mapLoading = false
    },
    mapInitComplete() {
    // create util AMap.InfoWindow
      const plotInfoWin = new AMap.InfoWindow({ anchor: 'bottom-center' })
      this.infoWin = { plotInfoWin }
    },
    // 构造覆盖物
    pageInit() {
      const data = this.regDevsData
      if (data.length) {
        this.regMarkerInit()
      } else {
        console.log('get api data')
        getRegDevsInfoFromApi().then(res => {
          this.regDevsData = res.data
          this.regMarkerInit()
        })
      }
    },
    // 对覆盖区进行初始化, 构造管理对象
    overlayInit() {
      const regList = this.regList
      const regOverlayManageList = []
      for (const regObj of regList) {
        const lotBoundaryGroup = new AMap.OverlayGroup(regObj.lotPolygons)
        map.add(lotBoundaryGroup)
        lotBoundaryGroup.show()

        const regSMOverlayGroup = new AMap.OverlayGroup(regObj.regSCMarker[0])
        regSMOverlayGroup.show()

        const regCMOverlayGroup = new AMap.OverlayGroup(regObj.regSCMarker[1])
        map.add(regCMOverlayGroup)
        regCMOverlayGroup.show()

        const gSMOverlayGroup = new AMap.OverlayGroup(regObj.gSCMarker[0])
        gSMOverlayGroup.hide()

        const gCMOverlayGroup = new AMap.OverlayGroup(regObj.gSCMarker[1])
        map.add(gCMOverlayGroup)
        gCMOverlayGroup.hide()

        const devsMOverlayGroup = new AMap.OverlayGroup(regObj.devsMarker)
        devsMOverlayGroup.hide()

        const dpsMOverlayGroup = new AMap.OverlayGroup(regObj.dpMarker)
        dpsMOverlayGroup.hide()

        const pLinesOverlayGroup = new AMap.OverlayGroup(regObj.pLines)
        map.add(pLinesOverlayGroup)
        pLinesOverlayGroup.hide()

        regOverlayManageList.push({
          regName: regObj.regName,
          lotBoundaryGroup,
          regSMOverlayGroup,
          regCMOverlayGroup,
          gSMOverlayGroup,
          gCMOverlayGroup,
          devsMOverlayGroup,
          dpsMOverlayGroup,
          pLinesOverlayGroup
        })
      }
      // set current region
      this.cregName = regList[0].regName
      // console.log(this.cregName)
      this.regOverlayManageList = regOverlayManageList
    },
    // init region marker
    regMarkerInit() {
      const SimpleMarker = this.AMapUIPlugin.SimpleMarker
      const data = this.regDevsData

      this.regTotal = data.length // 区域总数
      const regList = []
      const regImageLayer = []
      let totalRange = 0
      for (const reg of data) {
        totalRange = +reg.regRange
        const groups = reg.groups
        // set simple marker
        const regSMarker = new SimpleMarker({
          showPositionPoint: {
            color: 'green', // 定位点
            radius: 4
          },
          iconLabel: reg.regName.charAt(0),
          iconStyle: 'red',
          map: map,
          position: reg.position
        })
        regSMarker.on('click', e => {
          this.cregName = reg.regName
          this.handelRegionMarkerClick(reg.position)
        })
        regSMarker.on('mouseover', e => {
          this.cregInfo.regDesc = reg.desc || '没有描述'
          this.cregInfo.regLocation = reg.location || ''
          this.cregInfo.regName = reg.regName
          this.cregInfo.regRange = reg.regRange
          const tooltip = this.$refs.tooltip.$$getInstance()
          tooltip.setPosition(reg.position)
          tooltip.setAnchor('top-center')
          // tooltip.setOffset(new AMap.Pixel(140, 75))
          this.tooltipVisible = true
        })
        regSMarker.on('mouseout', e => {
          // console.log(this.$refs.tooltip.$$getInstance().setOffset)
          this.tooltipVisible = false
        })
        // set  reg circle market
        const regCMarker = new AMap.CircleMarker({
          center: reg.position,
          radius: 32, // 3D视图下，regCMarker半径不要超过64px
          strokeColor: 'white',
          strokeWeight: 2,
          strokeOpacity: 0.5,
          fillColor: 'green',
          fillOpacity: 0.5,
          zIndex: 10,
          bubble: true,
          cursor: 'pointer',
          clickable: true
        })
        regCMarker.on('click', e => {
          this.cregName = reg.regName
          this.handelRegionMarkerClick(reg.position)
        })
        // ini lot ployons
        const tempPloy = this.lotBoundaryInit(reg.plots)
        // init this region devs groups
        const gdevdpp = this.groupMarkerInit(groups)
        const tempregInfo = {
          regName: reg.regName,
          lotPolygons: tempPloy.lotPolygons,
          regSCMarker: [regSMarker, regCMarker],
          gSCMarker: gdevdpp.gMarkerList,
          devsMarker: gdevdpp.devsMarkerList,
          dpMarker: gdevdpp.pAllMarker,
          pLines: gdevdpp.pLines
        }
        regList.push(tempregInfo)
        regImageLayer.push({ regName: reg.regName, imageLayers: tempPloy.imageLayers })
      }
      this.totalRange = totalRange // 区域面积
      this.regList = regList
      this.regImageLayer = regImageLayer
      this.overlayInit()
    },

    // set polyons bounds 地块边界
    lotBoundaryInit(plots) {
      const plotList = plots
      const lotPolygons = []
      const imageLayers = []
      for (const plot of plotList) {
        let exterior = plot.exterior
        const exteriorLen = exterior.length
        const times = parseInt(exteriorLen / 40)
        if (times < 1) {
          exterior = this.convertFrom(exterior)
        } else {
          let tempList = []
          for (let i = 0; i <= times; i++) {
            const len = tempList.length
            const start = len > 0 ? len : 0
            const end = start + 40 <= exteriorLen ? start + 40 : exteriorLen
            tempList = tempList.concat(this.convertFrom(exterior.slice(start, end)))
          }
          exterior = tempList
        }
        // 描绘地块边界
        const polygon = new AMap.Polygon({
          zIndex: plot.plotName === '总边缘' ? 12 : 15,
          strokeWeight: 0.1,
          borderWeight: 1,
          path: exterior,
          fillOpacity: 0,
          fillColor: '#000',
          cursor: 'pointer',
          strokeColor: '#fff'
          // strokeColor: plot.plotName === '总边缘' ? 'red' : 'green'
        })
        // 设置自定义属性 init mouse events
        polygon.setExtData({ plotName: plot.plotName })
        this.plotMouseEventsInit(polygon, plot)
        lotPolygons.push(polygon)

        const temp = this.imageLayerInit(plot)
        imageLayers.push(temp)
      }

      map.getLayers(imageLayers)
      return { lotPolygons, imageLayers }
    },
    // ImageLayerinit
    imageLayerInit(plot) {
      const bounds = this.convertFrom([
        plot.bounds.slice(0, 2),
        plot.bounds.slice(2, 4)
      ])
      const imageLayer = new AMap.ImageLayer({
        bounds: new AMap.Bounds(bounds[0], bounds[1]),
        url: plot.layerUrl, // 图片 Url
        zIndex: 20,
        zooms: plot.plotName === '总边缘' ? [3, 14] : [15, 19],
        map: map
      })
      return { layerName: plot.plotName, imageLayer: imageLayer }
    },
    // init groups
    groupMarkerInit(groups) {
      const SimpleMarker = this.AMapUIPlugin.SimpleMarker
      const groupList = groups
      const gSMarkerList = []
      const gCMarkerList = []
      let devsMarkerList = []
      let pAllMarker = []
      let pLines = []
      for (const group of groupList) {
        const devs = group.devs
        const gSMarker = new SimpleMarker({
          showPositionPoint: {
            color: 'green', // 定位点
            radius: 2
          },
          iconStyle: 'lightblue',
          iconLabel: '组',
          map: map,
          title: group.gName,
          position: group.position
        })
        const gCMarker = new AMap.CircleMarker({
          center: group.position,
          radius: 16, // 3D视图下，regCMarker半径不要超过64px
          strokeColor: 'white',
          strokeWeight: 2,
          strokeOpacity: 0.5,
          fillColor: 'lightgreen',
          fillOpacity: 0.4,
          zIndex: 10,
          bubble: true,
          cursor: 'pointer',
          clickable: true
        })
        // init mouse events
        this.devsGrpupMouseEventsInit(gSMarker, gCMarker, group)
        // save group S/C marker to list
        gSMarkerList.push(gSMarker)
        gCMarkerList.push(gCMarker)
        // init devs markers
        const temp = this.devsMarkerInit(devs) // return {devsMarkerList, pAllMarker, pLines}
        devsMarkerList = devsMarkerList.concat(temp.devsMarkerList)
        pAllMarker = pAllMarker.concat(temp.pAllMarker)
        pLines = pLines.concat(temp.pLines)
      }
      return {
        gMarkerList: [gSMarkerList, gCMarkerList],
        devsMarkerList: devsMarkerList,
        pAllMarker: pAllMarker,
        pLines: pLines
      }
    },
    // init devs marker
    devsMarkerInit(devs) {
      const AwesomeMarker = this.AMapUIPlugin.AwesomeMarker
      const devsList = devs
      const devsMarkerList = []
      let pAllMarker = []
      let pLines = []
      for (const dev of devsList) {
        // set Smarker
        const dSMarker = new AwesomeMarker({
          showPositionPoint: { color: 'green', radius: 2 },
          awesomeIcon: 'iconapp_icons--',
          getClassnamesOfAwesomeIcon: function(icon) {
            return 'iconfont ' + icon
          },
          iconLabel: {
            style: {
              color: 'black',
              fontSize: '16px'
            }
          },
          iconStyle: 'red',
          map: map,
          cursor: 'pointer',
          position: dev.position
        })
        devsMarkerList.push(dSMarker)
        this.devsMouseEventsInit(dSMarker, dev)
        // init datapoints marker
        const temp = this.dataPointMarkerInit(dev) // return: {pSomeMarker, plines}
        pAllMarker = pAllMarker.concat(temp.pSomeMarker)
        pLines = pLines.concat(temp.plines)
      }
      return { devsMarkerList, pAllMarker, pLines }
    },
    // init datapoints marker
    dataPointMarkerInit(dev) {
      const AwesomeMarker = this.AMapUIPlugin.AwesomeMarker
      const dpList = dev.dataPoints
      const pSomeMarker = []
      const plines = []
      for (const dpoint of dpList) {
        const pMarker = new AwesomeMarker({
          showPositionPoint: {
            color: 'green',
            radius: 1
          },
          awesomeIcon: 'iconhuabanfuben',
          // 注意空格'iconfont '
          getClassnamesOfAwesomeIcon: function(icon) {
            return 'iconfont ' + icon
          },
          iconLabel: {
            style: {
              color: 'black',
              fontSize: '8px'
            }
          },
          title: dpoint.dpName,
          iconStyle: 'green',
          map: map,
          cursor: 'pointer',
          position: dpoint.position
        })
        // init mouse events
        this.dpMouseEventInit(pMarker, dpoint)
        pSomeMarker.push(pMarker)
        // set polyline
        const polyline = new AMap.Polyline({
          path: [dev.position, dpoint.position],
          isOutline: false,
          outlineColor: '#ffeeff',
          borderWeight: 1,
          strokeColor: 'red',
          strokeOpacity: 1,
          strokeWeight: 1,
          // 折线样式还支持 'dashed'
          strokeStyle: 'dashed',
          // strokeStyle是dashed时有效
          strokeDasharray: [10, 2, 10],
          lineJoin: 'round',
          lineCap: 'round',
          zIndex: 100
        })
        plines.push(polyline)
      }
      return { pSomeMarker, plines }
    },
    handelRegionMarkerClick(position) {
      this.tooltipVisible = false
      setTimeout(_ => {
        map.setCenter(position)
        map.setZoom(15)
      }, 500)
    },
    positonTostring(position) {
      const temp = position.map(f => {
        return f.toFixed(2)
      })
      return temp.toString()
    },
    // 地块/边界初始化事件
    plotMouseEventsInit(polygon, plot) {
      const p = polygon
      p.on('mouseover', e => {
        this.handlePlotMouseEvents(p, e, plot)
      })
      p.on('mouseout', e => {
        // console.log(e)
        this.handlePlotMouseEvents(p, e, plot)
      })
      p.on('click', e => {
        this.handlePlotMouseEvents(p, e, plot)
      })
    },
    // 地块事件处理
    handlePlotMouseEvents(polygon, e, plot) {
      const pinfo = this.infoWin.plotInfoWin
      const area = polygon.getArea() * 0.0015
      // to do when czoom >14
      if (this.cZoom >= 15) {
        if (e.type === 'mouseout') {
          polygon.setOptions({ fillOpacity: 0 })
          this.plotArea = 0
        }
        if (e.type === 'mouseover') {
          polygon.setOptions({ fillOpacity: 0.4 })
          this.plotArea = area
        }
        if (e.type === 'click') {
          const t = polygon.getExtData()
          pinfo.setContent(t.plotName)
          pinfo.getPosition()
          pinfo.open(map, e.lnglat)
          setTimeout(e => {
            pinfo.close()
          }, 1000)
          this.cplot = Object.assign({}, plot)

          // console.log(plot)
          this.plotIntroVisible = true
        }
      }

      // console.log(plotName)
      // console.log(this.regImageLayer)
      // const cregImageLayer = ''
      // for (const item of this.regImageLayer) {
      //   if (item.regName === this.cregName) {
      //     for (const cIY of item.imageLayers) {
      //       if (cIY.layerName === plotName) {
      //         const cImageLayer = cIY.imageLayer
      //         cImageLayer.show()
      //       } else {
      //         // cIY.imageLayer.hide()
      //       }
      //     }
      //   }
      //
    },
    // devsGroup mouse events init
    devsGrpupMouseEventsInit(gSMarker, gCMarker, gInfo) {
      const gs = gSMarker
      const gc = gCMarker
      if (gs) {
        gs.on('click', e => {
          this.handledevsGrpupMouseEvents(gs, e, gInfo)
        })
      }
      if (gc) {
        gc.on('click', e => {
          this.handledevsGrpupMouseEvents(gc, e, gInfo)
        })
      }
    },
    // handle devsGroup events
    handledevsGrpupMouseEvents(marker, e, gInfo) {
      if (e.type === 'click') {
        this.cgInfo.gName = gInfo.gName
        this.cgInfo.desc = gInfo.desc
        this.cgInfo.gPosition = this.positonTostring(gInfo.position)
        this.cgInfo.devsTotal = gInfo.devsTotal
        this.plotIntroVisible = false
        this.gIntroVisible = true
      }
    },
    // devs mouse events init
    devsMouseEventsInit(devsMarker, dev) {
      const dm = devsMarker
      dm.on('click', e => {
        this.handleDevsMouseEvents(dm, e, dev)
      })
    },
    handleDevsMouseEvents(marker, e, devInfo) {
      if (e.type === 'click') {
        this.plotIntroVisible = false
        this.gIntroVisible = false
        alert(devInfo.position)
      }
    },
    dpMouseEventInit(marker, dpInfo) {
      marker.on('click', e => {
        this.handleDpMouseEvents(marker, e, dpInfo)
      })
    },
    handleDpMouseEvents(marker, e, dpInfo) {
      if (e.type === 'click') {
        alert(dpInfo.position)
      }
    },

    // 修改覆盖物可见状态
    modifyOverlayStatus(status) {
      if (status === 'small') {
        for (const o of this.regOverlayManageList) {
          if (o.regName === this.cregName) {
            o.lotBoundaryGroup.show()
            o.regSMOverlayGroup.show()
            o.regCMOverlayGroup.show()
            o.gSMOverlayGroup.hide()
            o.gCMOverlayGroup.hide()
            o.devsMOverlayGroup.hide()
            o.dpsMOverlayGroup.hide()
            o.pLinesOverlayGroup.hide()
          } else {
            for (const t in o) {
              if (typeof t !== 'string') {
                t.hide()
              }
            }
          }
        }
      }
      if (status === 'medium') {
        for (const o of this.regOverlayManageList) {
          if (o.regName === this.cregName) {
            o.lotBoundaryGroup.show()
            o.regSMOverlayGroup.hide()
            o.regCMOverlayGroup.hide()
            o.gSMOverlayGroup.show()
            o.gCMOverlayGroup.show()
            o.devsMOverlayGroup.hide()
            o.dpsMOverlayGroup.hide()
            o.pLinesOverlayGroup.hide()
          } else {
            for (const t in o) {
              if (typeof t !== 'string') {
                t.hide()
              }
            }
          }
        }
      }
      if (status === 'large') {
        for (const o of this.regOverlayManageList) {
          if (o.regName === this.cregName) {
            o.lotBoundaryGroup.show()
            o.regSMOverlayGroup.hide()
            o.regCMOverlayGroup.hide()
            o.gSMOverlayGroup.show()
            o.gCMOverlayGroup.hide()
            o.devsMOverlayGroup.show()
            o.dpsMOverlayGroup.hide()
            o.pLinesOverlayGroup.hide()
          } else {
            for (const t in o) {
              if (typeof t !== 'string') {
                t.hide()
              }
            }
          }
        }
      }
      if (status === 'moreLarge') {
        for (const o of this.regOverlayManageList) {
          if (o.regName === this.cregName) {
            o.lotBoundaryGroup.show()
            o.regSMOverlayGroup.hide()
            o.regCMOverlayGroup.hide()
            o.gSMOverlayGroup.hide()
            o.gCMOverlayGroup.hide()
            o.devsMOverlayGroup.show()
            o.dpsMOverlayGroup.show()
            o.pLinesOverlayGroup.show()
          } else {
            for (const t in o) {
              if (typeof t !== 'string') {
                t.hide()
              }
            }
          }
        }
      }
    },
    // zoomchange
    zoomchange() {
      const cZoom = map.getZoom()
      this.cZoom = cZoom
      if (cZoom >= 16) {
        this.modifyOverlayStatus('moreLarge')
      } else if (cZoom > 15) {
        // show devs marker ,hide reg and group marker
        this.modifyOverlayStatus('large')
      } else if (cZoom > 12) {
        // show group marker hide reg and devs marker
        this.plotIntroVisible = false
        this.modifyOverlayStatus('medium')
      } else {
        // show reg hide dev and group

        this.modifyOverlayStatus('small')
      }
    },
    convertFrom(list, type) {
      const temp = list
      if (type) {
        AMap.convertFrom(list, type, (status, res) => {
          if (status === 'complete') {
            return res.locations
          } else {
            this.$message.error('坐标转换错误！')
          }
        })
      } else {
        // console.log('no type') // for debug
      }
      return temp
    }
  }
}
</script>

