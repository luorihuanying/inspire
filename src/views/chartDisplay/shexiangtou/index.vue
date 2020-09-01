<template>
  <div class="wholeRange">
    <div class="deviceInfo">
      <div class="deviceInfoLeftRight">
        <div class="deviceInfoLeft">
          <div class="shang"><div class="shipin">
            <p style="  text-align: center;margin-top: -20px;">图像采集时间： {{ latestPic }}</p>
            <el-image style="width: 650px; height: 280px" :src="url[0]" :preview-src-list="srcList" />
          </div></div>
          <div class="xia">
            <ul class="ulClass">
              <li class="jj">温度：       {{ newest.wendu }}℃</li>
              <li class="jj">大气压强：    {{ newest.qiya }}hPa</li>
              <li class="jj">光照时长：    {{ newest.guangqiang }}Lux</li>
              <li class="jj">采集时间：    {{ newest.shijian }}</li>
            </ul>
          </div>
        </div>
        <div class="deviceInfoRight">
          <div class="externalOfP">
            <p>设备参数</p>
            <p>设备名称：   {{ this.model.设备名称 }}</p>
            <p>在线状态：   {{ this.model.在线状态 }}</p>
            <p>设备编号：   {{ this.model.设备编号 }}</p>
            <p>设备型号：   {{ this.model.设备型号 }}</p>
            <p>拍摄间隔：   {{ this.model.拍摄间隔 }}分钟</p>
            <p>充电状态：   {{ this.model.充电状态 }}</p>
            <p>最后活跃时间：   {{ this.model.最后活跃时间 }}</p>
            <p>位置信息：   {{ this.model.位置信息 }}</p>
            <p>海拔高度：   {{ this.model.海拔高度 }}米</p>
            <p>经度：   {{ this.model.经度 }}°</p>
            <p>纬度：   {{ this.model.纬度 }}°</p>
          </div>
        </div>
      </div>
    </div>
    <div class="centerSection1">
      <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
        <el-tab-pane label="相册" name="first" />
        <el-tab-pane label="图表" name="second" />
        <el-tab-pane label="日照时长" name="third" />
      </el-tabs>
    </div>
    <div id="shabi" class="centerSection2">
      <div class="timeButton">
        <el-button type="info" plain @click="today()">今日</el-button>
        <el-button type="info" plain @click="month()">近30天</el-button>
        <el-button type="info" plain @click="year()">近一年</el-button>
      </div>
      <div class="block">
        <el-date-picker
          v-model="value1"
          type="datetime"
          placeholder="选择日期时间"
          value-format="timestamp"
          @change="changeRuleDate"
        />
      </div>
      <div class="download">
        <el-button type="info" plain class="el-icon-download" @click="exportData()">导出数据</el-button>
      </div>
    </div>
    <div class="figureArea">
      <div id="xiangce" class="shellOfPic">
        <div class="circle-pic"><el-image style="width: 250px; height: 175px" :src="url[0]" :preview-src-list="srcList" class="picture" />
          <span class="demonstration">{{ picName[0] }}</span>
        </div>
        <div class="circle-pic"><el-image style="width: 250px; height: 175px" :src="url[1]" :preview-src-list="srcList" class="picture" />
          <span class="demonstration">{{ picName[1] }}</span>
        </div>
        <div class="circle-pic"><el-image style="width: 250px; height: 175px" :src="url[2]" :preview-src-list="srcList" class="picture" />
          <span class="demonstration">{{ picName[2] }}</span>
        </div>
        <div class="circle-pic"><el-image style="width: 250px; height: 175px" :src="url[3]" :preview-src-list="srcList" class="picture" />
          <span class="demonstration">{{ picName[3] }}</span>
        </div>
        <div class="circle-pic"><el-image style="width: 250px; height: 175px" :src="url[4]" :preview-src-list="srcList" class="picture" />
          <span class="demonstration">{{ picName[4] }}</span>
        </div>
        <div class="circle-pic"><el-image style="width: 250px; height: 175px" :src="url[5]" :preview-src-list="srcList" class="picture" />
          <span class="demonstration">{{ picName[5] }}</span>
        </div>
        <div class="circle-pic"><el-image style="width: 250px; height: 175px" :src="url[6]" :preview-src-list="srcList" class="picture" />
          <span class="demonstration">{{ picName[6] }}</span>
        </div>
        <div class="circle-pic"><el-image style="width: 250px; height: 175px" :src="url[7]" :preview-src-list="srcList" class="picture" />
          <span class="demonstration">{{ picName[7] }}</span>
        </div>
        <div class="circle-pic"><el-image style="width: 250px; height: 175px" :src="url[8]" :preview-src-list="srcList" class="picture" />
          <span class="demonstration">{{ picName[8] }}</span>
        </div>
        <div class="circle-pic"><el-image style="width: 250px; height: 175px" :src="url[9]" :preview-src-list="srcList" class="picture" />
          <span class="demonstration">{{ picName[9] }}</span>
        </div>
        <div class="circle-pic"><el-image style="width: 250px; height: 175px" :src="url[10]" :preview-src-list="srcList" class="picture" />
          <span class="demonstration">{{ picName[10] }}</span>
        </div>
        <div class="circle-pic"><el-image style="width: 250px; height: 175px" :src="url[11]" :preview-src-list="srcList" class="picture" />
          <span class="demonstration">{{ picName[11] }}</span>
        </div>
      </div>
      <div id="tubiao" class="shellOfChart">
        <div class="chart1">
          <div id="chart1" style="width: 500px;height:300px;" class="chartClass" />
        </div>
        <div class="chart2">
          <div id="chart2" style="width: 500px;height:300px;" class="chartClass" />
        </div>
        <div class="chart3">
          <div id="chart3" style="width: 500px;height:300px;" class="chartClass" />
        </div>
        <div class="chart4">
          <div id="chart4" style="width: 500px;height:300px;" class="chartClass" />
        </div>
      </div>
      <div id="rzsc" class="shellOfChart2">
        <div id="rizhaosh" style="width: 1100px;height:650px;margin: 0 auto;margin-top: 25px;;" />
      </div>
    </div>
  </div>
</template>
<style lang='scss' >
  @import "@/styles/chart.scss";
</style>
<script>
import { getCamera } from '@/api/chartData'
import { getDayData } from '@/api/chartData'
import { getMonthData } from '@/api/chartData'
import { getYearData, downloadData, getlivePic } from '@/api/chartData'
import echarts from 'echarts'
require('script-loader!file-saver')
require('../../../vendor/Blob')// 配置地址根据实际配置
require('script-loader!xlsx/dist/xlsx.core.min')
export default {
  data() {
    return {
      newest: {},
      latestPic: '',
      picName: [],
      url: [],
      srcList: [],
      model: {},
      activeName: 'second',
      value1: ''
    }
  },
  created() {
    this.getCameraData()
    this.getDay()
    this.getMonth()
    this.getYear()
    this.livePic()
  },
  methods: {
    livePic() {
      getlivePic().then(res => {
        this.url = res.data.image
        this.picName = res.data.createTime
        this.srcList = res.data.image
        this.latestPic = res.data.latestPic
      })
    },
    // 弹出框
    open(msg) {
      this.$alert(msg, '提示', {
        confirmButtonText: '确定',
        callback: action => {
          this.$message({
            type: 'info',
            message: `action: ${action}`
          })
        }
      })
    },
    exportData() {
      if (this.excelData.code === 400) {
        this.open(this.excelData.msg)
      } else {
        require.ensure([], () => {
          const { export_json_to_excel } = require('../../../vendor/Export2Excel')
          const tHeader = ['时间', '湿度平均值', '湿度最大值', '湿度最小值', '光强平均值', '光强最大值', '光强最小值', '气压平均值', '气压最大值', '气压最小值', '温度平均值', '温度最小值', '温度最小值']// 生成Excel表格的头部标题栏
          // 生成Excel表格的内容栏（根据自己的数据内容属性填写）
          const filterVal = ['date', 'hav', 'hm', 'hmi', 'iav', 'im', 'imi', 'pav', 'pm', 'pmi', 'tav', 'tm', 'tmi']
          // 需要导出Excel的数据
          var temp = []
          for (var i = 0; i < this.excelData.data.date.length; i++) {
            var dict = {}
            dict['date'] = this.excelData.data.date[i]
            dict['hav'] = this.excelData.data.humidity.average[i]
            dict['hm'] = this.excelData.data.humidity.max[i]
            dict['hmi'] = this.excelData.data.humidity.min[i]
            dict['iav'] = this.excelData.data.illumination.average[i]
            dict['im'] = this.excelData.data.illumination.max[i]
            dict['imi'] = this.excelData.data.illumination.min[i]
            dict['pav'] = this.excelData.data.pressure.average[i]
            dict['pm'] = this.excelData.data.pressure.max[i]
            dict['pmi'] = this.excelData.data.pressure.min[i]
            dict['tav'] = this.excelData.data.temperature.average[i]
            dict['tm'] = this.excelData.data.temperature.max[i]
            dict['tmi'] = this.excelData.data.temperature.min[i]
            temp.push(dict)
          }
          const list = temp
          const data = this.formatJson(filterVal, list)
          export_json_to_excel(tHeader, data, '摄像头数据')// 这里可以定义你的Excel表的默认名称
        })
      }
    },
    formatJson(filterVal, list) {
      return list.map(v => filterVal.map(j => v[j]))
    },
    changeRuleDate(value) {
      var data = { 'value': value }
      downloadData(data).then(res => {
        this.excelData = res
      })
    },
    getCameraData() {
      getCamera().then(res => {
        this.model = res.data
      })
    },
    handleClick(tab, event) {
      var xiangce = document.getElementById('xiangce')// 得到这个DIV。
      var tubiao = document.getElementById('tubiao')// 得到这个DIV。
      var rzsc = document.getElementById('rzsc')// 得到这个DIV。
      if (tab.label === '相册') {
        xiangce.style.visibility = 'visible'
        tubiao.style.visibility = 'hidden'
        rzsc.style.visibility = 'hidden'
        document.getElementById('shabi').style.visibility = 'hidden'
      }
      if (tab.label === '图表') {
        xiangce.style.visibility = 'hidden'
        tubiao.style.visibility = 'visible'
        rzsc.style.visibility = 'hidden'
        document.getElementById('shabi').style.visibility = 'visible'
      }
      if (tab.label === '日照时长') {
        xiangce.style.visibility = 'hidden'
        tubiao.style.visibility = 'hidden'
        rzsc.style.visibility = 'visible'
        document.getElementById('shabi').style.visibility = 'hidden'
        this.rizhaotu(this.monthDay.date, this.monthDay.sunshine)
      }
    },
    getDay() {
      getDayData().then(res => {
        this.dayData = res.data
        this.newest = res.data.newest
        this.c = [['chart1', '湿度%', res.data.avgMaxMin[0]], ['chart2', '光强Lux', res.data.avgMaxMin[1]], ['chart3', '气压hPa', res.data.avgMaxMin[2]], ['chart4', '温度℃', res.data.avgMaxMin[3]]]
        this.h = [this.dayData.humidity, this.dayData.illumination, this.dayData.pressure, this.dayData.temperature]
        this.today()
      })
    },
    getMonth() {
      getMonthData().then(res => {
        this.monthDay = res.data
        this.mon = [this.monthDay.humidity, this.monthDay.illumination, this.monthDay.pressure, this.monthDay.temperature]
      })
    },
    getYear() {
      getYearData().then(res => {
        this.yearDay = res.data
        this.yea = [this.yearDay.humidity, this.yearDay.illumination, this.yearDay.pressure, this.yearDay.temperature]
      })
    },
    picDay(chart, x, y) {
      var start = echarts.init(document.getElementById(chart[0]))
      start.setOption({
        title: {
          text: '最大值：' + chart[2][0] + '    |    最小值：' + chart[2][1] + '    |    平均值：' + chart[2][2],
          left: 'center',
          textStyle: {// 主标题文本样式{"fontSize": 18,"fontWeight": "bolder","color": "#333"}
            fontFamily: 'Arial, Verdana, sans...',
            fontSize: 12,
            fontStyle: 'normal',
            fontWeight: 'normal'
          }
        },
        tooltip: {
          trigger: 'axis'
        },
        xAxis: {
          type: 'category',
          data: x,
          name: '时间'
        },
        yAxis: {
          type: 'value',
          name: chart[1]
        },
        series: [{
          data: y,
          type: 'line'
        }]
      }, true)
    },
    picMonth(chart, x, y) {
      var start = echarts.init(document.getElementById(chart[0]))
      start.setOption({
        title: {
          text: chart[1].substring(0, 2) + '随时间的变化趋势',
          left: 'center',
          textStyle: {// 主标题文本样式{"fontSize": 18,"fontWeight": "bolder","color": "#333"}
            fontFamily: 'Arial, Verdana, sans...',
            fontSize: 12,
            fontStyle: 'normal',
            fontWeight: 'normal'
          }
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          padding: [40, 0, 0, 0], // 可设定图例[距上方距离，距右方距离，距下方距离，距左方距离]
          data: ['平均值', '最大值', '最小值']
        },
        xAxis: {
          type: 'category',
          data: x,
          name: '时间'
        },
        yAxis: {
          type: 'value',
          name: chart[1]
        },
        series: [{
          data: y.average,
          type: 'line',
          name: '平均值'
        },
        {
          data: y.max,
          type: 'line',
          name: '最大值'
        },
        {
          data: y.min,
          type: 'line',
          name: '最小值'
        }]
      }, true)
    },
    rizhaotu(x, y) {
      var rz = echarts.init(document.getElementById('rizhaosh'))
      rz.setOption({
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            crossStyle: {
              color: '#999'
            }
          }
        },
        toolbox: {
          feature: {
            dataView: { show: true, readOnly: false },
            magicType: { show: true, type: ['line', 'bar'] },
            restore: { show: true },
            saveAsImage: { show: true }
          }
        },
        title: {
          text: '月日照时长',
          left: 'center',
          padding: [10, 0, 0, 0]
        },
        xAxis: {
          type: 'category',
          data: x,
          name: '时间',
          axisPointer: {
            type: 'shadow'
          }
        },
        yAxis: {
          type: 'value',
          name: '日照时长(小时)'
        },
        series: [{
          data: y,
          type: 'bar',
          showBackground: true,
          backgroundStyle: {
            color: 'rgba(220, 220, 220, 0.8)'
          }
        }]
      }, true)
    },
    today() {
      for (var i = 0; i < 4; i++) {
        this.picDay(this.c[i], this.dayData.date, this.h[i])
      }
    },
    month() {
      for (var j = 0; j < 4; j++) {
        this.picMonth(this.c[j], this.monthDay.date, this.mon[j])
      }
    },
    year() {
      for (var i = 0; i < 4; i++) {
        this.picMonth(this.c[i], this.yearDay.date, this.yea[i])
      }
    }
  }
}
</script>
