<template>
    <div class="clip bg-purple-dark">
        <i class="el-icon-circle-close" v-on:click="removeItem(index)"></i>
        i am a cute slider {{index}}
        <br/>
        {{item.content}}        
    <div>
</template>

<script>
export default {
    props: ['item','index']
}
</script>

<style scoped>
.clip {
    border-radius: 8px;
    margin: 10px 10px;
    height: 300px;
    width:400px;
}
.el-icon-circle-close{
    position:relative;
    left:375px;
    top:5px;
    color: white;
    font-size: 20px;
}
</style>