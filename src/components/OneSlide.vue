<template>
	<div class="clip bg-purple-dark" @click="print(item,index)" :style="styleObject">
		<i class="el-icon-circle-close" v-on:click="removeItem(index)"></i> i am a cute slider {{index}}
		<br/> {{item.content}}
		<div>
</template>

<script>
export default {
    props: ['item','index'],
    methods:{
        removeItem(index) {
            this.$emit('remove',index);
        },
        print(item,index){
            console.log("i am the "+index+" st slider");
            console.log("i want to "+item.content);
            this.item.done=!this.item.done;
        }
    },
    computed:{
        styleObject: function(){
            if(!this.item.done)
            return {
            border: '5px solid #1499CC'
            };
        }
    }
}
</script>

<style scoped>
	.clip{
        border-radius: 8px;
            margin: 10px 10px;
            height: 300px;
            width: 400px;
            float: left;
    }
	.el-icon-circle-close {
		position: relative;
		left: 375px;
		top: 5px;
		color: white;
		font-size: 20px;
	}
	
	.el-icon-circle-close:hover {
		font-size: 25px;
	}
</style>