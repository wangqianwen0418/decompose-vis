<template>
	<div class="vis-figure">
		<el-row>
			<el-col :span="24">
				<canvas class="interactive" @mouseout="onMouseout" @mousemove="onMousemove" @mouseenter="onMouseenter">
				</canvas>
			</el-col>
		</el-row>
		<el-row :gutter="20">
			<el-col :span="4">
				<h1>A</h1>
			</el-col>
			<el-col :span="4">
				<h1>A</h1>
			</el-col>
			<el-col :span="4">
				<h1>A</h1>
			</el-col>
			<el-col :span="4">
				<h1>A</h1>
			</el-col>
			<el-col :span="4">
				<h1>A</h1>
			</el-col>
			<el-col :span="4">
				<h1>A</h1>
			</el-col>
		</el-row>
	</div>
</template>

<script type="text/javascript" src="./VisFigure.js"></script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
	.interactive {
		max-width: 1280px;
		max-height: 800px;
	}
	.display {
		max-width: 0px;
		max-height: 0px;
	}
	.vis-figure {
		position: relative; 
		top: 10px;
		left: 10px;
	}
</style>
