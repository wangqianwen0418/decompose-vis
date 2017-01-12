<template>
	<div>
		<el-row>
			<el-col :xs="24">
				<head-line> </head-line>
			</el-col>
		</el-row>
		<el-row :gutter="10">
			<el-col :span="18">
				<clips></clips>
				<div class="editor bg-purple-dark"></div>
			</el-col>
			<el-col :span="6">
				<div class="resource bg-purple-light"></div>
			</el-col>
		</el-row>
	</div>
</template>

<script>
    import HeadLine from './components/headline.vue';
	import clips from './components/clips.vue';
    export default { components: { HeadLine, clips } };

</script>

<style>
	.el-row {
		margin-bottom: 20px;
		&:last-child {
			margin-bottom: 0;
		}
	}
	
	.el-col {
		border-radius: 4px;
	}
	
	.bg-purple-dark {
		background: #99a9bf;
	}
	
	.bg-purple {
		background: #d3dce6;
	}
	
	.bg-purple-light {
		background: #e5e9f2;
	}
	
	.resource {
		border-radius: 8px;
		min-height: 560px;
		margin: 10px 10px;
	}
	
	.row-bg {
		padding: 10px 0;
		background-color: #f9fafc;
	}
	
	.headline {
		min-height: 60px;
		border-radius: 8px;
		margin: 0px 10px;
	}
	
	.clips {
		border-radius: 8px;
		height: 360px;
		margin: 10px 10px;
	}
	
	.editor {
		border-radius: 8px;
		height: 200px;
		margin: 10px 10px;
	}
</style>