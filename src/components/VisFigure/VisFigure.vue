<template>
	<div class="vis-figure">
		<canvas @mouseout="onMouseout" @mousemove="onMousemove" @click="onClick">
		</canvas>
		<canvas>
		</canvas>
	</div>
</template>

<script src="./VisFigure.js"></script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
	canvas {
		max-width: 1280px;
		max-height: 800px;
	}
	.vis-figure {
		position: relative; 
		top: 10px;
		left: 10px;
	}
</style>
