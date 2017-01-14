<template>
	<div id="slides" >
				<slide-container></slide-container>
	</div>			
</template>

<script>
  import SlideContainer from './SlideContainer.vue'
  export default {
    components:{
      SlideContainer
    }
  }
</script>

<style>
#slides{
  overflow:scroll ; 
  height:350px;
}
</style>