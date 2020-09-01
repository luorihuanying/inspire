<template>
  <div>
    <div class="main">
      <el-radio-group v-model="radio1" @change="statChange">
        <el-radio-button label="表格显示" />
        <el-radio-button label="图形显示" />
      </el-radio-group>
    </div>
    <div class="chartTable">
      <div id="kk" class="chartData">
        <el-row class="block-col-2">
          <el-col :span="12">
            <el-dropdown trigger="click" @command="handleCommand">
              <span class="el-dropdown-link" size="medium">
                {{ this.name[this.flag] }}<i class="el-icon-arrow-down el-icon--right" />
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="0">空气温度</el-dropdown-item>
                <el-dropdown-item command="1">雨量</el-dropdown-item>
                <el-dropdown-item command="2">太阳辐射强度</el-dropdown-item>
                <el-dropdown-item command="3">相对湿度</el-dropdown-item>
                <el-dropdown-item command="4">风速</el-dropdown-item>
                <el-dropdown-item command="5">风向</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </el-col>
        </el-row>
        <div id="chart" style="width: 900px;height:800px;" />
      </div>
      <div id="ll" class="tableD">
        <el-table
          :data="tableData"
          style="width: 100%"
          height="850"
        >
          <el-table-column
            fixed
            prop="date"
            label="采集时间"
            width="150"
          />
          <el-table-column
            prop="rainfall"
            label="雨量"
            width="120"
          />
          <el-table-column
            prop="solarRadiationIntensity"
            label="太阳辐射强度"
            width="120"
          />
          <el-table-column
            prop="airTemperature"
            label="空气温度"
            width="120"
          />
          <el-table-column
            prop="relativeHumidity"
            label="相对湿度"
            width="120"
          />
          <el-table-column
            prop="averageWindSpeed"
            label="风速"
            width="120"
          />
          <el-table-column
            prop="windDirection"
            label="风向"
            width="120"
          />
        </el-table>
      </div>
    </div>
  </div>
</template>
<style lang='scss' >
  @import "@/styles/chart.scss";
</style>
<script type="text/javascript">
import { getTianQi } from '@/api/chartData'
import echarts from 'echarts'
export default {
  data() {
    return {
      xdata: [],
      chartData: [],
      tableData: this.tableData,
      radio2: '图形显示',
      radio1: '表格显示',
      name: ['空气温度',
        '雨量',
        '太阳辐射强度',
        '相对湿度',
        '风速',
        '风向'
      ],
      flag: 0
    }
  },
  created() {
    this.getChartData()
  },
  methods: {
    getChartData() {
      var rainfall = []
      var solarRadiationIntensity = []
      var airTemperature = []
      var relativeHumidity = []
      var averageWindSpeed = []
      var windDirection = []
      var time = []
      var i = 0
      // 表格数据
      var td = []
      getTianQi().then(res => {
        for (i = 0; i < res.data.length; i++) {
          // time.push(res.data[i].datetime)
          var temp = {
            'date': res.data[i].datetime,
            'rainfall': res.data[i].values.地表.rainfall,
            'solarRadiationIntensity': res.data[i].values.地表.solarRadiationIntensity,
            'airTemperature': res.data[i].values.地表.airTemperature,
            'relativeHumidity': res.data[i].values.地表.relativeHumidity,
            'averageWindSpeed': res.data[i].values.地表.averageWindSpeed,
            'windDirection': res.data[i].values.地表.windDirection
          }
          td.push(temp)
          var t = res.data[i].datetime
          // 取时间后11位
          time.push(t.substring(t.length - 11, t.length))
          rainfall.push(res.data[i].values.地表.rainfall)
          solarRadiationIntensity.push(res.data[i].values.地表.solarRadiationIntensity)
          airTemperature.push(res.data[i].values.地表.airTemperature)
          relativeHumidity.push(res.data[i].values.地表.relativeHumidity)
          averageWindSpeed.push(res.data[i].values.地表.averageWindSpeed)
          windDirection.push(res.data[i].values.地表.windDirection)
        }
        var echart = echarts.init(document.getElementById('chart'))
        var option = this.lineChart('0')
        // 5. 展示数据
        echart.setOption(option, true)
      })
      this.xdata = time
      this.chartData = [airTemperature, rainfall, solarRadiationIntensity, relativeHumidity, averageWindSpeed, windDirection]
      this.tableData = td
    },
    lineChart(command) {
      var opt = {
        title: {
          text: this.name[parseInt(command)],
          left: 'center'
        },
        xAxis: {
          type: 'category',
          name: '时间',
          data: this.xdata,
          axisLabel: {
            interval: 0,
            rotate: 45,
            textStyle: {
              // color: 'blue',
              // fontFamily: 'sans-serif',
              fontSize: 10
              // fontStyle: 'italic',
              // fontWeight: 'bold'
            }
          },
          show: true
        },
        yAxis: {
          type: 'value',
          min: parseInt(Math.min.apply(null, this.chartData[parseInt(command)])),
          // min: 10,
          name: this.name[parseInt(command)]
        },
        series: [{
          data: this.chartData[parseInt(command)],
          type: 'line',
          smooth: true,
          show: true
        }]
      }
      return opt
    },
    handleCommand(command) {
      this.flag = parseInt(command)
      var echart = echarts.init(document.getElementById('chart'))
      var option = this.lineChart(command)
      // 5. 展示数据
      echart.setOption(option, true)
    },
    // label是回调参数
    statChange(label) {
      var div1 = document.getElementById('kk')// 得到这个DIV。
      var div2 = document.getElementById('ll')// 得到这个DIV。
      if (label === '图形显示') {
        div1.style.display = ''
        div2.style.display = 'none'
      } else {
        div1.style.display = 'none'
        div2.style.display = ''
      }
    }
  }
}
</script>
