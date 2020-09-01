<template>
  <div>
    <div class="msgbox">
      <transition name="slide-fade">
        <div v-if="msgbox">
          <div class="content">
            <span>
              {{ socketData.regName }}
            </span>
            <span>
              {{ socketData.devName }}
            </span>
            <span>
              {{ socketData.dpName }}
            </span>
            <span>
              {{ socketData.value }}
            </span>
          </div>
        </div>
      </transition>
    </div>
    <el-card class="box-card">
      <filters
        :export-flag="exportFlag"
        :dev-group-options="devGroupOptions"
        :dev-options="devOptions"
        :data-point-options="dataPointOptions"
        @updateDevOptions="updateDevOptions"
        @uptateDataPointsOptions="uptateDataPointsOptions"
        @getSearch="getSearch"
        @handleCreate="handleCreate"
        @handleExport="handleExport"
      />
      <dataTable
        v-loading="tableLoading"
        :table-data="tableData"
        style="margin-top:20px"
        @handleDeleteRow="handleDeleteRow"
        @handleModifyStatus="handleModifyStatus"
        @updateData="updateData"
      />
    </el-card>

    <pagination
      v-show="total>0"
      class="pagination-content"
      :total="total"
      :page.sync="page"
      :limit.sync="limit"
      @pagination="getQueryfromApi"
    />
    <!-- add new data  -->
    <div class="add-new-data">
      <el-dialog title="新添加记录" :visible.sync="dialogFormVisible">
        <el-form
          ref="dataForm"
          :rules="rules"
          :model="temp"
          label-position="left"
          label-width="90px"
          style="width: 300px; margin-left:50px;"
        >
          <el-form-item label="设备分组" prop="groupName">
            <el-select
              v-model="temp.groupName"
              class="filter-item"
              placeholder="选择"
              @change="updateDevOptions"
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
          </el-form-item>
          <el-form-item label="设备" prop="devName">
            <el-select
              v-model="temp.devName"
              class="filter-item"
              placeholder="选择设备名"
              @change="uptateDataPointsOptions"
            >
              <el-option
                v-for="(item,cindex) in createDevOptions"
                :key="cindex"
                :label="item"
                :value="item"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="日期" prop="date">
            <el-date-picker v-model="temp.date" type="datetime" placeholder="记录时间" />
          </el-form-item>
          <el-form-item label="数据点" prop="dataPointName">
            <el-select v-model="temp.dataPointName" class="filter-item" placeholder="选择数据点">
              <el-option
                v-for="(item,i) in createDataPointOptions"
                :key="i"
                :label="item"
                :value="item"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="数值" prop="value" style="max-width:200px">
            <el-input v-model="temp.value" placeholder="Please input" />
          </el-form-item>
          <el-form-item label="告警状态" style="max-width:200px">
            <el-select v-model="temp.alarm" class="filter-item" placeholder="请选择">
              <el-option
                v-for="(item ,index) in statusOptions"
                :key="index"
                :label="item.lable"
                :value="item.value"
              >
                <span style="float: left">{{ item.label }}</span>
                <span style="float: right; color: #8492a6; font-size: 13px">{{ item.value }}</span>
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">Cancel</el-button>
          <el-button type="primary" @click="createData">Confirm</el-button>
        </div>
      </el-dialog>
    </div>
    <!-- end add new data -->

    <!-- export file dialog  -->
    <el-dialog title="数据文件导出" :visible.sync="dialogExportVisible">
      <div style="height: 300px;">
        <el-steps direction="vertical" :active="2">
          <el-step title="步骤 1" />
          <el-step title="步骤 2" />
          <el-step title="步骤 3" description="这是一段很长很长很长的描述性文字" />
        </el-steps>
      </div>

    </el-dialog>
    <!-- end export file dialog -->
  </div>
</template>
<style scoped>
.box-card {
  margin: 15px;
}
@media screen and (max-width: 480px) {
  .box-card {
    margin: 0;
  }

  .pagination-content {
    max-width: 400px;
  }
}
.msgbox{
  position:absolute;
  z-index: 100;
  /* width: 400px; */
  height: 45px;
  right: 37px;
  top: 88px;
  /* background: red; */

}
.content{
  display: -webkit-flex;
  display: flex;
  flex-wrap:nowrap;
  justify-content: space-between;

}
/* 可以设置不同的进入和离开动画 */
/* 设置持续时间和动画函数 */
.slide-fade-enter-active {
  transition: all .3s ease;
}
.slide-fade-leave-active {
  transition: all .3s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}
.slide-fade-enter
/* .slide-fade-leave-active for below version 2.1.8 */ {
  transform: translateY(-10px);
  opacity: 0;
}
.slide-fade-leave-to{
  transform: translateY(10px);
  opacity: 0;
}
</style>
<script>
import Vue from 'vue'
import filters from './components/filters'
import dataTable from './components/dataTable'
import Pagination from '@/components/Pagination'
import { parseTime } from '@/utils'
import {
  getHistoryDataList,
  getDevListByGroupName,
  getdataPointListBydevName,
  getRegionGroupList,
  postNewhistoryData,
  delOneRowfromApi,
  changeAlarmStatusFromApi,
  updateDateFromApi
} from '@/api/history-data'
export default {
  components: {
    filters,
    dataTable,
    Pagination
  },
  data() {
    return {
      dialogExportVisible: false,
      exportFlag: true,
      tableLoading: false,
      tableData: [],
      total: 0,
      page: 1,
      limit: 20,
      baseConditions: {},
      // 假数据
      devGroupOptions: [],
      devOptions: [],
      dataPointOptions: [],
      // add new data
      statusOptions: [
        { label: '告警', value: 0 },
        { label: '正常', value: 1 }
      ],
      temp: {
        groupName: undefined,
        devName: '',
        date: new Date(),
        dataPointName: undefined,
        value: 0,
        alarm: 0
      },
      dialogFormVisible: false,
      dialogStatus: '',
      createDevOptions: [],
      createDataPointOptions: [],
      dialogPvVisible: false,
      rules: {
        groupName: [
          {
            required: true,
            message: 'groupName is required',
            trigger: 'change'
          }
        ],
        devName: [
          {
            required: true,
            message: 'deviceName is required',
            trigger: 'change'
          }
        ],
        date: [
          {
            type: 'date',
            required: true,
            message: 'timestamp is required',
            trigger: 'change'
          }
        ],
        dataPointName: [
          {
            required: true,
            message: 'dataPointName is required',
            trigger: 'blur'
          }
        ],
        value: [
          { required: true, message: 'value is required', trigger: 'blur' }
        ]
      },
      socketData: {
        regName: '',
        devName: '',
        dpName: '',
        value: ''
      },
      msgbox: false
    }
    // end add new data
  },
  created() {
    this.getRegionGroupListFromApi()
    this.getQueryfromApi()
  },
  // mounted() {
  //   this.$socket.open()
  // },
  // beforeDestroy() {
  //   this.$socket.close()
  // },
  methods: {
    // sendMsg() {
    //   this.send()
    // },

    // send() {
    //   this.$socket.emit('historydata', '1111111111')
    // },
    getRegionGroupListFromApi() {
      // 获取区域和分组信息
      getRegionGroupList().then(res => {
        const tempList = res.data
        if (tempList.length >= 0) {
          this.devGroupOptions = tempList
        } else {
          this.$message.warning('服务器无数据返回!')
        }
      })
    },
    updateDevOptions(devGroup, type = 0) {
      /*
      type=0 is create update
      type=1 is filter update
      */
      // 已选择设备组,获取设备列表'
      console.log('devGroup', devGroup)
      const data = { groupName: devGroup }
      getDevListByGroupName(data).then(response => {
        console.log(response)
        const devList = response.data.devList
        if (devList.length >= 0) {
          if (parseInt(type) === 1) {
            console.log('group:', devGroup, 'type:', type)
            this.devOptions = devList
          } else {
            this.temp.devName = undefined
            this.temp.dataPointName = undefined
            this.createDevOptions = devList
            console.log('group:', devGroup, 'type:', type)
          }
        } else {
          this.$message.error('服务器无数据返回!')
        }
      })
    },
    uptateDataPointsOptions(devName, type = 0) {
      // 已选择设备,获取数据点
      /*
      type=0 is create update
      type=1 is filter update
      */
      console.log('devName', devName)
      const data = { devName: devName }
      getdataPointListBydevName(data).then(response => {
        const dataPointList = response.data.dataPointList
        if (dataPointList.length >= 0) {
          if (parseInt(type) === 1) {
            this.dataPointOptions = dataPointList
            console.log('dev:', devName, 'type:', type)
          } else {
            this.temp.dataPointName = undefined
            this.createDataPointOptions = dataPointList
            console.log('dev:', devName, 'type:', type)
          }
        } else {
          this.$message.error('服务器无数据返回!')
        }
      })
    },
    getQueryfromApi() {
      this.tableLoading = true
      if (JSON.stringify(this.baseConditions) === '{}') {
        // this.$message.info('查询条件为空!')
        getHistoryDataList(this.baseConditions).then(response => {
          // console.log(response.data)
          // this.tableData = response.data.historyDataList
          if (this.$td === undefined) {
            Vue.prototype.$inspire = response.data.historyDataList
            this.tableData = this.$inspire
          } else {
            this.tableData = this.$td
          }
          this.total = response.data.total
          // can export file
          this.exportFlag = false
        })
      } else {
        this.baseConditions.limit = this.limit
        this.baseConditions.page = this.page
        getHistoryDataList(this.baseConditions).then(response => {
          // console.log(response.data)
          this.tableData = response.data.historyDataList
          this.total = response.data.total
          // can export file
          this.exportFlag = false
        })
      }
      setTimeout(() => {
        this.tableLoading = false
      }, 1000)
    },

    getSearch(baseConditions) {
      this.baseConditions = baseConditions
      this.getQueryfromApi()
    },
    // handleCreate
    handleCreate() {
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          console.log(this.temp)
          const data = Object.assign({}, this.temp)
          data.date = +new Date()
          postNewhistoryData(data).then(() => {
            data.id = this.tableData.length + 1
            data.date = parseTime(new Date())
            this.tableData.unshift(data)
            this.dialogFormVisible = false
            this.$notify({
              title: 'Success',
              message: 'Created Successfully',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleDeleteRow(row, index) {
      console.log('delete row')
      // post delete request to api delete one row from api
      delOneRowfromApi(row).then(res => {
        if (res.msg === 'ok') {
          this.$notify({
            title: 'Success',
            message: 'Delete Successfully',
            type: 'success',
            duration: 2000
          })
          // delete one row
          this.tableData.splice(index, 1)
        }
      })
    },
    // change alarm status
    handleModifyStatus(row) {
      // const temp = {}
      // temp.id = row.id
      // temp.alarm = row.alarm
      // temp.devName = row.devName
      // temp.dataPointName = row.dataPointName
      const temp = Object.assign({}, row)
      temp.date = +new Date()
      changeAlarmStatusFromApi(temp).then(res => {
        if (res.msg === 'ok') {
          this.$message({
            message: '操作Success',
            type: 'success'
          })
        } else {
          this.$message({
            message: '数据异常',
            type: 'warning'
          })
        }
      })
    },
    // handle edit data
    updateData(row) {
      const data = Object.assign({}, row)
      data.date = +new Date()
      updateDateFromApi(data).then(res => {
        const index = this.tableData.findIndex(v => v.id === row.id)
        this.tableData.splice(index, 1, row)
        this.$notify({
          title: 'Success',
          message: '数据更新成功',
          type: 'success',
          duration: 2000
        })
      })
    },
    // handle export data file
    handleExport() {
      this.exportFlag = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['id', '日期', '设备名', '数据点', '数据值', 'status']
        const filterVal = ['id', 'date', 'devName', 'dataPointName', 'value', 'alarm']
        const data = this.formatJson(filterVal)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: 'table-list'
        })
        setTimeout(() => {
          this.exportFlag = false
        }, 2000)
      })
    },
    formatJson(filterVal) {
      return this.tableData.map(v => filterVal.map(j => {
        if (j === 'date') {
          return parseTime(v[j])
        } else if (j === 'alarm') {
          return parseInt(v[j]) === 0 ? '告警' : '正常'
        } else {
          return v[j]
        }
      }))
    }
  },
  sockets: {
    connect: function() {
      this.$store.commit('socket/SET_CONNECT_STATUS', true, { root: true })
      // this.$socket.emit('historydata', '1111111111')
      console.log('socket connected')
      // window.setInterval(() => {
      //   this.$socket.emit('historydata', '12')
      // }, 3000)
    },
    historydata: function(data) {
      this.msgbox = false
      this.socketData = data
      this.msgbox = true
      // this.$notify({
      //   title: data.regName + '  ' + data.devName,
      //   message: data.dpName + ':' + data.value,
      //   type: 'success',
      //   duration: 1500
      // })
      // console.log(val)
    },
    message: function(val) {
      console.log(val)
    },
    disconnect: function() {
      console.log('dfdfdfdfd')
    }
  }
}
</script>
