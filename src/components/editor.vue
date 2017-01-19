<template>
    <div class="editor bg-purple-light">
        <textarea rows="4" cols="50" v-model="message" @input='editItem' placeholder="please select a slide">
		</textarea>
		
		
    </div>
</template>

<script>
	
export default {
	computed:{
		selectedItem(){
			return this.$store.getters.selectedItem
		},
	message(){
			return this.$store.getters.selectedItem.content
	}
	},
	methods:{
		editItem(event) {
            this.$store.dispatch('editItem',event.target.value)
        }
	}
}
</script>

<style scoped>
	.editor {
		border-radius: 8px;
		height: 35vh;
		margin: 10px 0px 0px 10px;
	}
	textarea:active,
	textarea:focus{
		outline:none;
	}
</style>