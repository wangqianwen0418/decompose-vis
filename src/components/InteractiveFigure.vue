<template>
	<div class="vis-figure">
		<canvas class="interactive" @mouseout="onMouseout" @mousemove="onMousemove" @mouseenter="onMouseenter" @click="onClick">
		</canvas>
		<canvas class="display">
		</canvas>
	</div>
</template>

<script type="text/javascript" src="./InteractiveFigure.js"></script>

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
