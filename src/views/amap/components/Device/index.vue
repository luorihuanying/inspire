<template>
  <div class="devinfo">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>节点名称:这是节点名称</span>

      </div>
      <div v-for="o in 6" :key="o" class="text item">
        {{ '这是具体内容 ' + o }}
      </div>
      <el-button style="float: left; padding: 3px 0" type="text">操作按钮</el-button>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {

    }
  }
}
</script>
<style scoped>
  .devinfo{
    width: 100%;
    height: 100px;
    background-color: #42b983;
  }
  .text {
    font-size: 14px;
  }

  .item {
    margin-bottom: 18px;
  }

  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }
  .clearfix:after {
    clear: both
  }

  .box-card {
    width: 100%;
  }

</style>
