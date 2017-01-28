<template>
	<div class="clip bg-purple-dark" @click="selectItem(item)" :style="styleObject"
	@drop="drop" @dragover="allowDrop">
		<i class="el-icon-circle-close" v-on:click="removeItem(item)"></i> i am a cute slider {{index}}
		<br/>
		{{item.content}}
		<div class='attachedEle' v-for="img in item.attachedEle">
			<img :src="img" alt="hhh"  height="122" width="62" draggable="true" @dragstart="drag">
		</div>
		<br/># of attached elements {{item.attachedEle.length}}
<!--
		<h2>List 1 Draggable</h2>
		<draggable :list="list" class="dragArea" :options="{group:'people'}">
			<div v-for="element in list">{{element.name}}</div>
		</draggable>

		<h2>List 2 Draggable</h2>
		<draggable :list="list2" class="dragArea" :options="{group:'people'}">
			<div v-for="element in list2">{{element.name}}</div>
		</draggable>-->

   </div>
</template>

<script>
import draggable from 'vuedraggable'
export default {
    props: ['item','index'],
    methods:{
        removeItem(item) {
            this.$store.dispatch('removeItem',item)
        },
        selectItem(item){
            this.$store.dispatch('selectItem', item);
        },
		drag(event){
        console.log(event.target);
        event.dataTransfer.setData("dragTarget", event.target.id);
		},
		allowDrop(ev) {
          ev.preventDefault();
		},
		drop(ev) {
          console.log(ev.target);
          ev.preventDefault();
          let data = ev.dataTransfer.getData("dragTarget");
		  let itm=document.getElementById(data);
		  var cln = itm.cloneNode(true)
          ev.target.appendChild(cln);
		  //this.item.attachedEle.push(data);    
        }
    },
    computed:{
        styleObject(){
            if(this.item.selected)
            return {
            border: '5px solid #1499CC'
            };
        }
    },
	components:{
		draggable
    }
}
</script>

<style scoped>
	.clip {
		border-radius: 8px;
		margin: 0px 10px;
		width: 35vw;
		height: 40vh;
		float: left;
	}
	
	.el-icon-circle-close {
		float: right;
		color: white;
		font-size: 3vw;
	}
	
	.el-icon-circle-close:hover {
		font-size: 4vw;
	}
	
</style>