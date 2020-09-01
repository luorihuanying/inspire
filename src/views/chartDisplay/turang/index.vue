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
                <el-dropdown-item command="0">地表温度</el-dropdown-item>
                <el-dropdown-item command="1">地下土壤温度</el-dropdown-item>
                <el-dropdown-item command="2">地下土壤湿度</el-dropdown-item>
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
            prop="dbwd"
            label="地表温度"
            width="120"
          />
          <el-table-column
            prop="t10"
            label="地下10cm温度"
            width="120"
          />
          <el-table-column
            prop="m10"
            label="地下10cm湿度"
            width="120"
          />
          <el-table-column
            prop="t20"
            label="地下20cm温度"
            width="120"
          />
          <el-table-column
            prop="m20"
            label="地下20cm湿度"
            width="120"
          />
          <el-table-column
            prop="t30"
            label="地下30cm温度"
            width="120"
          />
          <el-table-column
            prop="m30"
            label="地下30cm湿度"
            width="120"
          />
          <el-table-column
            prop="t40"
            label="地下40cm温度"
            width="120"
          />
          <el-table-column
            prop="m40"
            label="地下40cm湿度"
            width="120"
          />
          <el-table-column
            prop="t50"
            label="地下50cm温度"
            width="120"
          />
          <el-table-column
            prop="m50"
            label="地下50cm湿度"
            width="120"
          />
          <el-table-column
            prop="t60"
            label="地下60cm温度"
            width="120"
          />
          <el-table-column
            prop="m60"
            label="地下60cm湿度"
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
import { getZhiShang1 } from '@/api/chartData'
import echarts from 'echarts'
export default {
  data() {
    return {
      dbwd: [],
      tableData: this.tableData,
      radio2: '图形显示',
      radio1: '表格显示',
      name: ['地表温度',
        '地下土壤温度',
        '地下土壤湿度'
      ],
      flag: 0
    }
  },
  created() {
    this.getChartData()
  },
  methods: {
    getChartData() {
      // 地表温度
      var dibiaowendu = []
      // 地下温度
      var t10 = []
      var t20 = []
      var t30 = []
      var t40 = []
      var t50 = []
      var t60 = []
      // 地下湿度
      var m10 = []
      var m20 = []
      var m30 = []
      var m40 = []
      var m50 = []
      var m60 = []
      // 时间
      var time = []
      var i = 0
      // 表格数据
      var td = []
      getZhiShang1().then(res => {
        for (i = 0; i < res.data.length; i++) {
          // time.push(res.data[i].datetime)
          var temp = {
            'date': res.data[i].datetime,
            'dbwd': res.data[i].values.地表.temperature,
            't10': res.data[i].values['10cm'].temperature,
            'm10': res.data[i].values['10cm'].moisture,
            't20': res.data[i].values['20cm'].temperature,
            'm20': res.data[i].values['20cm'].moisture,
            't30': res.data[i].values['30cm'].temperature,
            'm30': res.data[i].values['30cm'].moisture,
            't40': res.data[i].values['40cm'].temperature,
            'm40': res.data[i].values['40cm'].moisture,
            't50': res.data[i].values['50cm'].temperature,
            'm50': res.data[i].values['50cm'].moisture,
            't60': res.data[i].values['60cm'].temperature,
            'm60': res.data[i].values['60cm'].moisture
          }
          td.push(temp)
          var t = res.data[i].datetime
          // 取时间后11位
          time.push(t.substring(t.length - 11, t.length))
          dibiaowendu.push(res.data[i].values.地表.temperature)
          t10.push(res.data[i].values['10cm'].temperature)
          t20.push(res.data[i].values['20cm'].temperature)
          t30.push(res.data[i].values['30cm'].temperature)
          t40.push(res.data[i].values['40cm'].temperature)
          t50.push(res.data[i].values['50cm'].temperature)
          t60.push(res.data[i].values['60cm'].temperature)
          m10.push(res.data[i].values['10cm'].moisture)
          m20.push(res.data[i].values['20cm'].moisture)
          m30.push(res.data[i].values['30cm'].moisture)
          m40.push(res.data[i].values['40cm'].moisture)
          m50.push(res.data[i].values['50cm'].moisture)
          m60.push(res.data[i].values['60cm'].moisture)
        }
        var echart = echarts.init(document.getElementById('chart'))
        var option = this.surfaceTemperature('0')
        // 5. 展示数据
        echart.setOption(option, true)
      })
      this.tmmin = [20, 10]
      this.dbwd = [time, dibiaowendu]
      this.dxwsd = [time, [t10, t20, t30, t40, t50, t60], [m10, m20, m30, m40, m50, m60]]
      this.tableData = td
    },
    surfaceTemperature(command) {
      var opt = {
        title: {
          text: this.name[parseInt(command)],
          left: 'center'
        },
        xAxis: {
          type: 'category',
          name: '时间',
          data: this.dbwd[0],
          axisLabel: {
            interval: 0,
            rotate: 45,
            textStyle: {
              fontSize: 10
            }
          },
          show: true
        },
        yAxis: {
          type: 'value',
          min: parseInt(Math.min.apply(null, this.dbwd[1]) - 2),
          // min: 10,
          name: '温度℃'
        },
        series: [{
          data: this.dbwd[1],
          type: 'line',
          smooth: true,
          show: true
        }]
      }
      return opt
    },
    surfaceTemperatureAndHumidity(command) {
      var opt = {
        title: {
          text: this.name[parseInt(command)],
          left: 'center'
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          x: 320,
          y: 30,
          data: ['10cm', '20cm', '30cm', '40cm', '50cm', '60cm']
        },
        grid: {
          left: '5%',
          right: '5%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: this.dxwsd[0],
          name: '时间',
          axisLabel: {
            interval: 0,
            rotate: 45,
            textStyle: {
              fontSize: 10
            }
          }
        },
        yAxis: {
          type: 'value',
          name: this.name[parseInt(command)],
          min: this.tmmin[parseInt(command) - 1]
        },
        series: [
          {
            name: '10cm',
            type: 'line',
            smooth: true,
            // stack: '总量',
            data: this.dxwsd[parseInt(command)][0],
            show: true
          },
          {
            name: '20cm',
            smooth: true,
            type: 'line',
            // stack: '总量',
            data: this.dxwsd[parseInt(command)][1],
            show: true
          },
          {
            name: '30cm',
            smooth: true,
            type: 'line',
            // stack: '总量',
            data: this.dxwsd[parseInt(command)][2],
            show: true
          },
          {
            name: '40cm',
            smooth: true,
            type: 'line',
            // stack: '总量',
            data: this.dxwsd[parseInt(command)][3],
            show: true
          },
          {
            name: '50cm',
            smooth: true,
            type: 'line',
            // stack: '总量',
            data: this.dxwsd[parseInt(command)][4],
            show: true
          },
          {
            name: '60cm',
            smooth: true,
            type: 'line',
            // stack: '总量',
            data: this.dxwsd[parseInt(command)][5],
            show: true
          }
        ]
      }
      return opt
    },
    handleCommand(command) {
      this.flag = parseInt(command)
      var echart = echarts.init(document.getElementById('chart'))
      if (command === '0') {
        var option = this.surfaceTemperature(command)
      } else {
        option = this.surfaceTemperatureAndHumidity(command)
      }
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
