<template>
	<el-carousel :autoplay="false" type="card" height="340px">
		<el-carousel-item v-for="(item, index) in items">
			<h3>{{index+1}}</h3>
			<i class="el-icon-circle-close" v-on:click="removeItem(index)"></i>
			<one-clip :item="item"></one-clip>
			<i class="el-icon-circle-plus"></i>
		</el-carousel-item>
	</el-carousel>
</template>

<script>
  import OneClip from './OneClip.vue'

  export default {
    data () {
      return {
        newItem: '',
        items: [
          {
            content: 'Get Milk',
            done: true
          },
          {
            content: 'Get Water',
            done: true
          },
          {
            content: 'Get Bread',
            done: true
          },
          {
            content: 'Get Milk',
            done: true
          },
          {
            content: 'Get Water',
            done: true
          },
          {
            content: 'Get Bread',
            done: true
          }
        ]
      }
    },
    methods:{
      removeItem (index) {
        this.items.splice(index, 1);
      },
			addItem() {
        this.items.push({content: "add new", done: false})
        this.newItem = ''
    },
    },
    components: { OneClip }
  }
</script>

<style scoped>
	h3 {
		opacity: 0.75;
		margin: 5px 20px 0px;
		color: white;
	}
	
	i.el-icon-circle-close {
		position: absolute;
		right: 10px;
		top: 2px;
		color: white;
		font-size: 20px;
	}
	
	i.el-icon-circle-plus {
		
		font-size: 20px;
	}
	
	.el-carousel__item:nth-child(2n) {
		background-color: #99a9bf;
	}
	
	.el-carousel__item:nth-child(2n+1) {
		background-color: #d3dce6;
	}
</style>