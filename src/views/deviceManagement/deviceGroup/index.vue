<template>
  <div class="main">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <el-row :gutter="10">
          <el-col :span="10">
            <div class="headerInfo">
              <span style="font-size:20px ; color:#000000">设备分组管理</span>
              <el-link style="margin-top:10px" type="info">分组信息按不同分区进行管理</el-link>
            </div>
          </el-col>
          <el-col :span="10" :offset="4">
            <div class="reg">
              <span style="margin-right:5px">当前分区:</span>
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
          <el-col class="reg-left" :span="6">
            <div>
              <div class="reg-iamge">
                <el-image
                  :src="cregInfo.layerUrl"
                  fit="scale-down"
                  style="width:100%; height: 150px"
                >
                  <div slot="error" class="image-slot">
                    <div class="image-error">
                      <i class="el-icon-picture-outline" />
                    </div>
                  </div>
                </el-image>
              </div>
              <div class="reginfocontent">
                <ul>
                  <li>
                    <svg-icon icon-class="pname" />
                    <span>基地名称 :</span>
                    {{ cregInfo.regName }}
                  </li>
                  <li />
                  <li>
                    <i class="el-icon-time" />
                    <span>创建时间 :</span>
                    {{ cregInfo.date }}
                  </li>
                  <li>
                    <p>
                      <svg-icon icon-class="intro" />
                      <span>基地描述 :</span>
                    </p>
                    <P style="text-indent:2em">{{ cregInfo.desc }}</P>
                  </li>
                  <li>
                    <i class="el-icon-position" />
                    经纬度 :{{ positonTostring(cregInfo.position) }}
                  </li>
                  <li>
                    <svg-icon icon-class="range" />
                    基地总面积 :{{ cregInfo.regRange }}平方米
                  </li>
                  <li>
                    <svg-icon icon-class="plot" />
                    地块总数 :{{ cregInfo.polotsTotal }}块
                  </li>

                  <li>
                    <p>
                      <i class="el-icon-location" />
                      <span>详细地址:</span>
                    </p>
                    <p style="text-indent:2em">{{ cregInfo.localtion }}</p>
                  </li>
                </ul>
                <el-button
                  :disabled="regOptions.length==0"
                  type="primary"
                  size="mini"
                  @click="handleEditorReg"
                >编辑</el-button>
                <el-button type="primary" size="mini" @click="handleCreateReg">添加</el-button>
                <el-button
                  :disabled="regOptions.length==0"
                  type="danger"
                  size="mini"
                  @click="handleDelReg"
                >删除</el-button>
              </div>
            </div>
          </el-col>
          <el-col :span="18">
            <!-- group table -->
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
            >
              <el-table-column
                header-align="center"
                align="center"
                prop="date"
                sortable
                label="创建日期"
                width="200"
              >
                <template slot-scope="scope">
                  <i class="el-icon-time" />
                  <span>{{ scope.row.date }}</span>
                </template>
              </el-table-column>

              <el-table-column header-align="center" align="center" prop="gName" label="设备组名">
                <template slot-scope="scope">
                  <el-popover
                    title="额外信息"
                    placement="right"
                    width="200"
                    trigger="click"
                    @show="showGroupInfo"
                  >
                    <div
                      v-loading="false"
                      element-loading-text="拼命加载中"
                      element-loading-spinner="el-icon-loading"
                    >
                      <p>描述:{{ scope.row.desc }}</p>
                      <p>设备总数:{{ scope.row.devsTotal }}</p>
                      <div style="text-align: right; margin: 0">
                        <el-button size="mini" type="text" @click="1">详情</el-button>
                      </div>
                    </div>
                    <el-button slot="reference" type="text">{{ scope.row.gName }}</el-button>
                  </el-popover>
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
                  <el-button type="primary" size="mini" @click="handleUpdateGroup(row,$index)">Edit</el-button>
                  <el-button
                    v-if="row.status!='deleted'"
                    size="mini"
                    type="danger"
                    @click="handleDeleteGroup(row,$index)"
                  >Delete</el-button>
                </template>
              </el-table-column>
              <!-- end Actions handleDelete(row,$index)  handleUpdate(row)-->
            </el-table>

            <!-- end group table -->
            <!-- group table -->
            <el-row>
              <el-col :span="8" :offset="8">
                <div><el-button type="primary" @click="handleCreateGroup">为当前分区创建设备组</el-button></div>
              </el-col>
            </el-row>
            <!-- end group table -->
          </el-col>

        </el-row>

      </div>
    </el-card>
    <div class="editor-data">
      <el-dialog
        :title="textMap[dialogStatus]"
        :visible.sync="dialogFormVisible"
        @close="handleCancel"
      >
        <el-form
          ref="dataForm"
          :rules="rules"
          :model="regTemp"
          label-position="left"
          label-width="90px"
          style="width: 300px; margin-left:50px; "
        >
          <el-dialog :fullscreen="true" :visible.sync="preImagedialogVisible" append-to-body>
            <img width="100%" :src="dialogImageUrl" alt="无法加载">
          </el-dialog>
          <el-form-item label="基地名称:" prop="regName">
            <el-input v-model="regTemp.regName" placeholder="请输入" clearable />
          </el-form-item>
          <el-form-item label="经纬度" prop="position">
            <el-input v-model="regTemp.position" placeholder="请以逗号分隔" clearable />
          </el-form-item>
          <el-form-item label="日期" prop="date">
            <el-date-picker v-model="regTemp.date" type="datetime" placeholder="登记时间" />
          </el-form-item>
          <el-form-item label="基地简介" prop="desc">
            <el-input
              v-model="regTemp.desc"
              type="textarea"
              maxlength="30"
              show-word-limit
              placeholder="请以逗号分隔"
              clearable
            />
          </el-form-item>
          <el-form-item label="基地地址" prop="localtion">
            <el-input
              v-model="regTemp.localtion"
              type="textarea"
              maxlength="30"
              show-word-limit
              placeholder="输入项目地址"
            />
          </el-form-item>
        </el-form>
        <div class="image-upload">
          <span style="color:#606266;font-weight: 700;">基地快照:</span>
          <el-upload
            ref="upload"
            class="upload-iamge"
            :action="imageUploadUrl"
            :before-upload="limitUploadFile"
            :on-preview="handlePreview"
            :before-remove="handleRemove"
            :auto-upload="false"
            :file-list="fileList"
            :on-error="uploadError"
            :limit="1"
            :on-success="uploadSuccess"
            :on-exceed="fileExceed"
            list-type="picture"
          >
            <el-button slot="trigger" :disabled="uploading" size="small" type="primary">选取文件</el-button>
            <el-button
              style="margin-left: 10px;"
              size="small"
              type="success"
              @click="submitUpload"
            >上传到服务器</el-button>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
          </el-upload>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button @click="handleCancel">Cancel</el-button>
          <el-button
            :disabled="!hadUpload"
            type="primary"
            @click="dialogStatus=='editor'?updateRegData():createRegData()"
          >Confirm</el-button>
        </div>

      </el-dialog>
    </div>
    <!-- end editor -->
    <!-- group form editor -->
    <el-dialog
      :title="statusMap[gStatus]"
      :visible.sync="gdialogVisible"
      width="50%"
    >
      <el-form
        ref="gdataForm"
        :rules="grules"
        :model="gtemp"
        label-position="left"
        label-width="90px"
        style="width: 300px; margin-left:50px; "
      >
        <el-form-item label="设备组" prop="gName">
          <el-input v-model="gtemp.gName" placeholder="请输入" clearable />
        </el-form-item>
        <el-form-item label="经纬度" prop="position">
          <el-input v-model="gtemp.position" placeholder="请以逗号分隔" clearable />
        </el-form-item>
        <el-form-item label="简介" prop="desc">
          <el-input
            v-model="gtemp.desc"
            type="textarea"
            maxlength="30"
            show-word-limit
            placeholder="输入项目简介"
            clearable
          />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="gdialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="gStatus=='editor'?updateGroupInfo():createGroupInfo()">确 定</el-button>
      </span>
    </el-dialog>
    <!-- end group form editor -->
    <div class="show-message">
      <el-dialog title="警告" :visible.sync="dialogVisible" width="30%" @close="delWarningClose">
        <span style="color:red">{{ gdelFlag?'分组信息':'基地信息' }}一旦删除就不可撤销 ,确定要删除吗?</span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="delWarningClose">取 消</el-button>
          <el-button v-show="gdelFlag" type="primary" @click="delGrouInfo">确 定</el-button>
          <el-button v-show="!gdelFlag" type="primary" @click="delcreg">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>
<style lang='scss' scoped>
@import "@/styles/groupinfo.scss";
</style>
<script>
import { imageUploadUrl } from '@/settings'
import {
  getRegGroupInfoFromApi,
  updateRegInfoToApi,
  createRegInfoToApi,
  delRegToApi,
  updataGroupInfoToApi,
  delGroupInfoToApi,
  creteGroupInfoToApi

} from '@/api/device-info'
export default {
  data() {
    return {
      imageUploadUrl: imageUploadUrl,
      uploading: false,
      tableLoading: false,
      dialogVisible: false,
      dialogFormVisible: false,
      preImagedialogVisible: false,
      preImageUrl: '',
      cregName: undefined,
      regOptions: [],
      regGroupInfo: [],
      tableData: [],

      gdialogVisible: false,
      gdelFlag: false,
      oldGroup: undefined,
      gStatus: '',
      statusMap: {
        create: '创建设备组',
        editor: '更新设备组信息'
      },
      gtemp: {
        gName: '',
        date: undefined,
        desc: '',
        position: undefined
      },
      delginfo: { group: [], index: 0 },
      grules: {
        gName: [{ required: true, message: 'gName is required', trigger: 'change' }],
        desc: [{ required: true, message: 'desc is required', trigger: 'change' }],
        position: [{ required: true, message: 'position is required', trigger: 'blur' }]
      },

      dialogStatus: '',
      textMap: {
        create: '创建分区',
        editor: '编辑分区信息'
      },

      regTemp: {
        regName: '',
        layerUrl: '',
        date: undefined,
        desc: '',
        localtion: '',
        regRange: undefined,
        polotsTotal: undefined,
        position: undefined,
        groupInfo: []
      },
      fileList: [],
      tempFile: undefined,
      dialogImageUrl: '',
      hadUpload: true,

      cregInfo: {
        regName: '',
        date: undefined,
        layerUrl: '',
        desc: '',
        localtion: '',
        regRange: undefined,
        polotsTotal: undefined,
        position: [],
        groupInfo: []
      },

      rules: {
        regName: [
          { required: true, message: 'regName is required', trigger: 'change' }
        ],
        desc: [
          { required: true, message: 'desc is required', trigger: 'change' }
        ],
        localtion: [
          { required: true, message: 'localtion is required', trigger: 'blur' }
        ],
        position: [
          {
            required: true,
            message: 'position value is required',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  watch: {
    cregName(newsel) {
      console.log('cregName', newsel)
      for (const reg of this.regGroupInfo) {
        if (newsel === reg.regName) {
          this.tableData = reg.groupInfo
          this.cregInfo = reg
          break
        }
      }
    }
  },
  created() {
    this.getGroupInfo()
  },
  methods: {
    getGroupInfo() {
      getRegGroupInfoFromApi().then(res => {
        this.regGroupInfo = res.data
        for (const i of res.data) {
          this.regOptions.push(i.regName)
        }
        this.cregName = res.data[0].regName
      })
    },
    handleDeleteGroup(row, index) {
      this.delginfo = Object.assign({}, { group: row, index: index })
      this.gdelFlag = true
      this.dialogVisible = true
    },
    delGrouInfo() {
      this.gdelFlag = false
      const g = this.delginfo.group
      const temp = this.delginfo.group
      g.date = +new Date(g.date)
      const data = {}
      data.regName = this.cregName
      data.gName = g.gName
      g.regName = this.cregName
      // console.log(data)
      delGroupInfoToApi(g).then(res => {
        for (const reg of this.regGroupInfo) {
          if (reg.regName === this.cregName) {
            const index = reg.groupInfo.findIndex(v => v.gName === g.gName)
            if (index >= 0) {
              reg.groupInfo.splice(index, 1, temp)
              this.tableData.splice(this.delginfo.index, 1)
              break
            }
          }
        }
        this.dialogVisible = false
        this.delginfo = {}
        this.$notify({
          title: 'Success',
          message: '更新信息成功!',
          type: 'success',
          duration: 2000
        })
      })
    },
    delWarningClose() {
      this.dialogVisible = false
      this.gdelFlag = false
    },
    handleUpdateGroup(row, index) {
      this.gStatus = 'editor'
      this.gtemp = Object.assign({}, row) // copy obj
      this.oldGroup = Object.assign({ index }, row)
      this.gtemp.position = this.positonTostring(row.position)
      this.gtemp.date = new Date()
      this.gdialogVisible = true
      this.$nextTick(() => {
        this.$refs['gdataForm'].clearValid
      })
    },
    handleCreateGroup() {
      this.gtemp = Object.assign({}, {}) // copy obj
      this.gStatus = 'create'
      this.gdialogVisible = true
      this.$nextTick(() => {
        this.$refs['gdataForm'].clearValid
      })
    },
    updateGroupInfo() {
      this.$refs['gdataForm'].validate(valid => {
        if (valid) {
          const tempData = Object.assign({}, this.gtemp)
          tempData.date = new Date()
          let position = this.gtemp.position
          const i = position.indexOf(',')
          if (i) {
            const start = position.substring(0, i)
            const end = position.substring(i + 1)
            if (!(isNaN(start) || isNaN(end))) {
              position = [parseFloat(start), parseFloat(end)]
              tempData.position = position
              const temp = tempData
              tempData.date = +new Date(tempData.date)
              // console.log(this.cregName, 'regName')
              temp.regName = this.cregName
              // console.log(temp)
              updataGroupInfoToApi(temp).then(res => {
                for (const reg of this.regGroupInfo) {
                  if (reg.regName === this.cregName) {
                    const index = reg.groupInfo.findIndex(v => v.gName === this.oldGroup.gName)
                    if (index >= 0) {
                      console.log('index', index)
                      reg.groupInfo[index] = temp
                      this.tableData.splice(this.oldGroup.index, 1, temp)
                      break
                    }
                  }
                }
                this.gdialogVisible = false
                this.oldGroup = {}
                this.$notify({
                  title: 'Success',
                  message: '更新信息成功!',
                  type: 'success',
                  duration: 2000
                })
              })
            } else { this.$message.error('坐标格式错误') }
          } else { this.$message.error('坐标格式错误') }
        }
      })
    },

    createGroupInfo() {
      this.$refs['gdataForm'].validate(valid => {
        if (valid) {
          const tempData = Object.assign({}, this.gtemp)
          tempData.date = new Date()
          let position = this.gtemp.position
          const i = position.indexOf(',')
          if (i) {
            const start = position.substring(0, i)
            const end = position.substring(i + 1)
            if (!(isNaN(start) || isNaN(end))) {
              position = [parseFloat(start), parseFloat(end)]
              tempData.position = position
              const temp = tempData
              tempData.date = +new Date(tempData.date)
              // console.log(this.cregName, 'regName')
              temp.regName = this.cregName
              // console.log(temp)

              creteGroupInfoToApi(temp).then(res => {
                for (const reg of this.regGroupInfo) {
                  if (reg.regName === this.cregName) {
                    reg.groupInfo.push(temp)
                    this.tableData = reg.groupInfo
                  }
                }
                this.gdialogVisible = false
                this.oldGroup = {}
                this.$notify({
                  title: 'Success',
                  message: '新建成功!',
                  type: 'success',
                  duration: 2000
                })
              })
            } else { this.$message.error('坐标格式错误') }
          } else { this.$message.error('坐标格式错误') }
        }
      })
    },
    showGroupInfo() {},
    fileExceed() {
      this.$message.error('无法上传多个文件!')
    },
    handleRemove(file, fileList) {
      // 处理移除文件
      this.tempFile = undefined
      console.log('remove file')
      this.hadUpload = false
      return true
    },
    handlePreview(file) {
      this.dialogImageUrl = file.url
      this.preImagedialogVisible = true
    },
    submitUpload() {
      // this.fileList.pop()
      console.log('upload')
      const cfile = this.$refs.upload.uploadFiles[0]
      if (!cfile) {
        this.$message.warning('图片未选择!')
      } else if (cfile.name === '当前基地图片') {
        this.$message.warning('当前图片未修改')
      } else {
        this.uploading = true
        this.$refs.upload.submit()
      }
    },
    uploadError(err, file, fileList) {
      this.uploading = false
      this.$refs.upload.clearFiles()
      console.log(err)
      this.fileList = []
      this.fileList.push({ name: file.name, url: file.url })
      this.$message.error('图片上传失败,请重新上传.')
    },
    uploadSuccess(res, file, fileList) {
      this.hadUpload = true
      this.uploading = false
      // console.log(res)
      this.tempFile = res
    },
    handleEditorReg() {
      this.dialogStatus = 'editor'
      this.regTemp = Object.assign({}, this.cregInfo) // copy obj
      this.regTemp.position = this.positonTostring(this.cregInfo.position)
      this.regTemp.date = new Date(this.cregInfo.date)
      this.fileList.push({ name: '当前基地图片', url: this.cregInfo.layerUrl })
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleCreateReg() {
      this.fileList = []
      this.hadUpload = false
      this.regTemp = {
        regName: '',
        layerUrl: '',
        date: undefined,
        desc: '',
        localtion: '',
        regRange: undefined,
        polotsTotal: undefined,
        position: undefined
      }
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleDelReg() {
      this.dialogVisible = true
    },
    delcreg() {
      const index = this.regOptions.indexOf(this.cregName)
      const index1 = this.regGroupInfo.findIndex(v => v.regName === this.cregName)
      const tempdata = this.regGroupInfo[index1]
      const data = { regName: tempdata.regName }
      delRegToApi(data).then(res => {
        this.regGroupInfo.splice(index1, 1)
        this.regOptions.splice(index, 1)
        this.cregName = this.regOptions[0]
        if (this.regOptions.length === 0) {
          this.cregInfo = {
            regName: '',
            date: undefined,
            layerUrl: '',
            desc: '',
            localtion: '',
            regRange: undefined,
            polotsTotal: undefined,
            position: [],
            groupInfo: []
          }
          this.tableData = []
        }
        this.dialogVisible = false
        this.$notify({
          title: 'Success',
          message: '删除分区(基地)成功!',
          type: 'success',
          duration: 2000
        })
      })
    },
    handleCancel() {
      console.log(this.dialogStatus)
      if (this.dialogStatus === 'create') {
        this.hadUpload = true
      }
      this.dialogFormVisible = false
      this.fileList = []
    },
    updateRegData() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          const tempData = Object.assign({}, this.regTemp)
          // console.log('this.tempfile', this.tempFile)
          tempData.layerUrl = this.tempFile ? this.tempFile.url : tempData.layerUrl
          let position = this.regTemp.position
          const i = position.indexOf(',')
          if (i) {
            const start = position.substring(0, i)
            const end = position.substring(i + 1)
            if (!(isNaN(start) || isNaN(end))) {
              position = [parseFloat(start), parseFloat(end)]
              tempData.position = position
              const temp = tempData
              tempData.date = +new Date(tempData.date) // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
              updateRegInfoToApi(tempData).then(() => {
                this.fileList = [] // del fiel iamge
                const index = this.regOptions.indexOf(this.cregName)
                this.regOptions[index] = temp.regName
                const index1 = this.regGroupInfo.findIndex(
                  v => v.regName === this.cregName
                )
                this.regGroupInfo[index1] = temp
                console.log(this.cregName, this.regGroupInfo, temp.regName)
                this.cregInfo = Object.assign({}, temp)
                this.cregName = temp.regName
                this.dialogFormVisible = false
                this.$notify({
                  title: 'Success',
                  message: '分区(基地)信息更新成功!',
                  type: 'success',
                  duration: 2000
                })
              })
            } else {
              this.$message.error('坐标格式错误')
            }
          } else {
            this.$message.error('坐标格式错误')
          }
        }
      })
    },
    createRegData() {
      console.log('create')
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          const tempData = Object.assign({}, this.regTemp)
          console.log(this.fileList)
          // console.log('this.tempfile', this.tempFile)
          tempData.layerUrl = this.tempFile.url
          let position = this.regTemp.position
          const i = position.indexOf(',')
          if (i) {
            const start = position.substring(0, i)
            const end = position.substring(i + 1)
            if (!(isNaN(start) || isNaN(end))) {
              position = [parseFloat(start), parseFloat(end)]
              tempData.position = position
              const temp = tempData
              tempData.date = +new Date(tempData.date) // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
              createRegInfoToApi(tempData).then(() => {
                this.fileList = [] // del fiel iamge
                this.cregInfo = Object.assign({}, temp)
                this.regOptions.push(temp.regName)
                this.regGroupInfo.push(temp)
                this.cregName = temp.regName
                this.dialogFormVisible = false
                this.$notify({
                  title: 'Success',
                  message: '创建分区成功!',
                  type: 'success',
                  duration: 2000
                })
              })
            } else {
              this.$message.error('坐标格式错误')
            }
          } else {
            this.$message.error('坐标格式错误')
          }
        } else {
          this.$message.error('检验不通过,请检查')
        }
      })
    },
    updateRegOptions(regName) {},
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
    limitUploadFile(file) {
      const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    }
  }
}
</script>
