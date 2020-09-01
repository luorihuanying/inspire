<template>
  <div class="main">
    <el-card v-loading="chartsLoading" :body-style="bodyStyle" class="devs-charts">
      <el-row :gutter="0">
        <el-col :span="6">
          <devStatusChart
            id="regsdevwtotal"
            name="设备组数"
            title="基地设备情况"
            sub-title="分区显示"
            :data="groupTotal"
          />
        </el-col>
        <el-col :span="6">
          <devStatusChart
            id="devstatus"
            name="设备数"
            title="基地设备数量情况"
            sub-title="分区显示"
            :data="devTotal"
          />
        </el-col>
        <el-col :span="6">
          <devStatusChart
            id="regsdevtotal"
            name="设备组"
            title="设备组设备情况"
            sub-title="分组显示"
            :data="creggdevs"
          />
        </el-col>
        <el-col :span="6">
          <devStatusChart
            id="regdevtotal"
            name="状态"
            title="设备在线情况"
            sub-title="分区显示"
            :data="cregStatus"
          />
        </el-col>
      </el-row>
      <div class="creg">
        <el-select v-model="cregName" placeholder="请选择">
          <el-option v-for="(item,index) in regOptions" :key="index" :value="item" />
        </el-select>
      </div>
    </el-card>

    <el-card :body-style="bodyStyle" class="devlist-card">
      <div class="list-header">
        <el-row :gutter="0">
          <el-col :span="5">
            <el-select v-model="filter.regSelect" clearable class="regselect" placeholder="选择分区">
              <el-option
                v-for="(item,index) in regOptions"
                :key="index"
                :label="item"
                :value="item"
              />
            </el-select>
          </el-col>
          <el-col :span="5">
            <el-select v-model="filter.groupSelect" clearable class="regselect" placeholder="选择设备组">
              <el-option
                v-for="(item,index) in groupOptions"
                :key="index"
                :label="item"
                :value="item"
              />
            </el-select>
          </el-col>
          <el-col :span="5">
            <el-select v-model="filter.statusSelect" clearable class="regselect" placeholder="设备状态">
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
          </el-col>
          <el-col :span="2">
            <el-button class="filter-btn" @click="filterDevsList('local')">筛选</el-button>
          </el-col>
          <el-col :span="4">
            <el-button class="filter-btn" @click="filterDevsList">从远程筛选</el-button>
          </el-col>
        </el-row>
      </div>

      <!-- device-list table -->
      <el-table
        ref="singleTable"
        v-loading="tableLoading"
        element-loading-text="拼命加载中"
        element-loading-spinner="el-icon-loading"
        class="devtable"
        size="mini "
        :data="tableData"
        highlight-current-row
        max-height="500"
        border
        fit
        :header-cell-style="tableHeaderStyle"
        @current-change="handleCurrentChange"
        @selection-change="handleSelectionChange"
      >
        >
        <el-table-column type="selection" width="55" />
        <el-table-column
          header-align="center"
          align="center"
          prop="id"
          fixed
          sortable
          label="ID"
          width="50"
        />
        <el-table-column
          header-align="center"
          align="center"
          prop="date"
          sortable
          label="登记日期"
          width="200"
        >
          <template slot-scope="scope">
            <i class="el-icon-time" />
            <span>{{ scope.row.date }}</span>
          </template>
        </el-table-column>
        <el-table-column header-align="center" align="center" prop="regName" label="所在地区" />
        <el-table-column header-align="center" align="center" prop="gName" label="所在设备组" />
        <el-table-column header-align="center" align="center" prop="name" label="设备名称">
          <template slot-scope="scope">
            <el-popover
              title="描述"
              placement="right"
              width="200"
              trigger="click"
              @show="queryDataCount"
            >
              <div
                v-loading="false"
                element-loading-text="拼命加载中"
                element-loading-spinner="el-icon-loading"
              >
                <p>这是一段描述这是一段描述这是一段描述</p>
                <div style="text-align: right; margin: 0">
                  <el-button size="mini" type="text" @click="1">详情</el-button>
                </div>
              </div>

              <el-button slot="reference" type="text">{{ scope.row.devName }}</el-button>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column header-align="center" align="center" prop="status" label="status">
          <template slot-scope="{row}">
            <span>{{ parseStatus(row) }}</span>
          </template>
        </el-table-column>
        <el-table-column
          header-align="center"
          align="center"
          width="200"
          prop="position"
          label="坐标"
        >
          <template slot-scope="{row}">
            <span>{{ positonTostring(row) }}</span>
          </template>
        </el-table-column>
        <!-- Actions -->
        <el-table-column
          label="操作"
          align="center"
          width="200"
          class-name="small-padding fixed-width"
        >
          <template slot-scope="{row,$index}">
            <el-button type="primary" size="mini" @click="handleUpdate(row)">Edit</el-button>
            <el-button v-if="row.status!='deleted'" size="mini" type="danger" @click="handleDelete(row,$index)">Delete</el-button>
          </template>
        </el-table-column>
        <!-- end Actions handleDelete(row,$index)  handleUpdate(row)-->
      </el-table>
      <!-- end device-list table -->
      <pagination
        v-show="tableData.length"
        :page.sync="filter.page"
        :limit.sync="filter.limit"
        class="pagination-content"
        :total="tableData.length"
        @pagination="getDevsList(filter)"
      />
    </el-card>
    <!-- show waring -->
    <el-dialog
      title="提示"
      :visible.sync="warningDialog"
      width="30%"
    >
      <span style="color:red">删除不可逆,确定要删除吗?</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="warningDialog = false">取 消</el-button>
        <el-button type="primary" @click="handleSoreDel">确 定</el-button>
      </span>
    </el-dialog>

    <!-- end show waring -->
    <!-- editor  -->
    <div class="editor-data">
      <el-dialog title="编辑" :visible.sync="dialogFormVisible">
        <el-form
          ref="dataForm"
          :rules="rules"
          :model="temp"
          label-position="left"
          label-width="90px"
          style="width: 300px; margin-left:50px;"
        >
          <el-form-item label="选择分区" prop="regName">
            <el-select
              v-model="temp.regName"
              placeholder="选择"
            >
              <el-option
                v-for="(item,cindex) in regOptions"
                :key="cindex"
                :value="item"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="设备组" prop="gName">
            <el-select
              v-model="temp.devName"
              placeholder="选择设备组"
            >
              <el-option
                v-for="(item,cindex) in groupOptions"
                :key="cindex"
                :value="item"
              />
            </el-select>
          </el-form-item>

          <el-form-item label="设备" prop="devName">
            <el-input v-model="temp.devName" placeholder="设备名字" clearable />
          </el-form-item>

          <el-form-item label="日期" prop="date">
            <el-date-picker v-model="temp.date" type="datetime" placeholder="登记时间" />
          </el-form-item>
          <el-form-item label="坐标" prop="position">
            <el-input v-model="temp.position" placeholder="请以逗号分隔" clearable />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">Cancel</el-button>
          <el-button type="primary" @click="updateData">Confirm</el-button>
        </div>
      </el-dialog>
    </div>
    <!-- end editor -->

  </div>
</template>
<style lang="scss" scoped>
@import "@/styles/device-list.scss";
</style>
<script>
import Pagination from '@/components/Pagination'
import devStatusChart from './components/devsStatusChart'
import {
  getDevsListFromApi,
  deleteDev,
  getDevsCountFormApi,
  updateDevsInfoToApi } from '@/api/device-info'
export default {
  name: 'DeviceList',
  components: {
    devStatusChart,
    Pagination
  },
  data() {
    return {
      regOptions: [],
      statusOptions: [
        { label: '离线', value: 0 },
        { label: '在线', value: 1 }
      ],
      groupOptions: [],
      regdevsList: [],
      filter: {
        regSelect: undefined,
        groupSelect: '',
        statusSelect: '',
        page: 0,
        limit: 20
      },
      bodyStyle: {
        padding: 0
      },
      warningDialog: false,
      chartsLoading: false,
      tableLoading: false,
      dialogFormVisible: false,
      tableData: [],
      cregName: '',
      currentRow: null,
      multipleSelection: [],

      temp: {
        id: undefined,
        devName: '',
        regName: '',
        status: undefined,
        gName: '',
        position: undefined,
        date: undefined
      },
      deltemp: {
        row: undefined,
        index: undefined
      },

      devStatusList: [],
      gdList: [],
      devTotal: [],
      groupTotal: [],
      creggdevs: [],
      cregStatus: [],
      dataList: [],
      rules: {
        regName: [{ required: true, message: 'regName is required', trigger: 'change' }],
        gName: [{ required: true, message: 'group is required', trigger: 'change' }],
        devName: [{ required: true, message: 'device name is required', trigger: 'blur' }],
        position: [{ required: true, message: 'position value is required', trigger: 'blur' }]
      }
    }
  },
  watch: {
    cregName() {
      for (const i of this.devStatusList) {
        if (i.regName === this.cregName) {
          this.cregStatus = i.data
          break
        }
      }
      for (const i of this.gdList) {
        if (i.regName === this.cregName) {
          this.creggdevs = i.data
          break
        }
      }
    },
    'filter.regSelect': function(newSel, o) {
      if (newSel) {
        this.filter.groupSelect = ''
        this.groupOptions = []
        for (const i of this.regdevsList) {
          if (i.regName === newSel) {
            this.groupOptions = i.groups
            break
          }
        }
      } else {
        let temp = []
        this.regdevsList.forEach(i => {
          temp = temp.concat(i.groups)
        })
      }
    }
  },
  created() {
    this.getDevsList()
    this.getDevsCount()
  },
  methods: {
    getDevsList(query) {
      this.tableLoading = true
      getDevsListFromApi(query).then(res => {
        let temp = []
        let op = []
        for (const reg of res.data) {
          this.regdevsList.push({ regName: reg.regName, groups: reg.groups })
          temp = temp.concat(reg.devs)
          op = op.concat(reg.groups)
        }
        console.log(op)
        this.tableData = temp
        this.dataList = temp
        this.groupOptions = op // init filter
        this.tableLoading = false
      })
    },
    filterDevsList(source) {
      this.tableLoading = true
      if (source === 'local') {
        const reg = this.filter.regSelect
        const g = this.filter.groupSelect
        const s = this.filter.statusSelect
        const filter = this.dataList.filter(item => {
          const ig = item.gName
          const ir = item.regName
          const is = item.status
          return (
            (reg ? reg === ir : true) &&
            (g ? g === ig : true) &&
            (s !== '' ? parseInt(s) === parseInt(is) : true)
          )
        })
        this.tableData = filter
        this.tableLoading = false
      } else {
        const temp = {}
        //   filter: {
        //   regSelect: undefined,
        //   groupSelect: '',
        //   statusSelect: '',
        //   page: 0,
        //   limit: 20
        // },
        temp.regName = this.filter.regSelect || ''
        temp.groupName = this.filter.groupSelect
        temp.status = this.filter.statusSelect
        temp.page = this.filter.page
        temp.limit = this.filter.limit
        getDevsListFromApi(temp).then(res => {
          const data = res.data
          let templist = []
          for (const i of data) {
            templist = templist.concat(i.devs)
          }
          this.dataList = templist
          this.tableData = templist
          this.tableLoading = false
        })
      }
    },
    getDevsCount() {
      this.chartsLoading = true
      getDevsCountFormApi().then(res => {
        // console.log(res.data)
        const regGcount = []
        const regStatus = []
        const regDevsCount = []
        const gDevsCount = []
        for (const reg of res.data) {
          this.regOptions.push(reg.regName)
          const status = []
          regGcount.push({ name: reg.regName, value: reg.groups.length })
          regDevsCount.push({ name: reg.regName, value: reg.devsCount.total })
          status.push(
            { name: '在线', value: reg.devsCount.online },
            { name: '离线', value: reg.devsCount.offline }
          )
          const temp = reg.groups.map(item => {
            return { name: item.name, value: item.devsCount }
          })
          regStatus.push({ regName: reg.regName, data: status })
          gDevsCount.push({ regName: reg.regName, data: temp })
        }
        this.cregName = this.regOptions[0]
        this.devStatusList = regStatus
        this.gdList = gDevsCount
        this.devTotal = regDevsCount
        this.groupTotal = regGcount
        this.chartsLoading = false
      })
    },
    tableHeaderStyle({ row, column, rowIndex, columnIndex }) {
      return 'background-color:#1989fa;color:#fff;font-weight:400;'
    },
    handleCurrentChange(val) {
      this.currentRow = val
    },

    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    parseStatus(row) {
      switch (parseInt(row.status)) {
        case 0:
          return '离线'
        case 1:
          return '在线'
      }
    },
    queryDataCount() {
      //
    },
    positonTostring(row) {
      if (row.position) {
        const temp = row.position.map(f => {
          return f.toFixed(2)
        })
        return temp.toString()
      }
      return '无坐标'
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.temp.position = this.positonTostring(row)
      this.temp.date = new Date(this.temp.date)
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          let position = this.temp.position
          const i = position.indexOf(',')
          if (i) {
            const start = position.substring(0, i)
            const end = position.substring(i + 1)
            if (!(isNaN(start) || isNaN(end))) {
              position = [parseFloat(start), parseFloat(end)]
              tempData.position = position
              const temp = tempData
              tempData.date = +new Date(tempData.date) // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
              updateDevsInfoToApi(tempData).then(() => {
                const index = this.tableData.findIndex(v => v.id === this.temp.id)
                this.tableData.splice(index, 1, temp)
                this.dialogFormVisible = false
                this.$notify({
                  title: 'Success',
                  message: '设备信息更新成功!',
                  type: 'success',
                  duration: 2000
                })
              })
            } else { this.$message.error('position type error') }
          } else { this.$message.error('position type error') }
        }
      })
    },

    handleSoreDel() {
      this.warningDialog = false
      const row = this.deltemp.row
      const index = this.deltemp.index
      deleteDev(row).then(res => {
        if (res.msg === 'ok') {
          this.$notify({
            title: '已删除',
            message: '设备信息已被删除!',
            type: 'success',
            duration: 2000
          })
          this.tableData.splice(index, 1)
        } else { this.$message.error('数据提交错误!') }
      })
    },
    handleDelete(row, index) {
      this.deltemp.row = row
      this.deltemp.index = index
      this.warningDialog = true
    }
  }
}
</script>
