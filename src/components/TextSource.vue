<template>
  <el-tabs v-model="activeName" type="border-card" @tab-click="handleClick">
    <el-tab-pane label="encoding" name="first"></el-tab-pane>
    <el-tab-pane label="design task" name="second"></el-tab-pane>
    <el-tab-pane label="case study" name="third"></el-tab-pane>
    <el-tab-pane label="agorithm" name="fourth"></el-tab-pane>
  </el-tabs>
</template>
<script>
  export default {
    data() {
      return {
        activeName: 'first'
      };
    },
    methods: {
      handleClick(tab, event) {
        console.log(tab, event);
      }
    }
  };
</script>

<style>
    .el-tabs{
        height:60vh;
        font-family:Helvetica;
        border: solid 1px;
    }


    
</style>