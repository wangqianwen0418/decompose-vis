<template>
	<div class="container" :gutter="10" :style="{width:calculatedWidth+'px'}">
		<ul>
			<li>
				<draggable :list='items'>
					<one-slide v-for='(item,index) in items' 
                    :item='item' :index='index+1' 
                    @remove='removeItem'>
					</one-slide>
				</draggable>
			</li>
			<li>
				<div class="newclip bg-purple">
					<i class="el-icon-plus" v-on:click="addItem()"></i>
				</div>
			</li>
		</ul>
	</div>
</template>

<script>
    import OneSlide from './OneSlide'
    import draggable from 'vuedraggable'

    export default{
        props:['items'],
        computed: {
            calculatedWidth: function () {
            // `this` points to the vm instance
            return (this.items.length+1)*430;
            }
        },
        methods:{
			addItem() {
			    this.items.push({content: "i am new new new", done: false})
			},
            removeItem(index){
                this.items.splice(index,1);
                console.log(index);
            }
        },
        components:{
            OneSlide,
            draggable
        }
    }
</script>

<style scoped>
	.container {
		margin: 10px, 10px;
	}
	
	.newclip {
		float: left;
		border-radius: 8px;
		margin: 10px 10px;
		height: 300px;
		width: 400px;
		border: 5px dashed gray;
		border-radius: 5px;
		text-align: center;
		vertical-align: middle;
	}
	
	.el-icon-plus {
		position: relative;
		top: 120px;
		color: white;
		font-size: 40px;
	}
	
	.el-icon-plus:hover {
		font-size: 50px;
	}
	
	ul {
		list-style-type: none;
	}
</style>