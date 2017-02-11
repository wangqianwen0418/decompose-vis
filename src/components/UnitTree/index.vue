<template>
        <draggable :list="blocks">
                <button v-for="block in blocks" @click='selectBlock(block)'>
                    {{block.name}}
                </button>
        </draggable>

</template>

<script src='./script.js'></script>

<style scoped>
    ul {
        list-style-type: none;
    }
</style>
