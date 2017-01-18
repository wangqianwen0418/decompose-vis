<template>
	<div id="slides" >
		<slide-container :items='items' ></slide-container>
	</div>			
</template>

<script>
  import SlideContainer from './SlideContainer.vue'
  export default {
      data(){
      return{
          items: [
          {
              content: 'Get Milk one',
              done: true
          },
          {
              content: 'Get Water two',
              done: true
          },
          {
              content: 'Get Bread three',
              done: true
          },
          {
              content: 'Get shampoo four',
              done: true
          },
          {
              content: 'Get juice five',
              done: true
          }
          ]
      }
    },
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