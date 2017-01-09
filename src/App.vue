<template>
  <div id="app">
	<vis-figure src="/assets/paper1.png" width="640" height="360"></vis-figure>
  </div>
</template>

<script>
import VisFigure from './VisFigure.vue';

export default { components: { "vis-figure": VisFigure } };

</script>

<style>
	html {
		height: 100%;
	}

	body {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 100%;
	}

	#app {
		color: #2c3e50;
		left: 10px;
		top: 10px;
		font-family: Source Sans Pro, Helvetica, sans-serif;
		text-align: center;
	}

	#app a {
		color: #42b983;
		text-decoration: none;
	}

	.logo {
		width: 100px;
		height: 100px
	}
</style>
