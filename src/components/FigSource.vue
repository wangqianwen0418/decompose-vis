<template>
	<el-tabs v-model="activeName" type="border-card" @tab-click="handleClick">
        <el-tab-pane label="coordinates" name="first">iilioo
        <img src="src/assets/logo.png" alt="Smiley face" ></img>
        </el-tab-pane>
        <el-tab-pane label="node" name="second">hhhhhh</el-tab-pane>
        <el-tab-pane label="line" name="third">hhhhhh</el-tab-pane>
		<el-tab-pane label="area" name="forth">wwwwwwww</el-tab-pane>
		<el-tab-pane label="glyph" name="fivth">wwwwww</el-tab-pane>

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

<style scoped>
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