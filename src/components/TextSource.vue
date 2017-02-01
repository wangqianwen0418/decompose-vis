<template>
    <el-tabs v-model="activeName" type="border-card">
        <el-tab-pane label="encoding" name="first">hhhhhh</el-tab-pane>
        <el-tab-pane label="design task" name="second">wwwwwwww</el-tab-pane>
        <el-tab-pane label="case study" name="third">wwwwww</el-tab-pane>
        <el-tab-pane label="agorithm" name="fourth">iilioo</el-tab-pane>
    </el-tabs>
</template>
<script>
    export default {
        data() {
            return {
                activeName: 'first',
            };
        },
    };
</script>

<style>
	.el-tabs {
		height: 40vh;
		font-family: Helvetica;
		border-style: groove 1px;
    margin:5px;
    border-radius: 8px;
	}
  .el-tab-pane{
    border-radius: 8px;
  }


</style>
