<template>
  <div style=" with:100%;min-height:500px">
    <el-table
      style="width:100%"
      :data="tableData"
      max-height="540"
      border
      fit
      :header-cell-style="tableHeaderStyle"
    >
      <el-table-column label="序号" prop="id" fixed sortable align="center">
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column
        header-align="center"
        align="center"
        property="date"
        sortable
        label="日期"
        width="200"
      >
        <template slot-scope="scope">
          <i class="el-icon-time" />
          <span>{{ scope.row.date }}</span>
        </template>
      </el-table-column>/>
      <el-table-column header-align="center" align="center" property="devName" label="隶属设备" />

      <el-table-column header-align="center" align="center" label="数据点名称" property="dataPointName">
        <template slot-scope="scope">
          <el-popover title="描述" placement="right" width="200" trigger="click" @show="showDesc">
            <div
              v-loading="loading"
              element-loading-text="拼命加载中"
              element-loading-spinner="el-icon-loading"
            >
              <p>这是一段描述这是一段描述这是一段描述这是一段描述这是一段描述这是一段描述</p>
              <div style="text-align: right; margin: 0">
                <el-button size="mini" type="text" @click="datailClick">详情</el-button>
              </div>
            </div>

            <el-button slot="reference" type="text">{{ scope.row.dataPointName }}</el-button>
          </el-popover>
        </template>
      </el-table-column>/>
      <el-table-column header-align="center" align="center" property="value" label="数据值">
        <template slot-scope="{row}">
          <span>{{ parseValue(row) }}</span>
        </template>
      </el-table-column>
      <el-table-column header-align="center" align="center" property="alarm" label="告警状态">
        <template slot-scope="{row}">
          <span :style="row.alarm ==0?'color:red;':'color:green'">{{ row.alarm == 0 ? '告警' : '正常' }}</span>
        </template>
      </el-table-column>
      <!-- Actions -->
      <el-table-column label="操作" align="center" width="300" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">Edit</el-button>
          <el-button v-if="row.alarm!=0" size="mini" @click="handleModifyStatus(row,0)">告警</el-button>
          <el-button
            v-if="row.alarm!=1"
            type="success"
            size="mini"
            @click="handleModifyStatus(row,1)"
          >正常</el-button>
          <el-button
            v-if="row.status!='deleted'"
            size="mini"
            type="danger"
            @click="handleDelete(row,$index)"
          >Delete</el-button>
        </template>
      </el-table-column>
      <!-- end Actions -->
    </el-table>
    <!-- edit data  -->
    <div class="edit-data">
      <el-dialog title="管理员编辑" width="250px" :visible.sync="dialogVisible">
        <el-input v-model="chaneValue" clearable suffix-icon="el-icon-edit" placeholder="数据值" />
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">Cancel</el-button>
          <el-button type="primary" @click="updateData">Confirm</el-button>
        </div>
      </el-dialog>
    </div>
    <!-- end edit data -->
  </div>
</template>
<style lang="scss" scoped>
</style>
<script>
export default {
  props: {
    tableData: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      temp: {},
      dialogVisible: false,
      currentRow: null,
      loading: false,
      chaneValue: undefined
    }
  },

  methods: {
    tableHeaderStyle({ row, column, rowIndex, columnIndex }) {
      return 'background-color:#1989fa;color:#fff;font-weight:400;'
    },
    handleCurrentChange(val) {
      this.currentRow = val
    },
    parseValue(row) {
      switch (parseInt(row.type)) {
        case 0 :return row.value
        case 1:
          return row.value + '°C'
        case 2:
          return row.value + 'Pa'
        case 3:
          return row.value + 'T'
        case 4:
          return row.value + 'Q'
        case 5:
          return row.value + 'S'
      }
    },
    // alarmStatusFormat(row, column, cellValue, index) {
    //   // eslint-disable-next-line eqeqeq
    //   return 0
    // },
    showDesc() {
      console.log('show', this.visible)
      this.loading = true

      setTimeout(() => {
        this.loading = false
      }, 1000)
    },
    datailClick() {
      // console.log('detail click')
      this.$message.warning('功能正在开发中~~~')
    },
    handleModifyStatus(row, status) {
      row.alarm = status
      this.$emit('handleModifyStatus', row)
    },
    handleDelete(row, index) {
      this.$emit('handleDeleteRow', row, index)
    },
    handleUpdate(row) {
      this.dialogVisible = true
      this.chaneValue = row.value
      // 用于将所有可枚举属性的值从一个或多个源对象复制到目标对象。
      // 它将返回目标对象。
      this.temp = Object.assign({}, row) // copy obj
      this.temp.date = new Date().getTime()
      // console.log(this.temp)
    },
    updateData() {
      if (!isNaN(this.chaneValue)) {
        this.temp.value = parseInt(this.chaneValue)
        this.$emit('updateData', this.temp)
        setTimeout(_ => {
          this.dialogVisible = false
        }, 2000)
      } else {
        this.$message.error('输入类型错误!')
      }
    }
  }
}
</script>
