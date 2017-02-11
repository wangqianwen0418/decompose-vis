<template>
    <div class="resource bg-purple-light">
		<fig-source></fig-source>
		<!--<text-source></text-source>-->
        <unit-tree/>
        <in-block></in-block>
    </div>
</template>

<script src="./script.js"></script>

<style scoped>
	.resource {
		border-radius: 8px;
		height:80vh;
		margin: 10px 10px;
	}
    in-block {
       position:absolute;
       right: 0;
       top:0;
       color: 'white'
    }
</style>
