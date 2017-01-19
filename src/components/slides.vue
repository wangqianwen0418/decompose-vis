<template>
	<div id="slides" >
		<slide-container ></slide-container>
	</div>			
</template>

<script>
  import SlideContainer from './SlideContainer.vue'
  export default {
    components:{
      SlideContainer
    },
  }
</script>

<style>
    
#slides{
  overflow-x:scroll ; 
  overflow-y:hidden;
  height:45vh;
  margin: 0px, 10px;
}

#slides::-webkit-scrollbar {
    -webkit-appearance: none;
    width: 3px;
}
#slides::-webkit-scrollbar-thumb {
    border-radius: 1px;
    background-color: rgba(0,0,0,.5);
    -webkit-box-shadow: 0 0 1px rgba(255,255,255,.5);
}
</style>