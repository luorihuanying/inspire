<template>
  <div class="wholeRange">
    <div class="deviceInfo">
      <div class="deviceInfoLeftRight">
        <div class="deviceInfoLeft">
          <el-row class="block-col-2">
            <el-col :span="12">
              <el-dropdown trigger="click" @command="handleCommand">
                <span class="el-dropdown-link">
                  {{ label[0] }}<i class="el-icon-arrow-down el-icon--right" />
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item icon="el-icon-plus" command="0">{{ label[0] }}</el-dropdown-item>
                  <el-dropdown-item icon="el-icon-plus" command="1">{{ label[1] }}</el-dropdown-item>
                  <el-dropdown-item icon="el-icon-plus" command="2">{{ label[2] }}</el-dropdown-item>
                  <el-dropdown-item icon="el-icon-plus" command="3">{{ label[3] }}</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </el-col>
          </el-row>
          <el-table
            :data="tableData"
            style="width: 100%;margin-left: 20px;margin-top: 20px;"
          >
            <el-table-column
              prop="createTime"
              label="createTime"
              width="180"
            />
            <el-table-column
              prop="dataPointName"
              label="dataPointName"
              width="180"
            />
            <el-table-column
              prop="value"
              label="value"
            />
          </el-table></div>
        <div class="deviceInfoRight">
          <div class="externalOfP">
            <p>设备参数</p>
            <p>设备名称：   4G通讯模块</p>
            <p>在线状态：   {{ info.state }}</p>
            <p>设备编号：   {{ info.devId }}</p>
            <p>最后活跃时间：   {{ info.latestTime }}</p>
            <p>位置信息：   扶绥基地农机旁甘蔗实验地</p>
            <p>海拔高度：   107米</p>
            <p>经度：   107.463828723</p>
            <p>纬度：   22.303914863</p>
          </div>
        </div>
      </div>
    </div>
    <div id="shabi" class="centerSection2">
      <el-row class="block-col-1">
        <el-col :span="12">
          <el-dropdown trigger="click">
            <span class="el-dropdown-link">
              h10<i class="el-icon-arrow-down el-icon--right" />
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item icon="el-icon-plus">h10</el-dropdown-item>
              <el-dropdown-item icon="el-icon-plus">h20</el-dropdown-item>
              <el-dropdown-item icon="el-icon-plus">h30</el-dropdown-item>
              <el-dropdown-item icon="el-icon-plus">v20</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-col>
      </el-row>
      <div class="riqi">
        <div class="yy">
          <el-button type="info" plain class="yy" @click="today()">今日</el-button>
          <el-button type="info" plain class="yy" @click="month()">本周</el-button>
          <el-button type="info" plain class="yy" @click="year()">最近三个月</el-button>
        </div>
        <div class="block1">
          <el-date-picker
            v-model="value1"
            type="datetime"
            placeholder="选择日期时间"
            value-format="timestamp"
            @change="changeRuleDate"
          />
        </div>
        <div class="download1">
          <el-button type="info" plain class="el-icon-download" @click="exportData()">导出数据</el-button>
        </div>
      </div>
    </div>
    <div class="figureArea">
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
    </div>
  </div>
</template>
<style lang='scss' >
.el-dropdown-link {
    cursor: pointer;
    color: #409EFF;
  }
  .el-icon-arrow-down {
    font-size: 12px;
  }
  .demonstration {
    display: block;
    color: #8492a6;
    font-size: 14px;
    margin-bottom: 20px;
  }
  @import "@/styles/chart.scss";
</style>
<script>
import { getNewtestData, get4GInfo, getIotDay, getIotWeek, getIotMonth } from '@/api/chartData'
import echarts from 'echarts'
require('script-loader!file-saver')
require('../../../vendor/Blob')// 配置地址根据实际配置
require('script-loader!xlsx/dist/xlsx.core.min')
export default {
  data() {
    return {
      info: {},
      label: ['h10', 'h20', 'h30', 'v20'],
      tableData: [],
      model: {},
      value1: '',
      min: [80, 95, 100, 95],
      subTitle: ['h10', 'h20', 'h30', 'v20']
    }
  },
  created() {
    this.iotMonth()
    this.iotWeek()
    this.iotDay()
    this.get4GInfoData()
    this.getNewtest()
  },
  methods: {
    changeRuleDate() {

    },
    get4GInfoData() {
      get4GInfo().then(res => {
        this.info = res.data
      })
    },
    handleCommand(command) {
      var flag = parseInt(command)
      this.tableData = this.listTableData[flag]
    },
    getNewtest() {
      getNewtestData().then(res => {
        this.listTableData = res.data
        this.tableData = this.listTableData[0]
      })
    },
    iotDay() {
      getIotDay().then(res => {
        this.iotDayData = res.data
        this.c = ['chart1', 'chart2', 'chart3', 'chart4']
        this.h = [this.iotDayData.h10, this.iotDayData.h20, this.iotDayData.h30, this.iotDayData.v20]
        this.today()
      })
    },
    iotWeek() {
      getIotWeek().then(res => {
        this.iotWeekData = res.data
        this.week = [this.iotWeekData.h10, this.iotWeekData.h20, this.iotWeekData.h30, this.iotWeekData.v20]
      })
    },
    iotMonth() {
      getIotMonth().then(res => {
        this.iotMonthData = res.data
        this.monthData = [this.iotMonthData.h10, this.iotMonthData.h20, this.iotMonthData.h30, this.iotMonthData.v20]
      })
    },
    picDay(chart, z, min, subTitle) {
      var start = echarts.init(document.getElementById(chart))
      start.setOption({
        title: {
          text: 'RSSI值随时间变化趋势图',
          subtext: subTitle,
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
          data: z.createTime,
          name: '时间'
        },
        yAxis: {
          type: 'value',
          name: 'RSSI值',
          min: min
        },
        series: [{
          data: z.value,
          type: 'line'
        }]
      }, true)
    },
    picMonth(chart, weekeen, subTitle) {
      var start = echarts.init(document.getElementById(chart))
      start.setOption({
        title: {
          text: 'RSSI值随时间变化趋势图',
          subtext: subTitle,
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
          data: weekeen.date,
          name: '时间'
        },
        yAxis: {
          type: 'value',
          name: 'RSSI值',
          min: parseInt(weekeen.mi - 2)
        },
        series: [{
          data: weekeen.avg,
          type: 'line',
          name: '平均值'
        },
        {
          data: weekeen.max,
          type: 'line',
          name: '最大值'
        },
        {
          data: weekeen.min,
          type: 'line',
          name: '最小值'
        }]
      }, true)
    },
    today() {
      for (var i = 0; i < 4; i++) {
        this.picDay(this.c[i], this.h[i], this.min[i], this.subTitle[i])
      }
    },
    month() {
      for (var j = 0; j < 4; j++) {
        this.picMonth(this.c[j], this.week[j], this.subTitle[j])
      }
    },
    year() {
      for (var i = 0; i < 4; i++) {
        this.picMonth(this.c[i], this.monthData[i], this.subTitle[i])
      }
    }
  }
}
</script>
