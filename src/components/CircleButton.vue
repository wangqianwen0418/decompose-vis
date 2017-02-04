<template>
	<div class="circle-button">
        {{text}}
	</div>
</template>

<script type="text/javascript">
    export default {
        data() {
            style : {
                background: this.color
            }
        },
        methods: {
            click() {
                this.$emit('click');
            }
        }
    }
</script>

<style scoped>
</style>
