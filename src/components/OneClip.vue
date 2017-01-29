<template>
    <div class="clip bg-purple-light">
        {{item.content}}
    </div>
</template>

<script>
export default {
    props: ['item'],
};
</script>

<style scoped>
.clip {
    border-radius: 8px;
    margin: 0px 10px;
    height: 300px;
}
</style>
