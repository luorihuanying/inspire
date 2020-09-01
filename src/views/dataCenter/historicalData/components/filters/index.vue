<template>
  <div class="filter">
    <div class="group-box" style="margin-left: 10px;">
      <el-select
        v-model="devGroupSelect"
        class="filter-item"
        style="max-width:130px"
        placeholder="选择所在分组"
      >
        <el-option-group
          v-for="(group,index) in devGroupOptions"
          :key="index"
          :label="group.regionName"
        >
          <el-option
            v-for="(item,devindex) in group.groupList"
            :key="devindex"
            :value="item"
          />
        </el-option-group>
      </el-select>
    </div>
    <div class="dev-box" style="margin-left: 10px;">
      <el-select v-model="devSelect" class="filter-item" style="max-width:100px" placeholder="选择设备">
        <el-option
          v-for="(item,index) in devOptions"
          :key="index"
          :label="item"
          :value="item"
        />
      </el-select>
    </div>
    <div class="data-point-box  filter-item" style="margin-left: 10px;">
      <el-select
        v-model="dataPointSelect"
        style="max-width:180px"
        multiple
        collapse-tags
        placeholder="选择数据点"
      >
        <el-option
          v-for="(item,index) in dataPointOptions"
          :key="index"
          :label="item"
          :value="item"
        />
      </el-select>
    </div>
    <div class="time-select-box filter-item" style="margin-left: 10px;">
      <el-date-picker
        v-model="timeSelect"
        style="max-width:300px"
        type="datetimerange"
        :picker-options="pickerOptions"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        align="right"
      />
    </div>
    <div class="search-box" style="margin-left: 10px;">
      <el-button
        class="filter-item"
        :disabled="queryFlag"
        type="primary"
        icon="el-icon-search"
        :loading="false"
        @click="getQuery"
      >发送查询</el-button>
    </div>
    <div class="export" style="margin-left: 10px;">
      <el-button
        :disabled="exportFlag"
        :loading="false"
        class="filter-item"
        type="primary"
        icon="el-icon-download"
        @click="handleExport"
      >导出数据</el-button>
    </div>
    <div class="add-data" style="margin-left: 10px;">
      <el-button
        class="filter-item"
        type="primary"
        icon="el-icon-edit"
        @click="handleCreate"
      >添加记录</el-button>
    </div>
  </div>

</template>
<style scoped>
.filter {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
}
.filter-item {
  padding-bottom: 10px;
}
</style>
<script>
export default {
  props: {
    exportFlag: {
      type: Boolean,
      default() { return true }
    },
    devGroupOptions: {
      type: Array,
      default() {
        return []
      }
    },
    devOptions: {
      type: Array,
      default() {
        return []
      }
    },
    dataPointOptions: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      groupName: '',

      devGroupSelect: '',
      devSelect: '',
      dataPointSelect: [],
      // 快捷时间选择
      pickerOptions: {
        shortcuts: [
          {
            text: '最近一天',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 1)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近一个周',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
              picker.$emit('pick', [start, end])
            }
          }
        ]
      },
      // 默认显示24小时的历史数据
      timeSelect: [new Date(new Date() - 3600 * 1000 * 24 * 1), new Date()]
    }
  },
  computed: {
    queryFlag: function() {
      if (
        this.devGroupSelect &&
        this.devSelect &&
        this.timeSelect &&
        this.dataPointSelect.length !== 0
      ) {
        return false
      } else {
        return true
      }
    }
  },
  watch: {
    devGroupSelect() {
      // console.log('设备组:', this.devGroupSelect)
      this.devSelect = ''
      this.dataPointSelect = []
      // 更新dev-options
      this.$emit('updateDevOptions', this.devGroupSelect, 1)
    },
    devSelect() {
      // console.log('设备:', this.devSelect)
      if (this.devGroupSelect && this.devSelect) {
        this.dataPointSelect = []
        this.$emit('uptateDataPointsOptions', this.devSelect, 1)
      } else {
        console.log('没有选择设备')
      }
    }
  },
  methods: {
    getQuery() {
      const startTime = new Date(this.timeSelect[0])
      const endTime = new Date(this.timeSelect[1])
      // console.log('data', this.timeSelect[0])
      const baseConditions = {
        groupName: this.devGroupSelect,
        devName: this.devSelect,
        dataPoints: this.dataPointSelect,
        startTime: startTime.getTime(),
        endTime: endTime.getTime()
      }
      // console.log('get query', queryConditions)
      this.$emit('getSearch', baseConditions)
    },
    handleCreate() {
      this.$emit('handleCreate')
    },
    handleExport() {
      this.$emit('handleExport')
    }
  }

}
</script>
