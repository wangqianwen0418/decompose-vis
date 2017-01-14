<template>
	<div>
		<el-row>
			<el-col :span="24">
				<head-line> </head-line>
			</el-col>
		</el-row>
		<el-row :gutter="10">
			<el-col :span="18">
				<!--<clips></clips>-->
				<slider></slider>
				<editor></editor>
			</el-col>
			<el-col :span="6">
					<resource></resource>
			</el-col>
		</el-row>
	</div>
</template>

<script>
    import HeadLine from './components/headline.vue';
	import clips from './components/clips.vue';
	import resource from './components/resource.vue';
	import editor from './components/editor.vue'; 
	import slider from './components/example1.vue';

    export default { 
		components: { 
			HeadLine, 
			clips,
			resource,
			editor,
			slider
			} 
		}

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
	
	.row-bg {
		padding: 10px 0;
		background-color: #f9fafc;
	}
</style>