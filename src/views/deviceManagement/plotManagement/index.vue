<template>
  <div class="plotmain">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <el-row :gutter="10">
          <el-col :span="10">
            <div class="headerInfo">
              <span style="font-size:20px ; color:#000000">地块及图层管理</span>
              <el-link style="margin-top:10px" type="info">地块坐标数据及图层上传</el-link>
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
        <el-row :gutter="20">
          <el-col v-for="(plot, index) in plotsList" :key="index" class="plot_box" :span="6" :offset="2">
            <el-card :body-style="{ padding: '0px' }">
              <el-image style="width: 100%; height: 300px" :src="plot.layerUrl" :preview-src-list="[plot.layerUrl]" />
              <div style="padding: 14px;">
                <div class="bottom clearfix">
                  <el-tooltip placement="left" effect="light">
                    <div slot="content">{{ plot.desc }}</div>
                    <span>{{ plot.plotName }}</span>
                  </el-tooltip>

                  <el-button type="primary" class="button" @click="handleEditorPlot(plot)">Editor</el-button>
                </div>
                <div class="bottom clearfix">
                  <span class="lotRange">面积：{{ plot.lotRange }}</span>
                  <el-button type="danger" class="button" @click="handleDeletePlot(plot)">Delete</el-button>
                </div>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </div>
      <el-row :gutter="40">
        <el-col :span="4" :offset="8">
          <el-button type="primary" @click="hancreatePlot">新建地块数据</el-button>
        </el-col>
      </el-row>
    </el-card>
    <div class="plot_form">
      <el-dialog :title="textMap[dialogStatus]" :visible.sync="plotEditorVisible" width="40%" @close="plotFormClose">
        <el-dialog

          width="50%"
          title="上传边界经纬度（注意表头名为：longitude | latitude）"
          :visible.sync="exteriorVisibble"
          append-to-body
        >
          <div
            v-loading="tableLoading"
            class="app-container"
            element-loading-text="正在解析文件"
            element-loading-spinner="el-icon-loading"
            element-loading-background="rgba(0, 0, 0, 0.8)"
          >
            <upload-excel-component :on-success="handleExcelSuccess" :before-upload="beforeExcelUpload" />
            <el-table max-height="200px" :data="tableData" border highlight-current-row style="width: 100%;margin-top:20px;">
              <el-table-column v-for="(item,index) of tableHeader" :key="index" align="center" :prop="item" :label="item" />
            </el-table>
          </div>
        </el-dialog>

        <el-form
          ref="plotForm"
          :rules="prules"
          label-position="left"
          label-width="80px"
          size="mini"
          class="pform"
          :model="tempPlot"
        >
          <el-form-item label="地块名称" prop="plotName">
            <el-input v-model="tempPlot.plotName" style="width:200px" />
          </el-form-item>
          <el-form-item label="简要描述" prop="desc">
            <el-input
              v-model="tempPlot.desc"
              style="width:200px"
              type="textarea"
              maxlength="30"
              show-word-limit
            />
          </el-form-item>
          <el-form-item label="矩形区域" prop="bounds">
            <el-input v-model="tempPlot.bounds" style="width:200px" />
          </el-form-item>
          <el-form-item label="地块面积" prop="lotRange">
            <el-input v-model="tempPlot.lotRange" type="number" style="width:200px" />
          </el-form-item>
          <el-form-item label="边界坐标">
            <!-- <el-input v-model="tempPlot.bounds" style="width:200px" /> -->
            <el-button type="info" size="mini" @click="exteriorVisibble=true">{{ dialogStatus==='editor'?"更新":"上传" }}</el-button>
            <i :style="{color:exteriorUpdate?'green':'#fff'}" class="el-icon-success successIcon" />
          </el-form-item>
          <el-form-item label="地块图层">
            <el-upload
              ref="upload"
              class="upload-demo"
              :action="imageUploadUrl"
              :before-upload="limitUploadFile"
              :on-preview="handleImgPreview"
              :on-remove="handleImgRemove"
              :file-list="fileList"
              :auto-upload="false"
              :on-success="uploadImgSuccess"
              :on-error="uploadImgError"
              :on-exceed="fileExceed"
              :limit="1"
            >
              <el-button slot="trigger" size="mini" type="primary">选取文件</el-button>
              <el-button style="margin-left: 10px;" size="mini" type="success" @click="submitUpload">上传到服务器</el-button>
              <i :style="{color:imgHadUpload?'green':'#fff'}" class="el-icon-success successIcon" />
              <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过1024kb</div>
            </el-upload>
          </el-form-item>
          <!-- <el-form-item label="遥感图像">
            <el-upload
              ref="upload"
              class="upload-demo"
              :action="imageUploadUrl"
              :before-upload="limitUploadFile"
              :on-preview="handleImgPreview"
              :on-remove="handleImgRemove"
              :file-list="fileList"
              :auto-upload="false"
              :on-exceed="fileExceed"
              :limit="1"
            >
              <el-button slot="trigger" size="mini" type="primary">选取文件</el-button>
              <el-button style="margin-left: 10px;" size="mini" type="success" @click="submitUpload">上传到服务器</el-button>
              <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
            </el-upload>
          </el-form-item> -->
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button size="mini" @click="plotFormClose">取 消</el-button>
          <el-button size="mini" type="primary" @click="dialogStatus==='editor'?updataPlotInfo():createPlotInfo()">{{ dialogStatus==='editor'?"更新":"新建" }}</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>
<style lang='scss'>
@import "@/styles/plot.scss";
</style>
<script>
import { imageUploadUrl } from '@/settings'
import UploadExcelComponent from '@/components/UploadExcel/index.vue'
import { parePositon } from '@/utils/parse-position'
import Dictionary from '@/utils/newMap'
import { positonTostring } from '@/utils/map-about'
import {
  getPlotInfoFromApi,
  updatePlotInfoFromApi,
  createPlotInfoFromApi,
  deletePlotInfoToApi
} from '@/api/plot'
export default {
  components: { UploadExcelComponent },
  data() {
    return {
      imageUploadUrl: imageUploadUrl,
      tableLoading: false,
      exteriorUpdate: false,
      tableData: [],
      tableHeader: [],

      fileList: [],
      tempFile: undefined,

      dialogStatus: '',
      textMap: {
        create: '创建地块数据',
        editor: '编辑地块信息'
      },

      imgUploading: false,
      imgHadUpload: false,

      plotEditorVisible: false,
      exteriorVisibble: false,

      tempPlot: {
        plotName: '',
        lotRange: 0,
        layerUrl: '',
        exterior: [],
        bounds: '',
        desc: ''
      },

      prules: {
        plotName: [
          { required: true, message: 'plotName is required', trigger: 'change' }
        ],
        desc: [
          { required: true, message: 'desc is required', trigger: 'change' }
        ],
        bounds: [
          { required: true, message: 'bounds is required', trigger: 'blur' }
        ]
      },
      cregName: '',
      cplot: undefined,
      regOptions: [],
      regDict: undefined,
      plotsDict: undefined,
      plotsList: []
    }
  },
  watch: {
    cregName(newReg) {
      const creg = this.regDict.find(newReg)
      const plotsDict = creg.plots
      this.plotsList = plotsDict.toList()
      this.plotsDict = plotsDict
      // console.log(this.plotsList)
    }
  },
  created() {
    this.getPlotInfo()
  },
  methods: {
    getPlotInfo(regName) {
      getPlotInfoFromApi(regName).then(res => {
        const data = res.data
        const regDict = new Dictionary()
        data.forEach(reg => {
          const plots = reg.plots
          const pDict = new Dictionary()
          plots.forEach(plot => {
            pDict.add(plot.plotName, plot)
          })
          reg.plots = pDict
          regDict.add(reg.regName, reg)
        })
        this.regDict = regDict
        this.regOptions = regDict.getKeys()
        this.cregName = regDict.getFirstKey()
        // console.log(regDict)
      })
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
        this.imgUploading = true
        this.$refs.upload.submit()
      }
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
    },
    // imgChange(file, fileList) {
    //   console.log(file, fileList)
    // },
    fileExceed() { this.$message.error('图片数量超出限制！') },

    handleImgPreview() {},
    handleImgRemove() {
      console.log('remove file')
      this.imgHadUpload = false
      this.tempFile = undefined
      return true
    },

    uploadImgError(err, file, fileList) {
      this.imgUploading = false
      this.$refs.upload.clearFiles()
      console.log(err)
      this.fileList = []
      this.fileList.push({ name: file.name, url: file.url })
      this.$message.error('图片上传失败,请重新上传.')
    },
    uploadImgSuccess(res, file, fileList) {
      this.imgHadUpload = true
      this.imgUploading = false
      console.log(res)
      this.tempFile = res
    },

    beforeExcelUpload(file) {
      const isLt1M = file.size / 1024 / 1024 < 1
      if (isLt1M) {
        this.tableLoading = true
        return true
      }
      this.$message({
        message: '请不要上传大于1M的文件。',
        type: 'warning'
      })
      return false
    },
    handleExcelSuccess({ results, header }) {
      this.tableLoading = false
      this.$message.success('文件导入成功！')
      this.exteriorUpdate = true
      console.log(results, header)
      this.tableData = results
      this.tableHeader = header
    },
    handleDeletePlot(plot) {
      this.$confirm('此操作将永久删除该数据, 是否继续?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const plotName = plot.plotName
        const data = { regName: this.cregName, plotName }
        deletePlotInfoToApi(data).then(res => {
          this.plotsDict.remove(plot.plotName)
          this.plotsList = this.plotsDict.toList()
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    handleEditorPlot(plot) {
      this.dialogStatus = 'editor'
      const temp = Object.assign({}, plot)
      temp.bounds = positonTostring(temp.bounds)
      this.tempPlot = temp
      this.cplot = temp
      this.tempFile = undefined
      this.tableData = []
      this.tableHeader = []
      this.imgHadUpload = false
      this.exteriorUpdate = false
      this.plotEditorVisible = true
    },
    updataPlotInfo() {
      this.$refs['plotForm'].validate(valid => {
        const tempData = Object.assign({}, this.tempPlot)
        if (valid) {
          const bounds = parePositon(tempData.bounds)
          if (!this.imgHadUpload && this.$refs.upload.uploadFiles[0]) { this.$message.warning('已有文件在缓冲区，请上传或者请删除') } else {
            if (bounds) {
              tempData.bounds = bounds
              tempData.layerUrl = this.imgHadUpload && this.tempFile ? this.tempFile.url : tempData.layerUrl
              // console.log(tempData, this.cplot)
              const changedKey = this.plotsDict.changeKey(tempData.plotName, this.cplot.plotName)
              if (changedKey) {
              // console.log(tempData)
                if (this.exteriorUpdate) {
                  const exterior = this.tableData.map(item => [item.latitude, item.longitude])
                  tempData.exterior = exterior
                // console.log(exterior)
                }
                // update to api
                const data = { regName: this.cregName, ...tempData }
                // console.log(data)
                updatePlotInfoFromApi(data).then(res => {
                  this.plotsDict.update(tempData.plotName, tempData)
                  this.plotsList = this.plotsDict.toList()
                  this.plotEditorVisible = false
                })
              } else { this.$message.error('地块名检验不通过！') }
            } else { this.$message.error('边界坐标类型错误！') }
          }
        }
      })
    },
    hancreatePlot() {
      this.dialogStatus = 'create'
      this.tempFile = undefined
      this.tableData = []
      this.tableHeader = []
      this.imgHadUpload = false
      this.exteriorUpdate = false
      this.plotEditorVisible = true
    },
    createPlotInfo() {
      console.log('create')
      this.$refs['plotForm'].validate(valid => {
        const tempData = Object.assign({}, this.tempPlot)
        if (valid) {
          if (this.imgHadUpload) {
            if (this.exteriorUpdate) {
              const bounds = parePositon(tempData.bounds)
              if (bounds) {
                tempData.bounds = bounds
                tempData.layerUrl = this.tempFile.url
                // console.log(tempData, this.cplot)
                const checkKey = this.plotsDict.checkKey(tempData.plotName)
                if (checkKey) {
                  const exterior = this.tableData.map(item => [item.latitude, item.longitude])
                  tempData.exterior = exterior
                  // post to api
                  const data = { regName: this.cregName, ...tempData }
                  createPlotInfoFromApi(data).then(res => {
                    this.plotsDict.add(tempData.plotName, tempData)
                    this.plotsList = this.plotsDict.toList()
                    this.plotEditorVisible = false
                    this.$notify({
                      title: 'success',
                      message: '新建成功！',
                      type: 'success'
                    })
                  })
                } else { this.$message.error('地块名称检验失败！') }
              } else { this.$message.error('边界坐标类型错误！') }
            } else { this.$message.error('边界坐标Excel未上传！') }
          } else { this.$message.error('图层图片未上传！') }
        }
      })
    },
    plotFormClose() {
      this.$refs.upload.uploadFiles ? this.$refs.upload.uploadFiles = [] : undefined
      this.plotEditorVisible = false
    }

  }
}
</script>
