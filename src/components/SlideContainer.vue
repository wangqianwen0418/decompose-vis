<template>
	<el-row class="container" :gutter="10" >
		<span v-for='(item,index) in items'>
            <el-col :span=24/6>
                <one-slide :item='item' :index='index'></one-slide>
            </el-col>
        </span>
	</el-row>
</template>

<script>
    import OneSlide from './OneSlide'
    export default{
        data(){
            return{
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
                    content: 'Get shampoo',
                    done: true
                },
                {
                    content: 'Get juice',
                    done: true
                },
                {
                    content: 'Get candy',
                    done: true
                },
                {
                    content: 'Get meat',
                    done: true
                },
                {
                    content: 'Get knife',
                    done: true
                },
                {
                    content: 'Get soup',
                    done: true
                },
                {
                    content: 'Get apple',
                    done: true
                },
                {
                    content: 'Get orange',
                    done: true
                },
                {
                    content: 'Get Bread',
                    done: true
                },
                ]
            }
        },
        components:{
            OneSlide
        }
    }
</script>

<style scoped>
	.container {
		width: 2500px;
		
	}
</style>