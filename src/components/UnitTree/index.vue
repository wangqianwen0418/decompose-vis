<template>
    <div id="bTree">
        <draggable :list="blocks">
            <button v-for="block in blocks" @click="selectBlock(block)">
                    {{block.name}}
                </button>
        </draggable>
    </div>
</template>

<script src='./script.js'></script>

<style scoped>
    button {
        background-color: var(--color-0);
        color: var(--color-3);
        margin: 5px;
        border: none;
        border-radius: 3px;
        text-align: center;
        /*text-decoration: none;*/
        display: inline-block;
        font-size: 16px;
    }

    button:focus {
        outline: none;
        border: 3px solid var(--color-3);
        border-radius: 5px;
    }
</style>
