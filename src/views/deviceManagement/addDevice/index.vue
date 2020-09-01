<template>
  <div class="devmain">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <el-row :gutter="10">
          <el-col :span="10">
            <div class="headerInfo">
              <span style="font-size:20px ; color:#000000">设备数据点管理</span>
              <el-link style="margin-top:10px" type="info">设备信息按不同分区进行管理</el-link>
            </div>
          </el-col>
          <el-col :span="10" :offset="4">
            <div class="reg">
              <!-- <span style="margin-right:5px">当前分区:</span> -->
              <el-select v-model="cregName" class="regselect" placeholder="请选择">
                <el-option
                  v-for="(item,index) in regOptions"
                  :key="index"
                  :label="item"
                  :value="item"
                />
              </el-select>
            </div>
          </el-col>
        </el-row>
      </div>
      <div class="content">
        <el-row :gutter="30">
          <el-col class="dpleft" :span="8">
            <el-card class="dev-box">
              <div slot="header" class="clearfix">
                <span>{{ cregName ||'未选分区' }}</span>
                <!-- <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button> -->
              </div>
              <div v-for="(item,index) of devsList" :key="index" class="devInfo">
                <div class="dev_name">
                  <el-button style="font-size:16px" type="text" @click="showdevDetail(item.devName)">{{ item.devName }}</el-button>
                </div>

                <div class="btn_info">
                  <el-button class="btn" type="info" size="mini" @click="switchTable(item.devName)">数据点</el-button>
                  <!-- <el-divider direction="vertical" /> -->
                  <el-button class="btn" type="primary" size="mini" @click="handleEditorDev(item)">编辑</el-button>
                  <!-- <el-divider direction="vertical" /> -->
                  <el-button class="btn" type="danger" size="mini" @click="handleDelDev(item.devName)">删除</el-button>
                </div>
              </div>
              <el-divider />
              <div class="createDev">
                <el-button type="success" @click="handleCreateDev">创建设备</el-button>
              </div>
            </el-card>
          </el-col>
          <el-col class="dpright" :span="16">
            <el-tabs v-model="activeName" @tab-click="1">
              <el-tab-pane label="所有数据点" name="first">
                <el-table
                  ref="dPalltable"
                  v-loading="tableLoading"
                  element-loading-text="拼命加载中"
                  element-loading-spinner="el-icon-loading"
                  class="dpalltable"
                  size="mini"
                  :data="tableAllData"
                  highlight-current-row
                  max-height="500"
                  border
                  fit
                >
                  <el-table-column align="center" prop="devName" label="隶属设备">
                    <template slot-scope="scope">
                      <i class="el-icon-cpu" />
                      <span>{{ scope.row.devName }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column align="center" prop="dpName" label="数据点名" />
                  <el-table-column align="center" prop="position" label="坐标">
                    <template slot-scope="{row}">
                      <span>{{ positonTostring(row) }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column align="center" prop="dataTotal" label="当前数据量" />
                  <el-table-column align="center" prop="type" label="类型">
                    <template slot-scope="{row}">
                      <span>{{ row.type|parseType }}</span>
                    </template>
                  </el-table-column>
                  <!-- Actions -->
                  <el-table-column label="操作" align="center" width="200" class-name="small-padding fixed-width">
                    <template slot-scope="{row,$index}">
                      <el-button type="primary" size="mini" @click="handleUpdateDp(row)">Edit</el-button>
                      <el-button size="mini" type="danger" @click="handleDelDp(row,$index,'all')">Delete</el-button>
                    </template>
                  </el-table-column>
                  <!-- end Actions -->
                </el-table>

              </el-tab-pane>
              <el-tab-pane name="second">
                <div slot="label" class="switchDp">
                  <el-dropdown split-button type="text">
                    <span>{{ cdevName||'当前未选设备' }}</span>
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item v-for="(item,index) in devsKeys" :key="index">
                        <span @click="selectDev(item)"> {{ item }}</span>
                      </el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                </div>
                <el-table
                  ref="dPalltable"
                  v-loading="tableLoading"
                  element-loading-text="拼命加载中"
                  element-loading-spinner="el-icon-loading"
                  class="dpcurtable"
                  size="mini"
                  :data="tableData"
                  highlight-current-row
                  max-height="500"
                  border
                  fit
                >
                  <el-table-column align="center" prop="dpName" label="数据点名">
                    <template slot-scope="scope">
                      <!-- <i class="el-icon-time" /> -->
                      <span>{{ scope.row.dpName }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column align="center" prop="position" label="坐标">
                    <template slot-scope="{row}">
                      <span>{{ positonTostring(row) }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column align="center" prop="dataTotal" label="当前数据量" />
                  <el-table-column align="center" prop="type" label="类型">
                    <template slot-scope="{row}">
                      <span>{{ row.type|parseType }}</span>
                    </template>
                  </el-table-column>
                  <!-- Actions -->
                  <el-table-column label="操作" align="center" width="200" class-name="small-padding fixed-width">
                    <template slot-scope="{row,$index}">
                      <el-button type="primary" size="mini" @click="handleUpdateDp(row)">Edit</el-button>
                      <el-button size="mini" type="danger" @click="handleDelDp(row,$index,'some')">Delete</el-button>
                    </template>
                  </el-table-column>
                  <!-- end Actions -->
                </el-table>
              </el-tab-pane>
            </el-tabs>
            <!-- group table -->
            <el-row>
              <el-col :span="8" :offset="8">
                <div><el-button type="primary" @click="handleCreateDp">为当前分区创建数据点</el-button></div>
              </el-col>
            </el-row>
            <!-- end group table -->
          </el-col>
        </el-row>
      </div>
    </el-card>

    <!-- end editor -->
    <!-- group form editor -->

    <!-- end group form editor -->
    <div class="show-dev-detail">
      <el-dialog
        :modal-append-to-body="false"
        custom-class="dialog"
        :title="cdevName"
        :visible.sync="devDetailVisible"
        width="30%"
        @close="closedevDetail"
      >
        <el-card class="box-card" shadow="never">
          <div>设备名字 : {{ cdev.devName }}</div>
          <div>设备描述 : {{ cdev.desc }}</div>
          <div>坐标 :{{ positonTostring(cdev.position) }}</div>
          <div>当前数据量: {{ cdev.dataTotal }}</div>
          <div>数据点总数 : {{ cdev.dpTotal }}</div>
        </el-card>
        <!-- <span slot="footer" class="dialog-footer">
          <el-button @click="closedevDetail">关 闭</el-button>
        </span> -->
      </el-dialog>
    </div>

    <!--  form editor -->
    <el-dialog :title="textMap[devOpStatus]" :visible.sync="devFormVsible" width="50%" @close="closeEditorDev">
      <el-form
        ref="devForm"
        :rules="devrules"
        :model="devtemp"
        label-position="left"
        label-width="90px"
        style="width: 300px; margin-left:50px; "
      >
        <el-form-item label="设备名:" prop="devName">
          <el-input v-model="devtemp.devName" placeholder="请输入" clearable />
        </el-form-item>
        <el-form-item label="经纬度" prop="position">
          <el-input v-model="devtemp.position" placeholder="请以逗号分隔" clearable />
        </el-form-item>
        <el-form-item label="简介" prop="desc">
          <el-input
            v-model="devtemp.desc"
            type="textarea"
            maxlength="30"
            show-word-limit
            placeholder="设备描述"
            clearable
          />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeEditorDev">取 消</el-button>
        <el-button type="primary" @click="devOpStatus ==='editor'?updateDevInfo():createDev()">确 定</el-button>
      </span>
    </el-dialog>
    <!-- end  form editor -->
    <!-- dp form start -->

    <el-dialog :title="textMap[dpOpStatus]" :visible.sync="dpFormVsible" width="50%" @close="1">
      <el-form
        ref="dpForm"
        :rules="dprules"
        :model="dptemp"
        label-position="left"
        label-width="90px"
        style="width: 300px; margin-left:50px; "
      >
        <el-form-item v-if="dpOpStatus==='create'" label="设备名:" prop="devName">
          <el-select v-model="dptemp.devName" placeholder="请选择">
            <el-option
              v-for="(item,index) in devsKeys"
              :key="index"
              :label="item"
              :value="item"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="数据点名:" prop="dpName">
          <el-input v-model="dptemp.dpName" placeholder="请输入" clearable />
        </el-form-item>
        <el-form-item label="经纬度" prop="position">
          <el-input v-model="dptemp.position" placeholder="请以逗号分隔" clearable />
        </el-form-item>
        <el-form-item label="类型:" prop="type">
          <el-input v-model="dptemp.type" type="number" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="简介" prop="desc">
          <el-input
            v-model="dptemp.desc"
            type="textarea"
            maxlength="30"
            show-word-limit
            placeholder="设备描述"
            clearable
          />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dpFormVsible=false">取 消</el-button>
        <el-button type="primary" @click="dpOpStatus ==='editor'?updataDpInfo():createDp()">确 定</el-button>
      </span>
    </el-dialog>

    <!-- end dp form  -->

  </div>

</template>
<style lang='scss' >
@import "@/styles/adddevice.scss";
</style>
<script>
import { parePositon } from '@/utils/parse-position'
import {
  getDevsDataPointsFromApi,
  delDevToApi,
  updateDevToApi,
  createDevToApi,
  updateDpToApi,
  createDpToApi,
  delDpToApi

} from '@/api/dp'
import Dictionary from '@/utils/newMap'
export default {
  data() {
    return {
      dpFormVsible: false,
      devFormVsible: false,
      devDetailVisible: false,
      activeName: 'first',
      tableLoading: false,
      cdevName: '',
      cregName: '',
      tableData: [],

      tableAllData: [],

      devOpStatus: '',
      textMap: {
        create: '创建设备',
        editor: '编辑设备信息'
      },
      dpOpStatus: '',
      devtemp: {
        devName: '',
        desc: '',
        position: undefined

      },
      dptemp: {
        devName: '',
        dpName: '',
        desc: '',
        position: undefined
      },
      cdpName: '',

      regDict: undefined,
      regOptions: [],
      devsKeys: [],
      devsList: [],
      devsDict: undefined,
      cdev: {},

      devrules: {
        devName: [{ required: true, message: 'devName is required', trigger: 'change' }],
        desc: [{ required: true, message: 'desc is required', trigger: 'change' }],
        position: [{ required: true, message: 'position is required', trigger: 'blur' }]
      },
      dprules: {
        devName: [{ required: true, message: 'devName is required', trigger: 'change' }],
        dpName: [{ required: true, message: 'dpName is required', trigger: 'change' }],
        type: [{ required: true, message: 'type must be a number', trigger: 'change' }],
        desc: [{ required: true, message: 'desc is required', trigger: 'change' }],
        position: [{ required: true, message: 'position is required', trigger: 'blur' }]
      }
    }
  },
  watch: {
    cregName(newReg) {
      this.refreshReg(newReg)
    },
    cdevName(newName) {
      this.refreshDev(newName)
      this.activeName = 'second'
      // console.log(dev, newName)
    }
  },
  created() {
    this.getDevsDpList()
  },
  methods: {
    getDevsDpList(regName) {
      getDevsDataPointsFromApi(regName).then(res => {
        const data = res.data
        const regDict = new Dictionary()
        for (const reg of data) {
          const devsDict = new Dictionary()
          reg.devs.forEach((dev, index, arr) => {
            const dps = dev.dataPoints
            const dpsDict = new Dictionary()
            dps.forEach(item => { dpsDict.add(item.dpName, item) })
            dev.dataPoints = dpsDict
            devsDict.add(dev.devName, dev)
          })
          reg.devs = devsDict
          regDict.add(reg.regName, reg)
        }
        this.regOptions = regDict.getKeys()
        this.regDict = regDict
        // const devKeys = this.getDevsKeys(regDict)
        // console.log(this.regOptions)
        this.cregName = regDict.getFirstKey()
      })
    },

    switchTable(devName) {
      this.activeName = 'second'
      this.cdevName = devName
      console.log(devName)
    },
    handleEditorDev(cdev) {
      this.devOpStatus = 'editor'
      this.cdev = cdev
      const temp = Object.assign({}, cdev)
      temp.position = this.positonTostring(temp.position)
      this.devtemp = Object.assign({}, temp)
      this.devFormVsible = true
    },
    updateDevInfo() {
      this.$refs['devForm'].validate(valid => {
        const temp = Object.assign({ }, this.devtemp)
        // const temp = this.devtemp

        if (valid) {
          const position = parePositon(temp.position)
          if (position) {
            temp.position = position
            const changedKey = this.devsDict.changeKey(this.cdev.devName, temp.devName)
            if (changedKey) {
              // update to api
              const data = { regName: this.cregName, dev: temp }
              updateDevToApi(data).then(res => {
                this.devsDict.update(temp.devName, temp)
                this.devsList = this.devsDict.toList()
                this.devsKeys = this.devsDict.getKeys()
                this.devFormVsible = false

                this.$notify({
                  title: 'success',
                  message: '更新成功',
                  type: 'success'
                })
              })
            } else { this.$message.error('设备名冲突') }
          } else {
            this.$message.error('坐标类型错误')
          }
        }
      })
    },
    closeEditorDev() {
      this.cdev = {}
      this.devFormVsible = false
    },

    handleDelDev(devName) {
      this.$confirm('此操作将永久删除该设备, 是否继续?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const data = { regName: this.cregName, devName: devName }
        delDevToApi(data).then(res => {
          this.devsDict.remove(devName)
          this.devsList = this.devsDict.toList()
          this.devsKeys = this.devsDict.getKeys()
          this.$message.success('删除成功!')
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    handleCreateDev() {
      this.devtemp = {
        devName: '',
        desc: '',
        position: undefined
      }
      this.devOpStatus = 'create'
      this.devFormVsible = true
      this.$nextTick(() => {
        this.$refs['devForm'].clearValidate()
      })
    },
    createDev() {
      // console.log('dd')
      this.$refs['devForm'].validate(valid => {
        const temp = Object.assign({ }, this.devtemp)
        if (valid) {
          const position = parePositon(temp.position)
          if (position) {
            temp.position = position
            const checkKey = this.devsDict.checkKey(temp.devName)
            if (checkKey) {
              console.log(temp)
              // update to api
              const data = { regName: this.cregName, dev: temp }
              createDevToApi(data).then(res => {
                temp.dataPoints = new Dictionary()
                this.devsDict.add(temp.devName, temp)
                this.devsList = this.devsDict.toList()
                this.devsKeys = this.devsDict.getKeys()
                this.devFormVsible = false
                this.$notify({
                  title: 'success',
                  message: '更新成功',
                  type: 'success'
                })
              })
            } else { this.$message.error('设备名冲突') }
          } else {
            this.$message.error('坐标类型错误')
          }
        }
      })
    },
    selectDev(dev) {
      // console.log(dev)
      this.cdevName = dev
    },
    showdevDetail(dev) {
      // console.log(dev)
      this.cdevName = dev
      this.cdev = this.devsDict.find(dev)
      this.devDetailVisible = true
    },
    closedevDetail() {
      // console.log('close')
      this.devDetailVisible = false
      this.cdev = {}
    },
    handleCreateDp() {
      this.dpOpStatus = 'create'
      this.dptemp = {}
      this.dpFormVsible = true
      this.$nextTick(_ => {
        this.$refs['dpForm'].clearValidate()
      })
    },
    handleUpdateDp(row, index) {
      this.cdpName = row.dpName
      this.dpOpStatus = 'editor'
      const temp = Object.assign({}, row)
      temp.position = this.positonTostring(temp.position)
      this.dptemp = temp
      this.dpFormVsible = true
      this.$nextTick(_ => {
        this.$refs['dpForm'].clearValidate()
      })
    },
    handleDelDp(row, index, which) {
      this.$confirm('此操作将永久删除该数据点, 是否继续?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const temp = Object.assign({}, row)
        temp.regName = this.cregName
        console.log(temp)
        delDpToApi(temp).then(res => {
          const devName = row.devName
          const dpName = row.dpName
          const dev = this.devsDict.find(devName)
          const dpsDict = dev.dataPoints
          dpsDict.remove(dpName)
          this.refreshReg(this.cregName)
          this.refreshDev(devName)
          this.$notify({
            title: '成功',
            message: '已删除',
            type: 'success'
          })
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    updataDpInfo() {
      this.$refs['dpForm'].validate(valid => {
        const tempData = Object.assign({}, this.dptemp)
        if (valid) {
          const position = parePositon(tempData.position)
          if (position) {
            tempData.position = position
            const check = this.tableAllData.some(item => {
              return (item.devName !== tempData.devName) && (item.dpName === tempData.dpName)
            })
            const dpsDict = this.devsDict.find(tempData.devName).dataPoints
            const changeKey = dpsDict.changeKey(this.cdpName, tempData.dpName)
            if (!check && changeKey) {
              const data = { regName: this.cregName, ...tempData }
              console.log(data)

              updateDpToApi(data).then(res => {
                dpsDict.update(tempData.dpName, tempData)
                this.refreshReg(this.cregName)
                this.refreshDev(tempData.devName)
                this.dpFormVsible = false
                this.$notify({
                  title: '成功',
                  message: '修改成功！',
                  type: 'success'

                })
              })
            } else { this.$message.error('数据点名检验失败！') }
          } else { this.$message.error('坐标类型错误！') }
        }
      })
    },
    createDp() {
      this.$refs['dpForm'].validate(valid => {
        const tempData = Object.assign({}, this.dptemp)
        if (valid) {
          const position = parePositon(tempData.position)
          if (position) {
            tempData.position = position
            const index = this.tableAllData.findIndex(i => i.dpName === tempData.dpName)
            // console.log(this.tableAllData, index)
            if (index === -1) {
              const data = { regName: this.cregName, ...tempData }
              // post to api
              console.log(data)
              createDpToApi(data).then(res => {
                // let dpsDict = new Dictionary()
                // dpsDict.add(temp.dpName,temp)
                const dev = this.devsDict.find(tempData.devName)
                const dpsDict = dev.dataPoints
                dpsDict.add(tempData.dpName, tempData)
                this.refreshReg(this.cregName)
                this.refreshDev(tempData.devName)
                this.dpFormVsible = false
                this.$notify({
                  title: '成功',
                  message: '创建成功',
                  type: 'success'
                })
              })
            } else { this.$message.error('设备名检验不通过！') }
          } else { this.$message.error('坐标类型错误！') }
          // console.log(this.dptemp)
        } else { this.$message.error('检验失败！') }
      })
    },

    positonTostring(data) {
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
    },
    refreshReg(newReg) {
      // console.log(newReg)
      const reg = this.regDict.find(newReg)
      const devsDict = reg.devs
      const devsKeys = devsDict.getKeys()
      let dpsList = []
      devsKeys.forEach(item => {
        const dev = devsDict.find(item)
        const dpsDict = dev.dataPoints
        const dpList = dpsDict.toList()
        dpList.forEach(item => { item.devName = dev.devName })
        dpsList = dpsList.concat(dpList)
      })
      this.tableAllData = dpsList
      this.devsKeys = devsKeys
      this.devsDict = devsDict
      this.devsList = devsDict.toList()
    },
    refreshDev(newName) {
      if (newName) {
        const dev = this.devsDict.find(newName)
        const dpsDict = dev.dataPoints
        // console.log(dpsDict.toList())
        this.tableData = dpsDict.toList()
      }
    }
  }
}
</script>
