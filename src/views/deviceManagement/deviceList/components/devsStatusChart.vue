<template>
  <div :id="id" :class="className" :style="{height:height,width:width}" />
</template>

<script>
// 按需引入 引入 ECharts 主模块
var echarts = require('echarts/lib/echarts')
import resize from './mixins/resize'
require('echarts/theme/macarons') // echarts theme

export default {
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    id: {
      type: String,
      default: 'chart',
      require: true
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '250px'
    },
    data: {
      type: Array,
      default() { return [] },
      required: true
    },
    name: {
      type: String,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    subTitle: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      chart: null
    }
  },
  watch: {
    data: function() {
      // console.log(this.data, 'watch')
      this.handleUpdate()
    }
  },
  mounted() {
    this.initChart()
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    initChart() {
      this.chart = echarts.init(document.getElementById(this.id), 'macarons')
    },
    handleUpdate() {
      this.chart.showLoading()
      const keys = []
      for (const i of this.data) {
        keys.push(i.name)
      }
      this.chart.setOption({
        title: {
          text: this.title,
          subtext: this.subTitle,
          left: 'left'
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} '
        },
        legend: {
          left: 'center',
          top: 'bottom',
          data: keys
        },
        series: [
          {
            label: {
              normal: {
                show: false,
                position: 'inside'
              },
              emphasis: {
                show: true,
                textStyle: {
                  fontSize: '30',
                  fontWeight: 'bold'
                }
              }
            },
            labelLine: {
              normal: {
                show: false
              }
            },
            name: this.name,
            type: 'pie',
            radius: ['20%', '70%'],
            center: ['50%', '50%'],
            roseType: 'area',
            data: this.data
          }
        ]
      })
      this.chart.hideLoading()
    }
  }
}
</script>
