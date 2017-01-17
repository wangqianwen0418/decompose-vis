<template>
    <div class="resource bg-purple-light">
        resource
		<text-source></text-source>
    </div>
</template>

<script>
import TextSource from './TextSource'
	export default{
		components:{
			TextSource
		}
	}
</script>

<style scoped>
	.resource {
		border-radius: 8px;
		height:80vh;
		margin: 10px 10px;
	}
</style>