<template>
	<div class="container" :style="{width:calculatedWidth+'px'}">
		<ul>
			<li>
				<draggable :list='items'>
					<one-slide v-for='(item,index) in items' :item='item' :index='index+1' >
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
        computed: {
            calculatedWidth() {
            // `this` points to the vm instance
            return (this.$store.getters.items.length+1)*screen.width*0.4;
            },
			items(){
            return this.$store.getters.items
            }
        },
        methods:{
			addItem() {
			    this.$store.dispatch('addItem')
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
		margin: 0px 10px;
		width: 40vw;
		height: 40vh;
		border: 5px dashed gray;
		border-radius: 5px;
		text-align: center;
		vertical-align: middle;
	}
	
	.el-icon-plus {
		position: relative;
		top: 7vw;
		color: white;
		font-size: 5vw;
	}
	
	.el-icon-plus:hover {
		font-size: 7vw;
	}
	
	ul {
		list-style-type: none;
	}
</style>