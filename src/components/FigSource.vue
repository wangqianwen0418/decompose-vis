<template>
	<el-tabs v-model="activeName" type="border-card">
		<el-tab-pane label="coordinates" name="first"><b>h</b>hhhh
			<div>
				<img id="drag1" src="../assets/paper1.png" draggable="true" @dragstart="drag" width="336" height="69">
			</div>
		</el-tab-pane>
		<el-tab-pane label="node" name="second">h<b>h</b>hhh
			<div id="drag2" draggable="true" @dragstart="drag">
				<img src="../assets/paper1.png" width="112" height="23">
			</div>
		</el-tab-pane>
		<el-tab-pane label="line" name="third">hh<b>h</b>hh
			<div id="drag3" draggable="true" @dragstart="drag">
				<svg width="100" height="100">
					<circle cx="50" cy="50" r="40" stroke="green" stroke-width="4" fill="yellow" />
				</svg>
			</div>
		</el-tab-pane>
		<el-tab-pane label="area" name="forth">hhh<b>h</b>h</el-tab-pane>
		<el-tab-pane label="glyph" name="fivth">hhhh<b>h</b></el-tab-pane>

	</el-tabs>
</template>
<script>
  export default {
    data() {
      return {
        activeName: 'first'
      };
    },
    methods:{
      drag(event){
        console.log(event.target);
        event.dataTransfer.setData("dragTarget", event.target.id);
        //event.dataTransfer.setData("dragTarget", event.target.src);
      },
    }
  };
</script>

<style scoped>
	.el-tabs {
		height: 40vh;
		font-family: Helvetica;
		border-style: groove 1px;
		margin: 5px;
		border-radius: 8px;
	}
	
	.el-tab-pane {
		border-radius: 8px;
	}
</style>